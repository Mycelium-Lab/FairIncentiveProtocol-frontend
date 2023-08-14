import { Component } from "react";
import { config } from "../utils/config"

class SignIn extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            password: ''
        }
    }

    async signin() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            const raw = JSON.stringify({
                "email": this.state.email,
                "password": this.state.password
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
            };
              
            const res = await fetch(`${config.api}/auth/signin`, requestOptions)
            const json = await res.json()
            if (res.status === 200) {
                document.cookie = `token=${json.body.data.token}`
                window.location.reload()
            } else {
                alert(json.error.message)
            }
        } catch (error) {
            console.log(error)
        }
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


    signin = this.signin.bind(this)
    onChangeEmail = this.onChangeEmail.bind(this)
    onChangePassword = this.onChangePassword.bind(this)

    render() {
        return (
            <div>
                <div>
                    <h4>Sign In</h4>
                    <div>
                        <div>Please login to your account</div>
                        <div className='input-fields'>
                            <div>Email</div>
                            <div>
                                <input onChange={this.onChangeEmail} type='email' placeholder='Email' className='input-line full-width'></input>
                            </div>
                            <div>Password</div>
                            <div>
                                <input onChange={this.onChangePassword} type='password' placeholder='Password' className='input-line full-width'></input>
                            </div>
                        </div>
                        <div><button onClick={this.signin} className='ghost-round full-width'>SignIn</button></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignIn