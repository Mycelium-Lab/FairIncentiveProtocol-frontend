import { Component } from "react";
import { getBearerHeaderReset } from "../../utils/getBearerHeader";
import { config } from "../../utils/config";
import { Button, Container, Form, FormGroup } from "react-bootstrap";
import passwordHide from "../../media/common/password_hide.svg";
import passwordShow from "../../media/common/password_show.svg";
import DefaultAuth from "../../layouts/defaultAuth";
import SuccessModal from "../common/modals/success";
import ErrorModal from "../common/modals/error";

class PassReset extends Component {

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            repeat_password: '',
            showPassword: false,
            isInvalidPassword: false,
            showSuccess: false,
            successTitle: '',
            successName: '',
            successText: '',
            showError: false,
            errorName: '',
            errorText: '',
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
                this.handleShowError('Password cannot be empty')
                return
            }
            if(!repeat_password) {
                this.handleShowError('Repeat password cannot be empty')
                return
            }
            if(password !== repeat_password) {
                this.handleShowError('Passwords do not match')
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
                this.handleShowSuccess('Successfull changing', 'You have successfully changed your password', 'Now you will be redirected to the signin page')
                
                // this.handleShowSuccess(json.body.message, json.body.message)
            } else {
                this.handleShowError(json.error.message)
            }}
        } catch (error) {
            console.log(error)
        }
    }

    handleShowSuccess = (successTitle, successName, successText) => {
        this.setState({showSuccess: true, successTitle, successName, successText})
        window.location.href = '/'
    }
    handleCloseSuccess = () => this.setState({showSuccess: false, successName: null, successText: null})
    handleShowError = (errorText) => this.setState({showError: true, errorText})
    handleCloseError = () => this.setState({showError: false})

    onChangePassword = this.onChangePassword.bind(this)
    onChangeRepeatPassword = this.onChangeRepeatPassword.bind(this)
    submit = this.submit.bind(this)
    handleShowSuccess = this.handleShowSuccess.bind(this)
    handleCloseSuccess = this.handleCloseSuccess.bind(this)
    handleShowError = this.handleShowError.bind(this)
    handleCloseError = this.handleCloseError.bind(this)

    render() {
        return (
            <>
            <DefaultAuth>
               
            </DefaultAuth>
           <Container className="auth-warapp">
           <img className="auth-logo w-100" src={require('../../media/auth/logo.png')}/>
           <div className="auth">
                <div className="auth__form">
                   <div className="auth__form-header">
                       <h5 className="auth__form-title">Create a new password</h5>
                   </div>
                  
                   <Form className='auth__form-fields'>
                        <FormGroup className="form__signin">
                            {
                                this.state.isInvalidPassword ? 
                                <>
                                    <Form.Label className="auth__form-fields-label">New password</Form.Label>
                                    {
                                        !this.state.showPassword 
                                        ? 
                                        <img className="form__signin-icon-password_error form__signin-icon-password" onClick={() => this.setState({showPassword: !this.state.showPassword})} src={passwordHide}></img>
                                        : 
                                        <img className="form__signin-icon-password_error form__signin-icon-password" onClick={() => this.setState({showPassword: !this.state.showPassword})} src={passwordShow}></img>
                                    }
                                
                                    <Form.Control className='auth__form-fields-input_error auth__form-fields-input' onChange={this.onChangePassword} type={this.state.showPassword ? 'text' : 'password'} placeholder='Password' />
                                    <span className="form__prompt_error form__prompt" id="basic-addon4">Wrong password</span>
                                </>
                                : 
                                <>
                                    <Form.Label className="auth__form-fields-label">New password</Form.Label>
                                    {
                                        !this.state.showPassword 
                                        ?
                                        <img className="form__signin-icon-password" onClick={() => this.setState({showPassword: !this.state.showPassword})} src={passwordHide}></img>
                                        :
                                        <img className="form__signin-icon-password" onClick={() => this.setState({showPassword: !this.state.showPassword})} src={passwordShow}></img>
                                    }
                                    <Form.Control className='auth__form-fields-input' onChange={this.onChangePassword} type={this.state.showPassword ? 'text' : 'password'} placeholder='Password' />
                                </>
                            }
                       </FormGroup>

                       <FormGroup className="form__signin">
                        {
                            this.state.isInvalidPassword ? 
                            <>
                                <Form.Label className="auth__form-fields-label">Confirm password</Form.Label>
                                {
                                      !this.state.showPassword 
                                      ? 
                                      <img className="form__signin-icon-password_error form__signin-icon-password" onClick={() => this.setState({showPassword: !this.state.showPassword})} src={passwordHide}></img>
                                      : 
                                      <img className="form__signin-icon-password_error form__signin-icon-password" onClick={() => this.setState({showPassword: !this.state.showPassword})} src={passwordShow}></img>
                                }
                               
                                <Form.Control className='auth__form-fields-input_error auth__form-fields-input' onChange={this.onChangeRepeatPassword} type={this.state.showPassword ? 'text' : 'password'} placeholder='Confirm password' />
                                <span className="form__prompt_error form__prompt" id="basic-addon4">Wrong password</span>
                            </>
                            : 
                            <>
                                <Form.Label className="auth__form-fields-label">Confirm password</Form.Label>
                                {
                                    !this.state.showPassword 
                                    ?
                                    <img className="form__signin-icon-password" onClick={() => this.setState({showPassword: !this.state.showPassword})} src={passwordHide}></img>
                                    :
                                    <img className="form__signin-icon-password" onClick={() => this.setState({showPassword: !this.state.showPassword})} src={passwordShow}></img>
                                }
                                <Form.Control className='auth__form-fields-input' onChange={this.onChangeRepeatPassword} type={this.state.showPassword ? 'text' : 'password'} placeholder='Confirm password' />
                            </>
                        }
                          
                       </FormGroup>
                   </Form>


                   <div className='auth__form-action'>
                    {
                        this.state.isInvalidPassword  || !this.state.password.length ? <Button disabled onClick={this.submit} className='auth__form-action-btn_disabled auth__form-action-btn w-100'>Submit</Button>
                        : <Button onClick={this.submit} className='auth__form-action-btn auth__form-action-btn w-100'>Submit</Button>

                    }
                       
                   </div>
               </div>
           </div>
           </Container>
           <img className="auth-decore_left-people" src={require('../../media/auth/man.png')}/>
           <img className="auth-decore_right-people" src={require('../../media/auth/woman.png')}/>
           <SuccessModal 
                    showSuccess={this.state.showSuccess} 
                    handleCloseSuccess={this.handleCloseSuccess}
                    successTitle={this.state.successTitle}
                    successName={this.state.successName} 
                    successText={this.state.successText}
            />
            <ErrorModal
                showError={this.state.showError}
                handleCloseError={this.handleCloseError}
                errorName={this.state.errorName}
                errorText={this.state.errorText}
            />
           </>
        )
    }
}

export default PassReset