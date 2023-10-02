import { Component } from "react";
import logo from '../media/header/logo.svg'
import more from '../media/header/more_header.svg'
import burger from '../media/header/menu_burger.svg'
import close from '../media/header/menu_close.svg'
import notification from '../media/common/notification.svg'
import user from '../media/common/user.svg'
import chevron from '../media/common/chevron.svg'
import defaultUser from '../media/notifications/default.png'
import mock_1 from '../media/notifications/mock_1.png'
import mock_2 from '../media/notifications/mock_2.png'
import mock_3 from '../media/notifications/mock_3.png'
import FPDropdown from "./common/FPDropdown";
import { Dropdown } from "react-bootstrap";

class Header extends Component {
    constructor(props) {
        super(props)
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


    logout = this.logout.bind(this)
    handleShowSidebar = this.handleShowSidebar.bind(this)
    handleNotifications = this.handleNotifications.bind(this)

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
                            <FPDropdown icon={notification} isTransformIcon={false}>
                                <div className="dropdown__notification_top">
                                    <span className="dropdown__menu-item-notification-name">Notifications</span>
                                    <span className="dropdown__menu-item_clear dropdown__menu-item">CLEAR ALL</span>
                                </div>
                                <Dropdown.Item className="dropdown__notification__item notification__item dropdown__menu-item">
                                <img className="dropdown__menu-item-notification-img" src={defaultUser}></img>
                                <div className="notification__item-desc">
                                    <p className="notification__item-messag_gray notification__item-message"><span className="notification__item-message_primary notification__item-message">Elwis Mathew</span> added a new product <span className="notification__item-message_primary notification__item-message">Redmi Pro 7 Mobile</span></p>
                                    <span className="notification__item-time">4 mins ago</span>
                                </div>
                                </Dropdown.Item>
                                <Dropdown.Item className="dropdown__notification__item  notification__item dropdown__menu-item">
                                <img className="dropdown__menu-item-notification-img" src={mock_1}></img>
                                <div className="notification__item-desc">
                                    <p className="notification__item-messag_gray notification__item-message"><span className="notification__item-message_primary notification__item-message">Elwis Mathew</span> added a new product <span className="notification__item-message_primary notification__item-message">Redmi Pro 7 Mobile</span></p>
                                    <span className="notification__item-time">4 mins ago</span>
                                </div>
                                </Dropdown.Item>
                                  <Dropdown.Item className="dropdown__notification__item  notification__item dropdown__menu-item">
                                <img className="dropdown__menu-item-notification-img" src={mock_2}></img>
                                <div className="notification__item-desc">
                                    <p className="notification__item-messag_gray notification__item-message"><span className="notification__item-message_primary notification__item-message">Elwis Mathew</span> added a new product <span className="notification__item-message_primary notification__item-message">Redmi Pro 7 Mobile</span></p>
                                    <span className="notification__item-time">4 mins ago</span>
                                </div>
                                </Dropdown.Item>
                                <Dropdown.Item className="dropdown__notification__item  notification__item dropdown__menu-item">
                                <img className="dropdown__menu-item-notification-img" src={mock_3}></img>
                                <div className="notification__item-desc">
                                    <p className="notification__item-messag_gray notification__item-message"><span className="notification__item-message_primary notification__item-message">Elwis Mathew</span> added a new product <span className="notification__item-message_primary notification__item-message">Redmi Pro 7 Mobile</span></p>
                                    <span className="notification__item-time">4 mins ago</span>
                                </div>
                                </Dropdown.Item>
                                <Dropdown.Item className="dropdown__menu-item_view dropdown__menu-item" onClick={this.handleNotifications}>View all Notifications</Dropdown.Item>
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
                                    </div>
                                </Dropdown.Item>
                                <Dropdown.Item className="dropdown__menu-item">My Profile</Dropdown.Item>
                                <Dropdown.Item className="dropdown__menu-item">Settings</Dropdown.Item>
                                <Dropdown.Item className="dropdown__menu-item_logout dropdown__menu-item" onClick={this.logout}>Logout</Dropdown.Item>
                            </FPDropdown>
                        </div>
                    </div>
                </header>
        )
    }
}

export default Header