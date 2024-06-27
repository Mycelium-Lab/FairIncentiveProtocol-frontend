import { Component } from "react";
import Container from 'react-bootstrap/Container';
import { Button, Form, FormGroup } from "react-bootstrap";
import DefaultAuth from "../../layouts/defaultAuth";
import email from "../../media/common/email.svg";
import { config } from "../../utils/config";


class Forgot extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSend: false,
            email: null
        }
    }

    async onsubmit() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            const raw = JSON.stringify({
                "email": this.state.email
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
            };
              
            const res = await fetch(`${config.api}/pass_reset/forgot`, requestOptions)
            const json = await res.json()
            if (res.status === 200) {
                this.setState({
                    isSend: true
                })
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

    handleSwitch(event, value) {
        this.props.switch(event, value)
    }

    handleSwitch = this.handleSwitch.bind(this)
    onsubmit = this.onsubmit.bind(this)
    onChangeEmail = this.onChangeEmail.bind(this)
    
    render() {
        const { switcher } = this.props;
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
                    {
                        !this.state.isSend ?
                        <>
                        <div className="auth__form-header">
                       <h4 className="auth__form-title">Forgot password ?</h4>
                       <span className="auth__form-subtitle_forgot auth__form-subtitle">Don’t worry! it happens. Please enter the address
                    associated with your account.</span>
                   </div>
                  
                   <Form className='auth__form-fields'>
                       <FormGroup className="form__signin">
                           <Form.Label className='auth__form-fields-label'>Email</Form.Label>
                           <img className="form__signin-icon-email" src={email}></img>
                           <Form.Control className='auth__form-fields-input' onChange={this.onChangeEmail} type="email" placeholder="Email" />
                       </FormGroup>
                   </Form>

            
                   <div className='auth__form-action'>
                   <Button  onClick={(ev) => this.handleSwitch(ev, switcher)} className='auth__form-action-btn_back auth__form-action-btn w-100'>Back</Button>
                       <Button  onClick={this.onsubmit} className='auth__form-action-btn w-100'>Submit</Button>
                   </div>
                   </>
                   :  <>
                    <div className="auth__form-header">
                        <h4 className="auth__form-title_sent auth__form-title">Password reset message sent</h4>
                        <span className="auth__form-subtitle_forgot auth__form-subtitle mb-4">The message has been sent to your address <b>j***@gmail.com</b>. Follow the instructions in the message to reset your password.</span>
                        <span className="auth__form-subtitle_forgot auth__form-subtitle mb-4">If you didn't receive the email, please check your spam folder or <a onClick={(e) => this.setState({isSend: false})} className="auth__form-subtitle_forgot_warning">try again</a>.</span>
                    <span className="auth__form-subtitle_forgot auth__form-subtitle">Something does not work? Contact <a className="auth__form-subtitle_forgot_warning">Support</a>.</span>
                    </div>
                    </>
                    }
               </div>
           </div>
           </Container>
           <img className="auth-decore_left-people" src={require('../../media/auth/man.png')}/>
           <img className="auth-decore_right-people" src={require('../../media/auth/woman.png')}/></>
        )
    }
}

export default Forgot