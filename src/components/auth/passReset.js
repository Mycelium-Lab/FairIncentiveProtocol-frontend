import { Component } from "react";
import { getBearerHeaderReset } from "../../utils/getBearerHeader";
import { config } from "../../utils/config";

class PassReset extends Component {

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            repeat_password: ''
        }
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

    async submit() {
        try {
            const {password, repeat_password} = this.state
            if(!password) { 
                alert('Password cannot be empty')
                return
            }
            if(!repeat_password) {
                alert('Repeat password cannot be empty')
                return
            }
            if(password !== repeat_password) {
                alert('Passwords do not match')
                return
            }
            const bearerHeader = getBearerHeaderReset()
            const headers = new Headers();{
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", bearerHeader)

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
                alert('Successfull changing')
                window.location.href = '/'
                // this.handleShowSuccess(json.body.message, json.body.message)
            } else {
                alert(json.error.message)
            }}
        } catch (error) {
            console.log(error)
        }
    }

    onChangePassword = this.onChangePassword.bind(this)
    onChangeRepeatPassword = this.onChangeRepeatPassword.bind(this)
    submit = this.submit.bind(this)

    render() {
        return (
            <div>
                <h1>Password reset</h1>
                <div>Enter new password</div>
                <input onChange={this.onChangePassword} type="password"/>
                <div>Reenter new password</div>
                <input onChange={this.onChangeRepeatPassword} type="password"/>
                <br/>
                <br/>
                <button onClick={this.submit}>Submit</button>
            </div>
        )
    }
}

export default PassReset