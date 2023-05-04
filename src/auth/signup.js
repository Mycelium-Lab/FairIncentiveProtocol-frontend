import { Component } from "react";
import { config } from "../utils/config"

class SignUp extends Component {
    constructor() {
        super()
        this.state = {
            companyName: '',
            email: '',
            password: '',
            repeat_password: '',
            wallet: '' //0x0000000000000000000000000000000000000000
        }
    }

    async createAccount() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            const raw = JSON.stringify({
                "name": this.state.companyName,
                "email": this.state.email,
                "password": this.state.password,
                "repeat_password": this.state.repeat_password,
                "wallet": this.state.wallet
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow',
                mode: 'no-cors'
              };
              
            const res = await fetch(`${config.api}/auth/signup`, requestOptions)
            const json = await res.json()
            if (res.status === 200) {
                this.setState({
                    companyName: '',
                    email: '',
                    password: '',
                    repeat_password: '',
                    wallet: ''
                })
                alert(`${json.message}. Now you can signin.`)
            } else {
                alert(json.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    onChangeCompanyName(event) {
        this.setState({
            companyName: event.target.value
        })
    }

    onChangeEmail(event) {
        this.setState({
            email: event.target.value
        })
    }

    onChangePassword(event) {
        this.setState({
            password: event.target.value
        })
    }

    onChangeRepeatPassword(event) {
        this.setState({
            repeat_password: event.target.value
        })
    }

    onChangeWallet(event) {
        this.setState({
            wallet: event.target.value
        })
    }

    onChangeCompanyName = this.onChangeCompanyName.bind(this)
    createAccount = this.createAccount.bind(this)
    onChangeEmail = this.onChangeEmail.bind(this)
    onChangePassword = this.onChangePassword.bind(this)
    onChangeRepeatPassword = this.onChangeRepeatPassword.bind(this)
    onChangeWallet = this.onChangeWallet.bind(this)

    render() {
        return (
            <div className='container'>
                <div className='window'>
                    <div className='overlay'></div>
                    <div className='content'>
                    <div className='welcome'>Hello There!</div>
                    <div className='subtitle'>Before using our services you need to create an account.</div>
                    <div className='input-fields'>
                        <input onChange={this.onChangeCompanyName} type='text' placeholder='Company name' className='input-line full-width'></input>
                        <input onChange={this.onChangeEmail} type='email' placeholder='Email' className='input-line full-width'></input>
                        <input onChange={this.onChangeWallet} type='text' placeholder='Wallet' className='input-line full-width'></input>
                        <input onChange={this.onChangePassword} type='password' placeholder='Password' className='input-line full-width'></input>
                        <input onChange={this.onChangeRepeatPassword} type='password' placeholder='Repeat password' className='input-line full-width'></input>
                    </div>
                    <div><button onClick={this.createAccount} className='ghost-round full-width'>Create Account</button></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp