import { Component } from "react";
import { config } from "../utils/config";
import { getBearerHeader } from "../utils/getBearerHeader";
import { createLongStrView } from "../utils/longStrView";

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
            switcher: types.token
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
            const rewardEvents = json.rewardEvents
            this.setState({
                rewardTokenEvents: rewardEvents
            })
        } catch (error) {
            alert(error)
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
            const rewardEvents = json.rewardEvents
            this.setState({
                rewardNFTEvents: rewardEvents
            })
        } catch (error) {
            alert(error)
        }
    }

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
                                    {v.token_amount} {v.token_symbol}
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
                                    <button className="btn btn-dark" disabled>Revoke</button>
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
                                    <a href={`/claimnft?id=${v.event_id}&user_id=${v.user_id}`} target="_blank">Claim Link</a>
                                    <button className="btn btn-dark" disabled>Revoke</button>
                                </td>
                            </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default RewardEvents