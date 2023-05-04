import { Component } from "react";
import { config } from "../utils/config";
import { getBearerHeader } from "../utils/getBearerHeader";

class Settings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: props.name,
            email: props.email,
            phone: props.phone,
            wallet: props.wallet,
            password: ''
        }
    }

    onChangeName(event) {
        this.setState({
            name: event.target.value
        })
    }

    onChangeEmail(event) {
        this.setState({
            email: event.target.value
        })
    }
    
    onChangePhone(event) {
        this.setState({
            phone: event.target.value
        })
    }
    
    onChangeWallet(event) {
        this.setState({
            wallet: event.target.value
        })
    }
    
    onChangePassword(event) {
        this.setState({
            password: event.target.value
        })
    }

    async changeName() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())

            const raw = JSON.stringify({
                "newName": this.state.name
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow',
                referrerPolicy: "unsafe_url"
              };
            const res = await fetch(`${config.api}/company/changename`, requestOptions)
            const json = await res.json()
            alert(json.message)
        } catch (error) {
            alert(error)
        }
    }

    async changeEmail() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())

            const raw = JSON.stringify({
                "newEmail": this.state.email
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow',
                referrerPolicy: "unsafe_url"
              };
            const res = await fetch(`${config.api}/company/changeemail`, requestOptions)
            const json = await res.json()
            alert(json.message)
        } catch (error) {
            alert(error)
        }
    }

    async changePhone() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())

            const raw = JSON.stringify({
                "newPhone": this.state.phone
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow',
                referrerPolicy: "unsafe_url"
              };
            const res = await fetch(`${config.api}/company/changephone`, requestOptions)
            const json = await res.json()
            alert(json.message)
        } catch (error) {
            alert(error)
        }
    }

    async changeWallet() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())

            const raw = JSON.stringify({
                "newWallet": this.state.wallet
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow',
                referrerPolicy: "unsafe_url"
              };
            const res = await fetch(`${config.api}/company/changewallet`, requestOptions)
            const json = await res.json()
            alert(json.message)
        } catch (error) {
            alert(error)
        }
    }

    async changePassword() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())

            const raw = JSON.stringify({
                "newPassword": this.state.password
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow',
                referrerPolicy: "unsafe_url"
              };
            const res = await fetch(`${config.api}/company/changepassword`, requestOptions)
            const json = await res.json()
            alert(json.message)
        } catch (error) {
            alert(error)
        }
    }

    onChangeName = this.onChangeName.bind(this)
    onChangeEmail = this.onChangeEmail.bind(this)
    onChangePhone = this.onChangePhone.bind(this)
    onChangeWallet = this.onChangeWallet.bind(this)
    onChangePassword = this.onChangePassword.bind(this)
    changeName = this.changeName.bind(this)
    changeEmail = this.changeEmail.bind(this)
    changePhone = this.changePhone.bind(this)
    changeWallet = this.changeWallet.bind(this)
    changePassword = this.changePassword.bind(this)

    render() {
        return (
            <div>
                <h3>Settings</h3>
                <div>
                    Information
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item"> 
                            <div>
                                Company name
                            </div>
                            <div className="input-group mb-3">
                                <input onChange={this.onChangeName} type="text" className="form-control" placeholder={this.props.auth.name} aria-describedby="basic-addon1"/>
                            </div>
                            <div>
                                <button onClick={this.changeName} type="button" className="btn btn-dark">Change</button>
                            </div>
                        </li>
                        <li className="list-group-item"> 
                            <div>
                                Email
                            </div>
                            <div className="input-group mb-3">
                                <input onChange={this.onChangeEmail} type="email" className="form-control" placeholder={this.props.auth.email} aria-label="Email" aria-describedby="basic-addon1"/>
                            </div>
                            <div>
                                <button onClick={this.changeEmail} type="button" className="btn btn-dark">Change</button>
                            </div>
                        </li>
                        <li className="list-group-item"> 
                            <div>
                                Phone
                            </div>
                            <div className="input-group mb-3">
                                <input onChange={this.onChangePhone} type="text" className="form-control" placeholder={this.props.auth.phone} aria-describedby="basic-addon1"/>
                            </div>
                            <div>
                                <button onClick={this.changePhone} type="button" className="btn btn-dark">Change</button>
                            </div>
                        </li>
                        <li className="list-group-item"> 
                            <div>
                                Wallet
                            </div>
                            <div className="input-group mb-3">
                                <input onChange={this.onChangeWallet} type="text" className="form-control" placeholder={this.props.auth.wallet} aria-describedby="basic-addon1"/>
                            </div>
                            <div>
                                <button onClick={this.changeWallet} type="button" className="btn btn-dark">Change</button>
                            </div>
                        </li>
                        <li className="list-group-item"> 
                            <div>
                                Password
                            </div>
                            <div className="input-group mb-3">
                                <input onChange={this.onChangePassword} type="password" className="form-control" aria-describedby="basic-addon1"/>
                            </div>
                            <div>
                                <button onClick={this.changePassword} type="button" className="btn btn-dark">Change</button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Settings