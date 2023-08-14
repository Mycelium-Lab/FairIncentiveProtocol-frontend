import { Component } from "react";
import { config } from "../utils/config";
import { getBearerHeader } from "../utils/getBearerHeader";
import { createLongStrView } from "../utils/longStrView";
import '../styles/rewardEvents.css'
import { ethers } from "ethers";
import { Modal } from "react-bootstrap";

const types = {
    token: 'token',
    nft: 'nft'
}

class RewardEvents extends Component {

    constructor() {
        super()
        this.state = {
            rewardTokenEvents: [],
            rewardNFTEvents: [],
            switcher: types.token,
            showRevoke: false,
            revoke_event_id: null,
            revoke_event_type: null
        }
    }

    async componentDidMount() {
        await this.getRewardTokenEvents()
        await this.getRewardNFTEvents()
    }

    async getRewardTokenEvents() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
                };
            const res = await fetch(`${config.api}/rewards/events/tokens`, requestOptions)
            const json = await res.json()
            const rewardEvents = json.body.data
            this.setState({
                rewardTokenEvents: rewardEvents
            })
        } catch (error) {
            console.log(error)
        }
    }

    async getRewardNFTEvents() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
                };
            const res = await fetch(`${config.api}/rewards/events/nfts`, requestOptions)
            const json = await res.json()
            const rewardEvents = json.body.data
            this.setState({
                rewardNFTEvents: rewardEvents
            })
        } catch (error) {
            console.log(error)
        }
    }

    async deleteTokenRewardEvent(id) {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())
            const raw = JSON.stringify(
                {
                    id: id,
                }
            );
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/rewards/delete/events/token`, requestOptions)
            if (res.status === 200) {
                let tokenEvents = this.state.rewardTokenEvents
                tokenEvents = tokenEvents.filter(v => v.event_id !== id)
                this.setState({
                    rewardTokenEvents: tokenEvents
                })
                this.handleCloseRevoke()
            }
            else alert('Something went wrong')
        } catch (error) {
            console.log(error)
        }
    }

    async deleteNFTRewardEvent(id) {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())
            const raw = JSON.stringify(
                {
                    id: id,
                }
            );
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/rewards/delete/events/nft`, requestOptions)
            if (res.status === 200) {
                let rewardNFTEvents = this.state.rewardNFTEvents
                rewardNFTEvents = rewardNFTEvents.filter(v => v.event_id !== id)
                this.setState({
                    rewardNFTEvents
                })
                this.handleCloseRevoke()
            }
            else alert('Something went wrong')
        } catch (error) {
            console.log(error)
        }
    }

    handleShowRevoke = (revoke_event_id, revoke_event_type) => this.setState({showRevoke: true, revoke_event_id, revoke_event_type})
    handleCloseRevoke = () => this.setState({showRevoke: false, revoke_event_id: null, revoke_event_type: null})

    deleteTokenRewardEvent = this.deleteTokenRewardEvent.bind(this)
    deleteNFTRewardEvent = this.deleteNFTRewardEvent.bind(this)
    handleShowRevoke = this.handleShowRevoke.bind(this)
    handleCloseRevoke = this.handleCloseRevoke.bind(this)

    render() {
        return (
            <div>
                <h3>Reward Events</h3>
                <div>
                    <button type="button" className={this.state.switcher === types.token ? "btn btn-dark" : "btn btn-light"} onClick={() => this.setState({switcher: types.token})}>Token rewards</button>
                    <button type="button" className={this.state.switcher === types.nft ? "btn btn-dark" : "btn btn-light"} onClick={() => this.setState({switcher: types.nft})}>NFT rewards</button>
                </div>
                <table className="table table-bordered border-dark">
                    <thead>
                        <tr className="table-secondary" >
                        <th className="table-secondary" scope="col">id</th>
                        <th className="table-secondary" scope="col">Status</th>
                        <th className="table-secondary" scope="col">Reward</th>
                        <th className="table-secondary" scope="col">Distributed</th>
                        <th className="table-secondary" scope="col">User</th>
                        <th className="table-secondary" scope="col">Comment</th>
                        <th className="table-secondary" scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                            this.state.switcher === types.token 
                            ?
                            this.state.rewardTokenEvents.map(v =>
                            <tr className="table-secondary">
                                <td className="table-secondary">
                                    {createLongStrView(v.event_id)}
                                </td>
                                <td className="table-secondary">
                                    {v.status}
                                </td>
                                <td className="table-secondary">
                                    {v.reward_name}
                                </td>
                                <td className="table-secondary">
                                    {ethers.utils.formatEther(v.token_amount)} {v.token_symbol}
                                </td>
                                <td className="table-secondary">
                                    <div>
                                        {v.user_external_id}
                                    </div>
                                    <div>
                                        (FAIR id: {createLongStrView(v.user_id)})
                                    </div>
                                </td>
                                <td className="table-secondary">
                                    {v.event_comment}
                                </td>
                                <td className="table-secondary">
                                    <a className="claim-link" href={`${config.api}/claim/token?id=${v.event_id}&user_id=${v.user_id}`} target="_blank">Claim Link</a>
                                    {
                                        v.status === 'Accrued'
                                        ?
                                        <button className="btn btn-dark" onClick={() => this.handleShowRevoke(v.event_id, types.token)}>Revoke</button>
                                        :
                                        null
                                    }
                                </td>
                            </tr>
                            )
                            :
                            this.state.rewardNFTEvents.map(v =>
                            <tr className="table-secondary">
                                <td className="table-secondary">
                                    {createLongStrView(v.event_id)}
                                </td>
                                <td className="table-secondary">
                                    {v.status}
                                </td>
                                <td className="table-secondary">
                                    {v.reward_name}
                                </td>
                                <td className="table-secondary">
                                    {v.nft_name} from {v.token_symbol} collection
                                </td>
                                <td className="table-secondary">
                                    <div>
                                        {v.user_external_id}
                                    </div>
                                    <div>
                                        (FAIR id: {createLongStrView(v.user_id)})
                                    </div>
                                </td>
                                <td className="table-secondary">
                                    {v.event_comment}
                                </td>
                                <td className="table-secondary">
                                    <a className="claim-link" href={`${config.api}/claim/nft?id=${v.event_id}&user_id=${v.user_id}`} target="_blank">Claim Link</a>
                                    {
                                        v.status === 'Accrued'
                                        ?
                                        <button className="btn btn-dark" onClick={() => this.handleShowRevoke(v.event_id, types.nft)}>Revoke</button>
                                        :
                                        null
                                    }
                                </td>
                            </tr>
                            )
                        }
                    </tbody>
                </table>
                <Modal show={this.state.showRevoke} onHide={this.handleCloseRevoke} centered>
                        <Modal.Header closeButton>
                            Revoke {createLongStrView(this.state.revoke_event_id)} event?
                        </Modal.Header>
                        <Modal.Footer>
                            <button className="btn btn-dark" onClick={
                                () => 
                                    this.state.revoke_event_type === types.token ? 
                                    this.deleteTokenRewardEvent(this.state.revoke_event_id) :
                                    this.deleteNFTRewardEvent(this.state.revoke_event_id)
                            }>Revoke</button>
                            <button className="btn btn-dark" onClick={this.handleCloseRevoke}>Cancel</button>
                        </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default RewardEvents