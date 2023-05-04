import { Component } from "react";
import '../styles/rewards.css'
import { ethers } from "ethers";
import { createLongStrView } from "../utils/longStrView";
import { getBearerHeader } from "../utils/getBearerHeader";
import { config } from "../utils/config";
import ERC20Mintable from '../contracts/erc20/ERC20Mintable.json'
import ERC721Mintable from '../contracts/erc721/ERC721Mintable.json'

const types = {
    token: 'token',
    nft: 'nft'
}

class Rewards extends Component {

    constructor() {
        super()
        this.state = {
            chosen_type: types.token,
            chosen_token: null,
            chosen_nft: null,
            chosen_user: null,
            provider: null,
            chainid: null,
            signer: null,
            address: null,
            amount: null,
            tokens: [],
            nfts: [],
            users: []
        }
    }

    async componentDidMount() {
        await this.getTokens()
        await this.getNFTs()
        await this.getUsers()
    }

    async getTokens() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow',
                referrerPolicy: "unsafe_url"
              };
            const res = await fetch(`${config.api}/tokens`, requestOptions)
            const json = await res.json()
            const tokens = json.tokens.map(v => <option value={v.address}>{v.symbol}</option>)
            this.setState({
                tokens,
                chosen_token: json.tokens.length > 0 ? json.tokens[0].address : null
            })
        } catch (error) {
            alert(error)
        }
    }

    async getNFTs() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow',
                referrerPolicy: "unsafe_url"
              };
            const res = await fetch(`${config.api}/nfts`, requestOptions)
            const json = await res.json()
            const nfts = json.nfts.map(v => <option value={v.address}>{v.symbol}</option>)
            this.setState({
                nfts,
                chosen_nft: json.nfts.length > 0 ? json.nfts[0].address : null
            })
        } catch (error) {
            alert(error)
        }
    }

    async getUsers() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow',
                referrerPolicy: "unsafe_url"
              };
            const res = await fetch(`${config.api}/users`, requestOptions)
            const json = await res.json()
            const users = json.users.map(v => <option value={v.address}>{v.firstname}</option>)
            this.setState({
                users,
                chosen_user: json.users.length > 0 ? json.users[0].wallet : null
            })
        } catch (error) {
            alert(error)
        }
    }

    async connect() {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum)
            await provider.send("eth_requestAccounts", [])
            const signer = await provider.getSigner()
            const chainid = (await provider.getNetwork()).chainId
            this.setState({
                provider,
                signer,
                address: signer.address,
                chainid
            })
        } catch (error) {
            alert(error)
        }
    }

    async mint() {
        try {
            if (this.state.chosen_type === types.token) {
                const tokenContract = new ethers.Contract(this.state.chosen_token, ERC20Mintable.abi, this.state.signer)
                tokenContract
                    .mint(this.state.chosen_user, ethers.parseEther(this.state.amount))
                    .then(async (tx) => await tx.wait())
                    .then(() => alert('Done'))
            } else {
                const nftContract = new ethers.Contract(this.state.chosen_nft, ERC721Mintable.abi, this.state.signer)
                nftContract
                    .safeMint(this.state.chosen_user)
                    .then(async (tx) => await tx.wait())
                    .then(() => alert('Done'))
            }
        } catch (error) {
            alert(error)
        }
    }

    changeType(event) {
        this.setState({
            chosen_type: event.target.value
        })
    }

    changeToken(event) {
        this.setState({
            chosen_token: event.target.value
        })
    }

    changeNFT(event) {
        this.setState({
            chosen_nft: event.target.value
        })
    }

    changeUser(event) {
        this.setState({
            chosen_user: event.target.value
        })
    }

    changeAmount(event) {
        this.setState({
            amount: event.target.value
        })
    }

    connect = this.connect.bind(this)
    changeType = this.changeType.bind(this)
    getTokens = this.getTokens.bind(this)
    getNFTs = this.getNFTs.bind(this)
    getUsers = this.getUsers.bind(this)
    changeToken = this.changeToken.bind(this)
    changeNFT = this.changeNFT.bind(this)
    changeUser = this.changeUser.bind(this)
    changeAmount = this.changeAmount.bind(this)
    mint = this.mint.bind(this)

    render() {
        return (
            <div>
                <h3>Rewards</h3>
                <button onClick={this.connect} type="button" className="btn btn-success">{this.state.address ? createLongStrView(this.state.address) : 'Connect'}</button>
                <div className="rewards-select">
                    <div className="form-floating">
                        <select onChange={this.changeType} className="form-select" id="floatingSelect" aria-label="Floating label select example">
                            <option value={types.token}>Token</option>
                            <option value={types.nft}>NFT</option>
                        </select>
                        <label htmlFor="floatingSelect">Choose type</label>
                    </div>
                    <div className="form-floating">
                        <select onChange={this.state.chosen_type === types.token ? this.changeToken : this.changeNFT} disabled={this.state.chosen_type ? false : true} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                            {
                                this.state.chosen_type === types.token
                                ?
                                this.state.tokens
                                :
                                this.state.nfts
                            }
                        </select>
                        <label htmlFor="floatingSelectDisabled">Choose {this.state.chosen_type}</label>
                    </div>
                    <div className="form-floating">
                        <select onChange={this.changeUser} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                            {
                                this.state.users
                            }
                        </select>
                        <label htmlFor="floatingSelectDisabled">Choose user</label>
                    </div>
                </div>
                <div className="input-group mb-3">
                    <input onChange={this.changeAmount} style={{display: this.state.chosen_type === types.token ? 'block' : 'none'}} type="number" className="form-control" placeholder="Amount" aria-label="amount" aria-describedby="basic-addon1"/>
                </div>
                <button onClick={this.mint} type="button" disabled={(this.state.address) ? false : true} className="btn btn-primary">Mint</button>
            </div>
        )
    }
}

export default Rewards