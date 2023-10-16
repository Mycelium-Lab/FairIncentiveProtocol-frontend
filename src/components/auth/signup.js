import { Component } from "react";
import { Button, Container, Form, FormGroup } from "react-bootstrap";
import DefaultAuth from "../../layouts/defaultAuth";
import { config } from "../../utils/config"
import email from "../../media/common/email.svg";
import passwordHide from "../../media/common/password_hide.svg";
import iata from '../../data/iata.json'

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
            isInvalidRepeatPassword: false
        }
    }

    async createAccount(ev) {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            const raw = JSON.stringify({
                "name": this.state.companyName,
                "email": this.state.email,
                "country": this.state.country,
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
                alert(json.error.message)
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
                                    <Form.Label className='auth__form-fields-label'>Company name</Form.Label>
                                    <Form.Control className='auth__form-fields-input' value={this.state.companyName} onChange={this.onChangeCompanyName} type="text" placeholder="Enter your company name" />
                                </FormGroup>

                                <FormGroup>
                                    <Form.Label className="auth__form-fields-label">Country</Form.Label>
                                    <select className='auth__form-fields-input form-control' value={this.state.country} id="companycountry-input-signup" onChange={this.onChangeCountry}>
                                    {
                                        iata.map(v => {
                                            return <option value={v.value} selected>{v.value}</option>
                                        })
                                    }
                                    </select>
                                </FormGroup>

                                <FormGroup>
                                    <Form.Label className="auth__form-fields-label">Representative's name and surname</Form.Label>
                                    <Form.Control className='auth__form-fields-input'   value={this.state.repname} id="companyrepname-input-signup" onChange={this.onChangeRepname} placeholder="Enter your name and surname"/>
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
                                            <img className="form__signin-icon-password_error form__signin-icon-password" src={passwordHide}></img>
                                            <Form.Control className='auth__form-fields-input_error auth__form-fields-input' value={this.state.password} id="companypassword-input-signup" onChange={this.onChangePassword} type='password' placeholder='Enter your password' />
                                            <span className="form__prompt_error form__prompt" id="basic-addon4">Wrong password</span>
                                        </> 
                                        : 
                                        <>
                                        <Form.Label className='auth__form-fields-label'>Password</Form.Label>
                                        <img className="form__signin-icon-password" src={passwordHide}></img>
                                        <Form.Control className='auth__form-fields-input' value={this.state.password} id="companypassword-input-signup" onChange={this.onChangePassword} type='password' placeholder='Enter your password' />
                                        </>
                                    }
                                </FormGroup>

                                <FormGroup className="form__signin">
                                {
                                        this.state.isInvalidRepeatPassword ?
                                        <>
                                            <Form.Label className='auth__form-fields-label'>Repeat password</Form.Label>
                                            <img className="form__signin-icon-password_error form__signin-icon-password" src={passwordHide}></img>
                                            <Form.Control className='auth__form-fields-input_error auth__form-fields-input' value={this.state.repeat_password} id="companyreppassword-input-signup" onChange={this.onChangeRepeatPassword} type='password' placeholder='Repeat your password' />
                                            <span className="form__prompt_error form__prompt" id="basic-addon4">Wrong password</span>
                                        </> 
                                        : 
                                        <>
                                        <Form.Label className='auth__form-fields-label'>Password</Form.Label>
                                        <img className="form__signin-icon-password" src={passwordHide}></img>
                                        <Form.Control className='auth__form-fields-input' value={this.state.repeat_password} id="companyreppassword-input-signup" onChange={this.onChangeRepeatPassword} type='password' placeholder='Repeat your password' />
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
            </>
        )
    }
}

export default SignUp