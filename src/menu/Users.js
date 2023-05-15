import { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import { getBearerHeader } from "../utils/getBearerHeader";
import { config } from "../utils/config";
import { createLongStrView } from "../utils/longStrView";
import '../styles/users.css'

let propertiesElementsLength = 0

class Users extends Component {

    constructor(props) {
        super(props)
        this.state = {
            add_externalID: '',
            add_email: '',
            add_wallet: '',
            add_notes: null,
            showAdd: false,
            users: [],
            propertiesElements: [],
            statsElements: [],
            properties: [],
            stats: []
        }
    }

    async componentDidMount() {
        await this.getUsers()
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
                    <input type="text" class="form-control" placeholder="Property name"/>
                    <input type="text" class="form-control" placeholder="Property value"/>
                    <button type="button" className="btn btn-dark" onClick={() => this.deletePropertyInput(propertiesElementsLength)}>-</button>
                </div>
            }
        )
        this.setState({propertiesElements})
    }

    handleShowAdd = () => this.setState({showAdd: true})
    handleCloseAdd = () => this.setState({showAdd: false})

    onChangeExternalID = this.onChangeExternalID.bind(this)
    onChangeNotes = this.onChangeNotes.bind(this)
    onChangeEmail = this.onChangeEmail.bind(this)
    onChangeWallet = this.onChangeWallet.bind(this)
    addUser = this.addUser.bind(this)
    getUsers = this.getUsers.bind(this)
    deleteUser = this.deleteUser.bind(this)
    handleShowAdd = this.handleShowAdd.bind(this)
    handleCloseAdd = this.handleCloseAdd.bind(this)
    addPropertyInput = this.addPropertyInput.bind(this)
    deletePropertyInput = this.deletePropertyInput.bind(this)

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
                        <div class="mb-3">
                            <label class="form-label">Username or external ID:</label>
                            <div class="input-group">
                                <input type="text" placeholder="Username" onChange={this.onChangeExternalID} class="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                            <div class="form-text" id="basic-addon4">Specify the user ID for API calls or it will be generated automatically</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Wallet:</label>
                            <div class="input-group">
                                <input placeholder="0x0000000000000000000000000000000000000000" type="text" onChange={this.onChangeWallet} class="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                            <div class="form-text" id="basic-addon4">Specify ethereum wallet to receive rewards</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Notes:</label>
                            <div class="input-group">
                                <textarea onChange={this.onChangeNotes} placeholder="User notes available to system administrators and 
moderators" type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"></textarea>
                            </div>
                            <div class="form-text" id="basic-addon4">The user does not see this text. <a href="https://www.markdownguide.org/cheat-sheet/" target="blank">Markdown</a> syntax is supported.</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Properties: <button type="button" className="btn btn-dark" onClick={this.addPropertyInput} disabled>+</button></label>
                            <div id="user-properties">
                                {
                                    this.state.propertiesElements.map(v => v.element)
                                }
                            </div>
                            <div class="form-text" id="basic-addon4">Textual parameters of user</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Stats: <button type="button" className="btn btn-dark" disabled>+</button></label>
                            <div id="user-stats">
                            </div>
                            <div class="form-text" id="basic-addon4">Numerical parameters of user</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email:</label>
                            <div class="input-group">
                                <input onChange={this.onChangeEmail} value={this.state.add_email}  placeholder="example@gmail.com" type="email" class="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
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
                                        <button type="button" className="btn btn-dark" disabled>Stat</button>
                                        <button type="button" className="btn btn-dark" disabled>To reward</button>
                                        <button type="button" className="btn btn-dark" disabled>Edit</button>
                                        <button onClick={async () => await this.deleteUser(v.id)} type="button" className="btn btn-danger">Delete</button>
                                    </td>
                                </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default Users