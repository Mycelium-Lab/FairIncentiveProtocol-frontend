import { Component } from "react";
import { config } from "../../utils/config";
import { getBearerHeader } from "../../utils/getBearerHeader";
import ErrorModal from "../common/modals/error";
import UpdateModal from "../common/modals/update";
import { Dropdown, Modal, Tab, Tabs } from "react-bootstrap";
import FileUpload from "../FileUpload";
import drug_drop from '../../media/settings/drug_drop.svg'
import attraction from '../../media/settings/attraction.svg'
import info from '../../media/settings/info_small_gray.svg'
import info_black from '../../media/common/info-small.svg'
import FPTable from "../common/FPTable";
import more from '../../media/common/more.svg'
import creditCard from '../../media/common/credit-card.svg'
import cardholder from '../../media/common/cardholder.svg'
import { billingHistoryTable, paymentMethodsTable, teamTable } from "../../data/tables";
import FPDropdown from "../common/FPDropdown";
import countries from "../../data/countries";

// Mock
let paymentMethods = [
    {
        card: 'Visa ending in 6967', 
        'expire_date': 'Expires 02/2026',
        status: 'Default'
    },
    {
        card: 'Visa ending in 1234', 
        'expire_date': 'Expires 03/2026',
        status: 'Default'
    },
    {
        card: 'Visa ending in 3214', 
        'expire_date': 'Expires 04/2026',
        status: 'Default'
    }
]

