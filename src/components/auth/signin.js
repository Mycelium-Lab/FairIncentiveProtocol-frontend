import { Component } from "react";
import { config } from "../../utils/config"
import Container from 'react-bootstrap/Container';
import { Button, Form, FormGroup } from "react-bootstrap";
import DefaultAuth from "../../layouts/defaultAuth";
import email from "../../media/common/email.svg";
import passwordHide from "../../media/common/password_hide.svg";

class SignIn extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            password: '',
            isInvalidEmail: false,
            isInvalidPassword: false,
            showPassword: false
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
        const validateEmail = (email) => {
            if(!email) {
                return true
            }
            return email.match(
              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
          };
        
        if(validateEmail(event.target.value)) {
            this.setState({
                email: event.target.value,
                isInvalidEmail: false
            })
        }
        else{
            this.setState({
                isInvalidEmail: true
            })
        }
    }

    onChangePassword(event) {
        if(event.target.value.length < 8 && event.target.value.length) {
            this.setState({
                password: event.target.value,
                isInvalidPassword: true
            })
        }
        else {
            this.setState({
                password: event.target.value,
                isInvalidPassword: false
            })
        }
    }

    handleSwitch(event, value) {
        this.props.switch(event, value)
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
                       <FormGroup className="form__signin">
                          
                           {
                            this.state.isInvalidEmail ? 
                            <>
                                 <Form.Label className='auth__form-fields-label'>Email</Form.Label>
                                    <img className="form__signin-icon-email_error form__signin-icon-email" src={email}></img>
                                <Form.Control className='auth__form-fields-input_error auth__form-fields-input' onChange={this.onChangeEmail} type="email" placeholder="Email" />
                                <span className="form__prompt_error form__prompt" id="basic-addon4">Invalid email format. Example: example@gmail.com</span>
                            </>
                            : 
                            <>
                                <Form.Label className='auth__form-fields-label'>Email</Form.Label>
                                    <img className="form__signin-icon-email" src={email}></img>
                                    <Form.Control className='auth__form-fields-input' onChange={this.onChangeEmail} type="email" placeholder="Email" />
                            </> 
                           }
                       </FormGroup>

                       <FormGroup className="form__signin">
                        {
                            this.state.isInvalidPassword ? 
                            <>
                                <Form.Label className="auth__form-fields-label">Password</Form.Label>
                                <img className="form__signin-icon-password_error form__signin-icon-password" onClick={() => this.setState({showPassword: !this.state.showPassword})} src={passwordHide}></img>
                                <Form.Control className='auth__form-fields-input_error auth__form-fields-input' onChange={this.onChangePassword} type={this.state.showPassword ? 'text' : 'password'} placeholder='Password' />
                                <span className="form__prompt_error form__prompt" id="basic-addon4">Wrong password</span>
                            </>
                            : 
                            <>
                                <Form.Label className="auth__form-fields-label">Password</Form.Label>
                                <img className="form__signin-icon-password" onClick={() => this.setState({showPassword: !this.state.showPassword})} src={passwordHide}></img>
                                <Form.Control className='auth__form-fields-input' onChange={this.onChangePassword} type={this.state.showPassword ? 'text' : 'password'} placeholder='Password' />
                            </>
                        }
                          
                       </FormGroup>
                   </Form>

                   <a className="auth__form-forgotpassword" onClick={(ev) => this.handleSwitch(ev, switcher.forgot)} value={switcher.forgot}>Forgot Password ?</a>

                   <div className='auth__form-action'>
                    {
                        this.state.isInvalidEmail || this.state.isInvalidPassword  || !this.state.email.length || !this.state.password.length ? <Button disabled onClick={this.signin} className='auth__form-action-btn_disabled auth__form-action-btn w-100'>Sign In</Button>
                        : <Button onClick={this.signin} className='auth__form-action-btn auth__form-action-btn w-100'>Sign In</Button>

                    }
                       
                       <div className="auth__form-action-group">
                           <span className="auth__form-action-group-text">Don't have an account ?</span>
                           <Button onClick={(ev) => this.handleSwitch(ev, switcher.signup)} value={switcher.signup} className="auth-switcher">{switcherText}</Button>
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