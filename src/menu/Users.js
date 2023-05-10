import { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import { getBearerHeader } from "../utils/getBearerHeader";
import { config } from "../utils/config";
import { createLongStrView } from "../utils/longStrView";

class Users extends Component {

    constructor(props) {
        super(props)
        this.state = {
            add_firstname: '',
            add_lastname: '',
            add_patronymic: '',
            add_email: '',
            add_wallet: '',
            showAdd: false,
            users: []
        }
    }

    async componentDidMount() {
        await this.getUsers()
    }

    onChangeFirstname(event) {
        this.setState({
            add_firstname: event.target.value
        })
    }

    onChangeLastname(event) {
        this.setState({
            add_lastname: event.target.value
        })
    }

    onChangePatronymic(event) {
        this.setState({
            add_patronymic: event.target.value
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
                "firstname": this.state.add_firstname,
                "lastname": this.state.add_lastname,
                "patronymic": this.state.add_patronymic,
                "email": this.state.add_email,
                "wallet": this.state.add_wallet
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
                    firstname: this.state.add_firstname,
                    lastname: this.state.add_lastname,
                    patronymic: this.state.add_patronymic,
                    email: this.state.add_email,
                    wallet: this.state.add_wallet
                })
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

    handleShowAdd = () => this.setState({showAdd: true})
    handleCloseAdd = () => this.setState({showAdd: false})

    onChangeFirstname = this.onChangeFirstname.bind(this)
    onChangeLastname = this.onChangeLastname.bind(this)
    onChangePatronymic = this.onChangePatronymic.bind(this)
    onChangeEmail = this.onChangeEmail.bind(this)
    onChangeWallet = this.onChangeWallet.bind(this)
    addUser = this.addUser.bind(this)
    getUsers = this.getUsers.bind(this)
    deleteUser = this.deleteUser.bind(this)
    handleShowAdd = this.handleShowAdd.bind(this)
    handleCloseAdd = this.handleCloseAdd.bind(this)

    render() {
        return (
            <div>
                <h3>Users</h3>
                <Modal show={this.state.showAdd} onHide={this.handleCloseAdd} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Add new user</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div class="mb-3">
                            <label class="form-label">Username or external ID:</label>
                            <div class="input-group">
                                <input type="text" placeholder="Username" onChange={this.onChangeFirstname} class="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
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
                                <textarea placeholder="User notes available to system administrators and 
moderators" type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"></textarea>
                            </div>
                            <div class="form-text" id="basic-addon4">The user does not see this text. <a href="https://www.markdownguide.org/cheat-sheet/" target="blank">Markdown</a> syntax is supported.</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email:</label>
                            <div class="input-group">
                                <input placeholder="example@gmail.com" type="email" class="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn-dark" onClick={this.rewardToken}>
                        Create
                    </button>
                    <button className="btn btn-light" onClick={this.handleCloseAdd}>
                        Cancel
                    </button>
                    </Modal.Footer>
                </Modal>
                <div>
                    <div className="input-group mb-3">
                        <input onChange={this.onChangeFirstname} value={this.state.add_firstname} type="text" className="form-control" placeholder="Firstname" aria-describedby="basic-addon1"/>
                        <input onChange={this.onChangeLastname} value={this.state.add_lastname} type="text" className="form-control" placeholder="Lastname" aria-describedby="basic-addon1"/>
                        <input onChange={this.onChangePatronymic} value={this.state.add_patronymic} type="text" className="form-control" placeholder="Pantronimyc" aria-describedby="basic-addon1"/>
                        <input onChange={this.onChangeEmail} value={this.state.add_email} type="email" className="form-control" placeholder="Email" aria-describedby="basic-addon1"/>
                        <input onChange={this.onChangeWallet} value={this.state.add_wallet} type="text" className="form-control" placeholder="Wallet" aria-describedby="basic-addon1"/>
                    </div>
                    <button onClick={this.handleShowAdd} type="button" className="btn btn-dark">Add new user</button>
                </div>
                <div>
                    <ul className="list-group list-group-flush">
                        <ul className="list-group list-group-horizontal">
                            <li className="list-group-item">
                                ID
                            </li>
                            <li className="list-group-item">
                                Firstname
                            </li>
                            <li className="list-group-item">
                                Email
                            </li>
                            <li className="list-group-item">
                                Wallet
                            </li>
                        </ul>
                        {
                            this.state.users.map(v => {
                                return <ul className="list-group list-group-horizontal">
                                    <li className="list-group-item">
                                        {createLongStrView(v.id)}
                                    </li>
                                    <li className="list-group-item">
                                        {v.firstname}
                                    </li>
                                    <li className="list-group-item">
                                        {v.email}
                                    </li>
                                    <li className="list-group-item">
                                        {v.wallet}
                                    </li>
                                    <li>
                                        <button type="button" className="btn btn-dark">Edit</button>
                                        <button onClick={async () => await this.deleteUser(v.id)} type="button" className="btn btn-danger">Delete</button>
                                    </li>
                                </ul>
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

export default Users