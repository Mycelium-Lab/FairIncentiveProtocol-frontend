import { Component } from "react";
import logo from '../media/header/logo.svg'
import notification from '../media/common/notification.svg'
import user from '../media/common/user.svg'
import Dropdown from "./common/FPDropdown";

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
                            <Dropdown label={userName} emit={{logout: this.logout}}></Dropdown>
                        </div>
                    </div>
                </header>
        )
    }
}

export default Header