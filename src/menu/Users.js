import { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import { getBearerHeader } from "../utils/getBearerHeader";
import { config } from "../utils/config";
import { createLongStrView } from "../utils/longStrView";
import '../styles/users.css'

let propertiesElementsLength = 0

const types = {
    token: 'token',
    nft: 'nft'
}

class Users extends Component {

    constructor(props) {
        super(props)
        this.state = {
            add_externalID: '',
            add_email: '',
            add_wallet: '',
            add_notes: null,
            showAdd: false,
            showToReward: false,
            chosen_user_external_id: null,
            chosen_user_id: null,
            users: [],
            propertiesElements: [],
            statsElements: [],
            properties: [],
            stats: [],
            chosen_type: types.token,
            chosen_reward_token: null,
            chosen_reward_nft: null,
            switcher: types.token,
            tokenRewards: [],
            nftRewards: [],
            nfts: {},
            current_nfts: [],
            comment: null
        }
    }

    async componentDidMount() {
        await this.getUsers()
        await this.getTokenRewards()
        await this.getNFTRewards()
    }

    onChangeExternalID(event) {
        this.setState({
            add_externalID: event.target.value
        })
    }

    onChangeNotes(event) {
        this.setState({
            add_notes: event.target.value
        })
    }

    onChangeEmail(event) {
        this.setState({
            add_email: event.target.value
        })
    }

    onChangeWallet(event) {
        this.setState({
            add_wallet: event.target.value
        })
    }

    async addUser() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())

            const raw = JSON.stringify({
                "external_id": this.state.add_externalID,
                "email": this.state.add_email,
                "wallet": this.state.add_wallet,
                "notes": this.state.add_notes,
                "properties": this.state.properties,
                "stats": this.state.stats
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/users/add`, requestOptions)
            const json = await res.json()
            if (res.status === 200) {
                const _users = this.state.users
                _users.push({
                    id: json.id,
                    external_id: this.state.add_externalID,
                    email: this.state.add_email,
                    wallet: this.state.add_wallet,
                    notes: this.state.add_notes
                })
                this.setState({
                    users: _users,
                    showAdd: false
                })
            } else {
                alert('Something went wrong')
            }
        } catch (error) {
            alert(error)
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
            this.setState({
                users: json.users
            })
        } catch (error) {
            alert(error)
        }
    }

    async deleteUser(id) {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())

            const raw = JSON.stringify({
                "id": id
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/users/delete`, requestOptions)
            if (res.status === 200) {
                const _users = this.state.users.filter(v => v.id != id)
                this.setState({
                    users: _users
                })
            } else {
                alert('Something went wrong')
            }
        } catch (error) {
            alert(error)
        }
    }

    async getTokenRewards() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/rewards/get/token`, requestOptions)
            const json = await res.json()
            this.setState({
                tokenRewards: json.tokenRewards,
                chosen_reward_token: json.tokenRewards[0] ? json.tokenRewards[0].id : null
            })
        } catch (error) {
            console.log(error)
        }
    }

    async getNFTRewards() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/rewards/get/nfts`, requestOptions)
            const json = await res.json()
            this.setState({
                nftRewards: json.nftRewards,
                chosen_reward_nft: json.nftRewards[0] ? json.nftRewards[0].id : null
            })
        } catch (error) {
            console.log(error)
        }
    }

    async reward() {
        try {
            const { chosen_type, chosen_reward_nft, chosen_reward_token, comment, chosen_user_id } = this.state
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())
            const raw = JSON.stringify(
                {
                    reward_id: chosen_type === types.token ? chosen_reward_token : chosen_reward_nft,
                    user_id: chosen_user_id,
                    comment: comment
                }
            );
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/rewards/reward/${chosen_type === types.token ? 'token' : 'nft'}`, requestOptions)
            if (res.status === 200) alert('Done')
            else alert('Something went wrong')
        } catch (error) {
            alert(error)
        }
    }

    deletePropertyInput = (index) => {
        console.log(index)
        let propertiesElements = this.state.propertiesElements
        console.log(propertiesElements)
        propertiesElements = propertiesElements.filter(v => v.id != index);
        console.log(propertiesElements)
        this.setState({propertiesElements})
    }

    addPropertyInput = () => {
        const propertiesElements = this.state.propertiesElements
        propertiesElements.push(
            {
                id: propertiesElementsLength,
                element: 
                <div className="user-custom-params">
                    <input type="text" className="form-control" placeholder="Property name"/>
                    <input type="text" className="form-control" placeholder="Property value"/>
                    <button type="button" className="btn btn-dark" onClick={() => this.deletePropertyInput(propertiesElementsLength)}>-</button>
                </div>
            }
        )
        this.setState({propertiesElements})
    }

    handleShowAdd = () => this.setState({showAdd: true})
    handleCloseAdd = () => this.setState({showAdd: false})
    handleShowToReward = (external_id, id) => this.setState({chosen_user_id: id, chosen_user_external_id: external_id, showToReward: true})
    handleCloseToReward = () => this.setState({showToReward: false})
    changeType(event) {
        this.setState({
            chosen_type: event.target.value
        })
    }
    changeRewardToken(event) {
        this.setState({
            chosen_reward_token: event.target.value
        })
    }
    changeRewardNFT(event) {
        this.setState({
            chosen_reward_nft: event.target.value
        })
    }
    changeComment(event) {
        this.setState({
            comment: event.target.value
        })
    }
    
    onChangeExternalID = this.onChangeExternalID.bind(this)
    onChangeNotes = this.onChangeNotes.bind(this)
    onChangeEmail = this.onChangeEmail.bind(this)
    onChangeWallet = this.onChangeWallet.bind(this)
    addUser = this.addUser.bind(this)
    getUsers = this.getUsers.bind(this)
    deleteUser = this.deleteUser.bind(this)
    handleShowAdd = this.handleShowAdd.bind(this)
    handleCloseAdd = this.handleCloseAdd.bind(this)
    handleShowToReward = this.handleShowToReward.bind(this)
    handleCloseToReward = this.handleCloseToReward.bind(this)
    addPropertyInput = this.addPropertyInput.bind(this)
    deletePropertyInput = this.deletePropertyInput.bind(this)
    getTokenRewards = this.getTokenRewards.bind(this)
    getNFTRewards = this.getNFTRewards.bind(this)
    changeType = this.changeType.bind(this)
    changeRewardToken = this.changeRewardToken.bind(this)
    changeRewardNFT = this.changeRewardNFT.bind(this)
    changeComment = this.changeComment.bind(this)
    reward = this.reward.bind(this)

    render() {
        return (
            <div>
                <div className="title-header">
                    <h3>Users</h3>
                    <button onClick={this.handleShowAdd} type="button" className="btn btn-dark">Add new user</button>
                </div>
                <Modal show={this.state.showAdd} onHide={this.handleCloseAdd} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Add new user</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3">
                            <label className="form-label">Username or external ID:</label>
                            <div className="input-group">
                                <input type="text" placeholder="Username" onChange={this.onChangeExternalID} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                            <div className="form-text" id="basic-addon4">Specify the user ID for API calls or it will be generated automatically</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Wallet:</label>
                            <div className="input-group">
                                <input placeholder="0x0000000000000000000000000000000000000000" type="text" onChange={this.onChangeWallet} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                            <div className="form-text" id="basic-addon4">Specify ethereum wallet to receive rewards</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Notes:</label>
                            <div className="input-group">
                                <textarea onChange={this.onChangeNotes} placeholder="User notes available to system administrators and 
moderators" type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"></textarea>
                            </div>
                            <div className="form-text" id="basic-addon4">The user does not see this text. <a href="https://www.markdownguide.org/cheat-sheet/" target="blank">Markdown</a> syntax is supported.</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Properties: <button type="button" className="btn btn-dark" onClick={this.addPropertyInput} disabled>+</button></label>
                            <div id="user-properties">
                                {
                                    this.state.propertiesElements.map(v => v.element)
                                }
                            </div>
                            <div className="form-text" id="basic-addon4">Textual parameters of user</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Stats: <button type="button" className="btn btn-dark" disabled>+</button></label>
                            <div id="user-stats">
                            </div>
                            <div className="form-text" id="basic-addon4">Numerical parameters of user</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email:</label>
                            <div className="input-group">
                                <input onChange={this.onChangeEmail} value={this.state.add_email}  placeholder="example@gmail.com" type="email" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn-dark" onClick={this.addUser}>
                        Create
                    </button>
                    <button className="btn btn-light" onClick={this.handleCloseAdd}>
                        Cancel
                    </button>
                    </Modal.Footer>
                </Modal>
                <div>
                    <table className="table table-bordered border-dark">
                        <thead>
                            <tr className="table-secondary" >
                            <th className="table-secondary" scope="col">ID</th>
                            <th className="table-secondary" scope="col">Name</th>
                            <th className="table-secondary" scope="col">Wallet</th>
                            <th className="table-secondary" scope="col">Tokens</th>
                            <th className="table-secondary" scope="col">Rewards</th>
                            <th className="table-secondary" scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.users.map(v =>
                                <tr className="table-secondary">
                                    <td className="table-secondary">
                                        {createLongStrView(v.id)}
                                    </td>
                                    <td className="table-secondary">
                                        {v.external_id}
                                    </td>
                                    <td className="table-secondary">
                                        {createLongStrView(v.wallet)}
                                    </td>
                                    <td className="table-secondary">
                                        (soon)
                                    </td>
                                    <td className="table-secondary">
                                        (soon)
                                    </td>
                                    <td className="table-secondary">
                                        <button type="button" className="btn btn-dark" disabled>Edit</button>
                                        <button type="button" className="btn btn-dark" disabled>Stat</button>
                                        <button type="button" className="btn btn-dark" onClick={() => this.handleShowToReward(v.external_id, v.id)}>To reward</button>
                                        <button onClick={async () => await this.deleteUser(v.id)} type="button" className="btn btn-danger">Delete</button>
                                    </td>
                                </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
                <Modal show={this.state.showToReward} onHide={this.handleCloseToReward} centered>
                    <Modal.Header closeButton>
                        Reward {this.state.chosen_user_external_id} (FAIR id: {createLongStrView(this.state.chosen_user_id ? this.state.chosen_user_id : '')})
                    </Modal.Header>
                    <Modal.Body>
                    <label className="form-label">Choose a reward mode:</label>
                        <div className="choose-reward-node">
                            <div className="form-check">
                                <input 
                                    className="form-check-input" value={types.token} type="radio" name="flexRadioDefault" id="flexRadioDefault1" 
                                    onChange={this.changeType} checked={this.state.chosen_type === types.token ? true : false}/>
                                <label className="form-check-label" for="flexRadioDefault1">
                                    Tokens
                                </label>
                            </div>
                            <div className="form-check">
                                <input 
                                    className="form-check-input" value={types.nft} type="radio" name="flexRadioDefault" id="flexRadioDefault2" 
                                    onChange={this.changeType} checked={this.state.chosen_type === types.nft ? true : false}
                                />
                                <label className="form-check-label" for="flexRadioDefault2">
                                    NFTs
                                </label>
                            </div>
                        </div>
                        <label className="form-label">Select reward:</label>
                        <div className="input-group mb-3">
                            <select onChange={this.state.chosen_type === types.token ? this.changeRewardToken : this.changeRewardNFT} disabled={this.state.chosen_type ? false : true} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                {
                                    this.state.chosen_type === types.token
                                    ?
                                    this.state.tokenRewards.map(v => <option value={v.id}>{v.name}</option>)
                                    :
                                    this.state.nftRewards.map(v => <option value={v.id}>{v.name}</option>)
                                }
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Comment:</label>
                            <textarea onChange={this.changeComment} className="form-control" placeholder="Reward comment(optional)" aria-label="With textarea"></textarea>
                            <div className="form-text" id="basic-addon4">The user does not see this text. <a href="https://www.markdownguide.org/cheat-sheet/" target="blank">Markdown</a> syntax is supported.</div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn-dark" onClick={this.reward}>
                        Reward
                    </button>
                    <button className="btn btn-light" onClick={this.handleCloseToReward}>
                        Cancel
                    </button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default Users