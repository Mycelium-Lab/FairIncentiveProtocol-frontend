import { Component } from "react";
import Modal from 'react-bootstrap/Modal';
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
            show: false,
            showReward: false,
            name: null,
            description: null,
            tokenRewards: [],
            tokens: [],
            nfts: [],
            users: [],
            reward_name: null
        }
    }

    async componentDidMount() {
        
        await    this.getTokens()
        await    this.getNFTs()
        await    this.getUsers()
        await    this.getTokenRewards()
        
    }

    async getTokens() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
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
                redirect: 'follow'
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
                redirect: 'follow'
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

    async getTokenRewards() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/rewards/get/token`, requestOptions)
            const json = await res.json()
            this.setState({
                tokenRewards: json.tokenRewards
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

    async rewardToken() {
        try {
            const { chosen_token, name, description, amount } = this.state
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())

            const raw = JSON.stringify(
                {
                    name, 
                    description,
                    address: chosen_token,
                    amount
                }
            );
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/rewards/add/token`, requestOptions)
            const json = await res.json()
            if (res.status === 200) {
                const tokenRewards = this.state.tokenRewards
                tokenRewards.push(json.createdTokenReward)
                this.setState({
                    tokenRewards,
                    show: false,
                    amount: null,
                    name: null,
                    description: null
                })
            } else alert('Something went wrong')
        } catch (error) {
            alert(error)
        }
    }

    async deleteReward(id) {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())

            const raw = JSON.stringify(
                {
                    id
                }
            );
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/rewards/delete/token`, requestOptions)
            const json = await res.json()
            if (res.status !== 200) alert('Something went wrong')
            else {
                const tokenRewards = this.state.tokenRewards.filter(v => v.id != id)
                this.setState({
                    tokenRewards
                })
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

    changeName(event) {
        this.setState({
            name: event.target.value
        })
    }

    changeDescription(event) {
        this.setState({
            description: event.target.value
        })
    }

    handleClose = () => this.setState({show: false});
    handleShow = () => this.setState({show: true});
    handleCloseReward = () => this.setState({showReward: false})
    handleShowReward = (reward_name) => this.setState({showReward: true, reward_name})

    connect = this.connect.bind(this)
    changeType = this.changeType.bind(this)
    getTokens = this.getTokens.bind(this)
    getNFTs = this.getNFTs.bind(this)
    getUsers = this.getUsers.bind(this)
    getTokenRewards = this.getTokenRewards.bind(this)
    changeToken = this.changeToken.bind(this)
    changeNFT = this.changeNFT.bind(this)
    changeUser = this.changeUser.bind(this)
    changeAmount = this.changeAmount.bind(this)
    changeName = this.changeName.bind(this)
    changeDescription = this.changeDescription.bind(this)
    mint = this.mint.bind(this)
    handleClose = this.handleClose.bind(this)
    handleShow = this.handleShow.bind(this)
    rewardToken = this.rewardToken.bind(this)
    deleteReward = this.deleteReward.bind(this)

    render() {
        return (
            <div>
                <div className="rewards-header">
                    <h3>Rewards</h3>
                    <button type="button" className="btn btn-dark" onClick={this.handleShow}>Create new reward</button>
                </div>
                <Modal show={this.state.show} onHide={this.handleClose} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Create new reward</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div class="mb-3">
                            <label class="form-label">Name</label>
                            <div class="input-group">
                                <input type="text" placeholder="My first reward" onChange={this.changeName} class="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                            <div class="form-text" id="basic-addon4">Specify the name of your reward. <b>User will see this</b></div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <div class="input-group">
                                <textarea placeholder="Reward description" type="text" onChange={this.changeDescription} class="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"></textarea>
                            </div>
                            <div class="form-text" id="basic-addon4"><b>User will see this.</b> <a href="https://www.markdownguide.org/cheat-sheet/" target="blank">Markdown</a> syntax is supported.</div>
                        </div>
                        <label class="form-label">Choose a reward mode:</label>
                        <div className="choose-reward-node">
                            <div class="form-check">
                                <input 
                                    class="form-check-input" value={types.token} type="radio" name="flexRadioDefault" id="flexRadioDefault1" 
                                    onChange={this.changeType} checked={this.state.chosen_type === types.token ? true : false}/>
                                <label class="form-check-label" for="flexRadioDefault1">
                                    Tokens
                                </label>
                            </div>
                            <div class="form-check">
                                <input 
                                    class="form-check-input" value={types.nft} type="radio" name="flexRadioDefault" id="flexRadioDefault2" 
                                    onChange={this.changeType} checked={this.state.chosen_type === types.nft ? true : false}
                                    disabled
                                />
                                <label class="form-check-label" for="flexRadioDefault2">
                                    NFTs
                                </label>
                            </div>
                        </div>
                        <label class="form-label">Select {this.state.chosen_type === types.token ? 'token' : 'NFT collection'}:</label>
                        <div className="input-group mb-3">
                            <select onChange={this.state.chosen_type === types.token ? this.changeToken : this.changeNFT} disabled={this.state.chosen_type ? false : true} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                {
                                    this.state.chosen_type === types.token
                                    ?
                                    this.state.tokens
                                    :
                                    this.state.nfts
                                }
                            </select>
                        </div>
                        {
                            this.state.chosen_type === types.token
                            ?
                            <div>
                                <label class="form-label">Amount</label>
                                <div class="input-group mb-3">
                                    <input type="number" class="form-control" onChange={this.changeAmount} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                                </div>
                            </div>
                            :
                            <div>
                                <label class="form-label">Token ID</label>
                                <div class="input-group mb-3">
                                    <input type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                                </div>
                            </div>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn-dark" onClick={this.rewardToken}>
                        Create
                    </button>
                    <button className="btn btn-light" onClick={this.handleClose}>
                        Cancel
                    </button>
                    </Modal.Footer>
                </Modal>
                <div>
                    <ul className="list-group list-group-flush">
                        <ul className="list-group list-group-horizontal">
                            <li className="list-group-item">
                                Name
                            </li>
                            <li className="list-group-item">
                                Description
                            </li>
                            <li className="list-group-item">
                                Address
                            </li>
                            <li className="list-group-item">
                                Amount
                            </li>
                        </ul>
                        {
                            this.state.tokenRewards.map(v =>
                            <ul className="list-group list-group-horizontal">
                                <li className="list-group-item">
                                    {v.name}
                                </li>
                                <li className="list-group-item">
                                    {v.description}
                                </li>
                                <li className="list-group-item">
                                    {v.address}
                                </li>
                                <li className="list-group-item">
                                    {v.amount}
                                </li>
                                <li className="list-group-item">
                                    <button className="btn btn-dark">Edit</button>
                                    <button className="btn btn-dark">Stat</button>
                                    <button className="btn btn-dark" onClick={() => this.handleShowReward(v.name)}>Reward</button>
                                    <button className="btn btn-danger" onClick={() => this.deleteReward(v.id)}>Delete</button>
                                </li>
                            </ul>
                            )
                        }
                    </ul>
                </div>
                <Modal show={this.state.showReward} onHide={this.handleCloseReward} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Rewarding {this.state.reward_name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div class="mb-3">
                            <label class="form-label">Select user</label>
                            <select onChange={this.changeUser} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                {
                                    this.state.users
                                }
                            </select>
                            <div class="form-text" id="basic-addon4">Select the user you would like to reward</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Comment:</label>
                            <textarea class="form-control" placeholder="Reward comment(optional)" aria-label="With textarea"></textarea>
                            <div class="form-text" id="basic-addon4">The user does not see this text. Markdown syntax is supported.</div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn-dark">
                        Reward
                    </button>
                    <button className="btn btn-light" onClick={this.handleCloseReward}>
                        Cancel
                    </button>
                    </Modal.Footer>
                </Modal>
                {/* <button onClick={this.connect} type="button" className="btn btn-success">{this.state.address ? createLongStrView(this.state.address) : 'Connect'}</button>
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
                <button onClick={this.mint} type="button" disabled={(this.state.address) ? false : true} className="btn btn-primary">Mint</button> */}
            </div>
        )
    }
}

export default Rewards