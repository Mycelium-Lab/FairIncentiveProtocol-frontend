import { Component } from "react";
import { Button, Container, Form, FormGroup } from "react-bootstrap";
import Select from "react-select";

import DefaultAuth from "../../layouts/defaultAuth";
import { config } from "../../utils/config"
import email from "../../media/common/email.svg";
import companyBadge from "../../media/common/company-bag.svg";
import representative from "../../media/common/representative.svg";
import ErrorModal from "../common/modals/error";
import errors from "../../errors";
import passwordHide from "../../media/common/password_hide.svg";
import passwordShow from "../../media/common/password_show.svg";
import { countries } from "../../utils/countries";
import manPhone from "../../media/auth/man-phone.svg";

const steps = {
    step1: "1",
    step2: "2"
}

class SignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            companyName: '',
            email: '',
            password: '',
            repeat_password: '',
            phone: '',
            country: '',
            repname: '',
            current_step: steps.step1,
            isInvalidEmail: false,
            isInvalidPassword: false,
            isInvalidRepeatPassword: false,
            showPassword: false,
            showRepeatPassword: false,
            showError: false,
            errorName: null
        }
    }

    async createAccount(ev) {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            const raw = JSON.stringify({
                "name": this.state.companyName,
                "email": this.state.email,
                "country": this.state.country.value,
                "password": this.state.password,
                "repeat_password": this.state.repeat_password,
                "repname": this.state.repname,
                "phone": this.state.phone
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
              
            const res = await fetch(`${config.api}/auth/signup`, requestOptions)
            const json = await res.json()
            if (res.status === 200) {
                // this.setState({
                //     companyName: '',
                //     email: '',
                //     password: '',
                //     repeat_password: '',
                //     wallet: ''
                // })
                //console.log(json)
                // alert(`${json.message}. Now you can signin.`)
                this.handleSwitch(ev, this.props.switcher)
            } else {
                const errroMessage = json.error.message
                const parsedMessage = errors[errroMessage] ? errors[errroMessage] : errroMessage
                this.setState({
                    showError: true,
                    errorName: parsedMessage
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    goToStep1() {
        this.setState({
            current_step: steps.step1
        })
    }

    goToStep2() {
        this.setState({
            current_step: steps.step2
        })
    }
    
    onChangeCompanyName(event) {
        this.setState({
            companyName: event.target.value
        })
    }

    onChangeCountry(event) {
        this.setState({
            country: event.target.value
        })
    }

    onChangeRepname(event) {
        this.setState({
            repname: event.target.value
        })
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

    onChangeRepeatPassword(event) {
        if(event.target.value.length < 8 && event.target.value.length) {
            this.setState({
               repeat_password: event.target.value,
               isInvalidRepeatPassword: true
            })
        }
        else {
            this.setState({
                repeat_password: event.target.value,
                isInvalidRepeatPassword: false
            })
        }
    }

    onChangePhone(event) {
        this.setState({
            phone: event.target.value
        })
    }

    handleSwitch(event, value) {
        this.props.switch(event, value)
    }
    
    handleCloseError = () => this.setState({showError: false})

    handleSwitch = this.handleSwitch.bind(this)

    onChangeCompanyName = this.onChangeCompanyName.bind(this)
    createAccount = this.createAccount.bind(this)
    onChangeEmail = this.onChangeEmail.bind(this)
    onChangePassword = this.onChangePassword.bind(this)
    onChangeRepeatPassword = this.onChangeRepeatPassword.bind(this)
    onChangePhone = this.onChangePhone.bind(this)
    goToStep1 = this.goToStep1.bind(this)
    goToStep2 = this.goToStep2.bind(this)
    onChangeCountry = this.onChangeCountry.bind(this)
    onChangeRepname = this.onChangeRepname.bind(this)
    handleCloseError = this.handleCloseError.bind(this)

    render() {
        const { switcher, switcherText } = this.props;
        return (
            <>
            <DefaultAuth>

            </DefaultAuth>
                <Container className="auth-warapp">
                <img className="auth-logo w-100" src={require('../../media/auth/logo.png')}/>
                <div className="auth">
                    <div className="auth__form">

                        <div className="auth__man_phone-wrapper">
                            <img class="auth__man_phone" src={manPhone} />
                        </div>
                        <img className="auth-logo__update w-100" src={require('../../media/auth/logo.png')}/>

                        <div className="auth__form-header">
                            <h4 className="auth__form-title">Create an Account</h4>
                            <div className="auth__form-subtitle">Step {this.state.current_step}/2</div>
                        </div>

                        {
                            this.state.current_step === steps.step1
                            ?
                            <>
                            <Form className='auth__form-fields'>
                                <FormGroup>
                                    <div className="form__signin">
                                        <Form.Label className='auth__form-fields-label'>Company name</Form.Label>
                                        <img className="form__signin-icon-company" src={companyBadge}></img>
                                        <Form.Control className='auth__form-fields-input auth__form-fields-input_company' value={this.state.companyName} onChange={this.onChangeCompanyName} type="text" placeholder="Enter your company name" />
                                    </div>
                                </FormGroup>

                                <FormGroup>
                                    <Form.Label className="auth__form-fields-label">Country</Form.Label>
                                    <Select
                                        placeholder={"Choose your country"}
                                        options={countries}
                                        value={this.state.country}
                                        onChange={(country) => this.setState({country})}
                                    >
                                    </Select>
                                    {/* <Form.Control className='auth__form-fields-input'  value={this.state.country} id="companycountry-input-signup" onChange={this.onChangeCountry} placeholder="Choose your country" /> */}
                                </FormGroup>

                                <FormGroup>
                                <div className="form__signin">
                                        <Form.Label className="auth__form-fields-label">Representative's name and surname</Form.Label>
                                        <img className="form__signin-icon-representative" src={representative}></img>
                                        <Form.Control className='auth__form-fields-input'   value={this.state.repname} id="companyrepname-input-signup" onChange={this.onChangeRepname} placeholder="Enter your name and surname"/>
                                </div>
                                </FormGroup>
                            </Form>
                            </>
                            :
                            <div>
                                <Form className='auth__form-fields'>

                                <FormGroup>
                                    <Form.Label className='auth__form-fields-label'>Phone number</Form.Label>
                                    <Form.Control className='auth__form-fields-input' value={this.state.phone} id="companyphone-input-signup" onChange={this.onChangePhone} placeholder="Enter your phone number" />
                                </FormGroup>

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
                                            <Form.Label className='auth__form-fields-label'>Password</Form.Label>
                                            {
                                                !this.state.showPassword
                                                ?
                                                <img className="form__signin-icon-password_error form__signin-icon-password" onClick={() => this.setState({showPassword: !this.state.showPassword})} src={passwordHide}></img>
                                                :
                                                <img className="form__signin-icon-password_error form__signin-icon-password" onClick={() => this.setState({showPassword: !this.state.showPassword})} src={passwordShow}></img>
                                            }
                                            
                                            <Form.Control className='auth__form-fields-input_error auth__form-fields-input' value={this.state.password} id="companypassword-input-signup" onChange={this.onChangePassword} type={this.state.showPassword ? 'text' : 'password'} placeholder='Enter your password' />
                                            <span className="form__prompt_error form__prompt" id="basic-addon4">Wrong password</span>
                                        </> 
                                        : 
                                        <>
                                        <Form.Label className='auth__form-fields-label'>Password</Form.Label>
                                        {
                                             !this.state.showPassword
                                             ?
                                            <img className="form__signin-icon-password" onClick={() => this.setState({showPassword: !this.state.showPassword})} src={passwordHide}></img>
                                            :
                                            <img className="form__signin-icon-password" onClick={() => this.setState({showPassword: !this.state.showPassword})} src={passwordShow}></img>
                                        }
                                        
                                        <Form.Control className='auth__form-fields-input' value={this.state.password} id="companypassword-input-signup" onChange={this.onChangePassword} type={this.state.showPassword ? 'text' : 'password'} placeholder='Enter your password' />
                                        </>
                                    }
                                </FormGroup>

                                <FormGroup className="form__signin">
                                {
                                        this.state.isInvalidRepeatPassword ?
                                        <>
                                            <Form.Label className='auth__form-fields-label'>Repeat password</Form.Label>
                                            {
                                                 !this.state.showRepeatPassword
                                                 ?
                                                 <img className="form__signin-icon-password_error form__signin-icon-password" onClick={() => this.setState({showRepeatPassword: !this.state.showRepeatPassword})} src={passwordHide}></img>
                                                 :
                                                 <img className="form__signin-icon-password_error form__signin-icon-password" onClick={() => this.setState({showRepeatPassword: !this.state.showRepeatPassword})} src={passwordShow}></img>
                                            }
                                      
                                            <Form.Control className='auth__form-fields-input_error auth__form-fields-input' value={this.state.repeat_password} id="companyreppassword-input-signup" onChange={this.onChangeRepeatPassword} type={this.state.showRepeatPassword ? 'text' : 'password'} placeholder='Repeat your password' />
                                            <span className="form__prompt_error form__prompt" id="basic-addon4">Wrong password</span>
                                        </> 
                                        : 
                                        <>
                                        <Form.Label className='auth__form-fields-label'>Repeat password</Form.Label>
                                        {
                                         !this.state.showRepeatPassword
                                         ?  <img className="form__signin-icon-password" onClick={() => this.setState({showRepeatPassword: !this.state.showRepeatPassword})} src={passwordHide}></img>
                                         : 
                                         <img className="form__signin-icon-password" onClick={() => this.setState({showRepeatPassword: !this.state.showRepeatPassword})} src={passwordShow}></img>  
                                        }
                                        <Form.Control className='auth__form-fields-input' value={this.state.repeat_password} id="companyreppassword-input-signup" onChange={this.onChangeRepeatPassword} type={this.state.showRepeatPassword ? 'text' : 'password'} placeholder='Repeat your password' />
                                        </>
                                    }
                                </FormGroup>

                                </Form>
                            </div>
                        }
                        <div className='auth__form-action'>
                            {
                                this.state.current_step === steps.step1
                                ?
                                <div className="auth__form-action-group-btn">
                                    <Button onClick={(ev) => this.handleSwitch(ev, switcher)} className='auth__form-action-btn_back auth__form-action-btn w-50'>Back</Button>
                                    <Button onClick={this.goToStep2} className="auth__form-action-btn w-50">Next</Button>
                                </div>
                                :
                                
                                <div className="auth__form-action-group-btn">
                                    <Button onClick={this.goToStep1} className='auth__form-action-btn_back auth__form-action-btn w-50'>Back</Button>
                                    {
                                     this.state.isInvalidEmail || this.state.isInvalidPassword || this.state.isInvalidRepeatPassword || !this.state.repeat_password || !this.state.email.length || !this.state.password.length ?  <Button disabled onClick={this.createAccount}  className='auth__form-action-btn_disabled auth__form-action-btn w-50'>Sign Up</Button>
                                     : <Button  onClick={this.createAccount}  className='auth__form-action-btn w-50'>Sign Up</Button>
                                    }
                                </div>
                            }
                            <div className="auth__form-action-group">
                                <span className="auth__form-action-group-text">Don't have an account?</span>
                                <Button onClick={(ev) => this.handleSwitch(ev, switcher)} value={switcher} className="auth-switcher">{switcherText}</Button>
                            </div>
                        </div>
                    </div>
                </div>
                </Container>
                <ErrorModal 
                    showError={this.state.showError}
                    handleCloseError={this.handleCloseError}
                    errorName={this.state.errorName}
                />
            </>
        )
    }
}

export default SignUp