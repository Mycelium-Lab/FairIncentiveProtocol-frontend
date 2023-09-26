import { Component } from "react";
import { config } from "../../utils/config";
import { getBearerHeader } from "../../utils/getBearerHeader";
import ErrorModal from "../common/modals/error";
import SuccessModal from "../common/modals/success";

class Settings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: props.auth.name,
            email: props.auth.email,
            phone: props.auth.phone,
            wallet: props.auth.wallet,
            password: '',
            showSuccess: false,
            showError: false
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
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/company/changename`, requestOptions)
            const json = await res.json()
            if (res.status === 200) {
                console.log(json.body.message)
                this.handleShowSuccess(json.body.message, json.body.message)
            } else {
                this.handleShowError(json.error.message)
            }
        } catch (error) {
            this.handleShowError(error.message)
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
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/company/changeemail`, requestOptions)
            const json = await res.json()
            if (res.status === 200) {
                console.log(json.body.message)
                this.handleShowSuccess(json.body.message, json.body.message)
            } else {
                this.handleShowError(json.error.message)
            }
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
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/company/changephone`, requestOptions)
            const json = await res.json()
            if (res.status === 200) {
                console.log(json.body.message)
                this.handleShowSuccess(json.body.message, json.body.message)
            } else {
                this.handleShowError(json.error.message)
            }
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
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/company/changewallet`, requestOptions)
            const json = await res.json()
            if (res.status === 200) {
                console.log(json.body.message)
                this.handleShowSuccess(json.body.message, json.body.message)
            } else {
                this.handleShowError(json.error.message)
            }
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
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/company/changepassword`, requestOptions)
            const json = await res.json()
            if (res.status === 200) {
                console.log(json.body.message)
                this.handleShowSuccess(json.body.message, json.body.message)
            } else {
                this.handleShowError(json.error.message)
            }
        } catch (error) {
            alert(error)
        }
    }

    handleShowSuccess = (successName, successText) => this.setState({showSuccess: true, successName, successText})
    handleCloseSuccess = () => this.setState({showSuccess: false, successName: null, successText: null})
    handleShowError = (errorText) => this.setState({showError: true, errorText})
    handleCloseError = () => this.setState({showError: false})

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
    handleShowSuccess = this.handleShowSuccess.bind(this)
    handleCloseSuccess = this.handleCloseSuccess.bind(this)
    handleShowError = this.handleShowError.bind(this)
    handleCloseError = this.handleCloseError.bind(this)

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
                                <input onChange={this.onChangeName} type="text" className="form-control" placeholder={this.state.name} aria-describedby="basic-addon1"/>
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
                                <input onChange={this.onChangeEmail} type="email" className="form-control" placeholder={this.state.email} aria-label="Email" aria-describedby="basic-addon1"/>
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
                                <input onChange={this.onChangePhone} type="text" className="form-control" placeholder={this.state.phone} aria-describedby="basic-addon1"/>
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
                                <input onChange={this.onChangeWallet} type="text" className="form-control" placeholder={this.state.wallet} aria-describedby="basic-addon1"/>
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
                <SuccessModal 
                    showSuccess={this.state.showSuccess} 
                    handleCloseSuccess={this.handleCloseSuccess}
                    successName={this.state.successName} 
                    successText={this.state.successText}
                />
                <ErrorModal
                    showError={this.state.showError}
                    handleCloseError={this.handleCloseError}
                    errorText={this.state.errorText}
                />
            </div>
        )
    }
}

export default Settings