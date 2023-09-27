import { Component } from "react";
import './styles/menu.scss'
import './styles/middle.scss'
import './styles/settings.scss'
import Dashboard from "./components/menu/Dashboard";
import Rewards from "./components/menu/Rewards";
import Tokens from "./components/menu/Tokens";
import Users from "./components/menu/Users";
import NFTCollections from "./components/menu/NFTCollections";
import Settings from "./components/menu/Settings";
import { checkAuth } from "./utils/checkAuth";
import RewardEvents from "./components/menu/RewardEvents";
import NFTs from "./components/menu/NFTs";
import Header from "./components/Header";

const switcher = {
    dashboard: 'dashboard',
    rewards: 'rewards',
    reward_events: 'reward_events',
    users: 'users',
    tokens: 'tokens',
    nftcollection: 'nftcollection',
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
        if (this.state.switcher === switcher.reward_events) return <RewardEvents/>
        if (this.state.switcher === switcher.tokens) return <Tokens/>
        if (this.state.switcher === switcher.users) return <Users/>
        if (this.state.switcher === switcher.nftcollection) return <NFTCollections auth={this.state.auth}/>
        if (this.state.switcher === switcher.nft) return <NFTs/>
        if (this.state.switcher === switcher.settings) return <Settings auth={this.state.auth}/>
    }


    onSwitch = this.onSwitch.bind(this)
    renderInfo = this.renderInfo.bind(this)

    render() {
        return (
            <div>
                <Header userName={this.state.auth.name}></Header>
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
                            <li onClick={() => this.onSwitch(switcher.reward_events)}>
                                <a href="#">
                                    <i className="fa fa-star fa-2x"></i>
                                    <span className="nav-text">
                                        Reward events
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
                            <li onClick={() => this.onSwitch(switcher.nftcollection)}>
                                <a href="#">
                                    <i className="fa fa-picture-o fa-2x"></i>
                                    <span className="nav-text">
                                        NFT Collections
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