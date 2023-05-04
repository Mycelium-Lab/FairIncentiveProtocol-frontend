import { Component } from "react";
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

    onChangeFirstname = this.onChangeFirstname.bind(this)
    onChangeLastname = this.onChangeLastname.bind(this)
    onChangePatronymic = this.onChangePatronymic.bind(this)
    onChangeEmail = this.onChangeEmail.bind(this)
    onChangeWallet = this.onChangeWallet.bind(this)
    addUser = this.addUser.bind(this)
    getUsers = this.getUsers.bind(this)
    deleteUser = this.deleteUser.bind(this)

    render() {
        return (
            <div>
                <h3>Users</h3>
                <div>
                    <div className="input-group mb-3">
                        <input onChange={this.onChangeFirstname} value={this.state.add_firstname} type="text" className="form-control" placeholder="Firstname" aria-describedby="basic-addon1"/>
                        <input onChange={this.onChangeLastname} value={this.state.add_lastname} type="text" className="form-control" placeholder="Lastname" aria-describedby="basic-addon1"/>
                        <input onChange={this.onChangePatronymic} value={this.state.add_patronymic} type="text" className="form-control" placeholder="Pantronimyc" aria-describedby="basic-addon1"/>
                        <input onChange={this.onChangeEmail} value={this.state.add_email} type="email" className="form-control" placeholder="Email" aria-describedby="basic-addon1"/>
                        <input onChange={this.onChangeWallet} value={this.state.add_wallet} type="text" className="form-control" placeholder="Wallet" aria-describedby="basic-addon1"/>
                    </div>
                    <button onClick={this.addUser} type="button" className="btn btn-primary">Add</button>
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