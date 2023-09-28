import { Component } from "react";
import logo from '../media/header/logo.svg'
import notification from '../media/common/notification.svg'
import user from '../media/common/user.svg'
import chevron from '../media/common/chevron.svg'
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

    logout = this.logout.bind(this)

    render() {
        const {userName} = this.props
        return (
            <header>
                    <div className="header-left">
                        <img src={logo}></img>
                    </div>
                    <div className="header-right">
                        <div>
                            <img src={notification}></img>
                        </div>
                        <span className="devider"></span>
                        <div className="header-right__user">
                            <img src={user}></img>
                            <FPDropdown label={userName} icon={chevron} isTransformIcon={true}>
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