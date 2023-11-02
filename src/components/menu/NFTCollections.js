import { Component } from "react";
import { ethers } from "ethers";
import { createLongStrView } from "../../utils/longStrView";
import ERC721Mintable from "../../contracts/erc721/ERC721Mintable.json";
import ERC721DefaultRoyalty from "../../contracts/erc721/ERC721DefaultRoyalty.json";
import ERC721TokenRoyalty from "../../contracts/erc721/ERC721TokenRoyalty.json";
import { getBearerHeader } from "../../utils/getBearerHeader";
import { config } from "../../utils/config";
import { networks } from '../../utils/networks'
import Modal from 'react-bootstrap/Modal';
import '../../styles/nftCollections.scss'
import ConfirmModal from "../common/modals/confirm";
import ProgressModal from "../common/modals/progress";
import SuccessModal from "../common/modals/success";
import ErrorModal from "../common/modals/error";
import empty from "../../media/common/empty_icon.svg"
import info from '../../media/common/info-small.svg'
import more from '../../media/common/more.svg'
import webicon from '../../media/common/web-icon.svg'
import instagram from '../../media/common/instagram-icon.svg'
import telegram from '../../media/common/telegram-icon.svg'
import medium from '../../media/common/medium-icon.svg'
import facebook from '../../media/common/facebook-icon.svg'
import discord from '../../media/common/discord-icon.svg'
import drug_drop from '../../media/common/drug&drop.svg'
import customTokeSymbol from '../../media/common/custom_toke_symbol.svg'
import FPTable from "../common/FPTable";
import { nftsTable } from "../../data/tables";
import FileUpload from "../FileUpload";
import FPDropdown from "../common/FPDropdown";
import { Dropdown, Form } from "react-bootstrap";
import loader from '../../media/common/loader.svg';
import metamask from '../../media/common/metamask.svg'
import walletconnect from '../../media/common/walletconnect.svg'
import Select from "react-select";

const beneficialTypes = {
    company: "company",
    owner: "owner"
}

let propertiesElementsLength = 0
let levelsElementsLength = 0
let statsElementsLength = 0

