import { Component } from "react";
import './styles/menu.css'
import './styles/middle.css'
import './styles/header.css'
import './styles/settings.css'
import notificationsImage from './media/header/notifications.png'
import Dashboard from "./menu/Dashboard";
import Rewards from "./menu/Rewards";
import Tokens from "./menu/Tokens";
import Users from "./menu/Users";
import NFTs from "./menu/NFTs";
import Settings from "./menu/Settings";
import { checkAuth } from "./utils/checkAuth";

const switcher = {
    dashboard: 'dashboard',
    rewards: 'rewards',
    users: 'users',
    tokens: 'tokens',
    nft: 'nft',
    settings: 'settings'
}

class MainScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            switcher: switcher.dashboard,
            auth: props.auth
        }
    }

    onSwitch(value) {
        this.setState({
            switcher: value
        })
    }

    renderInfo() {
        if (this.state.switcher === switcher.dashboard) return <Dashboard/>
        if (this.state.switcher === switcher.rewards) return <Rewards/>
        if (this.state.switcher === switcher.tokens) return <Tokens/>
        if (this.state.switcher === switcher.users) return <Users/>
        if (this.state.switcher === switcher.nft) return <NFTs/>
        if (this.state.switcher === switcher.settings) return <Settings auth={this.state.auth}/>
    }

    logout() {
        console.log('here')
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        window.location.reload()
    }

    onSwitch = this.onSwitch.bind(this)
    renderInfo = this.renderInfo.bind(this)
    logout = this.logout.bind(this)

    render() {
        return (
            <div>
                <header>
                    <div className="header-left">
                        FAIR Protocol
                    </div>
                    <div className="header-right">
                        <div>
                            <i className="fa fa-bell"></i>
                        </div>
                        <div>
                            {this.state.auth.name}
                        </div>
                        <div>
                            <button onClick={this.logout} className="btn btn-danger"><i className="fa fa-sign-out fa-2x"></i></button>
                        </div>
                    </div>
                </header>
                <div className="middle">
                <nav className="main-menu">
                        <ul>
                            <li onClick={() => this.onSwitch(switcher.dashboard)}>
                                <a href="#">
                                    <i className="fa fa-home fa-2x"></i>
                                    <span className="nav-text">
                                        Dashboard
                                    </span>
                                </a>
                            </li>
                            <li onClick={() => this.onSwitch(switcher.rewards)}>
                                <a href="#">
                                    <i className="fa fa-plus fa-2x"></i>
                                    <span className="nav-text">
                                        Rewards
                                    </span>
                                </a>
                                
                            </li>
                            <li onClick={() => this.onSwitch(switcher.users)}>
                                <a href="#">
                                <i className="fa fa-users fa-2x"></i>
                                    <span className="nav-text">
                                        Users
                                    </span>
                                </a>
                                
                            </li>
                            <li onClick={() => this.onSwitch(switcher.tokens)}>
                                <a href="#">
                                <i className="fa fa-usd fa-2x"></i>
                                    <span className="nav-text">
                                        Tokens
                                    </span>
                                </a>
                            
                            </li>
                            <li onClick={() => this.onSwitch(switcher.nft)}>
                                <a href="#">
                                    <i className="fa fa-picture-o fa-2x"></i>
                                    <span className="nav-text">
                                        NFTs
                                    </span>
                                </a>
                            </li>
                            <li onClick={() => this.onSwitch(switcher.settings)}>
                                <a href="#">
                                    <i className="fa fa-cog fa-2x"></i>
                                    <span className="nav-text">
                                        Settings
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <div className="middle-info">
                        {this.renderInfo()}
                    </div>
                </div>
            </div>
        )
    }

}

export default MainScreen