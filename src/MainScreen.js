import { Component } from "react";
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
import Sidebar from "./components/Sidebar";

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
            auth: props.auth,
            showSidebar: true,
        }
    }

    componentDidMount() {
        console.log(window.innerWidth)
        if(window.innerWidth < 769) {
            this.setState({
                showSidebar: false
            })
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
        if (this.state.switcher === switcher.nftcollection) return <NFTCollections auth={this.state.auth} switcher={switcher} onSwitch={this.onSwitch}/>
        if (this.state.switcher === switcher.nft) return <NFTs/>
        if (this.state.switcher === switcher.settings) return <Settings auth={this.state.auth}/>
    }

    changeShowSidebar() {
        this.setState({
            showSidebar: !this.state.showSidebar
        })
    }


    onSwitch = this.onSwitch.bind(this)
    renderInfo = this.renderInfo.bind(this)
    changeShowSidebar = this.changeShowSidebar.bind(this)

    render() {
        return (
            <div>
                <Header userName={this.state.auth.name} showSidebar={this.state.showSidebar} changeShowSidebar={this.changeShowSidebar}></Header>
                <div className="middle">
                {
                    this.state.showSidebar ? <Sidebar switcher={switcher} onSwitch={this.onSwitch} changeShowSidebar={this.changeShowSidebar}></Sidebar>  : null  
                }
                {
                    !this.state.showSidebar &&  window.innerWidth < 769 ? 
                    <div className="middle-info">
                        {this.renderInfo()}
                    </div>
                    : this.state.showSidebar &&  window.innerWidth < 769 ? null 
                    :  <div className="middle-info">
                            {this.renderInfo()}
                        </div>
                }
                </div>
            </div>
        )
    }

}

export default MainScreen