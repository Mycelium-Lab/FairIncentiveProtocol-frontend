import { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import FPTable from "../common/FPTable";
import more from '../../media/common/more.svg';
import FPDropdown from "../common/FPDropdown";
import { getBearerHeader } from "../../utils/getBearerHeader";
import { config } from "../../utils/config";
import { createLongStrView } from "../../utils/longStrView";
import { userTable } from "../../data/tables";
import info from '../../media/common/info-small.svg'
import drug_drop from '../../media/common/drug&drop.svg'
import FileUpload from "../FileUpload";

let propertiesElementsLength = 0
let statsElementsLength = 0
let editPropertiesElementsLength = 0
let editStatsElementsLength = 0

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
            showEdit: false,
            showDelete: false,
            chosen_user_external_id: null,
            chosen_user_id: null,
            users: [],
            propertiesElements: [],
            statsElements: [],
            basic_edit_user: {},
            edit_user: {},
            editPropertiesElements: [],
            editStatsElements: [],
            chosen_type: types.token,
            chosen_reward_token: null,
            chosen_reward_nft: null,
            switcher: types.token,
            tokenRewards: [],
            nftRewards: [],
            nfts: {},
            current_nfts: [],
            comment: null,
            tabelData: userTable
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
            let propertiesElements = this.state.propertiesElements
            let statsElements = this.state.statsElements
            propertiesElements = propertiesElements.filter(v => v.work).map(v => {
                return {
                    name: v.name,
                    value: v.value
                }
            })
            statsElements = statsElements.filter(v => v.work).map(v => {
                return {
                    name: v.name,
                    value: v.value
                }
            })
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())

            const raw = JSON.stringify({
                "external_id": this.state.add_externalID,
                "email": this.state.add_email,
                "wallet": this.state.add_wallet,
                "notes": this.state.add_notes,
                "properties": propertiesElements,
                "stats": statsElements
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
                    id: json.body.data.id,
                    external_id: this.state.add_externalID,
                    email: this.state.add_email,
                    wallet: this.state.add_wallet,
                    notes: this.state.add_notes,
                    properties: propertiesElements,
                    stats: statsElements
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
                users: json.body.data
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
                    users: _users,
                    showDelete: false
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
            json.body.data = json.body.data.filter(v => v.status !== 1)
            this.setState({
                tokenRewards: json.body.data,
                chosen_reward_token: json.body.data[0] ? json.body.data[0].id : null
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
            json.body.data = json.body.data.filter(v => v.status !== 1)
            this.setState({
                nftRewards: json.body.data,
                chosen_reward_nft: json.body.data[0] ? json.body.data[0].id : null
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

    async edit() {
        try {
            const { edit_user, editPropertiesElements, editStatsElements } = this.state
            const properties = editPropertiesElements.filter(v => v.work).map(v => {
                return {
                    name: v.name, 
                    value: v.value
                }
            })
            const stats = editStatsElements.filter(v => v.work).map(v => {
                return {
                    name: v.name, 
                    value: v.value
                }
            })
            edit_user.properties = properties
            edit_user.stats = stats
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())
            const raw = JSON.stringify({
                company_id: edit_user.company_id,
                email: edit_user.email,
                external_id: edit_user.external_id,
                id: edit_user.id,
                image: edit_user.image,
                notes: edit_user.notes,
                properties: edit_user.properties,
                stats: edit_user.stats,
                wallet: edit_user.wallet
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/users/update`, requestOptions)
            if (res.status === 200) {
                let users = this.state.users
                users = users.map(v => {
                    if (v.id === edit_user.id) {
                        return edit_user
                    }
                    return v
                })
                this.setState({users, showEdit: false})
                alert('Done')
            } else alert('Something went wrong')
        } catch (error) {
            console.log(error)
        }
    }

    deletePropertyInput = (index) => {
        console.log(index)
        let propertiesElements = this.state.propertiesElements
        propertiesElements.forEach(v => {if (v.id === index) v.work = false})
        this.setState({
            propertiesElements
        })
    }

    addPropertyInput = () => {
        const propertiesElements = this.state.propertiesElements
        const id = propertiesElementsLength
        propertiesElements.push(
            {
                id,
                element: 
                <div className="user-custom-params">
                    <input type="text" id={`property-name-${id}`} onChange={(event) => this.changePropertyName(id, event.target.value)} className="form-control" placeholder="Property name"/>
                    <input type="text" id={`property-value-${id}`} onChange={(event) => this.changePropertyValue(id, event.target.value)} className="form-control" placeholder="Property value"/>
                    <button type="button" className="btn btn-dark" onClick={() => this.deletePropertyInput(id)}>-</button>
                </div>,
                name: undefined,
                value: undefined,
                work: true
            }
        )
        propertiesElementsLength += 1
        this.setState({propertiesElements})
    }

    changePropertyName(id, value) {
        let propertiesElements = this.state.propertiesElements
        propertiesElements.forEach(v => {
            if (v.id === id) v.name = value
        })
        document.getElementById(`property-name-${id}`).value = value
        this.setState({
            propertiesElements
        })
    }

    changePropertyValue(id, value) {
        let propertiesElements = this.state.propertiesElements
        propertiesElements.forEach(v => {
            if (v.id === id) v.value = value
        }) 
        this.setState({
            propertiesElements
        })
    }

    deleteStatInput = (index) => {
        let statsElements = this.state.statsElements
        statsElements.forEach(v => { if (v.id === index) v.work = false});
        this.setState({statsElements})
    }

    addStatInput = () => {
        const statsElements = this.state.statsElements
        const id = statsElementsLength
        statsElements.push(
            {
                id,
                element: 
                <div className="user-custom-params">
                    <input type="text" id={`stat-name-${id}`} onChange={this.changeStatName} className="form-control" placeholder="Stat name"/>
                    <input type="number" id={`stat-value-${id}`} onChange={this.changeStatValue} className="form-control" placeholder="Stat value"/>
                    <button type="button" className="btn btn-dark" onClick={() => this.deleteStatInput(id)}>-</button>
                </div>,
                name: undefined,
                value: undefined,
                work: true
            }
        )
        statsElementsLength += 1
        this.setState({statsElements})
    }

    changeStatName(event) {
        let statsElements = this.state.statsElements
        const idFull = event.target.id.split('-')
        const id = parseInt(idFull[idFull.length - 1])
        statsElements.forEach(v => {
            if (v.id === id) v.name = event.target.value
        }) 
        this.setState({
            statsElements
        })
    }

    changeStatValue(event) {
        let statsElements = this.state.statsElements
        const idFull = event.target.id.split('-')
        const id = parseInt(idFull[idFull.length - 1])
        statsElements.forEach(v => {
            if (v.id === id) v.value = event.target.value
        }) 
        this.setState({
            statsElements
        })
    }

    handleShowAdd = () => this.setState({showAdd: true})
    handleCloseAdd = () => this.setState({showAdd: false})
    handleShowToReward = (external_id, id) => this.setState({chosen_user_id: id, chosen_user_external_id: external_id, showToReward: true})
    handleCloseToReward = () => this.setState({showToReward: false})
    handleShowEdit = (user) => {
        const propertiesElements = []
        const statsElements = []
        user.properties.forEach(v => {
            const propertyId = editPropertiesElementsLength
            propertiesElements.push(
                {
                    id: propertyId,
                    element: 
                    <div className="user-custom-params">
                        <input type="text" id={`edit-property-name-${propertyId}`} onChange={(event) => this.changeEditPropertyName(propertyId, event.target.value)} defaultValue={v.name} className="form-control" placeholder="Property name"/>
                        <input type="text" id={`edit-property-value-${propertyId}`} onChange={(event) => this.changeEditPropertyValue(propertyId, event.target.value)} defaultValue={v.value} className="form-control" placeholder="Property value"/>
                        <button type="button" className="btn btn-dark" onClick={() => this.deleteEditPropertyInput(propertyId)}>-</button>
                    </div>,
                    name: v.name,
                    value: v.value,
                    work: true
                }
            )
            editPropertiesElementsLength += 1
        })
        user.stats.forEach(v => {
            const statId = editStatsElementsLength
            statsElements.push(
                {
                    id: statId,
                    element: 
                    <div className="user-custom-params">
                        <input type="text" id={`edit-stat-name-${statId}`} onChange={this.changeEditStatName} defaultValue={v.name} className="form-control" placeholder="Stat name"/>
                        <input type="number" id={`edit-stat-value-${statId}`} onChange={this.changeEditStatValue} defaultValue={v.value} className="form-control" placeholder="Stat value"/>
                        <button type="button" className="btn btn-dark" onClick={() => this.deleteEditStatInput(statId)}>-</button>
                    </div>,
                    name: v.name,
                    value: v.value,
                    work: true
                }
            )
            editStatsElementsLength += 1
        })
        this.setState({
            showEdit: true, 
            edit_user: {...user}, 
            basic_edit_user: {...user},
            editPropertiesElements: propertiesElements,
            editStatsElements: statsElements
        })
    }
    handleCloseEdit = () => this.setState({showEdit: false, edit_user: {}, basic_edit_user: {}, editPropertiesElements: [], editStatsElements: []})
    handleShowDelete = (chosen_user_external_id, chosen_user_id) => this.setState({showDelete: true, chosen_user_external_id, chosen_user_id})
    handleCloseDelete = () => this.setState({showDelete: false, chosen_user_external_id: null, chosen_user_id: null})

    deleteEditPropertyInput = (index) => {
        let propertiesElements = this.state.editPropertiesElements
        propertiesElements.forEach(v => {if (v.id === index) v.work = false})
        this.setState({
            editPropertiesElements: propertiesElements
        })
    }

    addEditPropertyInput = () => {
        const propertiesElements = this.state.editPropertiesElements
        const id = editPropertiesElementsLength
        propertiesElements.push(
            {
                id,
                element: 
                <div className="user-custom-params">
                    <input type="text" id={`edit-property-name-${id}`} onChange={(event) => this.changeEditPropertyName(id, event.target.value)} className="form-control" placeholder="Property name"/>
                    <input type="text" id={`edit-property-value-${id}`} onChange={(event) => this.changeEditPropertyValue(id, event.target.value)} className="form-control" placeholder="Property value"/>
                    <button type="button" className="btn btn-dark" onClick={() => this.deleteEditPropertyInput(id)}>-</button>
                </div>,
                name: undefined,
                value: undefined,
                work: true
            }
        )
        editPropertiesElementsLength += 1
        this.setState({editPropertiesElements: propertiesElements})
    }

    changeEditPropertyName(id, value) {
        let propertiesElements = this.state.editPropertiesElements
        propertiesElements.forEach(v => {
            if (v.id === id) v.name = value
        })
        document.getElementById(`edit-property-name-${id}`).value = value
        this.setState({
            editPropertiesElements: propertiesElements
        })
    }

    changeEditPropertyValue(id, value) {
        let propertiesElements = this.state.editPropertiesElements
        propertiesElements.forEach(v => {
            if (v.id === id) v.value = value
        }) 
        this.setState({
            editPropertiesElements: propertiesElements
        })
    }
    deleteEditStatInput = (index) => {
        let statsElements = this.state.editStatsElements
        statsElements.forEach(v => { if (v.id === index) v.work = false});
        this.setState({editStatsElements: statsElements})
    }

    addEditStatInput = () => {
        const statsElements = this.state.editStatsElements
        const id = editStatsElementsLength
        statsElements.push(
            {
                id,
                element: 
                <div className="user-custom-params">
                    <input type="text" id={`edit-stat-name-${id}`} onChange={this.changeEditStatName} className="form-control" placeholder="Stat name"/>
                    <input type="number" id={`edit-stat-value-${id}`} onChange={this.changeEditStatValue} className="form-control" placeholder="Stat value"/>
                    <button type="button" className="btn btn-dark" onClick={() => this.deleteEditStatInput(id)}>-</button>
                </div>,
                name: undefined,
                value: undefined,
                work: true
            }
        )
        editStatsElementsLength += 1
        this.setState({editStatsElementsLength: statsElements})
    }

    changeEditStatName(event) {
        let statsElements = this.state.editStatsElements
        const idFull = event.target.id.split('-')
        const id = parseInt(idFull[idFull.length - 1])
        statsElements.forEach(v => {
            if (v.id === id) v.name = event.target.value
        }) 
        this.setState({
            editStatsElements: statsElements
        })
    }

    changeEditStatValue(event) {
        let statsElements = this.state.editStatsElements
        const idFull = event.target.id.split('-')
        const id = parseInt(idFull[idFull.length - 1])
        statsElements.forEach(v => {
            if (v.id === id) v.value = event.target.value
        }) 
        this.setState({
            editStatsElements: statsElements
        })
    }

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
    changeEditExternalID(event) {
        let edit_user = this.state.edit_user
        edit_user.external_id = event.target.value
        this.setState({
            edit_user
        })
    }
    changeEditWallet(event) {
        let edit_user = this.state.edit_user
        edit_user.wallet = event.target.value
        this.setState({
            edit_user
        })
    }
    changeEditNotes(event) {
        let edit_user = this.state.edit_user
        edit_user.notes = event.target.value
        this.setState({
            edit_user
        })
    }
    changeEditEmail(event) {
        let edit_user = this.state.edit_user
        edit_user.email = event.target.value
        this.setState({
            edit_user
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
    handleShowEdit = this.handleShowEdit.bind(this)
    handleCloseEdit = this.handleCloseEdit.bind(this)
    handleShowDelete = this.handleShowDelete.bind(this)
    handleCloseDelete = this.handleCloseDelete.bind(this)
    addPropertyInput = this.addPropertyInput.bind(this)
    deletePropertyInput = this.deletePropertyInput.bind(this)
    getTokenRewards = this.getTokenRewards.bind(this)
    getNFTRewards = this.getNFTRewards.bind(this)
    changeType = this.changeType.bind(this)
    changeRewardToken = this.changeRewardToken.bind(this)
    changeRewardNFT = this.changeRewardNFT.bind(this)
    changeComment = this.changeComment.bind(this)
    reward = this.reward.bind(this)
    changePropertyName = this.changePropertyName.bind(this)
    changePropertyValue = this.changePropertyValue.bind(this)
    deleteStatInput = this.deleteStatInput.bind(this)
    addStatInput = this.addStatInput.bind(this)
    changeStatName = this.changeStatName.bind(this)
    changeStatValue = this.changeStatValue.bind(this)
    changeEditExternalID = this.changeEditExternalID.bind(this)
    changeEditWallet = this.changeEditWallet.bind(this)
    changeEditNotes = this.changeEditNotes.bind(this)
    changeEditEmail = this.changeEditEmail.bind(this)
    edit = this.edit.bind(this)
    deleteEditPropertyInput = this.deleteEditPropertyInput.bind(this)
    addEditPropertyInput = this.addEditPropertyInput.bind(this)
    changeEditPropertyName = this.changeEditPropertyName.bind(this)
    changeEditPropertyValue = this.changeEditPropertyValue.bind(this)
    deleteEditStatInput = this.deleteEditStatInput.bind(this)
    addEditStatInput = this.addEditStatInput.bind(this)
    changeEditStatName = this.changeEditStatName.bind(this)
    changeEditStatValue = this.changeEditStatValue.bind(this)

    render() {
        return (
            <>
                <div className="title-header">
                    <h3>Users</h3>
                    <button onClick={this.handleShowAdd} type="button" className="btn btn_primary btn_orange">Add new user</button>
                </div>
                <Modal show={this.state.showAdd} onHide={this.handleCloseAdd} centered>
                    <Modal.Header closeButton>
                    <Modal.Title className="modal-newuser__title">Add new user</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-4">
                            <label className="form__label">Username or external ID:</label>
                            <div className="input-group">
                                <input type="text" placeholder="Username" onChange={this.onChangeExternalID} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                            <div className="form__prompt" id="basic-addon4">Specify the user ID for API calls or it will be generated automatically</div>
                        </div>
                        <div className="mb-4">
                            <label className="form__label">Profile image *</label>
                            <div className="input-group">
                                <FileUpload></FileUpload>
                            </div>
                            <div className="form__prompt" id="basic-addon4">File types supported: JPG, PNG, GIF, SVG. Max size: 100 MB</div>
                        </div>
                        <div className="mb-4">
                            <label className="form__label">Wallet: <img className="form__icon-info" src={info} /></label>
                            <div className="input-group">
                                <input placeholder="0xhjfg7...9fdf" type="text" onChange={this.onChangeWallet} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                            <div className="form__prompt" id="basic-addon4">Specify ethereum wallet to receive rewards</div>
                        </div>
                        <div className="mb-4">
                            <label className="form__label">Notes: <img className="form__icon-info" src={info} /></label>
                            <div className="input-group">
                                <textarea onChange={this.onChangeNotes} placeholder="User notes available to system administrators and 
moderators" type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"></textarea>
                            </div>
                            <div className="form__prompt" id="basic-addon4">The user does not see this text. <a href="https://www.markdownguide.org/cheat-sheet/" className="link__form-prompt" target="blank">Markdown</a> syntax is supported.</div>
                        </div>
                        <div className="form__group mb-4">
                            <div className="form__group_top-row">
                                <div className="form__group_top-row-left">
                                    <img src={drug_drop}></img>
                                    <div>
                                        <label className="form__label_group form__label">Properties:  <img className="form__icon-info" src={info} />
                                        { /*<button type="button" className="btn btn-dark" onClick={this.addEditPropertyInput}>+</button> */}
                                        </label>
                                        {
                                            /*
                                            <div id="user-properties">
                                            {
                                                this.state.editPropertiesElements ?
                                                this.state.editPropertiesElements.map(v => v.work ? v.element : null) :
                                                null
                                            }
                                        </div>
                                        */
                                        }
                                        <div className="form__prompt" id="basic-addon4">Textual parameters of user</div>
                                    </div>
                                </div>
                                <button type="button" className="btn btn_primary btn_orange btn__counter" onClick={this.addEditPropertyInput}>+</button>
                            </div>
                            <div className="form__group_bottom-row">
                                <div className="input-group">
                                    <input type="text" placeholder="Username" value={this.state.edit_user.external_id} onChange={this.changeEditExternalID} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                                <div className="input-group">
                                    <input type="text" placeholder="Username" value={this.state.edit_user.external_id} onChange={this.changeEditExternalID} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                                <button type="button" className="btn btn_primary btn_orange btn__counter" onClick={this.addEditPropertyInput}>-</button>
                            </div>
                            
                        </div>
                        <div className="form__group mb-4">
                            <div className="form__group_top-row">
                                <div className="form__group_top-row-left">
                                    <img src={drug_drop}></img>
                                    <div>
                                        <label className="form__label_group form__label">Stats: <img className="form__icon-info" src={info} />
                                        {/*<button type="button" className="btn btn-dark" onClick={this.addEditStatInput}>+</button>*/}
                                        </label>
                                        {
                                            /*
                                            <div id="user-stats">
                                            {
                                                this.state.editStatsElements ?
                                                this.state.editStatsElements.map(v => v.work ? v.element : null) :
                                                null
                                            }
                                        </div>
                                        */
                                        }
                                        <div className="form__prompt" id="basic-addon4">Numerical parameters of user</div>
                                    </div>
                                </div>
                                <button type="button" className="btn btn_primary btn_orange btn__counter" onClick={this.addEditPropertyInput}>+</button>
                            </div>
                            <div className="form__group_bottom-row">
                                <div className="input-group">
                                    <input type="text" placeholder="Username" value={this.state.edit_user.external_id} onChange={this.changeEditExternalID} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                                <div className="input-group">
                                    <input type="text" placeholder="Username" value={this.state.edit_user.external_id} onChange={this.changeEditExternalID} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                                <button type="button" className="btn btn_primary btn_orange btn__counter" onClick={this.addEditPropertyInput}>-</button>
                            </div>
                            
                        </div>
                        <div className="mb-4">
                            <label className="form__label">Email:</label>
                            <div className="input-group">
                                <input onChange={this.onChangeEmail} value={this.state.add_email}  placeholder="example@gmail.com" type="email" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn_primary btn_gray" onClick={this.handleCloseAdd}>
                        Back
                    </button>
                    <button className="btn btn_primary btn_orange" onClick={this.addUser}>
                        Create
                    </button>
                    </Modal.Footer>
                </Modal>
                <div>
                    {
                        /*
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
                                        <div>
                                            NFTs: {v.nft_rewards ? v.nft_rewards.map((reward, i, arr) => 
                                                `${reward.count} ${reward.count === 1 ? 'time' : 'times'} ${reward.reward_name}${i === (arr.length - 1) ? '.' : ';'}\n`
                                            ): null}
                                        </div>
                                        <div>
                                            Tokens: {v.token_rewards ? v.token_rewards.map((reward, i, arr) => 
                                                `${reward.count} ${reward.count === 1 ? 'time' : 'times'} ${reward.reward_name}${i === (arr.length - 1) ? '.' : ';'}\n`
                                            ): null}
                                        </div>
                                    </td>
                                    <td className="table-secondary">
                                        <button type="button" className="btn btn-dark" disabled>Stat</button>
                                        <button type="button" className="btn btn-dark" onClick={() => this.handleShowEdit(v)}>Edit</button>
                                        <button type="button" className="btn btn-dark" onClick={() => this.handleShowToReward(v.external_id, v.id)}>To reward</button>
                                        <button onClick={() => this.handleShowDelete(v.external_id, v.id)} type="button" className="btn btn-danger">Delete</button>
                                    </td>
                                </tr>
                                )
                            }
                        </tbody>
                    </table>
                    */
                    }
                    <FPTable data={this.state.tabelData}>
                        <tr>
                            <td>1</td>
                            <td>Name 1</td>
                            <td>
                                <a className="link__primary">0x12c4...32f4</a>
                            </td>
                            <td>
                                <ul className="tokens-list unlist">
                                    <li className="tokens-list__item">
                                    345 ABC
                                    </li>
                                    <li className="tokens-list__item">
                                    105 545 CBA
                                    </li>
                                    <li className="tokens-list__item">
                                    5 NFTs from ABC collection
                                    </li>
                                </ul>
                            </td>
                            <td>
                            <a className="link__primary">5 from ABC collection</a>
                            </td>
                            <td>
                                <FPDropdown icon={more}>
                                    <Dropdown.Item className="dropdown__menu-item">Stat</Dropdown.Item>
                                    <Dropdown.Item className="dropdown__menu-item">Edit</Dropdown.Item>
                                    <Dropdown.Item className="dropdown__menu-item">To reward</Dropdown.Item>
                                    <Dropdown.Item className="dropdown__menu-item">Delete</Dropdown.Item>
                                </FPDropdown>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Name 2</td>
                            <td>
                                <a className="link__primary">0x12c4...32f7</a>
                            </td>
                            <td>
                                <ul className="tokens-list unlist">
                                        <li className="tokens-list__item">
                                        345 ABC
                                        </li>
                                        <li className="tokens-list__item">
                                        105 545 CBA
                                        </li>
                                        <li className="tokens-list__item">
                                        5 NFTs from ABC collection
                                        </li>
                                </ul>
                            </td>
                            <td>
                                <a className="link__primary">5 from ABC collection</a>
                            </td>
                            <td>
                                <FPDropdown icon={more}>
                                <Dropdown.Item className="dropdown__menu-item">Stat</Dropdown.Item>
                                <Dropdown.Item className="dropdown__menu-item">Edit</Dropdown.Item>
                                <Dropdown.Item className="dropdown__menu-item">To reward</Dropdown.Item>
                                <Dropdown.Item className="dropdown__menu-item">Delete</Dropdown.Item>
                        </FPDropdown>
                            </td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Name 3</td>
                            <td>
                                <a className="link__primary">0x12c4...32f9</a>
                            </td>
                            <td>
                            <ul className="tokens-list unlist">
                                    <li className="tokens-list__item">
                                    345 ABC
                                    </li>
                                    <li className="tokens-list__item">
                                    105 545 CBA
                                    </li>
                                    <li className="tokens-list__item">
                                    5 NFTs from ABC collection
                                    </li>
                                </ul>
                            </td>
                            <td>
                            <a className="link__primary">5 from ABC collection</a>
                            </td>
                        <td>
                        <FPDropdown icon={more}>
                            <Dropdown.Item className="dropdown__menu-item">Stat</Dropdown.Item>
                            <Dropdown.Item className="dropdown__menu-item">Edit</Dropdown.Item>
                            <Dropdown.Item className="dropdown__menu-item">To reward</Dropdown.Item>
                            <Dropdown.Item className="dropdown__menu-item">Delete</Dropdown.Item>
                        </FPDropdown>
                        </td>
                    </tr>
                </FPTable>
                </div>
                <Modal show={this.state.showToReward} onHide={this.handleCloseToReward} centered>
                    <Modal.Header closeButton>
                        Reward {this.state.chosen_user_external_id} (FAIR id: {createLongStrView(this.state.chosen_user_id ? this.state.chosen_user_id : '')})
                    </Modal.Header>
                    <Modal.Body>
                    <label className="form__label">Choose a reward mode:</label>
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
                        <label className="form__label">Select reward:</label>
                        <div className="input-group mb-4">
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
                        <div className="mb-4">
                            <label className="form__label">Comment:</label>
                            <textarea onChange={this.changeComment} className="form-control" placeholder="Reward comment(optional)" aria-label="With textarea"></textarea>
                            <div className="form-text" id="basic-addon4">The user does not see this text. <a href="https://www.markdownguide.org/cheat-sheet/" className="link__form-prompt" target="blank">Markdown</a> syntax is supported.</div>
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
                <Modal show={this.state.showEdit} onHide={this.handleCloseEdit} centered>
                    <Modal.Header closeButton>
                        Edit {this.state.edit_user.external_id} (FAIR id: {createLongStrView(this.state.edit_user.id)})
                    </Modal.Header>

                    <Modal.Body>
                        <div className="mb-4">
                            <label className="form__label">Username or external ID:</label>
                            <div className="input-group">
                                <input type="text" placeholder="Username" value={this.state.edit_user.external_id} onChange={this.changeEditExternalID} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                            <div className="form__prompt" id="basic-addon4">Specify the user ID for API calls or it will be generated automatically</div>
                        </div>
                        <div className="mb-4">
                            <label className="form__label">Wallet: <img src={info} /></label>
                            <div className="input-group">
                                <input placeholder="0xhjfg7...9fdf" type="text" value={this.state.edit_user.wallet} onChange={this.changeEditWallet} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                            <div className="form__prompt" id="basic-addon4">Specify ethereum wallet to receive rewards</div>
                        </div>
                        <div className="mb-4">
                            <label className="form__label">Notes: <img className="form__icon-info" src={info} /></label>
                            <div className="input-group">
                                <textarea value={this.state.edit_user.notes} onChange={this.changeEditNotes} placeholder="User notes available to system administrators and 
moderators" type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"></textarea>
                            </div>
                            <div className="form-text" id="basic-addon4">The user does not see this text. <a href="https://www.markdownguide.org/cheat-sheet/" target="blank">Markdown</a> syntax is supported.</div>
                        </div>


                        <div className="form__group mb-4">
                            <div className="form__group_top-row">
                                <div className="form__group_top-row-left">
                                        <img src={drug_drop}></img>
                                        <div>
                                        <label className="form__label_group form__label">Properties:  <img className="form__icon-info" src={info} />
                                        { /*<button type="button" className="btn btn-dark" onClick={this.addEditPropertyInput}>+</button> */}
                                        </label>
                                        {
                                            /*
                                            <div id="user-properties">
                                            {
                                                this.state.editPropertiesElements ?
                                                this.state.editPropertiesElements.map(v => v.work ? v.element : null) :
                                                null
                                            }
                                        </div>
                                        */
                                        }
                                        <div className="form__prompt" id="basic-addon4">Textual parameters of user</div>
                                    </div>
                                </div>
                            <button type="button" className="btn btn_primary btn_orange btn__counter" onClick={this.addEditPropertyInput}>+</button>
                            </div>
                            <div className="form__group_bottom-row">
                                <div className="input-group">
                                    <input type="text" placeholder="Username" value={this.state.edit_user.external_id} onChange={this.changeEditExternalID} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                                <div className="input-group">
                                    <input type="text" placeholder="Username" value={this.state.edit_user.external_id} onChange={this.changeEditExternalID} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                                <button type="button" className="btn btn_primary btn_orange btn__counter" onClick={this.addEditPropertyInput}>-</button>
                            </div>
                            
                        </div>
                        <div className="form__group mb-4">
                            <div className="form__group_top-row">
                                <div className="form__group_top-row-left">
                                    <img src={drug_drop}></img>
                                    <div>
                                        <label className="form__label_group form__label">Stats: <img className="form__icon-info" src={info} />
                                        {/*<button type="button" className="btn btn-dark" onClick={this.addEditStatInput}>+</button>*/}
                                        </label>
                                        {
                                            /*
                                            <div id="user-stats">
                                            {
                                                this.state.editStatsElements ?
                                                this.state.editStatsElements.map(v => v.work ? v.element : null) :
                                                null
                                            }
                                        </div>
                                        */
                                        }
                                        <div className="form__prompt" id="basic-addon4">Numerical parameters of user</div>
                                    </div>
                                </div>
                                <button type="button" className="btn btn_primary btn_orange btn__counter" onClick={this.addEditPropertyInput}>+</button>
                            </div>
                            <div className="form__group_bottom-row">
                                <div className="input-group">
                                    <input type="text" placeholder="Username" value={this.state.edit_user.external_id} onChange={this.changeEditExternalID} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                                <div className="input-group">
                                    <input type="text" placeholder="Username" value={this.state.edit_user.external_id} onChange={this.changeEditExternalID} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                                <button type="button" className="btn btn_primary btn_orange btn__counter" onClick={this.addEditPropertyInput}>-</button>
                            </div>
                            
                        </div>
                        <div className="mb-4">
                            <label className="form__label">Email:</label>
                            <div className="input-group">
                                <input onChange={this.changeEditEmail} value={this.state.edit_user.email}  placeholder="example@gmail.com" type="email" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn-dark" onClick={this.edit}>
                        Edit
                    </button>
                    <button className="btn btn-light" onClick={this.handleCloseEdit}>
                        Cancel
                    </button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showDelete} onHide={this.handleCloseDelete} centered>
                    <Modal.Header closeButton>
                        Delete {this.state.chosen_user_external_id} (FAIR id: {createLongStrView(this.state.chosen_user_id ? this.state.chosen_user_id : '')})?
                    </Modal.Header>
                    <Modal.Footer>
                        <button className="btn btn-danger" onClick={() => this.deleteUser(this.state.chosen_user_id)}>Delete</button>
                        <button className="btn btn-light" onClick={this.handleCloseDelete}>Cancel</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default Users