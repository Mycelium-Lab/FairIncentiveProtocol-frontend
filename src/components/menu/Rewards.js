import { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import { ethers, utils } from "ethers";
import { createLongStrView } from "../../utils/longStrView";
import { getBearerHeader } from "../../utils/getBearerHeader";
import { config } from "../../utils/config";
import ERC20Mintable from '../../contracts/erc20/ERC20Mintable.json'
import ERC721Mintable from '../../contracts/erc721/ERC721Mintable.json'
import filter from '../../media/common/filter.svg'
import close from '../../media/common/close.svg'
import more from '../../media/common/more.svg'
import info from '../../media/common/info-small.svg'
import drug_drop from '../../media/common/drug&drop.svg'
import { rewardsTable } from "../../data/tables";
import FPTable from "../common/FPTable";
import FPDropdown from "../common/FPDropdown";
import { Dropdown } from "react-bootstrap";
import LineChart from "../charts/LineChart";
import BarChart from "../charts/BarChart";
import { newUser } from "../../data/data";
import loader from '../../media/common/loader.svg'

import total from '../../media/dashboard/total_rewards.svg'
import rewarded from '../../media/dashboard/rewarded.svg'
import newRewards from '../../media/dashboard/new_rewards.svg'
import SuccessModal from "../common/modals/success";

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
            showDelete: false,
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
            reward_nft_name: null,
            showFilter: false,
            showSuccess: false,
            successName: null,
            hasLoad: false,
            newUserData: {
                    labels: newUser.map(data => data.time),
                    datasets: [{
                        data: newUser.map(data => data.amount),
                        backgroundColor: ['rgba(255, 159, 67, 0.85)'],
                    }]
            },
            totalUserData: {
                    labels: newUser.map(data => data.time),
                    datasets: [{
                        data: newUser.map(data => data.amount),
                        borderColor: ['rgba(255, 159, 67, 0.85)'],
                    }]
            },
            combinedRewards: [],
            toRewardNftId: null
        }
    }

    async componentDidMount() {
        this.setState({
            hasLoad: true
        })
        try{
            await this.getTokens()
            await this.getUsers()
            await this.getTokenRewards()
            await this.getNFTRewards()
            this.getNFTCollections().then(async () => await this.getNFTs())
        }
        catch(e) {
            console.error(e)
        }
        finally{ 
            this.setState({
                hasLoad: false,
                combinedRewards: [...this.state.tokenRewards, ...this.state.nftRewards]
            })
        }
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
                tokens: json.body.data,
                chosen_token: json.body.data.length > 0 ? json.body.data[0].address : null
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
                nftCollections: json.body.data,
                chosen_nft_collection: json.body.data.length > 0 ? json.body.data[0].address : null
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
            const current_nfts = this.state.chosen_nft_collection ? json.body.data.find(v => v.collection_address === this.state.chosen_nft_collection).nfts : []
            const chosen_nft = current_nfts[0] ? current_nfts[0].id : null
            this.setState({
                nfts: json.body.data,
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
            const users = json.body.data.map(v => <option value={v.id}>{v.external_id}</option>)
            this.setState({
                users,
                chosen_user: json.body.data.length > 0 ? json.body.data[0].id : null
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
                tokenRewards: json.body.data
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
                nftRewards: json.body.data
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
                json.body.data.count = 0
                tokenRewards.push(json.body.data)
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
                json.body.data.count = 0
                nftRewards.push(json.body.data)
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
                this.handleCloseDelete()
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
                this.handleCloseDelete()
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
            if (res.status === 200) {
                let tokenRewards = this.state.combinedRewards
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
            if (res.status === 200) {
                let nftRewards = this.state.combinedRewards
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
                    amount: ethers.utils.parseEther(reward_amount.toString()).toString()
                }
            } else {
                rawJSON = {
                    id: reward_id,
                    name: reward_name,
                    description: reward_description,
                    nft_id: reward_nft_id
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
            if(res.status === 200) {
                if (reward_type === types.token) {
                    let tokenRewards = this.state.tokenRewards
                    tokenRewards.forEach(v => {
                        if (v.id == reward_id) {
                            v.name = reward_name
                            v.description = reward_description
                            v.amount = ethers.utils.parseEther(reward_amount.toString()).toString()
                            v.symbol = reward_symbol
                            v.address = reward_token
                        }}
                    )
                    this.setState({
                        showEditReward: false,
                        showSuccess: true,
                        successName: `The "${this.state.tokenRewards.find(v => v.id === reward_id).name}" event was successfully edited`
                    })
                } else {
                    let nftRewards = this.state.nftRewards
                    nftRewards.forEach(v => {
                        if (v.id === reward_id) {
                            v.name = reward_name
                            v.description = reward_description
                            v.symbol = reward_symbol
                            v.address = reward_token
                            v.nft_name = reward_nft_name 
                            v.nft_id = reward_nft_id
                        }
                    })
                    this.setState({
                        showEditReward: false,
                        showSuccess: true,
                        successName: `The "${this.state.nftRewards.find(v => v.id === reward_id).name}" event was successfully edited`
                    })
                }
            }
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
        const current_nfts = this.state.nfts.find(v => v.collection_address === event.target.value).nfts
        this.setState({
            chosen_nft_collection: event.target.value,
            current_nfts: current_nfts,
            chosen_nft: current_nfts ? current_nfts[0].id : null 
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
            const _nfts = this.state.nfts.find(v => v.collection_address === event.target.value)
            current_nfts = {
                current_nfts: _nfts ? _nfts.nfts : [],
                reward_nft_id: _nfts ? _nfts.nfts[0].id : null,
                reward_nft_name: _nfts ? _nfts.nfts[0].name : null
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
            reward_nft_name: this.state.nfts.find(v => v.collection_address === this.state.reward_token).nfts.find(v => v.id === event.target.value).name
        })
    }

    async changeTokenRewardStatus(reward_id, status) {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())
            const raw = JSON.stringify({
                reward_id,
                status: status === 0 ? 1 : 0
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/rewards/update/status/token`, requestOptions)
            if (res.status === 200) {
                const combinedRewards = this.state.combinedRewards
                combinedRewards.forEach(v => {if (v.id === reward_id) v.status = status === 0 ? 1 : 0})
                this.setState({combinedRewards})
            }
        } catch (error) {
            alert('Something went wrong')
        }
    }

    async changeNFTRewardStatus(reward_id, status) {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())
            const raw = JSON.stringify({
                reward_id,
                status: status === 0 ? 1 : 0
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/rewards/update/status/nft`, requestOptions)
            if (res.status === 200) {
                const combinedRewards = this.state.combinedRewards
                combinedRewards.forEach(v => {if (v.id === reward_id) v.status = status === 0 ? 1 : 0})
                this.setState({combinedRewards})
            }
        } catch (error) {
            alert('Something went wrong')
        }
    }

    handleCloseStats = () => this.setState({showStats: false});
    handleShowStats = (reward_name) => this.setState({showStats: true, reward_name});

    handleClose = () => this.setState({show: false});
    handleShow = () => this.setState({show: true});
    handleCloseReward = () => this.setState({showReward: false})
    handleShowReward = (reward_name, reward_id, nft_id) => this.setState({showReward: true, reward_name, reward_id, toRewardNftId: nft_id})
    handleShowEditReward = (
        reward_name, reward_id, reward_count, 
        reward_description, reward_amount, reward_type, 
        reward_token, reward_nft_id, reward_symbol,
        reward_nft_name) => {
        let current_nfts = {}
        if (reward_type === types.nft) {
            current_nfts = {
                current_nfts: this.state.nfts.find(v => v.collection_address === reward_token).nfts
            }
        }
        this.setState(
            {   
                showEditReward: true, 
                reward_name, 
                reward_id,
                reward_count,
                reward_description,
                reward_amount: reward_amount ? parseFloat(ethers.utils.formatEther(reward_amount)) : '0',
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
    handleCloseSuccess = () => this.setState({showSuccess: false})

    handleShowDelete = (reward_type, reward_id, reward_name) => this.setState({showDelete: true, reward_id, reward_name, reward_type})
    handleCloseDelete = () => this.setState({showDelete: false, reward_name: null, reward_id: null, reward_type: null})

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
    handleShowDelete = this.handleShowDelete.bind(this)
    handleCloseDelete = this.handleCloseDelete.bind(this)
    changeTokenRewardStatus = this.changeTokenRewardStatus.bind(this)
    changeNFTRewardStatus = this.changeNFTRewardStatus.bind(this)
    saveEdit = this.saveEdit.bind(this)
    handleCloseSuccess = this.handleCloseSuccess.bind(this)

    render() {
        return (
            <>
                <div className="title-header">
                    <h3 className="menu__title">Rewards</h3>
                    <button  type="button" className="btn btn_orange btn_primary" onClick={this.handleShow}>Create new reward</button>
                </div>
                <div className="input-group__serach">
                    <button  type="button" className="btn btn_orange btn_image btn_primary" onClick={() => this.setState({showFilter: !this.state.showFilter})}>
                        {
                            this.state.showFilter 
                            ? <img className="close__image" src={close} ></img>
                            : <img className="filter__image" src={filter} ></img>
                        }
                    </button>
                    <div className="input-group search-input_rewards search-input">
                        <input type="text" placeholder="Search..." className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                    </div>
                </div>
                {
                     this.state.hasLoad ?  <img className="modal__loader_view modal__loader" src={loader}></img>
                     : 
                     <>
                        {
                    this.state.showFilter 
                    ? <div>
                            <div className="input-group_filter input-group">
                                <input type="text" placeholder="Name" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                <input type="text" placeholder="Name" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                <select className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                    <option value='Status'>Status</option>
                                    <option value='Name'>Name</option>
                                    <option value='Reward'>Reward</option>
                                </select>
                            </div>
                        </div>
                    : null
                }
                <div className="content__wrap">
                            <FPTable data={rewardsTable}>
                                {
                                    this.state.combinedRewards.map(v =>
                                 <tr>
                                          <td>   
                                                <label className="switch">
                                                    <input type="checkbox" checked={v.status == 0} onChange={() => v.nft_id ? this.changeNFTRewardStatus(v.id, v.status) : this.changeTokenRewardStatus(v.id, v.status)} role="switch"></input>
                                                    <span className="slider round"></span>
                                                </label>  
                                          </td>
                                          <td>
                                            {v.name}
                                          </td>
                                          <td>
                                            {
                                            v.nft_id
                                            ?
                                            `${v.nft_name} from ${v.symbol} collection`
                                            :
                                            `${ethers.utils.formatEther(v.amount)} ${v.symbol}`
                                            }
                                          </td>
                                          <td>
                                            {v.description ? v.description : '-'}
                                          </td>
                                          <td>
                                          {v.count}
                                          </td>
                                          <td>
                                            <FPDropdown icon={more}>
                                                <Dropdown.Item className="dropdown__menu-item" onClick={() => this.handleShowStats(v.name)}>Stat</Dropdown.Item>
                                                <Dropdown.Item className="dropdown__menu-item" onClick={() => this.handleShowEditReward(v.name, v.id, v.count, v.description, v.amount, v.nft_id ? types.nft :types.token, v.address, undefined, v.symbol)}>Edit</Dropdown.Item>
                                                <Dropdown.Item className="dropdown__menu-item" onClick={() => this.handleShowReward(v.name, v.id, v.nft_id)} disabled={v.status}>To reward</Dropdown.Item>
                                                <Dropdown.Item className="dropdown__menu-item" onClick={() => this.handleShowDelete(v.nft_id ? types.nft : types.token, v.id, v.name)}>Delete</Dropdown.Item>
                                            </FPDropdown>
                                              {/*
                                              <button className="btn btn-dark" onClick={() => this.handleShowMint(v.symbol, v.address, v.chainid)} disabled={v.supply_type == 1 ? true : false}>Mint</button>
                                              <button className="btn btn-dark" disabled>Roles control</button>
                                              <button className="btn btn-dark" onClick={() => this.handleShowPause(v.symbol, v.address, v.chainid)} disabled={!v.pausable}>{v.paused ? "Unpause" : "Pause"}</button>
                                              <button className="btn btn-dark" onClick={() => this.handleShowBlacklist(v.symbol, v.address, v.chainid)} disabled={!v.blacklist}>Blacklist</button>
                                              <button className="btn btn-dark" onClick={() => this.handleShowBurn(v.symbol, v.address, v.chainid)} disabled={!v.burnable}>Burn</button>
                                              <button className="btn btn-dark" disabled>Token info</button>
                                            */}
                                          </td>
                                      </tr>
                                    )
                              }
                            </FPTable>
                </div>

              
                {/*<div>
                    <button type="button" className={this.state.switcher === types.token ? "btn btn-dark" : "btn btn-light"} onClick={() => this.setState({switcher: types.token})}>Token rewards</button>
                    <button type="button" className={this.state.switcher === types.nft ? "btn btn-dark" : "btn btn-light"} onClick={() => this.setState({switcher: types.nft})}>NFT rewards</button>
                </div>*/}



                <Modal show={this.state.show} onHide={this.handleClose} centered>
                <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                        Create new reward
                    </Modal.Header>
                    <Modal.Body>
                

                    <div className="form_row  mb-4">
                     <div className="form_col_last form_col">
                        <label className="form__label">Name:</label>
                                <div className="input-group">
                                    <input type="text" value={this.state.reward_name} placeholder="e.g. My fisrt reward" onChange={this.changeName} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                                <div className="form__prompt" id="basic-addon4">Specify the name of your reward. <b>User will see this</b></div>
                     </div>
                           
                    </div>

                    <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                <label className="form__label">Description: <img className="form__icon-info" src={info}/></label>
                                    <div className="input-group">
                                    <textarea placeholder="Reward description" type="text" onChange={this.changeDescription} id="basic-url" aria-describedby="basic-addon3 basic-addon4"  className="form__textarea form__textarea_desct-nft-collection"  aria-label="With textarea"></textarea>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4"><b>User will see this.</b> <a className="link__form-prompt" href="https://www.markdownguide.org/cheat-sheet/" target="blank">Markdown</a> syntax is supported.</div>
                                </div>
                    </div>

                
                    <div className="form_row  mb-4">
                                    <div className="form_col">
                                    <label className="form__label">Choose a reward mode:</label>
                                        <div className="input-group">
                                        <div className="form-check custom-control custom-radio custom-control-inline">
                                            <input  
                                            checked={this.state.chosen_type === types.token ? true : false}
                                            onChange={this.changeType} 
                                            type="radio" id="rd_1" name="rd" value={types.token}/>
                                            <label className="form-check-label custom-control-label green" for="rd_1">
                                            Tokens <img src={info} className="form__icon-info"/>
                                            </label>
                                        </div>
                                        <div className="form-check custom-control custom-radio custom-control-inline ms-3">
                                            <input 
                                                checked={this.state.chosen_type === types.nft ? true : false}
                                              onChange={this.changeType} 
                                            type="radio" id="rd_2" name="rd" value={types.nft} />
                                            <label className="form-check-label custom-control-label red" for="rd_2">
                                            NFTs <img src={info} className="form__icon-info"/>
                                            </label>
                                        </div>
                                        </div>   
                                    </div>
                    </div>   


                     <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                    <label  className="form__label">Select {this.state.chosen_type === types.token ? 'token' : 'NFT collection'}:<img className="form__icon-info" src={info}/> </label>
                                    <div className="input-group">
                                        <select onChange={this.changeRewardToken} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                        {
                                            this.state.chosen_type === types.token
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
                                        this.state.chosen_type === types.token
                                        ? <div className="form__prompt" id="basic-addon4">Select the token to reward users with</div>
                                        : <div className="form__prompt" id="basic-addon4">Select the NFT collection to reward users with</div>
                                    }
                                </div>
                         </div>                             
                        {
                           this.state.chosen_type === types.token
                            ?
                            <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                    <label className="form__label" style={this.state.reward_count != 0 ? {color: "grey"}: null}>Amount: <img className="form__icon-info" src={info}/> </label>
                                    <div className="input-group">
                                        <input type="number" className="form-control" onChange={this.changeAmount} placeholder="e.g. 5" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4">Enter the amount of tokens for each reward</div>
                                </div>
                            </div>
                            :
                            <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                    <label className="form__label">Select token from collection: <img className="form__icon-info" src={info}/></label>
                                        <select onChange={this.changeChosenRewardNFT} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                         {
                                            this.state.current_nfts 
                                            ?
                                            this.state.current_nfts.map(v => {
                                                if (v.id === this.state.reward_nft_id) {
                                                    return <option value={v.id} selected>{v.name}</option>
                                                }
                                                return <option value={v.id}>{v.name}</option>
                                            }
                                            )
                                            :
                                            null
                                        }
                                        </select>
                                        <div className="form__prompt" id="basic-addon4">Select the NFT to reward users with</div>
                                </div>
                            </div>
                        }

                        <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                <div className="form__group_top-row-left">
                                        <img src={drug_drop}></img>
                                            <div>
                                                <label className="form__label_group form__label">Allow a repeat reward:  <img className="form__icon-info" src={info} />
                                                </label>
                                                <div className="form__prompt" id="basic-addon4">If activated, this award can be given to each user only once</div>
                                                        </div>
                                    </div>
                                </div>
                                <label className="switch_center switch">
                                        <input type="checkbox"></input>
                                        <span className="slider round"></span>
                                    </label>  
                        </div>
                        <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                    <div className="form__group_top-row-left">
                                        <img src={drug_drop}></img>
                                            <div>
                                                <label className="form__label_group form__label">Limit the total number of rewards:  <img className="form__icon-info" src={info} />
                                                </label>
                                                <div className="form__prompt" id="basic-addon4">You can set a limit of total number of awards</div>
                                                        </div>
                                    </div>
                                </div>
                                <label className="switch_center switch">
                                            <input type="checkbox"></input>
                                            <span className="slider round"></span>
                                    </label>  
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn_primary btn_gray" onClick={this.handleClose}>
                        Cancel
                    </button>
                    <button className="btn btn_primary btn_orange" onClick={this.state.chosen_type === types.token ? this.rewardToken : this.createNFTReward}>
                        Create
                    </button>
                    </Modal.Footer>
                </Modal>

                {/*<div>
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
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" onChange={() => this.changeTokenRewardStatus(v.id, v.status)} role="switch" id="flexSwitchCheckDefault" checked={!v.status}/>
                                        </div>
                                    </td>
                                    <td className="table-secondary">
                                        {v.name}
                                    </td>
                                    <td className="table-secondary">
                                        {ethers.utils.formatEther(v.amount)} {v.symbol}
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
                                        <button className="btn btn-dark" onClick={() => this.handleShowReward(v.name, v.id)} disabled={v.status}>To reward</button>
                                        <button className="btn btn-danger" onClick={() => this.handleShowDelete(types.token, v.id, v.name)}>Delete</button>
                                    </td>
                                </tr>
                                )
                            :
                            this.state.nftRewards.map(v =>
                                <tr className="table-secondary">
                                    <td className="table-secondary">
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" onChange={() => this.changeNFTRewardStatus(v.id, v.status)} role="switch" id="flexSwitchCheckDefault" checked={!v.status}/>
                                        </div>
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
                                        <button className="btn btn-dark" onClick={() => this.handleShowReward(v.name, v.id)} disabled={v.status}>To reward</button>
                                        <button className="btn btn-danger" onClick={() => this.handleShowDelete(types.nft, v.id, v.name)}>Delete</button>
                                    </td>
                                </tr>
                                )
                        }
                    </tbody>
                </table>
                    </div>*/}
                <Modal show={this.state.showReward} onHide={this.handleCloseReward} centered>
                    <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                        Rewarding {this.state.reward_name}
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                <label className="form__label">Select user: <img className="form__icon-info" src={info}/></label>
                                    <div className="input-group ">
                                        <select onChange={this.changeUser} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                            {
                                                this.state.users
                                            }
                                        </select>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4">Select the user you would like to reward</div>
                                </div>
                         </div>

                         <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                <label className="form__label">Comment: <img className="form__icon-info" src={info}/></label>
                                    <div className="input-group ">
                                    <textarea onChange={this.changeComment} className="form__textarea form__textarea_desct-nft-collection" placeholder="Reward comment(optional)" aria-label="With textarea"></textarea>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4">The user does not see this text. <a className="link__form-prompt" href="https://www.markdownguide.org/cheat-sheet/" target="blank">Markdown</a> syntax is supported.</div>
                                </div>
                         </div>

                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn_primary btn_gray" onClick={this.handleCloseReward}>
                        Cancel
                    </button>
                    <button className="btn btn_primary btn_orange" onClick={this.state.toRewardNftId ? this.rewardWithNFT : this.rewardWithToken }>
                        Reward
                    </button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showEditReward} onHide={this.handleCloseEditReward} centered>
                <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                        Edit "{this.state.reward_name}" reward
                    </Modal.Header>
                    <Modal.Body>
                

                    <div className="form_row  mb-4">
                     <div className="form_col_last form_col">
                        <label className="form__label">Name:</label>
                                <div className="input-group">
                                    <input type="text" value={this.state.reward_name} placeholder={this.state.reward_name} onChange={this.changeRewardName} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                                <div className="form__prompt" id="basic-addon4">Specify the name of your reward. <b>User will see this</b></div>
                     </div>
                           
                    </div>

                    <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                <label className="form__label">Description: <img className="form__icon-info" src={info}/></label>
                                    <div className="input-group">
                                    <textarea value={this.state.reward_description} placeholder={this.state.reward_description} type="text" onChange={this.changeRewardDescription} id="basic-url" aria-describedby="basic-addon3 basic-addon4"  className="form__textarea form__textarea_desct-nft-collection"  aria-label="With textarea"></textarea>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4"><b>User will see this.</b> <a className="link__form-prompt" href="https://www.markdownguide.org/cheat-sheet/" target="blank">Markdown</a> syntax is supported.</div>
                                </div>
                    </div>

                
                    <div className="form_row  mb-4">
                                    <div className="form_col">
                                    <label className="form__label" style={this.state.reward_count != 0 ? {color: "grey"} : null}>Choose a reward mode:</label>
                                        <div className="input-group">
                                        <div className="form-check custom-control custom-radio custom-control-inline">
                                            <input  
                                            onChange={this.changeType} checked={this.state.reward_type === types.token ? true : false}
                                            disabled={this.state.reward_count != 0 || this.state.reward_type === types.nft ? true : false} 
                                            type="radio" id="rd_1" name="rd" value={types.token}/>
                                            <label className="form-check-label custom-control-label green" for="rd_1">
                                            Tokens <img src={info} className="form__icon-info"/>
                                            </label>
                                        </div>
                                        <div className="form-check custom-control custom-radio custom-control-inline ms-3">
                                            <input 
                                              onChange={this.changeType} checked={this.state.reward_type === types.nft ? true : false}
                                              disabled={this.state.reward_count != 0 || this.state.reward_type === types.token ? true : false}
                                            type="radio" id="rd_2" name="rd" value={types.nft} />
                                            <label className="form-check-label custom-control-label red" for="rd_2">
                                            NFTs <img src={info} className="form__icon-info"/>
                                            </label>
                                        </div>
                                        </div>   
                                    </div>
                    </div>   


                     <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                    <label style={this.state.reward_count != 0 ? {color: "grey"} : null} className="form__label">Select {this.state.chosen_type === types.token ? 'token' : 'NFT collection'}:<img className="form__icon-info" src={info}/> </label>
                                    <div className="input-group ">
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
                                    <div className="form__prompt" id="basic-addon4">Select the user you would like to reward</div>
                                </div>
                         </div>                             
                        {
                            this.state.reward_type === types.token
                            ?
                            <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                    <label className="form__label" style={this.state.reward_count != 0 ? {color: "grey"}: null}>Amount: <img className="form__icon-info" src={info}/> </label>
                                    <div className="input-group">
                                        <input style={this.state.reward_count != 0 ? {color: "grey"}: null } type="number" defaultValue={this.state.reward_amount ? this.state.reward_amount : '0'} disabled={this.state.reward_count != 0 ? true : false} className="form-control" onChange={this.changeRewardAmount} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4">Enter the amount of tokens for each reward</div>
                                </div>
                            </div>
                            :
                            <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                    <label className="form__label" style={this.state.reward_count != 0 ? {color: "grey"} : null}>NFT</label>
                                        <select style={this.state.reward_count != 0 ? {color: "grey"} : null} disabled={this.state.reward_count != 0 ? true : false} onChange={this.changeChosenRewardNFT} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                         {
                                            this.state.current_nfts 
                                            ?
                                            this.state.current_nfts.map(v => {
                                                if (v.id === this.state.reward_nft_id) {
                                                    return <option value={v.id} selected>{v.name}</option>
                                                }
                                                return <option value={v.id}>{v.name}</option>
                                            }
                                            )
                                            :
                                            null
                                        }
                                        </select>
                                </div>
                            </div>
                        }

                        <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                <div className="form__group_top-row-left">
                                        <img src={drug_drop}></img>
                                            <div>
                                                <label className="form__label_group form__label">Allow a repeat reward:  <img className="form__icon-info" src={info} />
                                                </label>
                                                <div className="form__prompt" id="basic-addon4">If activated, this award can be given to each user only once</div>
                                                        </div>
                                    </div>
                                </div>
                                <label className="switch_center switch">
                                        <input type="checkbox"></input>
                                        <span className="slider round"></span>
                                    </label>  
                        </div>
                        <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                    <div className="form__group_top-row-left">
                                        <img src={drug_drop}></img>
                                            <div>
                                                <label className="form__label_group form__label">Limit the total number of rewards:  <img className="form__icon-info" src={info} />
                                                </label>
                                                <div className="form__prompt" id="basic-addon4">You can set a limit of total number of awards</div>
                                                        </div>
                                    </div>
                                </div>
                                <label className="switch_center switch">
                                            <input type="checkbox"></input>
                                            <span className="slider round"></span>
                                    </label>  
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn_primary btn_gray" onClick={this.handleClose}>
                        Cancel
                    </button>
                    <button className="btn btn_primary btn_orange" onClick={this.saveEdit}>
                        Save
                    </button>
                    </Modal.Footer>
                </Modal>

                <Modal dialogClassName="modal__info-rewards" show={this.state.showStats} onHide={this.handleCloseStats} centered>
                    <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                        {`"${this.state.reward_name}" reward statistics`}
                    </Modal.Header>
                    <Modal.Body>
                    <ul className="info__list_rewards info__list unlist">
                        <li className="info__list-item_rewards info__list-item_blue info__list-item">
                            <div className="info__content_left">
                                <span className="info__content-amount">125 576</span>
                                <span className="info__content-desc">The total number of rewards</span>
                            </div>
                            <div className="info__content_right">
                                <img src={total}></img>
                            </div>
                        </li>
                        <li className="info__list-item_rewards info__list-item_light-blue info__list-item">
                            <div className="info__content_left">
                                <span className="info__content-amount">9 867</span>
                                <span className="info__content-desc">Users rewarded</span>
                            </div>
                            <div className="info__content_right">
                                <img src={rewarded}></img>
                            </div>
                        </li>
                        <li className="info__list-item_rewards info__list-item_dark-blue info__list-item">
                            <div className="info__content_left">
                                <span className="info__content-amount">7 824</span>
                                <span className="info__content-desc">Rewards in the last 24 hours</span>
                            </div>
                            <div className="info__content_right">
                            <img src={newRewards}></img>
                            </div>
                        </li>
                    </ul>
                        <div className="dashboard__chart mb-4">
                            <div className="dashboard__chart_reward">
                                <label className="chart__label">Token distribution statistic</label>
                                <div className="dashboard__chart_reward_wrapper mb-4" style={{position: 'relative', height:'356px', display: 'flex', justifyContent: 'center'}}>
                                    <LineChart chartData={this.state.totalUserData}></LineChart>
                                </div>
                            </div>
                            <div className="dashboard__chart_reward">
                                <label className="chart__label">Statistics of the amount of awards</label>
                                <div className="dashboard__chart_reward_wrapper mb-4" style={{position: 'relative', height:'356px', display: 'flex', justifyContent: 'center'}}>
                                        <BarChart chartData={this.state.newUserData}></BarChart>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal >

                <Modal show={this.state.showDelete} onHide={this.handleCloseDelete} centered>
                <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                        Delete {this.state.reward_name}?
                    </Modal.Header>
                    <Modal.Footer>
                        <button onClick={this.handleCloseDelete} className="btn btn_primary btn_gray">Cancel</button>
                        <button onClick={() => this.state.reward_type === types.token ? this.deleteReward(this.state.reward_id) : this.deleteNFTReward(this.state.reward_id)} className="btn btn_primary btn_orange">Delete</button>
                    </Modal.Footer>
                </Modal>
                <SuccessModal 
                    showSuccess={this.state.showSuccess} 
                    handleCloseSuccess={this.handleCloseSuccess}
                    successName={this.state.successName} 
                />
                     </>
                }
            </>
        )
    }
}

export default Rewards