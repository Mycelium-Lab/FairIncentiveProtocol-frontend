import { Component } from "react";
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
import Notifications from "./components/Notifications";
import { getIsWalletInjectedLS, getWalletAddressLS, removeIsWalletInjectedLS, removeWalletAddressLS, setIsWalletInjectedLS, setWalletAddressLS } from "./utils/localStorageFuncs";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { config } from "./utils/config";
import { ethers } from "ethers";

const switcher = {
    dashboard: 'dashboard',
    rewards: 'rewards',
    reward_events: 'reward_events',
    users: 'users',
    tokens: 'tokens',
    nftcollection: 'nftcollection',
    nft: 'nft',
    settings: 'settings',
    notifications: 'notifications'
}

class MainScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            switcher: switcher.dashboard,
            auth: props.auth,
            showSidebar: true,
            isGoToCreationPage: '',
            creationPagePayload: '',
            provider: null,
            chainid: null,
            signer: null,
            address: null,
            nftcollectionAddress: null,
        }
    }

    async componentDidMount() {
        const walletAddressAlreadyExist = getWalletAddressLS()
        const isInjected = getIsWalletInjectedLS()
        if (walletAddressAlreadyExist && isInjected) {
            if (isInjected === 'false') {
                const provider = await EthereumProvider.init({
                    projectId: config.projectIdWalletConnect,
                    chains: [1],
                    optionalChains: [97, 80001, 23295,421614],
                    rpcMap: {
                        '97': 'https://bsc-testnet.publicnode.com',
                        '80001': 'https://rpc-mumbai.maticvigil.com',
                        '23295': 'https://testnet.sapphire.oasis.dev',
                        '421614': 'https://sepolia-rollup.arbitrum.io/rpc'
                    },
                    methods: ["personal_sign", "eth_sendTransaction"],
                    showQrModal: false,
                    qrModalOptions: {
                        themeMode: "light",
                    },
                });
                await provider.enable()
                const ethersWeb3Provider = new ethers.providers.Web3Provider(provider)
                const signer = await ethersWeb3Provider.getSigner()
                const address = await signer.getAddress()
                this.setProvider(ethersWeb3Provider)
                this.setSigner(signer)
                this.setAddress(address)
            } else {
                const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
                await provider.send("eth_requestAccounts", [])
                const signer = await provider.getSigner()
                const address = await signer.getAddress()
                this.setProvider(provider, true)
                this.setSigner(signer)
                this.setAddress(address)
            }
        }
        if(window.innerWidth < 769) {
            this.setState({
                showSidebar: false
            })
        }
    }

    setProvider(provider, isInjected = false) {
        setIsWalletInjectedLS(isInjected)
        this.setState({
            provider
        })
    }

    setSigner(signer) {
        this.setState({
            signer
        })
    }

    setAddress(address) {
        setWalletAddressLS(address)
        this.setState({
            address
        })
    }

    setChainid(chainid) {
        this.setState({
            chainid
        })
    }

    onSwitch(value) {
        this.setState({
            switcher: value
        })
    }

    renderInfo() {
        if (this.state.switcher === switcher.dashboard) return <Dashboard/>
        if (this.state.switcher === switcher.rewards) return <Rewards switcher={switcher} onSwitch={this.onSwitch} goToCreationPage={this.goToCreationPage} isGoToCreationPage={this.state.isGoToCreationPage}/>
        if (this.state.switcher === switcher.reward_events) return <RewardEvents switcher={switcher} onSwitch={this.onSwitch}/>
        if (this.state.switcher === switcher.tokens) return <Tokens sendProvider={this.sendProvider} setChainid={this.setChainid} setProvider={this.setProvider} setSigner={this.setSigner} setAddress={this.setAddress} isGoToCreationPage={this.state.isGoToCreationPage} wallet={{provider: this.state.provider,signer: this.state.signer,address: this.state.address,chainid: this.state.chainid}}/>
        if (this.state.switcher === switcher.users) return <Users switcher={switcher} onSwitch={this.onSwitch} goToCreationPage={this.goToCreationPage} isGoToCreationPage={this.state.isGoToCreationPage}/>
        if (this.state.switcher === switcher.nftcollection) return <NFTCollections sendProvider={this.sendProvider} setChainid={this.setChainid} setProvider={this.setProvider} setSigner={this.setSigner} setAddress={this.setAddress} auth={this.state.auth} switcher={switcher} onSwitch={this.onSwitch} isGoToCreationPage={this.state.isGoToCreationPage} creationPagePayload={this.state.creationPagePayload} getNeftCollection={this.getNeftCollection} wallet={{provider: this.state.provider,signer: this.state.signer,address: this.state.address,chainid: this.state.chainid}}/>
        if (this.state.switcher === switcher.nft) return <NFTs switcher={switcher} onSwitch={this.onSwitch} collection={this.state.nftcollection}/>
        if (this.state.switcher === switcher.settings) return <Settings auth={this.state.auth}/>
        if (this.state.switcher === switcher.notifications) return <Notifications />
    }

    changeShowSidebar() {
        this.setState({
            showSidebar: !this.state.showSidebar
        })
    }

    goToCreationPage(page, payload) {
        this.setState({
            isGoToCreationPage: page,
            creationPagePayload: payload
        })
    }

    sendProvider() {
        return {
            provider: this.state.provider,
            signer: this.state.signer,
            address: this.state.address,
            chainid: this.state.chainid
        }
    }

    removeProvider() {
        console.log('disconnect')
        removeIsWalletInjectedLS()
        removeWalletAddressLS()
        this.setState({
            provider: null,
            signer: null,
            address: null,
            chainid: null
        })
    } 

    getProvider(provider, signer, address, chainid) {
        this.setState({
            provider,
            signer,
            address,
            chainid
        })
    }

    getNeftCollection(collection) {
        this.setState({
            nftcollection: collection
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.isGoToCreationPage) {
            this.setState({
                isGoToCreationPage: false,
            })
        }
    }

    onSwitch = this.onSwitch.bind(this)
    goToCreationPage = this.goToCreationPage.bind(this)
    renderInfo = this.renderInfo.bind(this)
    changeShowSidebar = this.changeShowSidebar.bind(this)
    getProvider = this.getProvider.bind(this)
    getNeftCollection = this.getNeftCollection.bind(this)
    setProvider = this.setProvider.bind(this)
    setSigner = this.setSigner.bind(this)
    setAddress = this.setAddress.bind(this)
    setChainid = this.setChainid.bind(this)
    sendProvider = this.sendProvider.bind(this)
    removeProvider = this.removeProvider.bind(this)

    render() {
        return (
            <div>
                <Header 
                    userName={this.state.auth ? this.state.auth.name : null} 
                    showSidebar={this.state.showSidebar} 
                    changeShowSidebar={this.changeShowSidebar}
                    notifications={switcher.notifications} 
                    settings={switcher.settings} 
                    onSwitch={this.onSwitch}
                    getProvider={this.getProvider}
                    sendProvider={this.sendProvider}
                    removeProvider={this.removeProvider}
                    setChainid={this.setChainid} 
                    setProvider={this.setProvider} 
                    setSigner={this.setSigner} 
                    setAddress={this.setAddress}
                    >
                    </Header>
                <div className="middle">
                    <>
                        {
                        this.state.showSidebar ? <Sidebar switcher={switcher} currentSwitch={this.state.switcher} onSwitch={this.onSwitch} changeShowSidebar={this.changeShowSidebar}></Sidebar>  : null  
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
                    </>
                </div>
            </div>
        )
    }

}

export default MainScreen