class NFTCollections extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: null,
            symbol: null,
            description: null,
            description2: null,
            chainid: networks[config.status === "test" ? '80001' : '137'].chainid,
            provider: null,
            signer: null,
            address: null,
            showCreate: false,
            showCreateImagesPage: false,
            showCreateBeneficialPage: false,
            showCreateLinkPage: false,
            showAddNFT: false,
            showNFTDetail: false,
            showConfirm: false,
            showProgress: false,
            showSuccess: false,
            showError: false,
            successName: null,
            successText: null,
            errorName: null,
            errorText: null,
            confirmName: null,
            confirmText: null,
            addNFTAddress: '',
            addNFTAmount: null,
            addNFTName: '',
            addNFTDescription: null,
            nftCollections: [],
            optionNftCollection: [],
            propertiesElements: [],
            statsElements: [],
            levelsElements: [],
            network: networks[config.status === "test" ? '80001' : '137'],
            beneficialAddress: this.props.auth.wallet,
            beneficialType: beneficialTypes.company,
            royalties: null,
            website: null,
            instagram: null,
            telegram: null,
            medium: null,
            facebook: null,
            discord: null,
            other: null,
            stageOfCreateNftCollection: 0,
            stageOfAddNft: 0,
            hasLoad: false,
            collectionOptions: null,
            isInvalidAddress: false,
            isInvalidRoyalties: false
        }
    }

    async componentDidMount() {
        this.setState({
            hasLoad: true
        })
        try{
            await this.getNFTCollections()
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
            if(this.props.isGoToCreationPage === 'create token from collection') {
                this.handleShowAddNFT(this.props.creationPagePayload)
            }
            else {
                this.handleShowCreate()
            }
        }
        if(this.props?.wallet?.provider && this.props?.wallet?.signer && this.props?.wallet?.address && this.props?.wallet?.chainid) {
            this.setState({
                provider: this.props.wallet.provider,
                signer: this.props.wallet.signer,
                address: this.props.wallet.address,
                chainid: this.props.wallet.chainid.toString()
            })
        }
    }

    onChangeName(event) {
        this.setState({
            name: event.target.value
        })
    }

    onChangeSymbol(event) {
        this.setState({
            symbol: event.target.value
        })
    }

    onChangeAddNFTAmount(event) {
        this.setState({
            addNFTAmount: event.target.value
        })
    }

    onChangeAddNFTName(event) {
        this.setState({
            addNFTName: event.target.value
        })
    }

    onChangeAddNFTDescription(event) {
        this.setState({
            addNFTDescription: event.target.value
        })
    }

    onChangeDescription(event) {
        this.setState({
            description: event.target.value
        })
    }

    onChangeDescription2(event) {
        this.setState({
            description2: event.target.value
        })
    }

    onChangeBeneficialType(event) {
        this.setState({
            beneficialType: event.target.value
        })
    }

    onChangeBeneficialAddress(event) {
        const validateAddress = (address) => {
            if(!address) {
                return true
            }
            return address.match(
                /^0x[a-fA-F0-9]{40}$/g
            );
          };
          if (!ethers.utils.isAddress(event.target.value) ) {
            this.setState({
                beneficialAddress: event.target.value,
                isInvalidAddress: true
            })
        }
        else if(validateAddress(event.target.value)) {
            this.setState({
                beneficialAddress: event.target.value,
                isInvalidAddress: false
            })
        }
        else{
            this.setState({
                beneficialAddress: event.target.value,
                isInvalidAddress: true
            })
          
        }
    }

    onChangeRoyalties(event) {
        if(Number(event.target.value) >= 0.5 && Number(event.target.value) <= 10) 
        {
            this.setState({
                royalties: event.target.value,
                isInvalidRoyalties: false
            })
        }
        else {
            this.setState({
                royalties: event.target.value,
                isInvalidRoyalties: true
            })
        }
    }

    onChangeWebsite = (event) => this.setState({website: event.target.value})
    onChangeInstagram = (event) => this.setState({instagram: event.target.value})
    onChangeTelegram = (event) => this.setState({telegram: event.target.value})
    onChangeMedium = (event) => this.setState({medium: event.target.value})
    onChangeFacebook = (event) => this.setState({facebook: event.target.value})
    onChangeDiscord = (event) => this.setState({discord: event.target.value})
    onChangeOther = (event) => this.setState({other: event.target.value})

    async changeNetwork(event) {
        const network = networks[event.target.value]
        if(network.chainid.toString() !== this.state.chainid) {
            this.setState({
                network,
                chainid: network.chainid,
                provider: null,
                signer: null,
                address: null
            })
        }
        else {
            this.setState({
                network,
            })
        }
    }

    changeCollection(event) {
        this.setState({
            addNFTAddress: event,
        })
    }

    async connect() {
        const network = this.state.network
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
            await provider.send("eth_requestAccounts", [])
            const signer = await provider.getSigner()
            const address = await signer.getAddress()
            try {
                this.handleShowConfirm('Connect', 'Confirm the network change', 'Please, confirm the network change in your wallet')
                await window.ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: ethers.utils.hexValue(parseInt(network.chainid)) }]
                })
                // .then(() => window.location.reload())
                this.setState({
                    provider,
                    signer,
                    address,
                    stageOfCreateNftCollection: 3
                })
              } catch (err) {
                console.log(err)
                if (err.code === 4902) {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainName: network.name,
                        chainId: ethers.utils.hexValue(parseInt(network.chainid)),
                        nativeCurrency: { name: network.currency_symbol, decimals: 18, symbol: network.currency_symbol},
                        rpcUrls: [network.rpc]
                      }
                    ]
                  })
                //   .then(() => window.location.reload())
                }
              }
              this.handleCloseConfirm()
    }

    nextStage () {
        this.setState({stageOfCreateNftCollection: this.state.stageOfCreateNftCollection + 1 })
    }
    prevStage () {
        if(this.state.stageOfCreateNftCollection === 1) {
            this.setState({stageOfCreateNftCollection: this.state.stageOfCreateNftCollection - 1, showCreate: false  })
        }
        else {
            this.setState({stageOfCreateNftCollection: this.state.stageOfCreateNftCollection - 1 })
        }
    }

    nextStageAddNft() {
        this.setState({stageOfAddNft: this.state.stageOfAddNft + 1 })
    }
    prevStageAddNft () {
        if(this.state.stageOfAddNft === 1) {
            this.setState({stageOfAddNft: this.state.stageOfAddNft - 1, showAddNFT: false  })
        }
        else {
            this.setState({stageOfAddNft: this.state.stageOfAddNft - 1 })
        }
    }

    async createNFTCollection() {
        try {
            const {
                name,
                symbol,
                description,
                network,
                beneficialAddress,
                beneficialType,
                royalties,
                website, instagram, telegram, medium, facebook, discord, other
            } = this.state
            const links = []
            if (website) links.push({link: website})
            if (instagram) links.push({link: instagram})
            if (telegram) links.push({link: telegram})
            if (medium) links.push({link: medium})
            if (facebook) links.push({link: facebook})
            if (discord) links.push({link: discord})
            if (other) links.push({link: other})
            let NFT, contract
            this.handleShowConfirm('Create NFT', `Confirm ${symbol} collection creation`, `Please, confirm contract creation in your wallet`)
            if (beneficialType === beneficialTypes.company) {
                NFT = new ethers.ContractFactory(ERC721DefaultRoyalty.abi, ERC721DefaultRoyalty.bytecode, this.state.signer)
                contract = await NFT.deploy(this.state.name, this.state.symbol, config.signerAddress, beneficialAddress, royalties);
            } else {
                NFT = new ethers.ContractFactory(ERC721TokenRoyalty.abi, ERC721TokenRoyalty.bytecode, this.state.signer)
                contract = await NFT.deploy(this.state.name, this.state.symbol, config.signerAddress, royalties);
            } 
            this.handleCloseConfirm()
            this.handleShowProgress()
            const contractAdddress = contract.address
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())
            const raw = JSON.stringify({
                "address": contractAdddress,
                name,
                symbol,
                "chainid": network.chainid.toString(),
                description,
                links,
                beneficiary: beneficialAddress || null,
                royalties
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/nfts/add/collection`, requestOptions)
            if (res.status === 200) {
                const collection = (await res.json()).body.data
                const _nfts = this.state.nftCollections
                _nfts.push(collection)
                this.setState({
                    nftCollections: _nfts,
                    name: null,
                    symbol: null,
                    description: null,
                    beneficialType: beneficialTypes.company,
                    royalties: null,
                    website: null, instagram: null, telegram: null, medium: null, facebook: null, discord: null, other: null
                })
                contract.deployed().then(() => {
                    this.handleCloseProgress()
                    this.handleShowSuccess('Create NFT', `${symbol} collection created`, `The contract creation was successful`)
                    this.setState({
                        showCreate: false,
                        stageOfCreateToken: 0,
                    })
                })
            } else {
                alert('Something went wrong')
            }
        } catch (error) {
            this.customError(error)
        }
    }

    async createNFT() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())
            const raw = JSON.stringify({
                "address": this.state.addNFTAddress.value,
                "amount": this.state.addNFTAmount,
                "name": this.state.addNFTName,
                "description": this.state.addNFTDescription
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/nfts/add/nft`, requestOptions)
            if (res.status === 200){
                this.setState({
                    showAddNFT: false,
                    showSuccess: true,
                    successTitle: 'Create NFT',
                    successName: `The NFT "${this.state.addNFTName}" was successfully created`
                })
            }
            else{
                this.setState({
                    showError: true,
                    errorName: 'Something went wrong'
                })
            }
        } catch (error) {
            this.setState({
                showError: true,
                errorName: 'Something went wrong'
            })
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
                optionNftCollection: json.body.data.map(v => ({value: v.address, label: v.symbol}))
            })
        } catch (error) {
            alert(error)
        }
    }

    handleCloseCreate = () => this.setState({showCreate: false})
    handleShowCreate = () => {
        this.setState({showCreate: true, stageOfCreateNftCollection: 1})
    }

    handleCloseCreateImagesPage = () => this.setState({showCreateImagesPage: false})
    handleShowCreateImagesPage = () => this.setState({showCreateImagesPage: true})

    handleCloseCreateBeneficialPage = () => this.setState({showCreateBeneficialPage: false})
    handleShowCreateBeneficialPage = () => this.setState({showCreateBeneficialPage: true})

    handleCloseCreateLinkPage = () => this.setState({showCreateLinkPage: false})
    handleShowCreateLinkPage = () => this.setState({showCreateLinkPage: true})

    handleShowNFTDetail = (event, active, address) => {
        event.stopPropagation();
        this.props.getNeftCollection(address)
        this.props.onSwitch(active)
        this.setState({showNFTDetail: true})
    }

    handlCollectionOptions = (event) => {
        this.setState({
            collectionOptions: event.target.value
        })
    }

    addPropertyInput = () => {
        const propertiesElements = this.state.propertiesElements
        const id = propertiesElementsLength
        propertiesElements.push(
            {
                id,
                element: 
                <div className="user-custom-params">
                            <div className="input-group">
                                <input type="text" id={`property-name-${id}`} onChange={this.changePropertyName} className="form-control" placeholder="Property name"/>
                            </div>
                            <div className="input-group">
                                <input type="text" id={`property-value-${id}`} onChange={this.changePropertyValue} className="form-control" placeholder="Default value"/>
                            </div>
                    <button type="button" className="btn btn_primary btn_orange btn__counter" onClick={() => this.deletePropertyInput(id)}>-</button>
                </div>,
                name: undefined,
                value: undefined,
                work: true
            }
        )
        propertiesElementsLength += 1
        this.setState({propertiesElements})
    }

    deletePropertyInput = (index) => {
        let propertiesElements = this.state.propertiesElements
        propertiesElements.forEach(v => {if (v.id === index) v.work = false})
        this.setState({
            propertiesElements
        })
    }

    addStatInput = () => {
        const statsElements = this.state.statsElements
        const id = statsElementsLength
        statsElements.push(
            {
                id,
                element: 
                <div className="user-custom-params">
                        <div className="input-group">
                            <input type="text" id={`stat-name-${id}`} onChange={this.changeStatName} className="form-control" placeholder="Stat name"/>
                        </div>
                        <div className="input-group">
                            <input type="number" id={`stat-value-${id}`} onChange={this.changeStatValue} className="form-control" placeholder="Default value"/>
                        </div>
                    <button type="button" className="btn btn_primary btn_orange btn__counter" onClick={() => this.deleteStatInput(id)}>-</button>
                </div>,
                name: undefined,
                value: undefined,
                work: true
            }
        )

        statsElementsLength += 1
        this.setState({statsElements})
    }

    deleteStatInput = (index) => {
        let statsElements = this.state.statsElements
        statsElements.forEach(v => { if (v.id === index) v.work = false});
        this.setState({statsElements})
    }

    addLevelInput = () => {
        const levelsElements = this.state.levelsElements
        const id = levelsElementsLength
        levelsElements.push(
            {
                id,
                element:                                               
                <div className="user-custom-params">
                        <div className="input-group">
                            <input type="text" id={`stat-name-${id}`} onChange={this.changeStatName} className="form-control" placeholder="Level name"/>
                        </div>
                        <div className="input-group">
                            <input type="number" id={`stat-value-${id}`} onChange={this.changeStatValue} className="form-control" placeholder="Default value 1"/>
                        </div>
                        <div className="input-group">
                            <input type="number" id={`stat-value-${id}`} onChange={this.changeStatValue} className="form-control" placeholder="Default value 2"/>
                        </div>
                    <button type="button" className="btn btn_primary btn_orange btn__counter" onClick={() => this.deleteLevelInput(id)}>-</button>
                </div>,
                name: undefined,
                value: undefined,
                work: true
            }
        )

        levelsElementsLength += 1
        this.setState({levelsElements})
    }

    deleteLevelInput = (index) => {
        let levelsElements = this.state.levelsElements
        levelsElements.forEach(v => { if (v.id === index) v.work = false});
        this.setState({levelsElements})
    }

    customError = (error) => {
        this.handleCloseConfirm()
        this.handleCloseProgress()
        if (error.message.includes('user rejected transaction')) {
            this.handleShowError('User rejected transaction')
        }
        if (error.message.includes('insufficient allowance')) {
            this.handleShowError('Insufficient allowance')
        }
        if (error.message.includes('User in blacklist')) {
            this.handleShowError('User in blacklist')
        }
        if (error.message.includes('Cap exceeded')) {
            this.handleShowError('Maximum supply exceeded')
        }
        if (error.message.includes('Empty list')) {
            this.handleShowError('Empty removing list')
        }
        if (error.message.includes('Cap is 0')) {
            this.handleShowError('The maximum supply is not set')
        }
        if (error.message.includes('Initial supply is 0')) {
            this.handleShowError('The initial supply is not set')
        }
        console.log(error)
    } 

    handleCloseAddNFT = () => this.setState({showAddNFT: false})
    handleShowAddNFT = (nft) => this.setState({showAddNFT: true, stageOfAddNft: 1, stageOfCreateNftCollection: 0, addNFTAddress: nft})
    handleShowConfirm = (confirmTitle, confirmName, confirmText) => this.setState({showConfirm: true, confirmTitle, confirmName, confirmText})
    handleCloseConfirm = () => this.setState({showConfirm: false, confirmName: null, confirmText: null})
    handleShowProgress = () => this.setState({showProgress: true})
    handleCloseProgress = () => this.setState({showProgress: false})
    handleShowSuccess = (successTitle, successName, successText) => this.setState({showSuccess: true, successName, successText, successTitle})
    handleCloseSuccess = () => this.setState({showSuccess: false, successName: null, successText: null})
    handleShowError = (errorText) => this.setState({showError: true, errorText})
    handleCloseError = () => this.setState({showError: false})
    
    nextStage = this.nextStage.bind(this)
    prevStage = this.prevStage.bind(this)
    nextStageAddNft = this.nextStageAddNft.bind(this)
    prevStageAddNft = this.prevStageAddNft.bind(this)
    onChangeName = this.onChangeName.bind(this)
    onChangeSymbol = this.onChangeSymbol.bind(this)
    connect = this.connect.bind(this)
    createNFTCollection = this.createNFTCollection.bind(this)
    createNFT = this.createNFT.bind(this)
    getNFTCollections = this.getNFTCollections.bind(this)
    handleShowCreate = this.handleShowCreate.bind(this)
    handleCloseCreate = this.handleCloseCreate.bind(this)
    handleCloseAddNFT = this.handleCloseAddNFT.bind(this)
    handleShowAddNFT = this.handleShowAddNFT.bind(this)
    onChangeAddNFTAmount = this.onChangeAddNFTAmount.bind(this)
    onChangeAddNFTName = this.onChangeAddNFTName.bind(this)
    onChangeAddNFTDescription = this.onChangeAddNFTDescription.bind(this)
    changeNetwork = this.changeNetwork.bind(this)
    changeCollection = this.changeCollection.bind(this)
    onChangeDescription = this.onChangeDescription.bind(this)
    onChangeDescription2 = this.onChangeDescription2.bind(this)
    handleCloseCreateImagesPage = this.handleCloseCreateImagesPage.bind(this)
    handleShowCreateImagesPage = this.handleShowCreateImagesPage.bind(this)
    handleCloseCreateBeneficialPage = this.handleCloseCreateBeneficialPage.bind(this)
    handleShowCreateBeneficialPage = this.handleShowCreateBeneficialPage.bind(this)
    handleCloseCreateLinkPage = this.handleCloseCreateLinkPage.bind(this)
    handleShowCreateLinkPage = this.handleShowCreateLinkPage.bind(this)
    onChangeBeneficialType = this.onChangeBeneficialType.bind(this)
    onChangeBeneficialAddress = this.onChangeBeneficialAddress.bind(this)
    onChangeRoyalties = this.onChangeRoyalties.bind(this)
    onChangeWebsite = this.onChangeWebsite.bind(this)
    onChangeInstagram = this.onChangeInstagram.bind(this)
    onChangeTelegram = this.onChangeTelegram.bind(this)
    onChangeMedium = this.onChangeMedium.bind(this)
    onChangeFacebook = this.onChangeFacebook.bind(this)
    onChangeDiscord = this.onChangeDiscord.bind(this)
    onChangeOther = this.onChangeOther.bind(this)
    handleShowConfirm = this.handleShowConfirm.bind(this)
    handleCloseConfirm = this.handleCloseConfirm.bind(this)
    handleShowProgress = this.handleShowProgress.bind(this)
    handleCloseProgress = this.handleCloseProgress.bind(this)
    handleShowSuccess = this.handleShowSuccess.bind(this)
    handleCloseSuccess = this.handleCloseSuccess.bind(this)
    handleShowError = this.handleShowError.bind(this)
    handleCloseError = this.handleCloseError.bind(this)
    handlCollectionOptions = this.handlCollectionOptions.bind(this)
    addPropertyInput = this.addPropertyInput.bind(this)
    deletePropertyInput = this.deletePropertyInput.bind(this)
    addStatInput = this.addStatInput.bind(this)
    deleteStatInput = this.deleteStatInput.bind(this)

    render() {
        const {switcher} = this.props
        return (
            <>
                <div className="title-header">
                    <div>
                        <h3 className="menu__title">NFTs</h3>
                        {
                            this.state.showCreate 
                            ?    <span className="menu__subtitle">Creating new collection </span> 
                            : null
                        }
                    </div>
                    {
                        this.state.nftCollections?.length && !this.state.stageOfCreateNftCollection ? <button onClick={this.handleShowCreate} type="button" className="btn btn_orange btn_primary">Create new collection</button> : null
                    }
                </div>
                {
                     this.state.hasLoad ?  <img className="modal__loader_view modal__loader" src={loader}></img>
                     : 
                     <>
                        {
                     this.state.showCreate && this.state.stageOfCreateNftCollection === 1 
                    ?   <div className="content__wrap">
                         {/*<button onClick={this.connect} type="button" className="btn btn-dark">{this.state.address ? createLongStrView(this.state.address) : 'Connect'}</button>*/}
                        <h4 className="menu__title-secondary mb-4">Specify the parameters of the new token</h4>
                            <div className="form__groups"> 

                                <div className="form_row">
                                    <div className="form_col">
                                    <label className="form-label">Name *</label>
                                        <div className="input-group">
                                            <input type="text" value={this.state.name} placeholder="Example: Treasures of the sea" onChange={this.onChangeName} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                        </div>
                                    </div>
                                    <div className="form_col_last form_col mb-4">
                                        <label className="form-label">Symbol *</label>
                                        <div className="input-group">
                                            <input type="text" value={this.state.symbol} placeholder="Example: TOS" onChange={this.onChangeSymbol} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                        </div>
                                    </div>
                                </div>
                                {
                                     window.innerWidth < 769 ?
                                     <div className="form_row mb-4">
                                     <div className="form_col_last form_col">
                                     <label className="form-label">Blockchain *</label>
                                     <div className="input-group">
                                         <select onChange={this.changeNetwork} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                             <option value={config.status === "test" ? '80001' : '137'} selected={this.state.network.chainid === (config.status === "test" ? '80001' : '137')}>{networks[config.status === "test" ? '80001' : '137'].name}</option>
                                             <option value={config.status === "test" ? '97' : '56'} selected={this.state.network.chainid === (config.status === "test" ? '97' : '56')}>{networks[config.status === "test" ? '97' : '56'].name}</option>
                                             <option value={config.status === "test" ? '5' : '1'} selected={this.state.network.chainid === (config.status === "test" ? '5' : '1')}>{networks[config.status === "test" ? '5' : '1'].name}</option>
                                             <option value={config.status === "test" ? '420' : '10'} selected={this.state.network.chainid === (config.status === "test" ? '420' : '10')} disabled={config.status === "test" ? true : false} >{networks[config.status === "test" ? '420' : '10'].name}</option>
                                             <option value={config.status === "test" ? '43113' : '43114'} selected={this.state.network.chainid === (config.status === "test" ? '43113' : '43114')}>{networks[config.status === "test" ? '43113' : '43114'].name}</option>
                                             <option value={config.status === "test" ? '421613' : '42161'} selected={this.state.network.chainid === (config.status === "test" ? '421613' : '42161')}>{networks[config.status === "test" ? '421613' : '42161'].name}</option>
                                         </select>
                                     </div>
                                     <div className="form__prompt" id="basic-addon4">Select the blockchain where you'd like new items from this collection to be added by default</div>
                                     </div>
                                 </div>
 
                                     :  <div className="form_row">
                                     <div className="form_col_last form_col">
                                     <label className="form-label">Blockchain *</label>
                                     <div className="input-group">
                                         <select onChange={this.changeNetwork} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                             <option value={config.status === "test" ? '80001' : '137'} selected={this.state.network.chainid === (config.status === "test" ? '80001' : '137')}>{networks[config.status === "test" ? '80001' : '137'].name}</option>
                                             <option value={config.status === "test" ? '97' : '56'} selected={this.state.network.chainid === (config.status === "test" ? '97' : '56')}>{networks[config.status === "test" ? '97' : '56'].name}</option>
                                             <option value={config.status === "test" ? '5' : '1'} selected={this.state.network.chainid === (config.status === "test" ? '5' : '1')}>{networks[config.status === "test" ? '5' : '1'].name}</option>
                                             <option value={config.status === "test" ? '420' : '10'} selected={this.state.network.chainid === (config.status === "test" ? '420' : '10')} disabled={config.status === "test" ? true : false} >{networks[config.status === "test" ? '420' : '10'].name}</option>
                                             <option value={config.status === "test" ? '43113' : '43114'} selected={this.state.network.chainid === (config.status === "test" ? '43113' : '43114')}>{networks[config.status === "test" ? '43113' : '43114'].name}</option>
                                             <option value={config.status === "test" ? '421613' : '42161'} selected={this.state.network.chainid === (config.status === "test" ? '421613' : '42161')}>{networks[config.status === "test" ? '421613' : '42161'].name}</option>
                                         </select>
                                     </div>
                                     <div className="form__prompt" id="basic-addon4">Select the blockchain where you'd like new items from this collection to be added by default</div>
                                     </div>
                                 </div>
 
                                }

                                {
                                     window.innerWidth < 769 
                                     ?    <div className="form_row mb-4">
                                     <div className="form_col_last form_col">
                                         <label className="form-label">Description (optional)</label>
                                             <div className="input-group">
                                                 <textarea type="text" value={this.state.description} onChange={this.onChangeDescription} className="form__textarea form__textarea_desct-nft-collection" id="basic-url" aria-describedby="basic-addon3 basic-addon4"></textarea>
                                             </div>
                                             <div className="form-text" id="basic-addon4"><a className="link__form-prompt" href="https://www.markdownguide.org/cheat-sheet/" target="blank">Markdown</a> syntax is supported. 0 of 1000 characters used</div>
                                     </div>
                                 </div> 
                                     
                                     :    <div className="form_row">
                                     <div className="form_col_last form_col">
                                         <label className="form-label">Description (optional)</label>
                                             <div className="input-group">
                                                 <textarea type="text" value={this.state.description} onChange={this.onChangeDescription} className="form__textarea form__textarea_desct-nft-collection" id="basic-url" aria-describedby="basic-addon3 basic-addon4"></textarea>
                                             </div>
                                             <div className="form-text" id="basic-addon4"><a className="link__form-prompt" href="https://www.markdownguide.org/cheat-sheet/" target="blank">Markdown</a> syntax is supported. 0 of 1000 characters used</div>
                                     </div>
                                 </div>
                                }
                             

                                <div className="form_row mb-4">
                                <div className="form_col_action_left form_col_last form_col">
                                <button className="btn btn_pre-sm  btn_primary btn_gray" onClick={this.prevStage}>
                                    Back
                                </button>
                                {
                                    (
                                        !this.state.name
                                        ||
                                        !this.state.symbol
                                    )
                                    ?
                                    <button className="btn btn_pre-sm  btn_primary btn_orange btn_disabled" disabled onClick={this.nextStage}>
                                        Next
                                    </button>
                                    :
                                    <button className="btn btn_pre-sm  btn_primary btn_orange" onClick={this.nextStage}>
                                        Next
                                    </button>
                                }
                                </div>
                        </div>
                            
                            </div>
                        </div>
                    : null
                }

                {
                    this.state.showCreate && this.state.stageOfCreateNftCollection === 2  && (this.props?.wallet?.chainid?.toString() !== this.state.chainid || !this.props?.wallet?.chainid)
                    ?  <div className="content__wrap">
                         <h4 className="menu__title-secondary">Choose a wallet connection method</h4>
                         <span className="menu__subtitle">To create an nft collection, you need to complete a transaction using a cryptocurrency wallet</span>
                         <ul className="walletl__list unlist">
                            <li className="walletl__list-item" onClick={this.connect}>
                                <div>
                                     <img src={metamask}></img>
                                </div>
                                <p  className="walletl__list-item-name">MetaMask</p>
                            </li>
                            <li className="walletl__list-item">
                                <div>
                                    <img src={walletconnect}></img>
                                </div>
                                <p className="walletl__list-item-name">WalletConnect</p>
                            </li>
                         </ul>
                         <div className="form_row mb-4">
                            <div className="form_col_action_left form_col_last form_col">
                                <button className="btn btn_pre-sm  btn_primary btn_gray" onClick={this.prevStage}>
                                    Back
                                </button>
                                {
                                    this.state.provider && this.state.signer && this.state.address && this.state.chainid ? 
                                    <button className="btn btn_pre-sm btn_primary btn_orange" onClick={this.nextStage}>
                                        Next
                                    </button>
                                  :   <button disabled className="btn btn_pre-sm  btn_primary btn_orange btn_disabled">
                                        Next
                                        </button>
                                }
                            </div>
                         </div>
                        </div> 
                    :  this.state.showCreate && this.state.stageOfCreateNftCollection === 2 && this.props?.wallet?.chainid?.toString() === this.state.chainid ?
                    <div className="content__wrap">
                            <div className="mb-4">
                            <h4 className="menu__title-secondary ">Beneficial owner</h4>
                             <span className="menu__subtitle">Collection beneficiary can collect creator earnings when a user re-sells an item they created</span>
                            </div>
                            <div className="form__groups">
                                <div className="form_row">
                                    <div className="form_col">
                                        <label className="form-label">Beneficial recipient:</label> 
                                        <div className="input-group mb-4">
                                        <div className="form-check custom-control custom-radio custom-control-inline">
                                            <input type="radio" name="rd" id="rd_1"  
                                                value={beneficialTypes.company} checked={this.state.beneficialType === beneficialTypes.company}
                                                onChange={this.onChangeBeneficialType}/>
                                            <label className="form-check-label custom-control-label green" for="rd_1">
                                            The company <img src={info} className="form__icon-info"/>
                                            </label>
                                        </div>
                                        <div className="form-check custom-control custom-radio custom-control-inline ms-3">
                                            <input type="radio" name="rd" id="rd_2"
                                                value={beneficialTypes.owner} checked={this.state.beneficialType === beneficialTypes.owner}
                                                onChange={this.onChangeBeneficialType}   />
                                            <label className="form-check-label custom-control-label red" for="rd_2">
                                            First owner of a NFT <img src={info} className="form__icon-info"/>
                                            </label>
                                        </div>
                                        </div>   
                                    </div>
                                </div>
                                <div className="form_row mb-4">
                              
                                        {
                                            this.state.beneficialType === beneficialTypes.company && this.state.isInvalidAddress
                                            ?
                                            <div className="form_col">
                                            <label className="form__label">Beneficiary address:</label>
                                            <div className="input-group">
                                                <input maxLength={42}  type="text" placeholder="0x0000000000000000000000000000000000000000" onChange={this.onChangeBeneficialAddress} value={this.state.beneficialAddress}  className="auth__form-fields-input_error form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                            </div>
                                            <div className="form__prompt_error form__prompt" id="basic-addon4">Invalid wallet address format. Example: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F</div>
                                        </div>
                                            : this.state.beneficialType === beneficialTypes.company && !this.state.isInvalidAddress
                                            ? 
                                            <div className="form_col">
                                            <label className="form__label">Beneficiary address:</label>
                                            <div className="input-group">
                                                <input maxLength={42}  type="text" placeholder="0x0000000000000000000000000000000000000000" onChange={this.onChangeBeneficialAddress} value={this.state.beneficialAddress}  className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                            </div>
                                            <div className="form__prompt" id="basic-addon4">Wallet for receiving commissions from re-sales of the collection items</div>
                                        </div>
                                            : null
                                        }
                                        
                                   {
                                    this.state.isInvalidRoyalties 
                                    ?     <div className="form_col_last form_col">
                                    <label className="form__label">Resale royalties: <img src={info} className="form__icon-info"/></label>
                                    <div className="input-group">
                                    <input type="number" placeholder="5%" onChange={this.onChangeRoyalties} value={this.state.royalties} className="auth__form-fields-input_error form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                    </div>
                                    <div className="form__prompt_error form__prompt" id="basic-addon4">Total creator earnings must be between 0.5% and 10%</div>
                                </div> 
                                    :   <div className="form_col_last form_col">
                                    <label className="form__label">Resale royalties: <img src={info} className="form__icon-info"/></label>
                                    <div className="input-group">
                                    <input type="number" placeholder="5%" onChange={this.onChangeRoyalties} value={this.state.royalties}  className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4">Total creator earnings must be between 0.5% and 10%</div>
                                </div> 
                                    
                                   }
                                </div>
                            <div className="form_row mb-4">
                            <div className="form_col_action_left form_col_last form_col">
                            <button className="btn btn_pre-sm  btn_primary btn_gray" onClick={this.prevStage}>
                                    Back
                            </button>
                                {
                                   (
                                    this.state.royalties === null
                                    ||
                                    this.state.royalties === ''
                                    || this.state.isInvalidRoyalties 
                                    || this.state.isInvalidAddress
                                    ||
                                    (
                                        this.state.beneficialType === beneficialTypes.company ? 
                                        !ethers.utils.isAddress(this.state.beneficialAddress) 
                                        : false
                                    )
                                )
                                    ?
                                    <button type="button" className="btn btn_pre-sm  btn_primary btn_orange btn_disabled" disabled onClick={this.nextStage}>Next</button>
                                    :
                                    <button type="button" className="btn btn_pre-sm  btn_primary btn_orange" onClick={this.nextStage}>Next</button>
                                }
                            </div>
                         </div>
                            </div>
                            </div>

                    : null
                }

                {
                     this.state.showCreate && this.state.stageOfCreateNftCollection === 3 && (this.props?.wallet?.chainid?.toString() !== this.state.chainid || !this.props?.wallet?.chainid)
                     ?    <div className="content__wrap">
                            <div className="mb-4">
                            <h4 className="menu__title-secondary ">Beneficial owner</h4>
                             <span className="menu__subtitle">Collection beneficiary can collect creator earnings when a user re-sells an item they created</span>
                            </div>
                            <div className="form__groups">
                                <div className="form_row">
                                    <div className="form_col">
                                        <label className="form-label">Beneficial recipient:</label> 
                                        <div className="input-group mb-4">
                                        <div className="form-check custom-control custom-radio custom-control-inline">
                                            <input type="radio" name="rd" id="rd_1"  
                                                value={beneficialTypes.company} checked={this.state.beneficialType === beneficialTypes.company}
                                                onChange={this.onChangeBeneficialType}/>
                                            <label className="form-check-label custom-control-label green" for="rd_1">
                                            The company <img src={info} className="form__icon-info"/>
                                            </label>
                                        </div>
                                        <div className="form-check custom-control custom-radio custom-control-inline ms-3">
                                            <input type="radio" name="rd" id="rd_2"
                                                value={beneficialTypes.owner} checked={this.state.beneficialType === beneficialTypes.owner}
                                                onChange={this.onChangeBeneficialType}   />
                                            <label className="form-check-label custom-control-label red" for="rd_2">
                                            First owner of a NFT <img src={info} className="form__icon-info"/>
                                            </label>
                                        </div>
                                        </div>   
                                    </div>
                                </div>
                                <div className="form_row mb-4">
                              
                                {
                                            this.state.beneficialType === beneficialTypes.company && this.state.isInvalidAddress
                                            ?
                                            <div className="form_col">
                                            <label className="form__label">Beneficiary address:</label>
                                            <div className="input-group">
                                                <input maxLength={42}  type="text" placeholder="0x0000000000000000000000000000000000000000" onChange={this.onChangeBeneficialAddress} value={this.state.beneficialAddress}  className="auth__form-fields-input_error form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                            </div>
                                            <div className="form__prompt_error form__prompt" id="basic-addon4">Invalid wallet address format. Example: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F</div>
                                        </div>
                                            : this.state.beneficialType === beneficialTypes.company && !this.state.isInvalidAddress
                                            ? 
                                            <div className="form_col">
                                            <label className="form__label">Beneficiary address:</label>
                                            <div className="input-group">
                                                <input maxLength={42} type="text" placeholder="0x0000000000000000000000000000000000000000" onChange={this.onChangeBeneficialAddress} value={this.state.beneficialAddress}  className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                            </div>
                                            <div className="form__prompt" id="basic-addon4">Wallet for receiving commissions from re-sales of the collection items</div>
                                        </div>
                                            : null
                                        }
                                     {
                                    this.state.isInvalidRoyalties 
                                    ?     <div className="form_col_last form_col">
                                    <label className="form__label">Resale royalties: <img src={info} className="form__icon-info"/></label>
                                    <div className="input-group">
                                    <input type="number" placeholder="5%" onChange={this.onChangeRoyalties} value={this.state.royalties} className="auth__form-fields-input_error form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                    </div>
                                    <div className="form__prompt_error form__prompt" id="basic-addon4">Total creator earnings must be between 0.5% and 10%</div>
                                </div> 
                                    :   <div className="form_col_last form_col">
                                    <label className="form__label">Resale royalties: <img src={info} className="form__icon-info"/></label>
                                    <div className="input-group">
                                    <input type="number" placeholder="5%" onChange={this.onChangeRoyalties} value={this.state.royalties}  className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4">Total creator earnings must be between 0.5% and 10%</div>
                                </div> 
                                    
                                   }
                                </div>
                            <div className="form_row mb-4">
                            <div className="form_col_action_left form_col_last form_col">
                            <button className="btn btn_pre-sm  btn_primary btn_gray" onClick={this.prevStage}>
                                    Back
                            </button>
                                {
                                    (
                                        this.state.royalties === null
                                        ||
                                        this.state.royalties === ''
                                        || this.state.isInvalidRoyalties 
                                        || this.state.isInvalidAddress
                                        ||
                                        (
                                            this.state.beneficialType === beneficialTypes.company ? 
                                            !ethers.utils.isAddress(this.state.beneficialAddress) 
                                            : false
                                        )
                                    )
                                    ?
                                    <button type="button" className="btn btn_pre-sm  btn_primary btn_orange btn_disabled" disabled onClick={this.nextStage}>Next</button>
                                    :
                                    <button type="button" className="btn btn_pre-sm  btn_primary btn_orange" onClick={this.nextStage}>Next</button>
                                }
                            </div>
                         </div>
                            </div>
                            </div>
                    : this.state.showCreate && this.state.stageOfCreateNftCollection === 3 && this.props?.wallet?.chainid?.toString() === this.state.chainid ?
                    <div className="content__wrap">
                         <h4 className="menu__title-secondary mb-4">Links</h4>
                        <div className="form__groups">
                            <div className="form_row_relative form_row mb-4">
                                        <div className="form_col_last form_col">
                                        <label className="form__label">Website</label>
                                        <img className="website-icon" src={webicon}></img>
                                        <div className="input-group">
                                            <input type="text" placeholder="yourwebsite.io" value={this.state.website} onChange={this.onChangeWebsite} className="form-control_with_image form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                        </div>
                                        </div>
                            </div>
                        </div>

                        <div className="form_row">
                                    <div className="form_col_last form_col">
                                        <label className="form-label">Socials:</label> 
                                        <div className="form_row_relative form_row mb-4">
                                            <div className="form_col">
                                                <img className="instagram-icon" src={instagram}></img>
                                                <div className="input-group">
                                                    <input type="text" placeholder="Instagram" value={this.state.instagram} onChange={this.onChangeInstagram}  className="form-control_with_image form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                </div>
                                        
                                            </div>
                                            <div className="form_row_relative form_col_last form_col">
                                            <img className="facebook-icon" src={facebook}></img>
                                                <div className="input-group">
                                                <input type="text" placeholder="Facebook" value={this.state.facebook} onChange={this.onChangeFacebook} className="form-control_with_image form-control form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                </div>
                                            
                                            </div>
                                        </div>
                                        <div className="form_row_relative form_row mb-4">
                                            <div className="form_col">
                                            <img className="telegram-icon" src={telegram}></img>
                                                <div className="input-group">
                                                    <input type="text" placeholder="Telegram" value={this.state.telegram} onChange={this.onChangeTelegram} className="form-control_with_image form-control form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                </div>
                                        
                                            </div>
                                            <div className="form_row_relative form_col_last form_col">
                                            <img className="discord-icon" src={discord}></img>
                                                <div className="input-group">
                                                <input type="text" placeholder="Discord" alue={this.state.discord} onChange={this.onChangeDiscord} className="form-control_with_image form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                </div>
                                            
                                            </div>
                                        </div>
                                        <div className="form_row_relative form_row mb-4">
                                            <div className="form_col">
                                            <img className="medium-icon" src={medium}></img>
                                                <div className="input-group">
                                                    <input type="text" placeholder="Medium" value={this.state.medium} onChange={this.onChangeMedium} className="form-control_with_image form-control form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                </div>
                                        
                                            </div>
                                            <div className="form_row_relative form_col_last form_col">
                                            <img className="other-icon" src={webicon}></img>
                                                <div className="input-group">
                                                <input type="text" placeholder="Other" value={this.state.other} onChange={this.onChangeOther} className="form-control_with_image form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                </div>
                                            
                                            </div>
                                        </div>
                                </div>
                        </div>
                        <div className="form_row mb-4">
                            <div className="form_col_action_left form_col_last form_col">
                            <button className="btn btn_pre-sm  btn_primary btn_gray" onClick={this.prevStage}>
                                    Back
                                </button>
                                <button className="btn btn_pre-sm  btn_primary btn_orange" onClick={this.createNFTCollection}>
                                    Create
                                </button>
                            </div>
                         </div>
                    </div>
                    : null
                }

                {
                 this.state.showCreate && this.state.stageOfCreateNftCollection === 4
                 ?  <div className="content__wrap">
                         <h4 className="menu__title-secondary mb-4">Links</h4>
                        <div className="form__groups">
                            <div className="form_row_relative form_row mb-4">
                                        <div className="form_col_last form_col">
                                        <label className="form__label">Website</label>
                                        <img className="website-icon" src={webicon}></img>
                                        <div className="input-group">
                                            <input type="text" placeholder="yourwebsite.io" value={this.state.website} onChange={this.onChangeWebsite} className="form-control_with_image form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                        </div>
                                        </div>
                            </div>
                        </div>

                        <div className="form_row">
                                    <div className="form_col_last form_col">
                                        <label className="form-label">Socials:</label> 
                                        <div className="form_row_relative form_row mb-4">
                                            <div className="form_col">
                                                <img className="instagram-icon" src={instagram}></img>
                                                <div className="input-group">
                                                    <input type="text" placeholder="Instagram" value={this.state.instagram} onChange={this.onChangeInstagram}  className="form-control_with_image form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                </div>
                                        
                                            </div>
                                            <div className="form_row_relative form_col_last form_col">
                                            <img className="facebook-icon" src={facebook}></img>
                                                <div className="input-group">
                                                <input type="text" placeholder="Facebook" value={this.state.facebook} onChange={this.onChangeFacebook} className="form-control_with_image form-control form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                </div>
                                            
                                            </div>
                                        </div>
                                        <div className="form_row_relative form_row mb-4">
                                            <div className="form_col">
                                            <img className="telegram-icon" src={telegram}></img>
                                                <div className="input-group">
                                                    <input type="text" placeholder="Telegram" value={this.state.telegram} onChange={this.onChangeTelegram} className="form-control_with_image form-control form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                </div>
                                        
                                            </div>
                                            <div className="form_row_relative form_col_last form_col">
                                            <img className="discord-icon" src={discord}></img>
                                                <div className="input-group">
                                                <input type="text" placeholder="Discord" alue={this.state.discord} onChange={this.onChangeDiscord} className="form-control_with_image form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                </div>
                                            
                                            </div>
                                        </div>
                                        <div className="form_row_relative form_row mb-4">
                                            <div className="form_col">
                                            <img className="medium-icon" src={medium}></img>
                                                <div className="input-group">
                                                    <input type="text" placeholder="Medium" value={this.state.medium} onChange={this.onChangeMedium} className="form-control_with_image form-control form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                </div>
                                        
                                            </div>
                                            <div className="form_row_relative form_col_last form_col">
                                            <img className="other-icon" src={webicon}></img>
                                                <div className="input-group">
                                                <input type="text" placeholder="Other" value={this.state.other} onChange={this.onChangeOther} className="form-control_with_image form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                </div>
                                            
                                            </div>
                                        </div>
                                </div>
                        </div>
                        <div className="form_row mb-4">
                            <div className="form_col_action_left form_col_last form_col">
                            <button className="btn btn_pre-sm  btn_primary btn_gray" onClick={this.prevStage}>
                                    Back
                                </button>
                                <button className="btn btn_pre-sm  btn_primary btn_orange" onClick={this.createNFTCollection}>
                                    Create
                                </button>
                            </div>
                         </div>
                    </div>
                 : null   
                }

                        {
                            this.state.nftCollections?.length && !this.state.showAddNFT && !this.state.showCreate ?  
                            <div className="content__wrap">
                            <FPTable data={nftsTable}>
                                {
                                    this.state.nftCollections.map(v => {
                                        return<tr>
                                            <td>
                                            <div className="nft__collection-name">
                                                <img src={customTokeSymbol}></img>
                                                <span>
                                                    {v.symbol} collection
                                                </span>
                                            </div>
                                            </td>
                                            <td>
                                                (soon)
                                            </td>
                                            <td>
                                                (soon)
                                            </td>
                                            <td>
                                                <FPDropdown icon={more}>
                                                    <Dropdown.Item className="dropdown__menu-item" onClick={() => this.handleShowAddNFT({value: v.address, label: v.symbol})}>Add NFT</Dropdown.Item>
                                                    <Dropdown.Item className="dropdown__menu-item" onClick={(event) => this.handleShowNFTDetail(event, switcher.nft, v.address)}>Collection details</Dropdown.Item>
                                                </FPDropdown>
                                            </td>
                                        </tr>
                                    })
                                }
                            </FPTable>
                            </div>
                        : this.state.showAddNFT && !this.state.showCreate && this.state.stageOfAddNft === 1 ? 
                        <div className="content__wrap">
                            <h4 className="menu__title-secondary mb-4">Filling the collection</h4>
                            <div className="form__groups">
                                <div className="form_row mb-4">
                                        <div className="form_col_last form_col">
                                            <label className="form-label">Collection:</label>
                                            <div className="input-group">
                                                 <Select
                                                    className="w-100"
                                                    value={this.state.addNFTAddress}
                                                    placeholder={"Choose NFT collection"}
                                                    options={this.state.optionNftCollection}
                                                    onChange={this.changeCollection}
                                                ></Select>
                                            

                                            </div>
                                            <div className="form__prompt" id="basic-addon4">This is the collection where your item will appear</div>
                                         </div>
                                </div>
                            </div>
                            <div className="form_row">
                                {
                                      window.innerWidth < 769 
                                      ? <div className="form_col mb-4">
                                      <label className="form-label">Adding options:</label> 
                                      <div className="input-group">
                                      <div className="form-check custom-control custom-radio custom-control-inline">
                                          <input type="radio" id="rd_1" name="rd" value="One by one"/>
                                          <label className="form-check-label custom-control-label green" for="rd_1">
                                          One by one <img src={info} className="form__icon-info"/>
                                          </label>
                                      </div>
                                      <div className="form-check custom-control custom-radio custom-control-inline ms-3">
                                          <input type="radio" id="rd_2" name="rd" value="Massive adding" />
                                          <label className="form-check-label custom-control-label red" for="rd_2">
                                          Massive adding <img src={info} className="form__icon-info"/>
                                          </label>
                                      </div>
                                      </div>   
                                  </div>
                                      : <div className="form_col">
                                      <label className="form-label">Adding options:</label> 
                                      <div className="input-group">
                                      <div className="form-check custom-control custom-radio custom-control-inline">
                                          <input checked={this.state.collectionOptions === 'One by one' ? 1 : 0} type="radio" id="rd_1" name="rd" value="One by one" onChange={this.handlCollectionOptions}/>
                                          <label className="form-check-label custom-control-label green" for="rd_1">
                                          One by one <img src={info} className="form__icon-info"/>
                                          </label>
                                      </div>
                                      <div className="form-check custom-control custom-radio custom-control-inline ms-3">
                                          <input checked={this.state.collectionOptions === 'Massive adding' ? 1 : 0} type="radio" id="rd_2" name="rd" value="Massive adding" onChange={this.handlCollectionOptions} />
                                          <label className="form-check-label custom-control-label red" for="rd_2">
                                          Massive adding <img src={info} className="form__icon-info"/>
                                          </label>
                                      </div>
                                      </div>   
                                  </div>
                                }
                            </div>
                            <div className="form_row mb-4">
                                <div className="form_col_action_left form_col_last form_col">
                                <button className="btn btn_pre-sm  btn_primary btn_gray" onClick={this.prevStageAddNft}>
                                                    Back
                                                </button>
                                    {
                                        this.state.collectionOptions ? 
                                        <button className="btn btn_pre-sm  btn_primary btn_orange" onClick={this.nextStageAddNft}>
                                         Next
                                        </button>
                                        :   <button disabled className="btn btn_pre-sm  btn_primary btn_orange btn_disabled">
                                        Next
                                        </button>

                                    }
                                </div>
                        </div>
                        </div>
                        : !this.state.nftCollections?.length && !this.state.showCreate ?
                        <div className="empty">
                          <div className="empty__wrapper">
                              <img src={empty}></img>
                              <span className="empty__desc">You don't have any NFT collection yet</span>
                              <button onClick={this.handleShowCreate} type="button" className="btn btn_rounded btn_orange btn_sm">Create new collection</button>
                          </div>
                        </div>
                         : null
                        }
                        {
                            this.state.showAddNFT && !this.state.showCreate && this.state.stageOfAddNft === 2
                            ?    <div className="content__wrap">
                                     <h4 className="menu__title-secondary mb-4">Adding {this.state.collectionOptions.toLowerCase()}</h4>
                                        <div className="form__groups">
                                            <div className="form_row mb-4">
                                                <div className="form_col_last form_col">
                                                <label className="form__label_disbaled form__label">Logo image</label>
                                                    <FileUpload disabled></FileUpload>
                                                    {/*<div className="form__prompt" id="basic-addon4">This image will appear at the top of your collection page. File types supported: JPG, PNG, GIF, SVG. Max size: 100 MB</div>*/}
                                                </div>
                                            </div>
                                            <div className="form_row mb-4">
                                                <div className="form_col">
                                                    <label className="form__label">Name *:</label>
                                                    <div className="input-group">
                                                        <input type="text" placeholder="Item name" onChange={this.onChangeAddNFTName} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                    </div>
                                                </div>
                                                <div className="form_col_last form_col">
                                                    <label className="form__label">External link: <img src={info} className="form__icon-info"/></label>
                                                    <div className="input-group">
                                                    <input type="text" placeholder="https://website.com/item/123" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                    </div>
                                                    <div className="form__prompt" id="basic-addon4">Will include a link to this URL on this item's detail page, so that users can click to learn more about it</div>
                                                </div>
                                            </div>

                                            <div className="form_row mb-4">
                                                <div className="form_col_last form_col">
                                                    <label className="form-label">Description: </label>
                                                    <div className="input-group">
                                                        <textarea type="text" value={this.state.description} onChange={this.onChangeAddNFTDescription} className="form__textarea form__textarea_desct-nft-collection" id="basic-url" aria-describedby="basic-addon3 basic-addon4"></textarea>
                                                    </div>
                                                    <div className="form__prompt" id="basic-addon4"> 
                                                        The description will be included on the item's detail page underneath its image. <a className="link__form-prompt" href="https://www.markdownguide.org/cheat-sheet/" target="blank">Markdown</a> syntax is supported.
                                                    </div>
                                                </div>
                                            </div> 

                                            <div className="form__group_row form__group mb-4">

                                                <div className="form_col form__group">
                                                        <div className="form__group_top-row">
                                                            <div className="form__group_top-row-left">
                                                                    <img src={drug_drop}></img>
                                                                    <div>
                                                                    <label className="form__label_group form__label">Properties:  <img className="form__icon-info" src={info} />
                                                                    </label>
                                                                    <div className="form__prompt" id="basic-addon4">Textual traits that show up as rectangles</div>
                                                                </div>
                                                            </div>
                                                            <button type="button" className="btn btn_primary btn_orange btn__counter" onClick={this.addPropertyInput}>+</button>
                                                        </div>
                                                        <div className="form__group_bottom-row">
                                                            {
                                                            <div id="user-properties">
                                                                {
                                                                    this.state.propertiesElements ?
                                                                    this.state.propertiesElements.map(v => v.work ? v.element : null) :
                                                                    null
                                                                }
                                                            </div>
                                                            }
                                                            {/*<div className="form__group_bottom-row-last">
                                                                <div className="input-group">
                                                                    <input type="text" placeholder="Property"  className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                                </div>
                                                                <div className="input-group">
                                                                    <input type="text" placeholder="Value"  className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                                </div>
                                                        </div>*/}
                                                    </div>
                                                </div>

                                                <div className="form_col_last form_col form__group">
                                                        <div className="form__group_top-row">
                                                            <div className="form__group_top-row-left">
                                                                    <img src={drug_drop}></img>
                                                                    <div>
                                                                    <label className="form__label_group form__label">Levels:  <img className="form__icon-info" src={info} />
                                                                    </label>
                                                                    <div className="form__prompt" id="basic-addon4">Numerical traits that show as a progress bar</div>
                                                                </div>
                                                            </div>
                                                            <button type="button" className="btn btn_primary btn_orange btn__counter" onClick={this.addLevelInput}>+</button>
                                                        </div>
                                                        <div className="form__group_bottom-row">
                                                            {
                                                            <div id="user-properties">
                                                                {
                                                                    this.state.levelsElements ?
                                                                    this.state.levelsElements.map(v => v.work ? v.element : null) :
                                                                    null
                                                                }
                                                            </div>
                                                            }
                                                            {/*<div className="form__group_bottom-row-last">
                                                                <div className="input-group">
                                                                    <input type="text" placeholder="Property"  className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                                </div>
                                                                <div className="input-group">
                                                                    <input type="text" placeholder="Value 1"  className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                                </div>
                                                                <div className="input-group">
                                                                    <input type="text" placeholder="Value 2"  className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                                </div>
                                                        </div>*/}
                                                            
                                                    </div>
                                                </div>
                                                
                                            </div> 

                                            <div className="form__group mb-4">
                                                <div className="form__group_top-row">
                                                    <div className="form__group_top-row-left">
                                                            <img src={drug_drop}></img>
                                                            <div>
                                                            <label className="form__label_group form__label">Stats:  <img className="form__icon-info" src={info} />
                                                            </label>
                                                            <div className="form__prompt" id="basic-addon4">Numerical traits that just show as numbers</div>
                                                        </div>
                                                    </div>
                                                    <button type="button" className="btn btn_primary btn_orange btn__counter" onClick={this.addStatInput}>+</button>
                                                </div>
                                                <div className="form__group_bottom-row">
                                                    {
                                                    <div id="user-properties">
                                                        {
                                                            this.state.statsElements ?
                                                            this.state.statsElements.map(v => v.work ? v.element : null) :
                                                            null
                                                        }
                                                    </div>
                                                    }
                                                    {/*<div className="form__group_bottom-row-last">
                                                        <div className="input-group_wide input-group">
                                                            <input type="text" placeholder="Property"  className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                        </div>
                                                        <div className="input-group">
                                                            <input type="text" placeholder="Value"  className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                                        </div>
                                                </div>*/}
                                                </div>
                                            </div>

                                            <div className="form__group mb-4">
                                                <div className="form__group_top-row">
                                                    <div className="form__group_top-row-left">
                                                            <img src={drug_drop}></img>
                                                            <div>
                                                            <label className="form__label_group form__label">Unlockable Content:  <img className="form__icon-info" src={info} />
                                                            </label>
                                                            <div className="form__prompt" id="basic-addon4">Include unlockable content that can only be revealed by the owner of the item</div>
                                                        </div>
                                                    </div>
                                                        <label className="switch">
                                                        <input type="checkbox" role="switch"></input>
                                                        <span className="slider round"></span>
                                                </label>  
                                                    </div>
                                                    <div input-group>
                                                        <textarea type="text" value={this.state.description2} onChange={this.onChangeDescription2} className="form__textarea form__textarea_desct-nft-collection" id="basic-url" aria-describedby="basic-addon3 basic-addon4"></textarea>
                                                    </div>
                                            </div>
                                        </div>
                                        <div className="form_row mb-4">
                                            <div className="form_col_action_left form_col_last form_col">
                                            <button className="btn btn_pre-sm  btn_primary btn_gray" onClick={this.prevStageAddNft}>
                                                    Back
                                                </button>
                                                <button className="btn btn_pre-sm  btn_primary btn_orange" onClick={this.createNFT}>
                                                    Create
                                                </button>
                                            </div>
                                        </div>
                                </div>
                            : null
                        }
                <ConfirmModal
                    showConfirm={this.state.showConfirm} 
                    handleCloseConfirm={this.handleCloseConfirm}
                    confirmTitle={this.state.confirmTitle}
                    confirmName={this.state.confirmName}
                    confirmText={this.state.confirmText}
                />
                <ProgressModal showProgress={this.state.showProgress} handleCloseProgress={this.handleCloseProgress}/>
                <SuccessModal
                    showSuccess={this.state.showSuccess} 
                    handleCloseSuccess={this.handleCloseSuccess}
                    successName={this.state.successName} 
                    successTitle={this.state.successTitle}
                    successText={this.state.successText}
                />
                <ErrorModal
                    showError={this.state.showError}
                    handleCloseError={this.handleCloseError}
                    errorText={this.state.errorText}
                    errorName={this.state.errorName}
                />
                     </>
                }
            </>
        )
    }
}

export default NFTCollections