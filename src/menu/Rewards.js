import { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import '../styles/rewards.css'
import { ethers, utils } from "ethers";
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
            switcher: types.token,
            chosen_token: null,
            chosen_nft_collection: null,
            chosen_nft: null,
            chosen_user: null,
            provider: null,
            chainid: null,
            signer: null,
            address: null,
            amount: null,
            show: false,
            showReward: false,
            showEditReward: false,
            name: null,
            description: null,
            comment: null,
            tokenRewards: [],
            nftRewards: [],
            tokens: [],
            nftCollections: [],
            nfts: {},
            current_nfts: [],
            users: [],
            reward_name: null,
            reward_id: null,
            reward_count: null,
            reward_description: null,
            reward_amount: null,
            reward_type: null,
            reward_token: null,
            reward_nft_id: null,
            reward_symbol: null,
            reward_nft_name: null
        }
    }

    async componentDidMount() {
        
        await this.getTokens()
        await this.getUsers()
        await this.getTokenRewards()
        await this.getNFTRewards()
        
        this.getNFTCollections().then(async () => await this.getNFTs())
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
            this.setState({
                tokens: json.tokens,
                chosen_token: json.tokens.length > 0 ? json.tokens[0].address : null
            })
        } catch (error) {
            console.log(error)
        }
    }

    async getNFTCollections() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/nfts/collections`, requestOptions)
            const json = await res.json()
            this.setState({
                nftCollections: json.nftCollections,
                chosen_nft_collection: json.nftCollections.length > 0 ? json.nftCollections[0].address : null
            })
        } catch (error) {
            console.log(error)
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
            const res = await fetch(`${config.api}/nfts/nfts`, requestOptions)
            const json = await res.json()
            const current_nfts = this.state.chosen_nft_collection ? json.nfts[this.state.chosen_nft_collection] : []
            const chosen_nft = current_nfts[0] ? current_nfts[0].nft_id : null
            this.setState({
                nfts: json.nfts,
                current_nfts,
                chosen_nft
            })
        } catch (error) {
            console.log(error)
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
            const users = json.users.map(v => <option value={v.id}>{v.external_id}</option>)
            this.setState({
                users,
                chosen_user: json.users.length > 0 ? json.users[0].id : null
            })
        } catch (error) {
            console.log(error)
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
            console.log(error)
        }
    }

    async getNFTRewards() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/rewards/get/nfts`, requestOptions)
            const json = await res.json()
            this.setState({
                nftRewards: json.nftRewards
            })
        } catch (error) {
            console.log(error)
        }
    }

    async connect() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
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
            console.log(error)
        }
    }
    
    async mint() {
        try {
            if (this.state.chosen_type === types.token) {
                const tokenContract = new ethers.Contract(this.state.chosen_token, ERC20Mintable.abi, this.state.signer)
                tokenContract
                    .mint(this.state.chosen_user, ethers.utils.parseEther(this.state.amount))
                    .then(async (tx) => await tx.wait())
                    .then(() => alert('Done'))
            } else {
                const nftContract = new ethers.Contract(this.state.chosen_nft_collection, ERC721Mintable.abi, this.state.signer)
                nftContract
                    .safeMint(this.state.chosen_user)
                    .then(async (tx) => await tx.wait())
                    .then(() => alert('Done'))
            }
        } catch (error) {
            console.log(error)
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
                    amount: utils.parseEther(amount).toString()
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
                json.createdTokenReward.count = 0
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
            console.log(error)
        }
    }
    
    async createNFTReward() {
        try {
            const { chosen_nft, name, description } = this.state
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())
            const raw = JSON.stringify({
                "nft_id": chosen_nft,
                "name": name,
                "description": description
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/rewards/add/nft`, requestOptions)
            const json = await res.json()
            if (res.status === 200) {
                const nftRewards = this.state.nftRewards
                json.createdNFTReward.count = 0
                nftRewards.push(json.createdNFTReward)
                this.setState({
                    nftRewards,
                    show: false,
                    amount: null,
                    name: null,
                    description: null
                })
                alert('Done')
            }
            else alert('Something went wrong')
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
            console.log(error)
        }
    }

    async deleteNFTReward(id) {
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
            const res = await fetch(`${config.api}/rewards/delete/nfts`, requestOptions)
            const json = await res.json()
            if (res.status !== 200) alert('Something went wrong')
            else {
                const nftRewards = this.state.nftRewards.filter(v => v.id != id)
                this.setState({
                    nftRewards
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    async rewardWithToken() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())

            const raw = JSON.stringify(
                {
                    reward_id: this.state.reward_id,
                    user_id: this.state.chosen_user,
                    comment: this.state.comment
                }
            );
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/rewards/reward/token`, requestOptions)
            const json = await res.json()
            if (json.rewarded) {
                let tokenRewards = this.state.tokenRewards
                tokenRewards.forEach(v => {if (v.id == this.state.reward_id) v.count = parseInt(v.count) + 1})
                alert('Done')
                this.setState({
                    showReward: false
                })
            }
            else alert('Something went wrong')
        } catch (error) {
            console.log(error)
        }
    }

    async rewardWithNFT() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())
            const raw = JSON.stringify(
                {
                    reward_id: this.state.reward_id,
                    user_id: this.state.chosen_user,
                    comment: this.state.comment
                }
            );
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/rewards/reward/nft`, requestOptions)
            const json = await res.json()
            if (json.rewarded) {
                let nftRewards = this.state.nftRewards
                nftRewards.forEach(v => {if (v.id == this.state.reward_id) v.count = parseInt(v.count) + 1})
                alert('Done')
                this.setState({
                    showReward: false
                })
            }
            else alert('Something went wrong')
        } catch (error) {
            console.log(error)
        }
    }

    async saveEdit() {
        try {
            const { 
                reward_id, 
                reward_type, 
                reward_name, 
                reward_description, 
                reward_amount, 
                reward_token, 
                reward_nft_id,
                reward_symbol,
                reward_nft_name
            } = this.state
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())
            let rawJSON = {}
            if (reward_type === types.token) {
                rawJSON = {
                    id: reward_id,
                    name: reward_name,
                    description: reward_description,
                    amount: reward_amount,
                    // address: reward_token
                }
            } else {
                rawJSON = {
                    id: reward_id,
                    name: reward_name,
                    description: reward_description,
                    nft_id: reward_nft_id
                    // address: reward_token
                }
            }
            const raw = JSON.stringify(rawJSON);
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/rewards/update/${reward_type === types.token ? 'token' : 'nft'}`, requestOptions)
            const json = await res.json()
            if(res.status === 200) {
                if (reward_type === types.token) {
                    let tokenRewards = this.state.tokenRewards
                    tokenRewards.forEach(v => {
                        if (v.id == reward_id) {
                            v.name = reward_name
                            v.description = reward_description
                            v.amount = reward_amount
                            v.symbol = reward_symbol
                            v.address = reward_token
                            v.nft_id = reward_nft_id
                        }}
                    )
                    alert('Done')
                } else {
                    let nftRewards = this.state.nftRewards
                    nftRewards.forEach(v => {
                        if (v.id === reward_id) {
                            v.name = reward_name
                            v.description = reward_description
                            v.symbol = reward_symbol
                            v.address = reward_token
                            v.nft_name = reward_nft_name 
                        }
                    })
                    alert('Done')
                }
            }
            // if (json.rewarded) {
            //     let nftRewards = this.state.nftRewards
            //     nftRewards.forEach(v => {if (v.id == this.state.reward_id) v.count = parseInt(v.count) + 1})
            //     alert('Done')
            //     this.setState({
            //         showReward: false
            //     })
            // }
        } catch (error) {
            console.log(error)
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

    changeNFTCollection(event) {
        this.setState({
            chosen_nft_collection: event.target.value,
            current_nfts: this.state.nfts[event.target.value],
            chosen_nft: this.state.nfts[event.target.value] ? this.state.nfts[event.target.value][0].nft_id : null 
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

    changeChosenNFT(event) {
        this.setState({
            chosen_nft: event.target.value
        })
    }

    changeComment(event) {
        this.setState({
            comment: event.target.value
        })
    }

    changeRewardName(event) {
        this.setState({
            reward_name: event.target.value
        })
    }

    changeRewardDescription(event) {
        this.setState({
            reward_description: event.target.value
        })
    }

    changeRewardAmount(event) {
        this.setState({
            reward_amount: event.target.value
        })
    }

    changeRewardToken(event) {
        let current_nfts = {}
        if (this.state.reward_type === types.nft) {
            current_nfts = {
                current_nfts: this.state.nfts[event.target.value],
                reward_nft_id: this.state.nfts[event.target.value] ? this.state.nfts[event.target.value][0].nft_id : null,
                reward_nft_name: this.state.nfts[event.target.value] ? this.state.nfts[event.target.value][0].nft_name : null
            }
        } 
        this.setState({
            reward_token: event.target.value,
            reward_symbol: 
            this.state.reward_type === types.token
            ?
            this.state.tokens.find(v => v.address === event.target.value).symbol
            :
            this.state.nftCollections.find(v => v.address === event.target.value).symbol
            ,
            ...current_nfts
        })
    }

    changeChosenRewardNFT(event) {
        this.setState({
            reward_nft_id: event.target.value,
            reward_nft_name: this.state.nfts[this.state.reward_token].find(v => v.nft_id === event.target.value).nft_name
        })
    }

    handleClose = () => this.setState({show: false});
    handleShow = () => this.setState({show: true});
    handleCloseReward = () => this.setState({showReward: false})
    handleShowReward = (reward_name, reward_id) => this.setState({showReward: true, reward_name, reward_id})
    handleShowEditReward = (
        reward_name, reward_id, reward_count, 
        reward_description, reward_amount, reward_type, 
        reward_token, reward_nft_id, reward_symbol,
        reward_nft_name) => {
        let current_nfts = {}
        if (reward_type === types.nft) {
            current_nfts = {
                current_nfts: this.state.nfts[reward_token]
            }
        }
        this.setState(
            {   
                showEditReward: true, 
                reward_name, 
                reward_id,
                reward_count,
                reward_description,
                reward_amount,
                reward_type,
                reward_token,
                reward_nft_id,
                reward_symbol,
                reward_nft_name,
                ...current_nfts
            }
        )
    }
    handleCloseEditReward = () => this.setState({showEditReward: false})

    connect = this.connect.bind(this)
    changeType = this.changeType.bind(this)
    getTokens = this.getTokens.bind(this)
    createNFTReward = this.createNFTReward.bind(this)
    rewardWithNFT = this.rewardWithNFT.bind(this)
    getNFTCollections = this.getNFTCollections.bind(this)
    getNFTs = this.getNFTs.bind(this)
    getUsers = this.getUsers.bind(this)
    getTokenRewards = this.getTokenRewards.bind(this)
    changeToken = this.changeToken.bind(this)
    changeNFTCollection = this.changeNFTCollection.bind(this)
    changeUser = this.changeUser.bind(this)
    changeAmount = this.changeAmount.bind(this)
    changeName = this.changeName.bind(this)
    changeDescription = this.changeDescription.bind(this)
    changeRewardName = this.changeRewardName.bind(this)
    changeRewardDescription = this.changeRewardDescription.bind(this)
    changeRewardAmount = this.changeRewardAmount.bind(this)
    changeRewardToken = this.changeRewardToken.bind(this)
    changeChosenRewardNFT = this.changeChosenRewardNFT.bind(this)
    mint = this.mint.bind(this)
    handleClose = this.handleClose.bind(this)
    handleShow = this.handleShow.bind(this)
    rewardToken = this.rewardToken.bind(this)
    deleteReward = this.deleteReward.bind(this)
    deleteNFTReward = this.deleteNFTReward.bind(this)
    changeComment = this.changeComment.bind(this)
    rewardWithToken = this.rewardWithToken.bind(this)
    changeChosenNFT = this.changeChosenNFT.bind(this)
    getNFTRewards = this.getNFTRewards.bind(this)
    handleShowEditReward = this.handleShowEditReward.bind(this)
    handleCloseEditReward = this.handleCloseEditReward.bind(this)
    saveEdit = this.saveEdit.bind(this)

    render() {
        return (
            <div>
                <div className="title-header">
                    <h3>Rewards</h3>
                    <button type="button" className="btn btn-dark" onClick={this.handleShow}>Create new reward</button>
                </div>
                <div>
                    <button type="button" className={this.state.switcher === types.token ? "btn btn-dark" : "btn btn-light"} onClick={() => this.setState({switcher: types.token})}>Token rewards</button>
                    <button type="button" className={this.state.switcher === types.nft ? "btn btn-dark" : "btn btn-light"} onClick={() => this.setState({switcher: types.nft})}>NFT rewards</button>
                </div>
                <Modal show={this.state.show} onHide={this.handleClose} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Create new reward</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <div className="input-group">
                                <input type="text" placeholder="My first reward" onChange={this.changeName} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                            <div className="form-text" id="basic-addon4">Specify the name of your reward. <b>User will see this</b></div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <div className="input-group">
                                <textarea placeholder="Reward description" type="text" onChange={this.changeDescription} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"></textarea>
                            </div>
                            <div className="form-text" id="basic-addon4"><b>User will see this.</b> <a href="https://www.markdownguide.org/cheat-sheet/" target="blank">Markdown</a> syntax is supported.</div>
                        </div>
                        <label className="form-label">Choose a reward mode:</label>
                        <div className="choose-reward-node">
                            <div className="form-check">
                                <input 
                                    className="form-check-input" value={types.token} type="radio" name="flexRadioDefault" id="flexRadioDefault1" 
                                    onChange={this.changeType} checked={this.state.chosen_type === types.token ? true : false}/>
                                <label className="form-check-label" for="flexRadioDefault1">
                                    Tokens
                                </label>
                            </div>
                            <div className="form-check">
                                <input 
                                    className="form-check-input" value={types.nft} type="radio" name="flexRadioDefault" id="flexRadioDefault2" 
                                    onChange={this.changeType} checked={this.state.chosen_type === types.nft ? true : false}
                                />
                                <label className="form-check-label" for="flexRadioDefault2">
                                    NFTs
                                </label>
                            </div>
                        </div>
                        <label className="form-label">Select {this.state.chosen_type === types.token ? 'token' : 'NFT collection'}:</label>
                        <div className="input-group mb-3">
                            <select onChange={this.state.chosen_type === types.token ? this.changeToken : this.changeNFTCollection} disabled={this.state.chosen_type ? false : true} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                {
                                    this.state.chosen_type === types.token
                                    ?
                                    this.state.tokens.map(v => <option value={v.address}>{v.symbol}</option>)
                                    :
                                    this.state.nftCollections.map(v => <option value={v.address}>{v.symbol}</option>)
                                }
                            </select>
                        </div>
                        {
                            this.state.chosen_type === types.token
                            ?
                            <div>
                                <label className="form-label">Amount</label>
                                <div className="input-group mb-3">
                                    <input type="number" className="form-control" onChange={this.changeAmount} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                                </div>
                            </div>
                            :
                            <div>
                                <label className="form-label">NFT</label>
                                <select onChange={this.changeChosenNFT} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                    {
                                        this.state.current_nfts 
                                        ?
                                        this.state.current_nfts.map(v => <option value={v.nft_id}>{v.nft_name}</option>)
                                        :
                                        null
                                    }
                                </select>
                            </div>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn-dark" onClick={this.state.chosen_type === types.token ? this.rewardToken : this.createNFTReward}>
                        Create
                    </button>
                    <button className="btn btn-light" onClick={this.handleClose}>
                        Cancel
                    </button>
                    </Modal.Footer>
                </Modal>
                <div>
                <table className="table table-bordered border-dark">
                    <thead>
                        <tr className="table-secondary" >
                        <th className="table-secondary" scope="col">Status</th>
                        <th className="table-secondary" scope="col">Name</th>
                        <th className="table-secondary" scope="col">Reward</th>
                        <th className="table-secondary" scope="col">Description</th>
                        <th className="table-secondary" scope="col">Rewarded</th>
                        <th className="table-secondary" scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.switcher === types.token
                            ?
                            this.state.tokenRewards.map(v =>
                                <tr className="table-secondary">
                                    <td className="table-secondary">
                                        (soon)
                                    </td>
                                    <td className="table-secondary">
                                        {v.name}
                                    </td>
                                    <td className="table-secondary">
                                        {v.amount} {v.symbol}
                                    </td>
                                    <td className="table-secondary">
                                        {v.description}
                                    </td>
                                    <td className="table-secondary">
                                        {v.count} times
                                    </td>
                                    <td className="table-secondary">
                                        <button className="btn btn-dark" onClick={() => this.handleShowEditReward(v.name, v.id, v.count, v.description, v.amount, types.token, v.address, undefined, v.symbol)}>Edit</button>
                                        <button className="btn btn-dark" disabled>Stat</button>
                                        <button className="btn btn-dark" onClick={() => this.handleShowReward(v.name, v.id)}>Reward</button>
                                        <button className="btn btn-danger" onClick={() => this.deleteReward(v.id)}>Delete</button>
                                    </td>
                                </tr>
                                )
                            :
                            this.state.nftRewards.map(v =>
                                <tr className="table-secondary">
                                    <td className="table-secondary">
                                        (soon)
                                    </td>
                                    <td className="table-secondary">
                                        {v.name}
                                    </td>
                                    <td className="table-secondary">
                                        {v.nft_name} from {v.symbol} collection
                                    </td>
                                    <td className="table-secondary">
                                        {v.description}
                                    </td>
                                    <td className="table-secondary">
                                        {v.count} times
                                    </td>
                                    <td className="table-secondary">
                                        <button className="btn btn-dark" onClick={() => this.handleShowEditReward(v.name, v.id, v.count, v.description, null, types.nft, v.address, v.nft_id, v.symbol, v.nft_name)}>Edit</button>
                                        <button className="btn btn-dark" disabled>Stat</button>
                                        <button className="btn btn-dark" onClick={() => this.handleShowReward(v.name, v.id)} >Reward</button>
                                        <button className="btn btn-danger" onClick={() => this.deleteNFTReward(v.id)}>Delete</button>
                                    </td>
                                </tr>
                                )
                        }
                    </tbody>
                </table>
                </div>
                <Modal show={this.state.showReward} onHide={this.handleCloseReward} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Rewarding {this.state.reward_name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3">
                            <label className="form-label">Select user</label>
                            <select onChange={this.changeUser} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                {
                                    this.state.users
                                }
                            </select>
                            <div className="form-text" id="basic-addon4">Select the user you would like to reward</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Comment:</label>
                            <textarea onChange={this.changeComment} className="form-control" placeholder="Reward comment(optional)" aria-label="With textarea"></textarea>
                            <div className="form-text" id="basic-addon4">The user does not see this text. <a href="https://www.markdownguide.org/cheat-sheet/" target="blank">Markdown</a> syntax is supported.</div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn-dark" onClick={this.state.switcher === types.token ? this.rewardWithToken : this.rewardWithNFT}>
                        Reward
                    </button>
                    <button className="btn btn-light" onClick={this.handleCloseReward}>
                        Cancel
                    </button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showEditReward} onHide={this.handleCloseEditReward} centered>
                    <Modal.Header closeButton>
                        Edit "{this.state.reward_name}" reward
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <div className="input-group">
                                <input type="text" value={this.state.reward_name} placeholder={this.state.reward_name} onChange={this.changeRewardName} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                            <div className="form-text" id="basic-addon4">Specify the name of your reward. <b>User will see this</b></div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <div className="input-group">
                                <textarea value={this.state.reward_description} placeholder={this.state.reward_description} type="text" onChange={this.changeRewardDescription} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"></textarea>
                            </div>
                            <div className="form-text" id="basic-addon4"><b>User will see this.</b> <a href="https://www.markdownguide.org/cheat-sheet/" target="blank">Markdown</a> syntax is supported.</div>
                        </div>
                        <label style={this.state.reward_count != 0 ? {color: "grey"} : null} className="form-label">Choose a reward mode:</label>
                        <div className="choose-reward-node">
                            <div className="form-check">
                                <input 
                                    className="form-check-input" value={types.token} type="radio" name="flexRadioDefault" id="flexRadioDefault1" 
                                    onChange={this.changeType} checked={this.state.reward_type === types.token ? true : false}
                                    disabled={this.state.reward_count != 0 || this.state.reward_type === types.nft ? true : false}
                                    />
                                <label className="form-check-label" for="flexRadioDefault1">
                                    Tokens
                                </label>
                            </div>
                            <div className="form-check">
                                <input 
                                    className="form-check-input" value={types.nft} type="radio" name="flexRadioDefault" id="flexRadioDefault2" 
                                    onChange={this.changeType} checked={this.state.reward_type === types.nft ? true : false}
                                    disabled={this.state.reward_count != 0 || this.state.reward_type === types.token ? true : false}
                                />
                                <label className="form-check-label" for="flexRadioDefault2">
                                    NFTs
                                </label>
                            </div>
                        </div>
                        <label style={this.state.reward_count != 0 ? {color: "grey"} : null} className="form-label">Select {this.state.chosen_type === types.token ? 'token' : 'NFT collection'}:</label>
                        <div className="input-group mb-3">
                            <select style={this.state.reward_count != 0 ? {color: "grey"} : null} onChange={this.changeRewardToken} disabled={this.state.reward_count != 0 ? true : false} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                {
                                    this.state.reward_type === types.token
                                    ?
                                    this.state.tokens.map(v => {
                                        if (v.address === this.state.reward_token) {
                                            return <option value={v.address} selected>{v.symbol}</option>
                                        }
                                        return <option value={v.address}>{v.symbol}</option>
                                    })
                                    :
                                    this.state.nftCollections.map(v => {
                                        if (v.address === this.state.reward_token) {
                                            return <option value={v.address} selected>{v.symbol}</option>
                                        }
                                        return <option value={v.address}>{v.symbol}</option>
                                    })
                                }
                            </select>
                        </div>
                        {
                            this.state.reward_type === types.token
                            ?
                            <div>
                                <label style={this.state.reward_count != 0 ? {color: "grey"}: null} className="form-label">Amount</label>
                                <div className="input-group mb-3">
                                    <input style={this.state.reward_count != 0 ? {color: "grey"}: null } type="number" value={this.state.reward_amount} disabled={this.state.reward_count != 0 ? true : false} className="form-control" onChange={this.changeRewardAmount} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                                </div>
                            </div>
                            :
                            <div>
                                <label style={this.state.reward_count != 0 ? {color: "grey"} : null} className="form-label">NFT</label>
                                <select style={this.state.reward_count != 0 ? {color: "grey"} : null} disabled={this.state.reward_count != 0 ? true : false} onChange={this.changeChosenRewardNFT} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                    {
                                        this.state.current_nfts 
                                        ?
                                        this.state.current_nfts.map(v => {
                                            if (v.nft_id === this.state.reward_nft_id) {
                                                return <option value={v.nft_id} selected>{v.nft_name}</option>
                                            }
                                            return <option value={v.nft_id}>{v.nft_name}</option>
                                        }
                                        )
                                        :
                                        null
                                    }
                                </select>
                            </div>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn-dark" onClick={this.saveEdit}>
                        Save
                    </button>
                    <button className="btn btn-light" onClick={this.handleClose}>
                        Cancel
                    </button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default Rewards