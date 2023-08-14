import { Component } from "react";
import { config } from "../utils/config"

const steps = {
    step1: "1",
    step2: "2"
}

class SignUp extends Component {
    constructor() {
        super()
        this.state = {
            companyName: '',
            email: '',
            password: '',
            repeat_password: '',
            phone: '',
            country: '',
            repname: '',
            current_step: steps.step1
        }
    }

    async createAccount() {
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
                console.log(json)
                // alert(`${json.message}. Now you can signin.`)
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

    onChangePhone(event) {
        this.setState({
            phone: event.target.value
        })
    }

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
        return (
            <div>
                <div>
                    <h4>Create an Account</h4>
                    <div>Step {this.state.current_step}/2</div>
                    {
                        this.state.current_step === steps.step1
                        ?
                        <div>
                            <div>
                                <div>Company name</div>
                                <div>
                                    <input value={this.state.companyName} id="companyname-input-signup" onChange={this.onChangeCompanyName} type='text' placeholder='Enter your company name' className='input-line full-width'></input>
                                </div>
                                <div>Country</div>
                                <div>
                                    <input value={this.state.country} id="companycountry-input-signup" onChange={this.onChangeCountry} placeholder="Choose your country"></input>
                                </div>
                                <div>Representative's name and surname</div>
                                <div>
                                    <input value={this.state.repname} id="companyrepname-input-signup" onChange={this.onChangeRepname} placeholder="Enter your name and surname"></input>
                                </div>
                            </div>
                        </div>
                        :
                        <div>
                            <div>
                                <div>Phone number</div>
                                <div>
                                    <input value={this.state.phone} id="companyphone-input-signup" onChange={this.onChangePhone} placeholder="Enter your phone number"></input>
                                </div>
                                <div>Email</div>
                                <div>
                                    <input value={this.state.email} id="companyemail-input-signup" onChange={this.onChangeEmail} type='email' placeholder='Email' className='input-line full-width'></input>
                                </div>
                                <div>Password</div>
                                <div>
                                    <input value={this.state.password} id="companypassword-input-signup" onChange={this.onChangePassword} type='password' placeholder='Enter your password' className='input-line full-width'></input>
                                </div>
                                <div>Repeat password</div>
                                <div>
                                    <input value={this.state.repeat_password} id="companyreppassword-input-signup" onChange={this.onChangeRepeatPassword} type='password' placeholder='Repeat your password' className='input-line full-width'></input>
                                </div>
                            </div>
                        </div>
                    }
                    <div>
                        {
                            this.state.current_step === steps.step1
                            ?
                            <button onClick={this.goToStep2} className='ghost-round full-width'>Next</button>
                            :
                            <>
                            <button onClick={this.goToStep1} className='ghost-round full-width'>Back</button>
                            <button onClick={this.createAccount} className='ghost-round full-width'>Sign Up</button>
                            </>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp