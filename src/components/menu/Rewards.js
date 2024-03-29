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
import empty from "../../media/common/empty_icon.svg"
import Select from "react-select";

import total from '../../media/dashboard/total_rewards.svg'
import rewarded from '../../media/dashboard/rewarded.svg'
import newRewards from '../../media/dashboard/new_rewards.svg'
import SuccessModal from "../common/modals/success";
import ErrorModal from "../common/modals/error";
import errors from "../../errors";
import { networks, networksNames } from "../../utils/networks";
import DatePicker from "../DatePicker";
import { subDays } from "date-fns";
import { typesOfDashboard } from "../../utils/constants";

const types = {
    token: 'token',
    nft: 'nft'
}

const optionEmpty = [
    {
        "value": "Create new one",
        "label": "Create new one"
    },
]

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
            tokens: [],
            optionTokens: [],
            nftCollections: [],
            optionNftCollection: [],
            nfts: {},
            current_nfts: [],
            optionCurrentNfts: [],
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
            successTitle: null,
            successName: null,
            hasLoad: false,
            rewardRangeStat: {
                    labels: newUser.map(data => data.time),
                    datasets: [{
                        data: newUser.map(data => data.amount),
                        backgroundColor: ['rgba(255, 159, 67, 0.85)'],
                    }]
            },
            rewardDistStat: {
                    labels: newUser.map(data => data.time),
                    datasets: [{
                        data: newUser.map(data => data.amount),
                        borderColor: ['rgba(255, 159, 67, 0.85)'],
                    }]
            },
            combinedRewards: [],
            toRewardNftId: null,
            rewardForStat: null,
            rewardForStatTotal: 0,
            rewardForStatUserTotal: 0,
            rewardForStatUser24h: 0
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
                hasLoad: false
            })
        }
        if(this.props.isGoToCreationPage) {
            this.handleShow()
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
                chosen_token: json.body.data.length > 0 ? {value: json.body.data[0].address, label: `${json.body.data[0].symbol} (${networks[`${json.body.data[0].chainid}`].name})`} : null,
                optionTokens: json.body.data.map(v => ({value: v.address, label: `${v.symbol} (${networks[`${v.chainid}`].name})`}))
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
                chosen_nft_collection: json.body.data.length > 0 ? {value: json.body.data[0].address, label: `${json.body.data[0].name} (${networks[`${json.body.data[0].chainid}`].name})`} : null,
                optionNftCollection: json.body.data.map(v => ({value: v.address, label: `${v.name} (${networks[`${v.chainid}`].name})`}))
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
            const current_nfts = this.state.chosen_nft_collection ? json.body.data.find(v => v.collection_address === this.state.chosen_nft_collection.value).nfts : []
            const chosen_nft = current_nfts[0] ? current_nfts[0].id : null
            this.setState({
                nfts: json.body.data,
                current_nfts,
                chosen_nft,
                optionCurrentNfts: current_nfts.map(v => ({value: v?.id ? v?.id : null, label: v.name}))
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
             const users = json.body.data.map(v => ({value: v?.id ? v?.id : null, label: v.external_id}))
            this.setState({
                users,
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
                combinedRewards: [...json.body.data, ...this.state.combinedRewards]
            })
        } catch (error) {
            console.log(error)
        }
    }


    async getTokenRewardById(id) {
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
              const rewardById = json.body.data.filter(v => v.id === id)[0]
              let index
              for(let i = 0; i <= this.state.combinedRewards.length; i++) {
                if (this.state.combinedRewards[i].id === id) {
                    index = i
                    break
                }
            }
              const combinedRewards = this.state.combinedRewards
              combinedRewards[index] = rewardById
              this.setState({
                combinedRewards
            })
        } catch (error) {
            console.log(error)
        }
    }

    async getNFTRewardByIdFromCreate(id) {
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
            const rewardById = json.body.data.filter(v => v.id === id)
            this.setState({
                combinedRewards: [...rewardById, ...this.state.combinedRewards]
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
                combinedRewards: [...json.body.data, ...this.state.combinedRewards]
            })
        } catch (error) {
            console.log(error)
        }
    }

     async getNFTRewardById(id) {
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
            const rewardById = json.body.data.filter(v => v.id === id)[0]
            let index
            for(let i = 0; i <= this.state.combinedRewards.length; i++) {
                if (this.state.combinedRewards[i].id === id) {
                    index = i
                    break
                }
            }
            const combinedRewards = this.state.combinedRewards
            combinedRewards[index] = rewardById
            this.setState({
              combinedRewards
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
            const networkName = chosen_token.label.split('(')[1].split(')')[0]
            const _network = networksNames[`${networkName}`] 
            const raw = JSON.stringify(
                {
                    name, 
                    description,
                    address: chosen_token.value,
                    amount: utils.parseEther(amount).toString(),
                    chainid: _network.chainid
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
                const combinedRewards = this.state.combinedRewards
                json.body.data.count = 0
                combinedRewards.push(json.body.data)
                this.setState({
                    combinedRewards,
                    show: false,
                    showSuccess: true,
                    successTitle: 'Create new reward',
                    successName: `The token "${json.body.data.name}" was successfully added`,
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
                const id = json.body.data.id
                await this.getNFTRewardByIdFromCreate(id)
                json.body.data.count = 0
                this.setState({
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
                const combinedRewards = this.state.combinedRewards.filter(v => v.id != id)
                this.setState({
                    combinedRewards
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
                const combinedRewards = this.state.combinedRewards.filter(v => v.id != id)
                this.setState({
                    combinedRewards
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
                    user_id: this.state.chosen_user.value,
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
                let combinedRewards = this.state.combinedRewards
                combinedRewards.forEach(v => {if (v.id == this.state.reward_id) v.count = parseInt(v.count) + 1})
                const currentReward = combinedRewards.filter((v) => v.id === this.state.reward_id)[0]
                this.setState({
                    showReward: false,
                    showSuccess: true,
                    successTitle: 'To reward',
                    successName: `The token reward "${currentReward.name}" event was successfully added for ${this.state.chosen_user.label}`
                })
            }
            else {
                const errroMessage = json.error.message
                const parsedMessage = errors[errroMessage] ? errors[errroMessage] : errroMessage
                this.setState({
                    showError: true,
                    errorName: parsedMessage
                })
            }
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
                    user_id: this.state.chosen_user.value,
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
                let combinedRewards = this.state.combinedRewards
                combinedRewards.forEach(v => {if (v.id == this.state.reward_id) v.count = parseInt(v.count) + 1})
                const currentReward = combinedRewards.filter((v) => v.id === this.state.reward_id)[0]
                this.setState({
                    showReward: false,
                    showSuccess: true,
                    successTitle: 'To reward',
                    successName: `The NFT reward "${currentReward.nft_name}" event was successfully added for ${this.state.chosen_user.label}`
                })
            }
            else {
                const errroMessage = json.error.message
                const parsedMessage = errors[errroMessage] ? errors[errroMessage] : errroMessage
                this.setState({
                    showError: true,
                    errorName: parsedMessage
                })
            }
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
                const address = this.state.chosen_token.value
                rawJSON = {
                    id: reward_id,
                    name: reward_name,
                    description: reward_description ? reward_description : null,
                    amount: ethers.utils.parseEther(reward_amount.toString()).toString(),
                    address
                }
            } else {
                rawJSON = {
                    id: reward_id,
                    name: reward_name,
                    description: reward_description ? reward_description : null,
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
                    let combinedRewards = this.state.combinedRewards
                    combinedRewards.forEach(v => {
                        if (v.id == reward_id) {
                            v.name = reward_name
                            v.description = reward_description
                            v.amount = ethers.utils.parseEther(reward_amount.toString()).toString()
                            v.symbol = reward_symbol
                            v.address = reward_token
                        }}
                    )
                    await this.getTokenRewardById(reward_id)
                    this.handleCloseEditReward()
                    this.setState({
                        showSuccess: true,
                        successTitle: "Edit",
                        successName: `The "${this.state.combinedRewards.find(v => v.id === reward_id).name}" event was successfully edited`
                    })
                } else {
                    let combinedRewards = this.state.combinedRewards
                    combinedRewards.forEach(v => {
                        if (v.id === reward_id) {
                            v.name = reward_name
                            v.description = reward_description
                            v.symbol = reward_symbol
                            v.address = reward_token
                            v.nft_name = reward_nft_name.label
                            v.nft_id = reward_nft_id
                        }
                    })
                    await this.getNFTRewardById(reward_id)
                    this.handleCloseEditReward()
                    this.setState({
                        showEditReward: false,
                        showSuccess: true,
                        successTitle: "Edit",
                        successName: `The "${this.state.combinedRewards.find(v => v.id === reward_id).name}" event was successfully edited`
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

    changeToken(selectedOption) {
        if(selectedOption.value === 'Create new one') {
            this.props.onSwitch(this.props.switcher.tokens)
            this.props.goToCreationPage('create token')
            return 
        }
        this.setState({
            chosen_token: selectedOption
        })
    }

    changeNFTCollection(selectedOption) {
        if(selectedOption.value === 'Create new one') {
            this.props.onSwitch(this.props.switcher.nftcollection)
            this.props.goToCreationPage('create nft')
            return 
        }
        const current_nfts = this.state.nfts.find(v => v.collection_address === selectedOption.value).nfts
        this.setState({
            chosen_nft_collection: selectedOption,
            current_nfts: current_nfts,
            chosen_nft: current_nfts.length ? current_nfts[0].id : null,
            reward_nft_id: current_nfts[0]?.id ? current_nfts[0]?.id : this.state.reward_nft_id,
            reward_nft_name: current_nfts.map(v => ({value: v?.id ? v?.id : null, label: v.name}))[0],
            optionCurrentNfts: current_nfts.map(v => ({value: v?.id ? v?.id : null, label: v.name}))
        })
    }

    changeUser(selectedOption) {
        if(selectedOption.label === 'Create new one') {
            this.props.onSwitch(this.props.switcher.users)
            this.props.goToCreationPage('create user')
            return 
        }
        this.setState({
            chosen_user: selectedOption
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
        if(event.target.value === 'Create new one') {
            this.props.onSwitch(this.props.switcher.tokens)
            this.props.goToCreationPage('create token')
            return 
        }
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

    changeChosenRewardNFT(selectedOption) {
        if(selectedOption.value === 'Create new one') {
            this.props.onSwitch(this.props.switcher.nftcollection)
            this.props.goToCreationPage('create token from collection', this.state.chosen_nft_collection)
            return 
        }
        const chosenRewardNft = this.state.nfts.find(v => v.collection_address === this.state.chosen_nft_collection.value).nfts.find(v => v.id === selectedOption.value)?.name
        this.setState({
            chosen_nft: selectedOption.value,
            reward_nft_id: selectedOption.value,
            reward_nft_name: {value: chosenRewardNft, label: chosenRewardNft}
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

    async changeOneRewardRanges(startDate, endDate) {
        try {
            const now = endDate
            const nowSub7 = startDate
            const isTodayOrYesterday = nowSub7.getDate() === now.getDate() && nowSub7.getMonth() === now.getMonth()
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())
            let queryWithDate = new URLSearchParams()
            queryWithDate.append('id', this.state.rewardForStat.id)
            queryWithDate.append("startDate", nowSub7.toString())
            queryWithDate.append("endDate", now.toString())
            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const promises = [
                fetch(`${config.api}/stat/rewards_range/${this.state.rewardForStat.nft_id ? 'erc721' : 'erc20'}?` + queryWithDate.toString(), requestOptions),
                fetch(`${config.api}/stat/rewards_distribution/${this.state.rewardForStat.nft_id ? 'erc721' : 'erc20'}?` + queryWithDate.toString(), requestOptions)
            ]
            const responses = await Promise.all(promises)
            const promisesJson = [
                responses[0].json(),
                responses[1].json()
            ]
            const jsons = await Promise.all(promisesJson)
            const jsonRange = jsons[0]
            const jsonDist = jsons[1]
            const range = {
                labels: jsonRange.body.data.map(v => `${isTodayOrYesterday ? new Date(v.date_interval_end).toLocaleTimeString().replace(/(:\d{2}| [AP]M)$/, "") : new Date(v.date_interval_end).toLocaleDateString()}`),
                datasets: [{
                    data: jsonRange.body.data.map(v => parseInt(v.count)),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            }
            const dist = {
                labels: jsonDist.body.data.map(v => `${isTodayOrYesterday ? new Date(v.end_date).toLocaleTimeString().replace(/(:\d{2}| [AP]M)$/, "") : new Date(v.end_date).toLocaleDateString()} `),
                datasets: [{
                    data: jsonDist.body.data.map(v => parseInt(v.count)),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            }
            this.setState({
                rewardRangeStat: range,
                rewardDistStat: dist
            })
        } catch (error) {
            console.log(error)
        }
    }

    handleCloseStats = () => this.setState({showStats: false});
    handleShowStats = async (reward) => {
        try {
            const now = new Date()
            const nowSub7 = subDays(new Date(), 7)
            const isTodayOrYesterday = nowSub7.getDate() === now.getDate() && nowSub7.getMonth() === now.getMonth()
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())
            let query = new URLSearchParams();
            query.append('id', reward.id)
            let queryWithDate = new URLSearchParams()
            queryWithDate.append('id', reward.id)
            queryWithDate.append("startDate", nowSub7.toString())
            queryWithDate.append("endDate", now.toString())
            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const promises = [
                fetch(`${config.api}/stat/rewarded_users/${reward.nft_id ? 'erc721' : 'erc20'}?` + query.toString(), requestOptions),
                fetch(`${config.api}/stat/rewarded_24h/${reward.nft_id ? 'erc721' : 'erc20'}?` + query.toString(), requestOptions),
                fetch(`${config.api}/stat/rewards_range/${reward.nft_id ? 'erc721' : 'erc20'}?` + queryWithDate.toString(), requestOptions),
                fetch(`${config.api}/stat/rewards_distribution/${reward.nft_id ? 'erc721' : 'erc20'}?` + queryWithDate.toString(), requestOptions)
            ]
            const responses = await Promise.all(promises)
            const promisesJson = [
                responses[0].json(),
                responses[1].json(),
                responses[2].json(),
                responses[3].json()
            ]
            const jsons = await Promise.all(promisesJson)
            const jsonUsersTotal = jsons[0]
            const json24hTotal = jsons[1]
            const jsonRange = jsons[2]
            const jsonDist = jsons[3]
            const range = {
                labels: jsonRange.body.data.map(v => `${isTodayOrYesterday ? new Date(v.date_interval_end).toLocaleTimeString().replace(/(:\d{2}| [AP]M)$/, "") : new Date(v.date_interval_end).toLocaleDateString()}`),
                datasets: [{
                    data: jsonRange.body.data.map(v => parseInt(v.count)),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            }
            const dist = {
                labels: jsonDist.body.data.map(v => `${isTodayOrYesterday ? new Date(v.end_date).toLocaleTimeString().replace(/(:\d{2}| [AP]M)$/, "") : new Date(v.end_date).toLocaleDateString()} `),
                datasets: [{
                    data: jsonDist.body.data.map(v => parseInt(v.count)),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            }
            this.setState({
                showStats: true, 
                rewardForStat: reward, 
                rewardForStatTotal: reward.count, 
                rewardForStatUserTotal: jsonUsersTotal.body.data,
                rewardForStatUser24h: json24hTotal.body.data,
                rewardRangeStat: range,
                rewardDistStat: dist
            })
        } catch (error) {
            console.log(error)
        }
    };

    handleClose = () => this.setState({
        name: '',
        description: null,
        amount: null,
        show: false,
        chosen_token: this.state.tokens.length ? {value: this.state.tokens[0].address, label: this.state.tokens[0].symbol} : null,
        chosen_nft_collection: this.state.nftCollections.length ?  {value: this.state.nftCollections[0].address, label: this.state.nftCollections[0].name} : null,
        chosen_type: 'token'
    });
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
        const token = this.state.tokens.filter(v => v.address === reward_token)[0]
        const nft = this.state.optionNftCollection.filter(v => v.value === reward_token)[0]
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
                reward_nft_name: {label: reward_nft_name, value: reward_nft_name},
                ...current_nfts,
                chosen_token:{value: token?.address, label: token?.symbol},
                chosen_nft_collection: {value: nft?.value, label: nft?.label},
                optionCurrentNfts: reward_type === types.nft ? current_nfts.current_nfts.map(v => ({value: v?.id ? v?.id : null, label: v.name})) : this.state.optionCurrentNfts
            }
        )
    }
    handleCloseEditReward = () => this.setState({
        name: '',
        description: null,
        amount: null,
        show: false,
        chosen_token: {value: this.state?.tokens[0]?.address, label: this.state?.tokens[0]?.symbol},
        reward_nft_name: !this.state?.nfts[0]?.nfts?.length ? null : this.state?.nfts[0]?.nfts[0],
        chosen_nft_collection: {value: this.state?.nftCollections[0]?.address, label: this.state?.nftCollections[0]?.name},
        chosen_type: 'token',
        current_nfts: !this.state?.nfts[0]?.nfts.length ? [] : this.state?.current_nfts,
        showEditReward: false
    })
    handleCloseSuccess = () => this.setState({showSuccess: false})
    handleCloseError = () => this.setState({showError: false})

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
    changeOneRewardRanges = this.changeOneRewardRanges.bind(this)
    handleCloseError = () => this.setState({showError: false})

    render() {
        return (
            <>
                <div className="title-header">
                    <h3 className="menu__title">Rewards</h3>
                    {
                        this.state.combinedRewards?.length && !this.state.showCreate 
                        ?  <button  type="button" className="btn btn_orange btn_primary" onClick={this.handleShow}>Create new reward</button>
                        : null
                    }
                </div>

                {
                    this.state.combinedRewards?.length && !this.state.showCreate 
                    ? <div className="input-group__serach">
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
                    : null 
                }

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

                 {
                     !this.state.combinedRewards?.length && !this.state.showCreate ?
                     <div className="empty">
                       <div className="empty__wrapper">
                           <img src={empty}></img>
                           <span className="empty__desc">Not any reward yet</span>
                           <button onClick={this.handleShow} type="button" className="btn btn_rounded btn_orange btn_sm">Create new reward</button>
                       </div>
                     </div>
                     : null
                }
                {
                      this.state.combinedRewards?.length && !this.state.showCreate ? 
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
                                            `${v.nft_name} from ${v.symbol} (${networks[`${v.chainid}`].name}) collection`
                                            :
                                            `${ethers.utils.formatEther(v.amount)} ${v.symbol} (${networks[`${v.chainid}`].name})`
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
                                            
                                                <Dropdown.Item className="dropdown__menu-item" onClick={() => this.handleShowStats(v)}>Stat</Dropdown.Item>
                                                <Dropdown.Item className="dropdown__menu-item" onClick={() => this.handleShowEditReward(v.name, v.id, v.count, v.description, v.amount, v.nft_id ? types.nft :types.token, v.address, v.nft_id , v.symbol, v.nft_name)}>Edit</Dropdown.Item>
                                                <Dropdown.Item className="dropdown__menu-item" onClick={() => this.handleShowReward(v.name, v.id, v.nft_id)} disabled={v.status}>To reward</Dropdown.Item>
                                                <Dropdown.Item className="dropdown__menu-item" onClick={() => this.handleShowDelete(v.nft_id ? types.nft : types.token, v.id, v.name)}>Delete</Dropdown.Item>

                                            </FPDropdown>
                                          </td>
                                      </tr>
                                    )
                              }
                            </FPTable>
                </div>
                      : null
                }

                <Modal show={this.state.show} onHide={this.handleClose} centered>
                <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                        Create new reward
                    </Modal.Header>
                    <Modal.Body>
                

                    <div className="form_row  mb-4">
                     <div className="form_col_last form_col">
                        <label className="form__label">Name* :</label>
                                <div className="input-group">
                                    <input type="text" placeholder="e.g. My fisrt reward" onChange={this.changeName} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
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
                                    <label  className="form__label">Select {this.state.chosen_type === types.token ? 'token' : 'NFT collection'}* :<img className="form__icon-info" src={info}/> </label>
                                    <div className="input-group">
                                    {
                                        this.state.chosen_type === types.token ?
                                        <Select
                                        className="w-100"
                                        value={!this.state.tokens.length ? 'create token:' : this.state.chosen_token }
                                        placeholder={"Choose token"}
                                        options={!this.state.tokens.length ? optionEmpty : this.state.optionTokens}
                                        onChange={this.changeToken}
                                        ></Select>
                                        :  <Select
                                        className="w-100"
                                        value={!this.state.nftCollections.length ? 'create nft:' : this.state.chosen_nft_collection }
                                        placeholder={"Choose nft collection"}
                                        options={!this.state.nftCollections.length ? optionEmpty : this.state.optionNftCollection}
                                        onChange={this.changeNFTCollection}
                                        ></Select>

                                    }
                                    </div>
                                    {
                                        this.state.chosen_type === types.token
                                        ? <div className="form__prompt" id="basic-addon4">Select the token to reward users with</div>
                                        : <div className="form__prompt" id="basic-addon4">Select the NFT collection to reward users with</div>
                                    }
                                </div>
                         </div>                             
                        {
                           this.state.chosen_type === types.token && this.state.tokens.length
                            ?
                            <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                    <label className="form__label">Amount* : <img className="form__icon-info" src={info}/> </label>
                                    <div className="input-group">
                                        <input type="number" className="form-control" onChange={this.changeAmount} placeholder="e.g. 5" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4">Enter the amount of tokens for each reward</div>
                                </div>
                            </div>
                            :
                            this.state.chosen_type !== types.token ?
                            <div className="form_row mb-4">
                            <div className="form_col_last form_col">
                                <label className="form__label">Select token from collection* : <img className="form__icon-info" src={info}/></label>
                                  <Select
                                        className="w-100"
                                        value={!this.state.current_nfts.length ? 'create token from collection:' : this.state.reward_nft_name }
                                        placeholder={"Choose nfts"}
                                        options={!this.state.current_nfts.length ? optionEmpty : this.state.optionCurrentNfts}
                                        onChange={this.changeChosenRewardNFT}
                                        ></Select>
                                    <div className="form__prompt" id="basic-addon4">Select the NFT to reward users with</div>
                            </div>
                        </div>
                        : null
                        }

                        <div className="form_row_reward_switch form_row mb-4">
                                <div className="form_col_last form_col">
                                <div className="form__group_top-row-left">
                                        <img src={drug_drop}></img>
                                            <div>
                                                <label className="form__label_group form__label">Allow a repeat reward:  <img className="form__icon-info" src={info} />
                                                </label>
                                                <div className="form__prompt_reward_switch form__prompt" id="basic-addon4">If activated, this award can be given to each user only once</div>
                                                        </div>
                                    </div>
                                </div>
                                <label className="switch_center switch">
                                        <input type="checkbox" disabled></input>
                                        <span className="slider round"></span>
                                    </label>  
                        </div>
                        <div className="form_row_reward_switch form_row mb-4">
                                <div className="form_col_last form_col">
                                    <div className="form__group_top-row-left">
                                        <img src={drug_drop}></img>
                                            <div>
                                                <label className="form__label_group form__label">Limit the total number of rewards:  <img className="form__icon-info" src={info} />
                                                </label>
                                                <div className="form__prompt_reward_switch form__prompt" id="basic-addon4">You can set a limit of total number of awards</div>
                                                        </div>
                                    </div>
                                </div>
                                <label className="switch_center switch">
                                            <input type="checkbox" disabled></input>
                                            <span className="slider round"></span>
                                    </label>  
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn_primary btn_gray" onClick={this.handleClose}>
                        Cancel
                    </button>
                    {
                        this.state.name && this.state.amount && this.state.chosen_type === types.token && this.state.chosen_token
                        ? <button className="btn btn_primary btn_orange" onClick={this.rewardToken}>
                        Create
                        </button>
                        : this.state.name && this.state.chosen_type !== types.token && this.state.chosen_nft_collection && this.state.reward_nft_id
                        ?  <button className="btn btn_primary btn_orange" onClick={this.createNFTReward}>
                            Create
                        </button>
                        :  <button disabled className="btn btn_primary btn_orange btn_disabled">
                        Create
                        </button>
                    }
                    </Modal.Footer>
                </Modal>

                <Modal id="rewardFromReward" show={this.state.showReward} onHide={this.handleCloseReward} centered>
                    <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                        Rewarding {this.state.reward_name}
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                <label className="form__label">Select user*: <img className="form__icon-info" src={info}/></label>
                                    <div className="input-group ">
                                        <Select
                                            className="w-100"
                                            value={!this.state.chosen_user ? 'create user:' : this.state.chosen_user }
                                            placeholder={"Choose user to reward"}
                                            options={!this.state.users.length ? optionEmpty : this.state.users}
                                            onChange={this.changeUser}
                                        ></Select>
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
                    {
                        this.state.chosen_user
                        ? <button className="btn btn_primary btn_orange" onClick={this.state.toRewardNftId ? this.rewardWithNFT : this.rewardWithToken }>
                        Reward
                        </button>
                        :  <button disabled className="btn btn_primary btn_orange btn_disabled">
                        Reward
                        </button>
                    }
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
                                    <label className="form__label" >Choose a reward mode:</label>
                                        <div className="input-group">
                                        <div className="form-check custom-control custom-radio custom-control-inline">
                                            <input  
                                            onChange={this.changeType} checked={this.state.reward_type === types.token ? true : false}
                                            type="radio" id="rd_1" name="rd" value={types.token}/>
                                            <label className="form-check-label custom-control-label green" for="rd_1">
                                            Tokens <img src={info} className="form__icon-info"/>
                                            </label>
                                        </div>
                                        <div className="form-check custom-control custom-radio custom-control-inline ms-3">
                                            <input 
                                              onChange={this.changeType} checked={this.state.reward_type === types.nft ? true : false}
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
                                    <label className="form__label">Select { this.state.reward_type === types.token ? 'token' : 'NFT collection'}:<img className="form__icon-info" src={info}/> </label>
                                    <div className="input-group ">
                                      {
                                        this.state.reward_type === types.token ?
                                        <Select
                                        className="w-100"
                                        value={!this.state.tokens.length ? 'create token:' : this.state.chosen_token }
                                        options={!this.state.tokens.length ? optionEmpty : this.state.optionTokens}
                                        onChange={this.changeToken}
                                        ></Select>
                                        :  <Select
                                        className="w-100"
                                        value={!this.state.nftCollections.length ? 'create nft:' : this.state.chosen_nft_collection }
                                        placeholder={"Choose nft collection"}
                                        options={!this.state.nftCollections.length ? optionEmpty : this.state.optionNftCollection}
                                        onChange={this.changeNFTCollection}
                                        ></Select>

                                    }
                                    </div>
                                    {
                                        this.state.reward_type === types.token
                                        ? <div className="form__prompt" id="basic-addon4">Select the token to reward users with</div>
                                        : <div className="form__prompt" id="basic-addon4">Select the NFT collection to reward users with</div>
                                    }
                                </div>
                         </div>                             
                        {
                            this.state.reward_type === types.token
                            ?
                            <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                    <label className="form__label">Amount: <img className="form__icon-info" src={info}/> </label>
                                    <div className="input-group">
                                        <input  type="number" defaultValue={this.state.reward_amount ? this.state.reward_amount : '0'} className="form-control" onChange={this.changeRewardAmount} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4">Enter the amount of tokens for each reward</div>
                                </div>
                            </div>
                            :
                            <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                    <label className="form__label">Select token from collection: <img className="form__icon-info" src={info}/> </label>
                                  <Select
                                        className="w-100"
                                        value={!this.state.current_nfts.length ? 'create token from collection:' : this.state.reward_nft_name }
                                        placeholder={"Choose nfts"}
                                        options={!this.state.current_nfts.length ? optionEmpty : this.state.optionCurrentNfts}
                                        onChange={this.changeChosenRewardNFT}
                                        ></Select>       
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
                    <button className="btn btn_primary btn_gray" onClick={this.handleCloseEditReward}>
                        Cancel
                    </button>
                    <button className="btn btn_primary btn_orange" onClick={this.saveEdit}>
                        Save
                    </button>
                    </Modal.Footer>
                </Modal>

                <Modal dialogClassName="modal__info-rewards" show={this.state.showStats} onHide={this.handleCloseStats} centered>
                    <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                        {`"${this.state?.rewardForStat?.name}" reward statistics`}
                    </Modal.Header>
                    <Modal.Body>
                    <ul className="info__list_rewards info__list unlist">
                        <li className="info__list-item_rewards info__list-item_blue info__list-item">
                            <div className="info__content_left">
                                <span className="info__content-amount">{this.state.rewardForStatTotal}</span>
                                <span className="info__content-desc">The total number of rewards</span>
                            </div>
                            <div className="info__content_right">
                                <img src={total}></img>
                            </div>
                        </li>
                        <li className="info__list-item_rewards info__list-item_light-blue info__list-item">
                            <div className="info__content_left">
                                <span className="info__content-amount">{this.state.rewardForStatUserTotal}</span>
                                <span className="info__content-desc">Users rewarded</span>
                            </div>
                            <div className="info__content_right">
                                <img src={rewarded}></img>
                            </div>
                        </li>
                        <li className="info__list-item_rewards info__list-item_dark-blue info__list-item">
                            <div className="info__content_left">
                                <span className="info__content-amount">{this.state.rewardForStatUser24h}</span>
                                <span className="info__content-desc">Rewards in the last 24 hours</span>
                            </div>
                            <div className="info__content_right">
                            <img src={newRewards}></img>
                            </div>
                        </li>
                    </ul>
                        <div className="dashboard__chart mb-4">
                            <DatePicker changeOneRewardRanges={this.changeOneRewardRanges} type={typesOfDashboard.reward_range}></DatePicker>
                            <div className="dashboard__chart_reward">
                                <label className="chart__label">Distribution statistic</label>
                                <div className="dashboard__chart_reward_wrapper mb-4" style={{position: 'relative', height:'356px', display: 'flex', justifyContent: 'center'}}>
                                    <LineChart chartData={this.state.rewardDistStat}></LineChart>
                                </div>
                            </div>
                            <div className="dashboard__chart_reward">
                                <label className="chart__label">Statistics of the amount of awards</label>
                                <div className="dashboard__chart_reward_wrapper mb-4" style={{position: 'relative', height:'356px', display: 'flex', justifyContent: 'center'}}>
                                        <BarChart chartData={this.state.rewardRangeStat}></BarChart>
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
                    successTitle={this.state.successTitle} 
                    successName={this.state.successName} 
                />
                   <ErrorModal 
                    showError={this.state.showError}
                    handleCloseError={this.handleCloseError}
                    errorName={this.state.errorName}
                />
                     </>
                }
            </>
        )
    }
}

export default Rewards