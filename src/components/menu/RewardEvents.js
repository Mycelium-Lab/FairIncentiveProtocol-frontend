import { Component } from "react";
import { config } from "../../utils/config";
import { getBearerHeader } from "../../utils/getBearerHeader";
import { createLongStrView } from "../../utils/longStrView";
import filter from '../../media/common/filter.svg'
import close from '../../media/common/close.svg'
//import '../../styles/rewardEvents.scss'
import { ethers } from "ethers";
import { Modal } from "react-bootstrap";
import more from '../../media/common/more.svg'
import info from '../../media/common/info-small.svg'
import { Dropdown } from "react-bootstrap";
import FPDropdown from "../common/FPDropdown";
import FPTable from "../common/FPTable";
import { rewardEventsTable } from "../../data/tables";

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
            revoke_event_type: null,
            showReward: false,
            reward_name: null,
            chosen_user: null,
            comment: null, 
            users: [],
            reward_id: null,
            reward_nft_id: null,
        }
    }

    async componentDidMount() {
        await this.getRewardTokenEvents()
        await this.getRewardNFTEvents()
        await this.getUsers()
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

    async getUsers() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/users`, requestOptions)
            const json = await res.json()
            const users = json.body.data.map(v => <option value={v.id}>{v.external_id}</option>)
            this.setState({
                users,
                chosen_user: json.body.data.length > 0 ? json.body.data[0].id : null
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

    async rewardWithToken() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())

            const raw = JSON.stringify(
                {
                    reward_id: this.state.reward_id,
                    user_id: this.state.chosen_user,
                    comment: this.state.comment
                }
            );
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/rewards/reward/token`, requestOptions)
            const json = await res.json()
            if (res.status === 200) {
                let tokenRewards = this.state.tokenRewards
                tokenRewards.forEach(v => {if (v.id == this.state.reward_id) v.count = parseInt(v.count) + 1})
                alert('Done')
                this.setState({
                    showReward: false
                })
            }
            else alert('Something went wrong')
        } catch (error) {
            console.log(error)
        }
    }

    async rewardWithNFT() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())
            const raw = JSON.stringify(
                {
                    reward_id: this.state.reward_id,
                    user_id: this.state.chosen_user,
                    comment: this.state.comment
                }
            );
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/rewards/reward/nft`, requestOptions)
            const json = await res.json()
            if (res.status === 200) {
                let nftRewards = this.state.nftRewards
                nftRewards.forEach(v => {if (v.id == this.state.reward_id) v.count = parseInt(v.count) + 1})
                alert('Done')
                this.setState({
                    showReward: false
                })
            }
            else alert('Something went wrong')
        } catch (error) {
            console.log(error)
        }
    }

    changeUser(event) {
        this.setState({
            chosen_user: event.target.value
        })
    }


    changeComment(event) {
        this.setState({
            comment: event.target.value
        })
    }

    handleShowRevoke = (revoke_event_id, revoke_event_type) => this.setState({showRevoke: true, revoke_event_id, revoke_event_type})
    handleCloseRevoke = () => this.setState({showRevoke: false, revoke_event_id: null, revoke_event_type: null})
    handleShowReward = () => this.setState({showReward: true})
    handleCloseReward = () => this.setState({showReward: false})
    changeUser = this.changeUser.bind(this)
    changeComment = this.changeComment.bind(this)
    getUsers = this.getUsers.bind(this)
    rewardWithToken = this.rewardWithToken.bind(this)
    rewardWithNFT = this.rewardWithNFT.bind(this)

    deleteTokenRewardEvent = this.deleteTokenRewardEvent.bind(this)
    deleteNFTRewardEvent = this.deleteNFTRewardEvent.bind(this)
    handleShowRevoke = this.handleShowRevoke.bind(this)
    handleCloseRevoke = this.handleCloseRevoke.bind(this)

    render() {
        return (
            <>
                <div className="title-header">
                    <h3 className="menu__title">Reward Events</h3>
                    <button  type="button" className="btn btn_orange btn_primary" onClick={this.handleShowReward}>To reward</button>
                </div>

                <div className="input-group__serach">
                    <button  type="button" className="btn btn_orange btn_image btn_primary" onClick={() => this.setState({showFilter: !this.state.showFilter})}>
                        {
                            this.state.showFilter 
                            ? <img className="close__image" src={close} ></img>
                            : <img className="filter__image" src={filter} ></img>
                        }
                    </button>
                    <div className="input-group search-input_rewards search-input">
                        <input type="text" placeholder="Search..." className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                    </div>
                </div>
                {
                    this.state.showFilter 
                    ? <div>
                            <div className="input-group_filter input-group">
                                <input type="text" placeholder="Name" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                <input type="text" placeholder="Name" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                <select className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                    <option value='Status'>Status</option>
                                    <option value='Name'>Name</option>
                                    <option value='Reward'>Reward</option>
                                </select>
                            </div>
                        </div>
                    : null
                }

                        <div className="content__wrap">
                            <FPTable data={rewardEventsTable}>
                                {
                                     this.state.switcher === types.token 
                                    ?  this.state.rewardTokenEvents.map(v =>
                                 <tr>
                                          <td>   
                                          {createLongStrView(v.event_id)}
                                          </td>
                                          <td>
                                          {v.status}
                                          </td>
                                          <td>
                                          {v.reward_name}
                                          </td>
                                          <td>
                                          {ethers.utils.formatEther(v.token_amount)} {v.token_symbol} from collection
                                          </td>
                                          <td>
                                            <div>
                                                {v.user_external_id}
                                            </div>
                                            <div>
                                                (FAIR id: {createLongStrView(v.user_id)})
                                            </div>
                                          </td>
                                          <td>
                                            <FPDropdown icon={more}>
                                            {
                                                v.status === 'Accrued'
                                                ?  <Dropdown.Item className="dropdown__menu-item" onClick={this.handleShowRevoke(v.event_id, types.token)} >Revoke</Dropdown.Item>
                                                : null
                                            }
                                            </FPDropdown>
                                          </td>
                                      </tr>)
                                      : null
                              }
                            </FPTable>
                        </div>

               {
                    /* <div>
                    <button type="button" className={this.state.switcher === types.token ? "btn btn-dark" : "btn btn-light"} onClick={() => this.setState({switcher: types.token})}>Token rewards</button>
                    <button type="button" className={this.state.switcher === types.nft ? "btn btn-dark" : "btn btn-light"} onClick={() => this.setState({switcher: types.nft})}>NFT rewards</button>
                    </div>*/
                }
                {
                    /*
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
                */
                }
                 <Modal show={this.state.showReward} onHide={this.handleCloseReward} centered>
                    <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                        Rewarding {this.state.reward_name}
                    </Modal.Header>
                    <Modal.Body>
                    <div className="form_row ">
                                <div className="form_col_last form_col">
                                <label className="form__label">Select reward: <img className="form__icon-info" src={info}></img></label>
                                <div className="input-group mb-4">
                                    <select onChange={this.state.chosen_type === types.token ? this.changeRewardToken : this.changeRewardNFT} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                        {
                                            this.state.rewardTokenEvents
                                        }                                          
                                    </select>
                                </div>
                         </div>
                        </div>
                        <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                <label className="form__label">Select user: <img className="form__icon-info" src={info}/></label>
                                    <div className="input-group ">
                                        <select onChange={this.changeUser} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                            {
                                                this.state.users
                                            }
                                        </select>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4">Select the user you would like to reward</div>
                                </div>
                         </div>

                         <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                <label className="form__label">Comment: <img className="form__icon-info" src={info}/></label>
                                    <div className="input-group ">
                                    <textarea onChange={this.changeComment} className="form__textarea form__textarea_desct-nft-collection" placeholder="Reward comment(optional)" aria-label="With textarea"></textarea>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4">The user does not see this text. <a className="link__form-prompt" href="https://www.markdownguide.org/cheat-sheet/" target="blank">Markdown</a> syntax is supported.</div>
                                </div>
                         </div>

                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn_primary btn_gray" onClick={this.handleCloseReward}>
                        Cancel
                    </button>
                    <button className="btn btn_primary btn_orange" onClick={this.state.switcher === types.token ? this.rewardWithToken : this.rewardWithNFT}>
                        Reward
                    </button>
                    </Modal.Footer>
                </Modal>
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
            </>
        )
    }
}

export default RewardEvents