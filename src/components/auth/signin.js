import { Component } from "react";
import { config } from "../../utils/config"
import Container from 'react-bootstrap/Container';
import { Button, Form, FormGroup } from "react-bootstrap";
import DefaultAuth from "../../layouts/defaultAuth";

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

    handleSwitch(event) {
        this.props.switch(event)
    }

    handleSwitch = this.handleSwitch.bind(this)
    signin = this.signin.bind(this)
    onChangeEmail = this.onChangeEmail.bind(this)
    onChangePassword = this.onChangePassword.bind(this)

    render() {
        const { switcher, switcherText } = this.props;
        return (
            <>
            <DefaultAuth>
                {
                    /*<img className="auth-decore_left" src={require('../../media/auth/left-wave.png')}/>
                    <img className="auth-decore_right" src={require('../../media/auth/right-wave.png')}/>

                    <img className="auth-decore_left" src={require('../../media/auth/left-wave.png')}/>
                    <img className="auth-decore_right" src={require('../../media/auth/right-wave.png')}/>*/
                    }
            </DefaultAuth>
           <Container className="auth-warapp">
           <img className="auth-logo w-100" src={require('../../media/auth/logo.png')}/>
           <div className="auth">
                <div className="auth__form">
                   <div className="auth__form-header">
                       <h4 className="auth__form-title">Sign In</h4>
                       <span className="auth__form-subtitle">Please login to your account</span>
                   </div>
                  
                   <Form className='auth__form-fields'>
                       <FormGroup>
                           <Form.Label className='auth__form-fields-label'>Email</Form.Label>
                           <Form.Control className='auth__form-fields-input' onChange={this.onChangeEmail} type="email" placeholder="Email" />
                       </FormGroup>

                       <FormGroup>
                           <Form.Label className="auth__form-fields-label">Password</Form.Label>
                           <Form.Control className='auth__form-fields-input' onChange={this.onChangePassword} type='password' placeholder='Password' />
                       </FormGroup>
                   </Form>

                   <a className="auth__form-forgotpassword">Forgot Password?</a>

                   <div className='auth__form-action'>
                       <Button  onClick={this.signin} className='auth__form-action-btn w-100'>Sign In</Button>
                       <div className="auth__form-action-group">
                           <span className="auth__form-action-group-text">Don't have an account?</span>
                           <Button onClick={this.handleSwitch} value={switcher} className="auth-switcher">{switcherText}</Button>
                       </div>
                   </div>
               </div>
           </div>
           </Container>
           <img className="auth-decore_left-people" src={require('../../media/auth/man.png')}/>
           <img className="auth-decore_right-people" src={require('../../media/auth/woman.png')}/></>
        )
    }
}

export default SignIn