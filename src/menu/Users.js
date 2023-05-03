import { Component } from "react";
import { getBearerHeader } from "../utils/getBearerHeader";
import { config } from "../utils/config";

class Users extends Component {

    constructor(props) {
        super(props)
        this.state = {
            add_firstname: null,
            add_lastname: null,
            add_patronymic: null,
            add_email: null,
            add_wallet: null
        }
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
            alert(json.message)
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

    render() {
        return (
            <div>
                <h3>Users</h3>
                <div>
                    <div class="input-group mb-3">
                        <input onChange={this.onChangeFirstname} type="text" class="form-control" placeholder="Firstname" aria-describedby="basic-addon1"/>
                        <input onChange={this.onChangeLastname} type="text" class="form-control" placeholder="Lastname (optional)" aria-describedby="basic-addon1"/>
                        <input onChange={this.onChangePatronymic} type="text" class="form-control" placeholder="Pantronimyc (optional)" aria-describedby="basic-addon1"/>
                        <input onChange={this.onChangeEmail} type="email" class="form-control" placeholder="Email" aria-describedby="basic-addon1"/>
                        <input onChange={this.onChangeWallet} type="text" class="form-control" placeholder="Wallet" aria-describedby="basic-addon1"/>
                    </div>
                    <button onClick={this.addUser} type="button" class="btn btn-success">Add</button>
                </div>
            </div>
        )
    }
}

export default Users