class Settings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: props.auth.name,
            email: props.auth.email,
            phone: props.auth.phone,
            wallet: props.auth.wallet,
            repname: props.auth.repname,
            password: '',
            showSuccess: false,
            showError: false,
            showMakePayment: false,
            showInvite: false,
            changeMemberRole: false,
            removeFromTeam: false,
            showAddPaymentMethod: false,
            showDeletePaymentMethods: false,
            chosen_payment_method: null,
            paymentMethods
        }
    }

    onChangeName(event) {
        this.setState({
            name: event.target.value
        })
    }

    onChangeEmail(event) {
        this.setState({
            email: event.target.value
        })
    }
    
    onChangePhone(event) {
        this.setState({
            phone: event.target.value
        })
    }
    
    onChangeWallet(event) {
        this.setState({
            wallet: event.target.value
        })
    }
    
    onChangePassword(event) {
        this.setState({
            password: event.target.value
        })
    }

    onChangeRepname(event) {
        this.setState({
            repname: event.target.value
        })
    }

    async changeProfile () {
        const promisesArray = [this.changeName(), this.changeEmail(), this.changePhone(), this.changeRepname()]
        if(this.state.password) {
            promisesArray.push(this.changePassword())
        }
        await Promise.all(promisesArray)
        this.handleShowSuccess('Update personal information', 'The personal information has been changed')
    }
    async changeName() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())

            const raw = JSON.stringify({
                "newName": this.state.name
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/company/changename`, requestOptions)
            const json = await res.json()
            if (res.status === 200) {
                console.log(json.body.message)
               // this.handleShowSuccess(json.body.message, json.body.message)
            } else {
                this.handleShowError(json.error.message)
            }
        } catch (error) {
            this.handleShowError(error.message)
        }
    }

    async changeEmail() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())

            const raw = JSON.stringify({
                "newEmail": this.state.email
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/company/changeemail`, requestOptions)
            const json = await res.json()
            if (res.status === 200) {
                console.log(json.body.message)
               // this.handleShowSuccess(json.body.message, json.body.message)
            } else {
                this.handleShowError(json.error.message)
            }
        } catch (error) {
            alert(error)
        }
    }

    async changePhone() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())

            const raw = JSON.stringify({
                "newPhone": this.state.phone
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/company/changephone`, requestOptions)
            const json = await res.json()
            if (res.status === 200) {
                console.log(json.body.message)
               // this.handleShowSuccess(json.body.message, json.body.message)
            } else {
                this.handleShowError(json.error.message)
            }
        } catch (error) {
            alert(error)
        }
    }

    async changeWallet() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())

            const raw = JSON.stringify({
                "newWallet": this.state.wallet
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/company/changewallet`, requestOptions)
            const json = await res.json()
            if (res.status === 200) {
                console.log(json.body.message)
                this.handleShowSuccess(json.body.message, json.body.message)
            } else {
                this.handleShowError(json.error.message)
            }
        } catch (error) {
            alert(error)
        }
    }

    async changePassword() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())

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
                console.log(json.body.message)
               // this.handleShowSuccess(json.body.message, json.body.message)
            } else {
                this.handleShowError(json.error.message)
            }
        } catch (error) {
            alert(error)
        }
    }

    async changeRepname() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())

            const raw = JSON.stringify({
                "newRepname": this.state.repname
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/company/changerepname`, requestOptions)
            const json = await res.json()
            if (res.status === 200) {
                console.log(json.body.message)
               // this.handleShowSuccess(json.body.message, json.body.message)
            } else {
                this.handleShowError(json.error.message)
            }
        } catch (error) {
            alert(error)
        }
    }

    deletePaymentMethods(id) {
        const _paymentMethods = this.state.paymentMethods.filter(v => v.card !== id)
        this.setState({
            paymentMethods: _paymentMethods,
            showDeletePaymentMethods: false
        })
    }
    
    handleCopy(event) {
        const tooltip = event.target.parentNode
        const tooltipText = event.target.children[0]
       const copyText = tooltip.previousSibling
       copyText.select();
       const abbreviateAddress = copyText.value.slice(0, 6) + '...' + copyText.value.slice(copyText.value.length - 4, copyText.value.length)
       tooltipText.innerHTML = "Copied: " + abbreviateAddress;
       document.execCommand("copy");
    }


    handleOutTooltip(event) {
       if(!event.target.classList.contains("tooltiptext")) {
            const tooltipText = event.target.children[0]
            tooltipText.innerHTML = "Copy to clipboard";
        }
    }

    handleAddNewPayment() {
        this.setState({showAddPaymentMethod: false})
        this.handleShowSuccess('Update default card', 'The default card has been changed', 'We will automatically charge your default card at the close of the current billing period.')
    }
    handleShowMakePayment() {
        this.setState({showMakePayment: true})
    }
    handleCloseMakePayment() {
        this.setState({showMakePayment: false})
    }
    handleShowDeletePaymentMethods(id) {
        this.setState({showDeletePaymentMethods: true, chosen_payment_method: id})   
    }
    handleCloseDeletePaymentMethods() {
        this.setState({showDeletePaymentMethods: false})   
    }

     handleShowAddPaymentMethod() {
        this.setState({showAddPaymentMethod: true})
    }
    handleCloseAddPaymentMethod() {
        this.setState({showAddPaymentMethod: false})
    }
    handleShowInvite() {
        this.setState({showInvite: true})
    }
    handleCloseInvite() {
        this.setState({showInvite: false})
    }

    handleInvite() {
        this.setState({showInvite: false})
        this.handleShowSuccess('Invitation', 'Invitations have been send out')
    }

    handleCloseChangeMemeberRole() {
        this.setState({changeMemberRole: false})
    }
    handleShowChangeMemeberRole() {
        this.setState({changeMemberRole: true})
    }
    
    handleShowRemoveFromTeam() {
        this.setState({removeFromTeam: true})
    }
    handleCloseRemoveFromTeam() {
        this.setState({removeFromTeam: false})
    }

    handleShowSuccess = (successTitle, successName, successText) => this.setState({showSuccess: true, successTitle, successName, successText})
    handleCloseSuccess = () => this.setState({showSuccess: false, successTitle: null, successName: null, successText: null})
    handleShowError = (errorText) => this.setState({showError: true, errorText})
    handleCloseError = () => this.setState({showError: false})

    deletePaymentMethods = this.deletePaymentMethods.bind(this)
    handleInvite = this.handleInvite.bind(this)

    handleCopy = this.handleCopy.bind(this)
    handleOutTooltip = this.handleOutTooltip.bind(this)
    handleAddNewPayment  = this.handleAddNewPayment.bind(this)
    handleShowAddPaymentMethod = this.handleShowAddPaymentMethod.bind(this)
    handleCloseAddPaymentMethod = this.handleCloseAddPaymentMethod.bind(this)
    handleCloseRemoveFromTeam = this.handleCloseRemoveFromTeam.bind(this)
    handleShowRemoveFromTeam = this.handleShowRemoveFromTeam.bind(this)
    handleCloseChangeMemeberRole = this.handleCloseChangeMemeberRole.bind(this)
    handleShowChangeMemeberRole = this.handleShowChangeMemeberRole.bind(this)
    handleCloseInvite = this.handleCloseInvite.bind(this)
    handleShowInvite = this.handleShowInvite.bind(this)
    handleShowMakePayment = this.handleShowMakePayment.bind(this)
    handleCloseMakePayment = this.handleCloseMakePayment.bind(this)
    handleShowDeletePaymentMethods = this.handleShowDeletePaymentMethods.bind(this)
    handleCloseDeletePaymentMethods = this.handleCloseDeletePaymentMethods.bind(this)
    onChangeName = this.onChangeName.bind(this)
    onChangeEmail = this.onChangeEmail.bind(this)
    onChangePhone = this.onChangePhone.bind(this)
    onChangeWallet = this.onChangeWallet.bind(this)
    onChangePassword = this.onChangePassword.bind(this)
    onChangeRepname = this.onChangeRepname.bind(this)
    changeName = this.changeName.bind(this)
    changeEmail = this.changeEmail.bind(this)
    changeProfile = this.changeProfile.bind(this)
    changePhone = this.changePhone.bind(this)
    changeWallet = this.changeWallet.bind(this)
    changePassword = this.changePassword.bind(this)
    handleShowSuccess = this.handleShowSuccess.bind(this)
    handleCloseSuccess = this.handleCloseSuccess.bind(this)
    handleShowError = this.handleShowError.bind(this)
    handleCloseError = this.handleCloseError.bind(this)

    render() {
        return (
            <div className="settings">
               <div className="title-header">
                    <h3 className="menu__title">Settings</h3>
                </div>
                <div className="setting__tab">
                    <Tabs defaultActiveKey="profile">
                        <Tab eventKey="profile" title="Profile">
                                <div className="content__wrap">
                                <h4 className="menu__title-secondary mb-4">Personal information</h4>
                                <div className="form__groups">

                                    <div className="form_row mb-4">
                                        <div className=" form_col">
                                            <label className="form__label">Name:</label>
                                            <div className="input-group">
                                                <input type="text" placeholder="Mike Jackson" onChange={this.onChangeRepname} value={this.state.repname}  className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                            </div>
                                        </div>
                                        <div className="form_col_last form_col">
                                            <label className="form__label">Company Name: </label>
                                            <div className="input-group">
                                                <input type="text" placeholder={`"ООО "Ромашка""`} onChange={this.onChangeName} value={this.state.name} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form_row mb-4">
                                        <div className="form_col">
                                            <label className="form__label">Phone: </label>
                                            <div className="input-group">
                                                <input type="text" placeholder="+7 999 202 77 77" onChange={this.onChangePhone} value={this.state.phone} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                            </div>
                                        </div>
                                        <div className="form_col_last form_col">
                                            <label className="form__label">Email:</label>
                                            <div className="input-group">
                                            <input type="text" placeholder="mj@gmail.com" onChange={this.onChangeEmail} value={this.state.email}  className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form_row mb-4">
                                        <div className="form_col_last form_col">
                                        <label className="form__label_disbaled form__label">Profile image: </label>
                                            <FileUpload disabled></FileUpload>
                                        </div>
                                    </div>
                                </div>
                               

                                <h4 className="menu__title-secondary mb-4">Security</h4>
                                <div className="form__groups_adaptive form__groups">
                                    <div className="form_row mb-4">
                                        <div className="form_col_last form_col">
                                            <label className="form__label">Change password: </label>
                                            <div className="input-group">
                                                <input type="text" onChange={this.onChangePassword} value={this.state.password} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                <button className="btn btn__reset btn_primary btn_orange ms-3">Reset</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form_row-switch form_row mb-4">
                                <div className="form_col_last form_col">
                                <div className="form__group_top-row-left">
                                        <img src={drug_drop}></img>
                                            <div>
                                                <label className="form__label_group form__label">Two-factor authentication:
                                                </label>
                                                <div className="form__prompt" id="basic-addon4">Add an extra layer of security to your account. To sign in, you'll need to provide a code along with your username and password.</div>
                                                        </div>
                                    </div>
                                </div>
                                <label className="switch_center switch">
                                        <input type="checkbox" onChange={() => this.setState({isActive: !this.state.isActive}) }></input>
                                        <span className="slider round"></span>
                                    </label>  
                        </div>


                                
                                <div className="form_row mb-4">
                                        <div className="form_col_action_left form_col_last form_col">
                                            <button className="btn btn_pre-sm  btn_primary btn_orange" onClick={this.changeProfile}>
                                                Save
                                            </button>
                                        </div>
                                </div>
                            </div>
                        </Tab>

                        <Tab eventKey="api" title="API">
                        <div className="content__wrap">
                         <h4 className="menu__title-secondary mb-4">API Token</h4>
                         <div className="form__groups">
                            <div className="form_row-switch form_row mb-4">
                                    <div className="form_col_last form_col">
                                        <div className="form__group_top-row-left">
                                                <img src={attraction}></img>
                                                    <div>
                                                        <label className="form__label_group form__label">Attention:
                                                        </label>
                                                        <div className="form__prompt" id="basic-addon4">Someone who has the API key of your account can use its capabilities (including distribution of rewards). Please be careful not to let your API key fall into the wrong hands.</div>
                                                                </div>
                                        </div>
                                    </div>
                                    <button className="btn btn_primary btn_orange">Create</button>
                            </div>
                            <div className="form__groups_adaptive_secondary form__groups_adaptive form_row mb-4">
                                <div className="form_col_last form_col">
                                    <label className="form__label">API key #1: </label>
                                    <div className="input-group">
                                        <input type="text" value={'0xE8D562606F35CB14dA3E8faB1174F9B5AE8319c4'}  className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                        <div className="tooltip-fp">
                                            <button onClick={this.handleCopy} onMouseOut={this.handleOutTooltip} className="btn btn__copy btn_primary btn_orange ms-3">
                                            <span class="tooltiptext">Copy to clipboard</span>
                                            Copy
                                            </button>
                                        </div>
                                        <button className="btn btn__copy btn_primary btn_orange ms-3">Revoke</button>
                                    </div>
                                </div>
                            </div>
                            <div className="form__groups_adaptive_secondary form__groups_adaptive form_row mb-4">
                                <div className="form_col_last form_col">
                                    <label className="form__label">API key #2: </label>
                                    <div className="input-group">
                                        <input type="text" value={'0xE8D562606F35CB14dA3E8faB1174F9B5AE8319c4'}  className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                        <div className="tooltip-fp">
                                            <button onClick={this.handleCopy} onMouseOut={this.handleOutTooltip}  className="btn btn__copy btn_primary btn_orange ms-3">
                                            <span class="tooltiptext">Copy to clipboard</span>
                                            Copy
                                            </button>
                                        </div>
                                        <button className="btn btn__copy btn_primary btn_orange ms-3">Revoke</button>
                                    </div>
                                </div>
                            </div>
                            <div className="form__groups_adaptive_secondary form__groups_adaptive form_row mb-4">
                                <div className="form_col_last form_col">
                                    <label className="form__label">API key #3: </label>
                                    <div className="input-group">
                                        <input type="text" value={'0xE8D562606F35CB14dA3E8faB1174F9B5AE8319c4'}  className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                        <div className="tooltip-fp">
                                            <button onClick={this.handleCopy} onMouseOut={this.handleOutTooltip} className="btn btn__copy btn_primary btn_orange ms-3">
                                            <span class="tooltiptext">Copy to clipboard</span>
                                            Copy
                                            </button>
                                        </div>
                                        <button className="btn btn__copy btn_primary btn_orange ms-3">Revoke</button>
                                    </div>
                                </div>
                            </div>
                            <div className="form_row mb-4">
                            <div className="form_col_action_left form_col_last form_col">
                                <button className="btn btn_pre-sm  btn_primary btn_orange">
                                    Save
                                </button>
                            </div>
                         </div>
                        </div>
                        </div> 
                        </Tab>

                        <Tab eventKey="billing" title="Billing">
                            <div className="content__wrap-main">
                                <div className="content__wrap">
                                    <h4 className="menu__title-secondary mb-4">Estimate Due</h4>
                                    <div className="form__groups mb-4">
                                        <p>ABC tokens on blacklisted users' wallets will be frozen and cannot be sent from them. Add list of wallets to the text box. Each wallet on a new line.</p>
                                    </div>
                                    <div className="form__groups mb-4">
                                        <b className="settings__bulling_value">$0.00</b>
                                    </div>
                                    <div className="form_row-marke-payments form_row mb-4">
                                        <div className="settings__payment">
                                            <div>
                                                <p>$0.00</p>
                                                <div className="settings__payment_bottom">
                                                    <span>Prepayments</span> <img src={info}/>
                                                </div>
                                            </div>
                                            <div>
                                                <p>$0.00</p>
                                                <div className="settings__payment_bottom">
                                                    <span>Total usage</span> <img src={info}/>
                                                </div>
                                            </div>
                                            <div>
                                                <p>$0.00</p>
                                                <div className="settings__payment_bottom">
                                                    <span>Estimated due</span> <img src={info}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form_col_action_payment form_col_action_left form_col_last form_col">
                                            <button className="btn btn_primary btn_orange" onClick={this.handleShowMakePayment}>
                                                Make a payment
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="content__wrap">
                                    <div className="title-header mb-4">
                                        <h4 className="menu__title-secondary-payment menu__title-secondary mb-4">Payment methods</h4>
                                        <button type="button" onClick={this.handleShowAddPaymentMethod} className="btn btn_orange btn_primary">Add a payment method </button>
                                    </div>
                                    {
                                     this.state.paymentMethods.length 
                                     ?   <FPTable data={paymentMethodsTable}>
                                     {
                                         this.state.paymentMethods.map(v => 
                                             <tr key={v.card}>
                                                 <td>{v.card}</td>
                                                 <td>{v.expire_date}</td>
                                                 <td>{v.status}</td>
                                                 <td>
                                                     <FPDropdown icon={more}>
                                                         <Dropdown.Item className="dropdown__menu-item" onClick={this.handleShowMakePayment}>Make a payment</Dropdown.Item>
                                                         <Dropdown.Item className="dropdown__menu-item" onClick={() => this.handleShowDeletePaymentMethods(v.card)}>Delete</Dropdown.Item>
                                                     </FPDropdown>
                                                 </td> 
                                             </tr>      
                                         )
                                     }
                                    </FPTable>
                                    : null 

                                    }
                                </div>

                                <div className="content__wrap">                                
                                    <h4 className="menu__title-secondary mb-4">Billing history</h4>
                                    <FPTable data={billingHistoryTable}>
                                            <tr>
                                                <td>March 31, 2023</td>
                                                <td>Expires 02/2026</td>
                                                <td>Default</td>
                                                <td>
                                                    <FPDropdown icon={more}>
                                                        <Dropdown.Item className="dropdown__menu-item">Make default</Dropdown.Item>
                                                        <Dropdown.Item className="dropdown__menu-item">Download PDF</Dropdown.Item>
                                                        <Dropdown.Item className="dropdown__menu-item">Delete</Dropdown.Item>
                                                    </FPDropdown>
                                                </td>
                                            </tr>
                                    </FPTable>
                                </div>

                            </div>
                        </Tab>
                        <Tab eventKey="team" title="Team">
                            <div className="content__wrap">
                                    <div className="title-header_adaptive title-header mb-4">
                                        <div className="input-group search-input_rewards search-input">
                                            <input type="text" placeholder="Search..." className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                        </div>
                                        <button type="button" className="btn btn_orange btn_primary" onClick={this.handleShowInvite}>Invite member</button>
                                    </div>
                                    <FPTable data={teamTable}>
                                            <tr>
                                                <td>
                                                    <p>Mike Thompson</p>
                                                    <p>mike@gmail.com</p>
                                                </td>
                                                <td>Owner</td>
                                                <td>Joined</td>
                                                <td>
                                                    <FPDropdown icon={more}>
                                                        <Dropdown.Item className="dropdown__menu-item">Leave team</Dropdown.Item>
                                                        <Dropdown.Item className="dropdown__menu-item" onClick={this.handleShowChangeMemeberRole}>Change role</Dropdown.Item>
                                                        <Dropdown.Item className="dropdown__menu-item" onClick={this.handleShowRemoveFromTeam}>Remove from team</Dropdown.Item>
                                                        <Dropdown.Item className="dropdown__menu-item">Resend email</Dropdown.Item>
                                                        <Dropdown.Item className="dropdown__menu-item">Cancel invite</Dropdown.Item>
                                                    </FPDropdown>
                                                </td>
                                            </tr>
                                    </FPTable>
                                </div>
                        </Tab>
                    </Tabs>
                </div>
                {/*<div>
                    Information
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item"> 
                            <div>
                                Company name
                            </div>
                            <div className="input-group mb-3">
                                <input onChange={this.onChangeName} type="text" className="form-control" placeholder={this.state.name} aria-describedby="basic-addon1"/>
                            </div>
                            <div>
                                <button onClick={this.changeName} type="button" className="btn btn-dark">Change</button>
                            </div>
                        </li>
                        <li className="list-group-item"> 
                            <div>
                                Email
                            </div>
                            <div className="input-group mb-3">
                                <input onChange={this.onChangeEmail} type="email" className="form-control" placeholder={this.state.email} aria-label="Email" aria-describedby="basic-addon1"/>
                            </div>
                            <div>
                                <button onClick={this.changeEmail} type="button" className="btn btn-dark">Change</button>
                            </div>
                        </li>
                        <li className="list-group-item"> 
                            <div>
                                Phone
                            </div>
                            <div className="input-group mb-3">
                                <input onChange={this.onChangePhone} type="text" className="form-control" placeholder={this.state.phone} aria-describedby="basic-addon1"/>
                            </div>
                            <div>
                                <button onClick={this.changePhone} type="button" className="btn btn-dark">Change</button>
                            </div>
                        </li>
                        <li className="list-group-item"> 
                            <div>
                                Wallet
                            </div>
                            <div className="input-group mb-3">
                                <input onChange={this.onChangeWallet} type="text" className="form-control" placeholder={this.state.wallet} aria-describedby="basic-addon1"/>
                            </div>
                            <div>
                                <button onClick={this.changeWallet} type="button" className="btn btn-dark">Change</button>
                            </div>
                        </li>
                        <li className="list-group-item"> 
                            <div>
                                Password
                            </div>
                            <div className="input-group mb-3">
                                <input onChange={this.onChangePassword} type="password" className="form-control" aria-describedby="basic-addon1"/>
                            </div>
                            <div>
                                <button onClick={this.changePassword} type="button" className="btn btn-dark">Change</button>
                            </div>
                        </li>
                    </ul>
        </div>*/}
                  <Modal show={this.state.showMakePayment} onHide={this.handleCloseMakePayment} centered>
                    <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                        Make a payment
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form_row mb-4">
                            <span className="form__label">Your current estimated costs for this billing period are $0.00.</span>
                        </div>
                        <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                <label className="form__label">Payment amount:</label>
                                    <div className="input-group ">
                                    <input type="number" placeholder="0" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4">Amount must be at least $1.00</div>
                                </div>
                         </div>

                         <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                <label className="form__label">Saved payment methods:</label>
                                    <div className="input-group ">
                                        <select onChange={this.changeUser} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                            {
                                                this.state.users
                                            }
                                        </select>
                                    </div>
                                </div>
                         </div>

                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn_primary btn_gray" onClick={this.handleCloseMakePayment}>
                        Cancel
                    </button>
                    <button className="btn btn_primary btn_orange">
                        Submit payment
                    </button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showAddPaymentMethod} onHide={this.handleCloseAddPaymentMethod} centered>
                    <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                    Add a new payment method
                    </Modal.Header>
                    <Modal.Body>
                        <div className="modal-subtitle mb-4">
                        We accept Visa, Mastercard, American Express, UnionPay, MIR, and Discover credit cards.
                        </div>
                        <div className="modal-subtitle mb-4">
                        You may see a temporary authorization hold on your card, which your bank should release soon. Digital Ocean does not charge you until you start using paid services.
                        </div>
                        <div className="form_row_relative form_row mb-2">
                                <div className="form_col_last form_col">
                                <label className="form__label">Card</label>
                                    <div className="input-group__add_payment input-group_card input-group">
                                    <img className="credit-card__image" src={creditCard}></img>
                                    <input type="text" placeholder="Card number" className="form-control_with_image form-control_wide form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                    <input type="text" placeholder="MM/YY" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                    <input type="number" placeholder="CVC" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                    </div>
                                </div>
                         </div>

                         <div className="form_row_relative form_row mb-4">
                         <div className="form_col_last form_col">
                                    <img className="cardholder__image" src={cardholder}></img>
                                    <div className="input-group">
                                    <input type="number" placeholder="Cardholder name" className="form-control_with_image form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                    </div>
                                </div>
                         </div>

                         <div className="form_row_relative form_row mb-4">
                                <div className="form_col_last form_col">
                                <div className="input-group__add_payment input-group mb-2">
                                                    <label className="form__label">Billing address</label>

                    <label className="modal-subtitle mb-3">Please provide the billing address associated with the card you've provided.</label>
                    <select className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                {
                                                countries.map(v => {
                                                    return <option value={v.name} selected={v.name === 'Thailand'}>
                                                        {v.name}
                                                    </option>
                                                })
                                            }
                            </select>
                                </div>
                                    <div className="input-group__add_payment input-group">
                                    <input type="text" placeholder="Street name" className="form-control_wide form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                    </div>
                                </div>
                         </div>

                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn_primary btn_gray" onClick={this.handleCloseAddPaymentMethod}>
                        Cancel
                    </button>
                    <button onClick={this.handleAddNewPayment} className="btn btn_primary btn_orange">
                        Submit payment
                    </button>
                    </Modal.Footer>
                </Modal>
                
                <Modal show={this.state.showInvite} onHide={this.handleCloseInvite} centered>
                    <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                    Invite team members
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form_row mb-4">
                            <span className="form__label">Just enter the addresses of the people you'd like to invite and we'll send them an email.</span>
                        </div>
                        <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                <label className="form__label">Enter email addresses: <img className="form__icon-info" src={info_black} /></label>
                                <div className="form_col_last form_col">
                                    <textarea className="form__textarea form__textarea_email" onChange={this.onChangeBlacklistAddText}></textarea>
                                </div>
                                </div>
                         </div>
                        
                         <div className="form_row">
                                <div className="form_col">
                                    <label className="form__label">Choose role:</label>
                                </div>
                            </div>
                         <div className="form_row mb-4">
                                <div className="form_col_flex form_col">
                                    <div className="form-check custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="rd_1" name="rd" value="Contract balance"/>
                                            <label className="form-check-label custom-control-label green" for="rd_1">
                                            Member <img src={info_black} className="form__icon-info"/>
                                            </label>
                                        </div>
                                        <div className="form-check custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="rd_2" name="rd" value="External wallet" />
                                            <label className="form-check-label custom-control-label red" for="rd_2">
                                                Owner <img src={info_black} className="form__icon-info"/>
                                            </label>
                                        </div>
                                </div>
                            </div>

                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn_primary btn_gray" onClick={this.handleCloseInvite}>
                        Cancel
                    </button>
                    <button className="btn btn_primary btn_orange" onClick={this.handleInvite}>
                    Invite team members
                    </button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.changeMemberRole} onHide={this.handleCloseChangeMemeberRole} centered>
                    <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                    Change member’s role
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form_row mb-4">
                            <div className="form_col">
                                <label className="form__label">Name:</label>
                                            <div className="input-group">
                                                <input type="number" placeholder="Mike Thompson" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                            </div>
                            </div>
                        </div>
        
                         <div className="form_row mb-4">
                            <div className="form_col">
                            <label className="form__label">Email:</label>
                                        <div className="input-group">
                                            <input type="number" placeholder="mike@gmail.com" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                        </div>
                            </div>
                        </div>

                        <div className="form_row">
                                <div className="form_col">
                                    <label className="form__label">Choose role:</label>
                                </div>
                            </div>
                         <div className="form_row mb-4">
                                <div className="form_col_flex form_col">
                                    <div className="form-check custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="rd_1" name="rd" value="Contract balance"/>
                                            <label className="form-check-label custom-control-label green" for="rd_1">
                                            Member <img src={info_black} className="form__icon-info"/>
                                            </label>
                                        </div>
                                        <div className="form-check custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="rd_2" name="rd" value="External wallet" />
                                            <label className="form-check-label custom-control-label red" for="rd_2">
                                                Owner <img src={info_black} className="form__icon-info"/>
                                            </label>
                                        </div>
                                        <div className="form-check custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="rd_2" name="rd" value="External wallet" />
                                            <label className="form-check-label custom-control-label red" for="rd_2">
                                                Admin <img src={info_black} className="form__icon-info"/>
                                            </label>
                                        </div>
                                </div>
                            </div>

                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn_primary btn_gray" onClick={this.handleCloseChangeMemeberRole}>
                        Cancel
                    </button>
                    <button className="btn btn_primary btn_orange">
                        Save
                    </button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.removeFromTeam} onHide={this.handleCloseRemoveFromTeam} centered>
                    <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                    Remove confirmation
                    </Modal.Header>
                    <Modal.Body>
                       <p className="modal-text_center modal-text_bold modal-text_smTitile modal-text">Delete Mike Thompson from team?</p>
                       <p className="modal-text_center modal-text mb-4">You won't be able to revert this</p>
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn_primary btn_gray" onClick={this.handleCloseRemoveFromTeam}>
                        Cancel
                    </button>
                    <button className="btn btn_primary btn_orange">
                        Delete
                    </button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showDeletePaymentMethods} onHide={this.handleCloseDeletePaymentMethods} centered>
                    <Modal.Header className="modal-newuser__title modal-title h4 mb-4" closeButton>
                        Delete payment method with card {this.state.chosen_payment_method}
                    </Modal.Header>
                    <Modal.Footer>
                    <button className="btn btn_primary btn_gray" onClick={this.handleCloseDeletePaymentMethods}>Back</button>
                        <button className="btn btn_primary btn_orange" onClick={() => this.deletePaymentMethods(this.state.chosen_payment_method)}>Delete</button>
                    </Modal.Footer>
                </Modal>
                <UpdateModal 
                    showSuccess={this.state.showSuccess} 
                    handleCloseSuccess={this.handleCloseSuccess}
                    successTitle={this.state.successTitle} 
                    successName={this.state.successName} 
                    successText={this.state.successText}
                />
                <ErrorModal
                    showError={this.state.showError}
                    handleCloseError={this.handleCloseError}
                    errorText={this.state.errorText}
                />
            </div>
        )
    }
}

export default Settings