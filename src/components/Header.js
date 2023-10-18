import { Component } from "react";
import logo from '../media/header/logo.svg'
import more from '../media/header/more_header.svg'
import burger from '../media/header/menu_burger.svg'
import close from '../media/header/menu_close.svg'
import notificationIcon from '../media/common/notification.svg'
import user from '../media/common/user.svg'
import chevron from '../media/common/chevron.svg'
import FPDropdown from "./common/FPDropdown";
import { Dropdown } from "react-bootstrap";
import notifications from "../data/notifications";
import { ethers } from "ethers";
import { config } from "../utils/config";
import Modal from 'react-bootstrap/Modal';
import { networks } from "../utils/networks";
import info from '../media/common/info-small.svg'
import ConfirmModal from "./common/modals/confirm";

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            notifications,
            showConnect: false,
            showConfirm: false,
            network: networks[config.status === "test" ? '5' : '1'],
            provider: null,
            chainid: null,
            signer: null,
            address: null,
        }
    }

    logout() {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        window.location.reload()
    }

    handleShowSidebar() {
        this.props.changeShowSidebar(!this.props.showSidebar)
    }
    handleNotifications() {
        this.props.onSwitch(this.props.notifications)
    }

    handleSettings() {
        this.props.onSwitch(this.props.settings)
    }

    clearAll() {
        this.setState({
            notifications: []
        })
    }

    handleShowConnet () {
        this.setState({
            showConnect: true
        })
    }
    handleCloseConnect() {
        this.setState({
            showConnect: false
        })
    }

    async changeNetwork(id) {
        const network = networks[id]
        this.setState({
            network,
            chainid: network.chainid,
            provider: null,
            signer: null,
            address: null
        },  async () => await this.connect())
    }

    handleShowConfirm = (confirmTitle, confirmName, confirmText) => this.setState({showConfirm: true, confirmTitle, confirmName, confirmText})
    handleCloseConfirm = () => this.setState({showConfirm: false, confirmName: null, confirmText: null})

    async disconnect() {
        localStorage.removeItem('account')
        this.setState({
            chainid: null,
            provider: null,
            signer: null,
            address: null
        })
    }

    async connect() {
        const network = this.state.network
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
            await provider.send("eth_requestAccounts", [])
            const signer = await provider.getSigner()
            const address = await signer.getAddress()
            const chainid = (await provider.getNetwork()).chainId
            try {
                this.handleShowConfirm('Connect', 'Confirm the network change', 'Please, confirm the network change in your wallet')
                await window.ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: ethers.utils.hexValue(parseInt(network.chainid)) }]
                })
                // .then(() => window.location.reload())
                localStorage.setItem('account',address )
                this.setState({
                    provider,
                    signer,
                    address,
                    chainid,
                })
              } catch (err) {
                console.log(err)
                if (err.code === 4902) {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainName: network.name,
                        chainId: ethers.utils.hexValue(parseInt(network.chainid)),
                        nativeCurrency: { name: network.currency_symbol, decimals: 18, symbol: network.currency_symbol},
                        rpcUrls: [network.rpc]
                      }
                    ]
                  })
                //   .then(() => window.location.reload())
                }
              }
              this.handleCloseConfirm()
              this.handleCloseConnect()
    }


    logout = this.logout.bind(this)
    handleShowSidebar = this.handleShowSidebar.bind(this)
    handleNotifications = this.handleNotifications.bind(this)
    handleSettings = this.handleSettings.bind(this)
    clearAll = this.clearAll.bind(this)
    connect = this.connect.bind(this)
    disconnect = this.disconnect.bind(this)
    handleShowConnet = this.handleShowConnet.bind(this)
    handleCloseConnect = this.handleCloseConnect.bind(this)
    changeNetwork = this.changeNetwork.bind(this)
    handleShowConfirm = this.handleShowConfirm.bind(this)
    handleCloseConfirm = this.handleCloseConfirm.bind(this)

    render() {
        const {userName, showSidebar} = this.props
        return (
            <header className="header">
                    <div className="header-left">
                        {
                            showSidebar 
                            ?
                            <img className="menu-close" src={close} onClick={this.handleShowSidebar}></img>
                            :
                            <img className="menu-burger" src={burger} onClick={this.handleShowSidebar}></img>
                        }
                        <img className="logo" src={logo}></img>
                    </div>
                    <div className="header-right">
                        <div>
                            {/*<img className="header-right__notification" src={notification} onClick={this.handleNotifications}></img>*/}
                            <FPDropdown icon={notificationIcon} isTransformIcon={false}>
                                <div className="dropdown__notification_top">
                                    {
                                         this.state.notifications.length ?  <span className="dropdown__menu-item-notification-name">Notifications</span>
                                         : <span className="dropdown__menu-item-notification-name">No notifications</span>
                                    }
                                    {
                                         this.state.notifications.length ? <span className="dropdown__menu-item_clear dropdown__menu-item" onClick={this.clearAll}>CLEAR ALL</span>
                                         : null
                                    }
                                </div>
                                {
                                    this.state.notifications.length ? 
                                    this.state.notifications.map(v => 
                                        <Dropdown.Item key={v.key} className="dropdown__notification__item notification__item dropdown__menu-item">
                                        <img className="dropdown__menu-item-notification-img" src={v.avatar}></img>
                                        <div className="notification__item-desc">
                                            <p className="notification__item-messag_gray notification__item-message"><span className="notification__item-message_primary notification__item-message">{v.name}</span> added a new product <span className="notification__item-message_primary notification__item-message">Redmi Pro 7 Mobile</span></p>
                                            <span className="notification__item-time">{v.ago}</span>
                                        </div>
                                        </Dropdown.Item>
                                    )
                                    : null
                                }
                                {
                                    this.state.notifications.length ?
                                    <Dropdown.Item className="dropdown__menu-item_view dropdown__menu-item" onClick={this.handleNotifications}>View all Notifications</Dropdown.Item>
                                    : null
                                }
                            </FPDropdown>
                        </div>
                        <span className="devider"></span>
                        <div className="header-right__user">
                            <img className="header-right__user_avatar" src={user}></img>
                            <FPDropdown label={window.innerWidth < 769 ? null : userName} icon={window.innerWidth < 769 ? more  : chevron} isTransformIcon={true}>
                                <Dropdown.Item className="dropdown__menu-item_profile dropdown__menu-iten">                                
                                    <img src={user}></img>
                                    <div className="dropdown__menu-item_profile-info">
                                        <span className="dropdown__menu-item_profile-username">{userName}</span>
                                        <span className="dropdown__menu-item_profile-status">Admin</span>
                                        {this.state.address ? 
                                         <span className="dropdown__menu-item_connect dropdown__menu-item_profile-status">{ `[ ${this.state.address.slice(0, 6) + '...' + this.state.address.slice(this.state.address.length - 4, this.state.address.length)} ]`}</span>
                                        : null 
                                        }
                                    </div>
                                </Dropdown.Item>
                                <Dropdown.Item className="dropdown__menu-item" onClick={this.handleSettings}>Settings</Dropdown.Item>
                                {
                                    this.state.address ?   <Dropdown.Item className="dropdown__menu-item_disconnect dropdown__menu-item" onClick={this.disconnect}>Disconnect wallet</Dropdown.Item>
                                    : <Dropdown.Item className="dropdown__menu-item_connect dropdown__menu-item" onClick={this.handleShowConnet}>Connect wallet</Dropdown.Item>
                                    
                                }
                                <Dropdown.Item className="dropdown__menu-item_logout dropdown__menu-item" onClick={this.logout}>Logout</Dropdown.Item>
                            </FPDropdown>
                        </div>
                    </div>

                    <Modal show={this.state.showConnect} onHide={this.handleCloseConnect} centered>
                        <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                                Connect
                        </Modal.Header>
                        <Modal.Body className="mb-4">
                        <div className="form_col_last form_col">
                                    <label className="form__label">Blockchain * <img src={info} className="form__icon-info" /></label>
                                    <div className="input-group">
                                        <select onChange={e => this.changeNetwork(e.target.value)} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                            <option value={config.status === "test" ? '5' : '1'} selected={this.state.network ? (this.state.network.chainid === (config.status === "test" ? '5' : '1')) : false}>{networks[config.status === "test" ? '5' : '1'].name}</option>
                                            <option value={config.status === "test" ? '97' : '56'} selected={this.state.network ? (this.state.network.chainid === (config.status === "test" ? '97' : '56')) : false}>{networks[config.status === "test" ? '97' : '56'].name}</option>
                                            <option value={config.status === "test" ? '80001' : '137'} selected={this.state.network ? (this.state.network.chainid === (config.status === "test" ? '80001' : '137')) : false}>{networks[config.status === "test" ? '80001' : '137'].name}</option>
                                            <option value={config.status === "test" ? '420' : '10'} selected={this.state.network ? (this.state.network.chainid === (config.status === "test" ? '420' : '10')) : false} disabled={config.status === "test" ? true : false} >{networks[config.status === "test" ? '420' : '10'].name}</option>
                                            <option value={config.status === "test" ? '43113' : '43114'} selected={this.state.network ? (this.state.network.chainid === (config.status === "test" ? '43113' : '43114')) : false}>{networks[config.status === "test" ? '43113' : '43114'].name}</option>
                                            <option value={config.status === "test" ? '421613' : '42161'} selected={this.state.network ? (this.state.network.chainid === (config.status === "test" ? '421613' : '42161')) : false}>{networks[config.status === "test" ? '421613' : '42161'].name}</option>
                                        </select>
                                    </div>
                                </div>
                        </Modal.Body>
                    </Modal>
                    <ConfirmModal 
                    showConfirm={this.state.showConfirm} 
                    handleCloseConfirm={this.handleCloseConfirm}
                    confirmTitle={this.state.confirmTitle}
                    confirmName={this.state.confirmName}
                    confirmText={this.state.confirmText}
                />
                </header>
        )
    }
}

export default Header