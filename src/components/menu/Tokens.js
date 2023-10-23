/* global BigInt */
import { Component } from "react";
import { ethers, ContractFactory } from "ethers";
import { Contract, Provider } from 'ethers-multicall';
import { createLongStrView } from "../../utils/longStrView";
import ERC20Mintable from "../../contracts/erc20/ERC20Mintable.json";
import ERC20Universal from "../../contracts/erc20/ERC20Universal.json"
import { getBearerHeader } from "../../utils/getBearerHeader";
import { config } from "../../utils/config";
import Modal from 'react-bootstrap/Modal';
import { networks } from "../../utils/networks";
import ConfirmModal from "../common/modals/confirm";
import ProgressModal from "../common/modals/progress";
import SuccessModal from "../common/modals/success";
import ErrorModal from "../common/modals/error";
import empty from "../../media/common/empty_icon.svg"
import info from '../../media/common/info-small.svg'
import infoDisabled from '../../media/common/info-small_disabled.svg'
import infoRed from '../../media/common/info-red.svg'
import more from '../../media/common/more.svg'
import copy from '../../media/common/copy.svg'
import search from '../../media/common/search.svg'
import metamask from '../../media/common/metamask.svg'
import walletconnect from '../../media/common/walletconnect.svg'
import down from '../../media/common/arrow_drop_down.svg'
import customTokeSymbol from '../../media/common/custom_toke_symbol.svg'
import FileUpload from "../FileUpload";
import { tokenTable, blacklistTable } from "../../data/tables";
import FPTable from "../common/FPTable";
import FPDropdown from "../common/FPDropdown";
import { Dropdown } from "react-bootstrap";
import loader from '../../media/common/loader.svg'
import LineChart from "../charts/LineChart";
import { newUser } from "../../data/data";

//TODO: Как-то добавлять провайдера и signer сразу

const emissionTypes = [
    {
        name: 'Capped',
        value: "0"
    },
    {
        name: 'Fixed',
        value: "1"
    },
    {
        name: 'Unlimited',
        value: "2"
    },
]

const burnAddressType = {
    current: 'current',
    other: 'other'
}

let editMintingManagersElementsLength = 0

class Tokens extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: null,
            symbol: null,
            provider: null,
            chainid: null,
            signer: null,
            address: null,
            showCreate: false,
            showMint: false,
            showBlacklist: false,
            showRoles: false,
            showInfo: false,
            showLoading: false,
            showBlacklistAdd: false,
            showPause: false,
            showBurn: false,
            showConfirm: false,
            showProgress: false,
            showSuccess: false,
            showError: false,
            successName: null,
            successText: null,
            errorText: null,
            confirmName: null,
            confirmText: null,
            isCurrentTokenPaused: null,
            currentTokenSymbol: null,
            currentTokenAddress: null,
            currentToken: null,
            currentTokenChainid: null,
            mintTokenAmount: null,
            mintTokenTotalSupply: null,
            mintTokenMaxSupply: null,
            mintTokenAvailableToMint: null,
            tokens: [],
            network: networks[config.status === "test" ? '5' : '1'],
            emissionType: emissionTypes[0].value,
            initialSupply: null,
            maxSupply: null,
            pausable: false,
            burnable: false,
            blacklist: false,
            verified: false,
            recoverable: false,
            currentTokenBlacklist: [],
            currentTokenBlacklistAddText: null,
            currentTokenBlacklistRemove: [],
            currentBurnAddressType: burnAddressType.current,
            burnAmount: null,
            otherBurnAddress: null,
            stageOfCreateToken: 0,
            editMintingManagersElements: [],
            tokenInfo: {},
            hasLoad: false,
            totalUserData: {
                labels: newUser.map(data => data.time),
                datasets: [{
                    data: newUser.map(data => data.amount),
                    borderColor: ['rgba(255, 159, 67, 0.85)'],
                }]
            },
        }
    }

    async componentDidMount() {
        this.setState({
            hasLoad: true
        })
        try{
            await this.getTokens()
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
            this.setState({
                stageOfCreateToken: 1,
                showCreate: true,
            })
        }
        if(this.props?.wallet?.provider && this.props?.wallet?.signer && this.props?.wallet?.address && this.props?.wallet?.chainid){
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

    onChangeEmissionType(event) {
        this.setState({
            emissionType: event.target.value
        })
    }

    onChangeInitialSupply(event) {
        this.setState({
            initialSupply: event.target.value
        })
    }

    onChangeMaxSupply(event) {
        this.setState({
            maxSupply: event.target.value
        })
    }

    onChangePausable(value) {
        this.setState({
            pausable: value
        })
    }

    onChangeBurnable(value) {
        this.setState({
            burnable: value
        })
    }

    onChangeBlacklist(value) {
        this.setState({
            blacklist: value
        })
    }

    onChangeVerified(value) {
        this.setState({
            verified: value
        })
    }

    onChangeRecoverable(value) {
        this.setState({
            recoverable: value
        })
    }

    onChangeMintTokenAmount(event) {
        this.setState({
            mintTokenAmount: event.target.value
        })
    }

    onChangeBlacklistAddText(event) {
        this.setState({
            currentTokenBlacklistAddText: event.target.value
        })
    }

    onChangeBlacklistRemove(address) {
        let currentTokenBlacklistRemove = this.state.currentTokenBlacklistRemove
        if (currentTokenBlacklistRemove.find(v => v === address)) {
            currentTokenBlacklistRemove = currentTokenBlacklistRemove.filter(v => v !== address)
        } else {
            currentTokenBlacklistRemove.push(address)
        }
        this.setState({currentTokenBlacklistRemove})
    }

    onChangeCurrentBurnType(event) {
        this.setState({currentBurnAddressType: event.target.value})
    }

    onChangeOtherBurnAddress(event) {
        this.setState({otherBurnAddress: event.target.value})
    }

    onChangeBurnAmount(event) {
        this.setState({burnAmount: event.target.value})
    }

    onChangeFpManager(event) {
        const network = this.state.network
        network.fpmanager = event.target.value;
        this.setState({network})
    }

    nextStage () {
        this.setState({stageOfCreateToken: this.state.stageOfCreateToken + 1 })
    }
    prevStage () {
        if(this.state.stageOfCreateToken === 1) {
            this.setState({stageOfCreateToken: this.state.stageOfCreateToken - 1, showCreate: false  })
        }
        else {
            this.setState({stageOfCreateToken: this.state.stageOfCreateToken - 1 })
        }
    }

    async connect() {
        const network = this.state.network
        // https://github.com/ethers-io/ethers.js/issues/866
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
                    stageOfCreateToken: 3
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

    async changeNetwork(id) {
        const network = networks[id]
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

    async createToken() {
        try {
            const {
                name,
                symbol,
                emissionType,
                initialSupply,
                maxSupply,
                burnable,
                blacklist,
                recoverable,
                verified,
                chainid,
                pausable,
                signer,
                network,
                address
            } = this.state
            const Token = new ContractFactory(ERC20Universal.abi, ERC20Universal.bytecode, signer)
            this.handleShowConfirm('Purchace', `Confirm ${symbol} token creation`, `Please, confirm contract creation in your wallet`)
            const contract = await Token.deploy(
                name,
                symbol,
                emissionType,
                maxSupply ? ethers.utils.parseEther(maxSupply).toString() : 0,
                initialSupply ? ethers.utils.parseEther(initialSupply).toString() : 0,
                pausable,
                burnable,
                blacklist,
                recoverable,
                network.fpmanager || address
            );
            this.handleCloseConfirm()
            this.handleShowProgress()
            const contractAdddress = contract.address
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())
            const raw = JSON.stringify({
                "address": contractAdddress,
                "name": name,
                "symbol": symbol,
                "chainid": chainid.toString(),
                "supply_type": emissionType,
                "max_supply": maxSupply ? ethers.utils.parseEther(maxSupply).toString() : null,
                "initial_supply": initialSupply ? ethers.utils.parseEther(initialSupply).toString() : null,
                "pausable": pausable,
                "burnable": burnable,
                "blacklist": blacklist,
                "recoverable": recoverable,
                "verified": verified,
                "fpmanager": network.fpmanager
                // "image"
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/tokens/add`, requestOptions)
            if (res.status === 200) {
                const token = (await res.json()).body.data
                const _tokens = this.state.tokens
                _tokens.push(token)
                this.setState({
                    tokens: _tokens,
                })
            } else {
                alert('Something went wrong')
            }
            contract.deployed().then(() => {
                this.handleCloseProgress()
                this.handleShowSuccess(`${symbol} token created`, `The contract creation was successful`)
                this.setState({
                    showCreate: false,
                    stageOfCreateToken: 0,
                })
            })
        } catch (error) {
            this.customError(error)
        }
    }

    async mint() {
        try {
            const {
                currentTokenSymbol,
                currentTokenAddress,
                mintTokenAmount,
                currentTokenChainid
            } = this.state
            let provider = new ethers.providers.Web3Provider(window.ethereum)
            let chainid = (await provider.getNetwork()).chainId
            if (chainid.toString() !== currentTokenChainid) {
                await this.changeNetwork(currentTokenChainid)
                provider = new ethers.providers.Web3Provider(window.ethereum)
            }
            await provider.send("eth_requestAccounts", [])
            const signer = await provider.getSigner()
            const Token = new ContractFactory(ERC20Universal.abi, ERC20Universal.bytecode, signer)
            const token = Token.attach(currentTokenAddress)
            this.handleShowConfirm('Mint', `Confirm the minting of ${mintTokenAmount} ${currentTokenSymbol} tokens`, `Please, confirm transaction in your wallet`)
            const tx = await token.mint(ethers.utils.parseEther(mintTokenAmount))
            this.handleCloseConfirm()
            this.handleShowProgress()
            tx.wait()
                .then(() => {
                    this.handleCloseProgress()
                    this.handleShowSuccess(`Token minted`, `You have successfully minted ${mintTokenAmount} ${currentTokenSymbol} tokens`)
                })
        } catch (error) {
            this.customError(error)
        }
    }

    async pause() {
        try {
            const {
                currentTokenSymbol,
                currentTokenAddress,
                isCurrentTokenPaused,
                currentTokenChainid
            } = this.state
            let provider = new ethers.providers.Web3Provider(window.ethereum)
            const chainid = (await provider.getNetwork()).chainId
            if (chainid.toString() !== currentTokenChainid) {
                await this.changeNetwork(currentTokenChainid)
                provider = new ethers.providers.Web3Provider(window.ethereum)
            }
            await provider.send("eth_requestAccounts", [])
            const signer = await provider.getSigner()
            const Token = new ContractFactory(ERC20Universal.abi, ERC20Universal.bytecode, signer)
            const token = Token.attach(currentTokenAddress)
            let tx;
            this.handleShowConfirm('Pause'`Confirm ${!isCurrentTokenPaused ? 'pausing' : 'unpausing'} ${currentTokenSymbol} token`, `Please, confirm transaction in your wallet`)
            if (!isCurrentTokenPaused) {
                tx = await token.pause()
            } else {
                tx = await token.unpause()
            }
            this.handleCloseConfirm()
            this.handleShowProgress()
            tx.wait()
                .then(() => {
                    this.handleCloseProgress()
                    this.handleShowSuccess(`Token ${!isCurrentTokenPaused ? 'paused' : 'unpaused'}`, `You have successfully ${!isCurrentTokenPaused ? 'paused' : 'unpaused'} ${currentTokenSymbol} token`)
                    this.setState({isCurrentTokenPaused: isCurrentTokenPaused ? false : true})
                })
        } catch (error) {
            this.customError(error)
        }
    }

    async burn() {
        try {
            const { currentBurnAddressType, otherBurnAddress, currentToken, currentTokenSymbol, burnAmount } = this.state
            this.handleShowConfirm('Burn', `Confirm burning ${currentTokenSymbol} token`, `Please, confirm tx in your wallet`)
            let tx;
            if (currentBurnAddressType === burnAddressType.current) {
                tx = await currentToken.burn(ethers.utils.parseEther(burnAmount.toString()))
            } else {
                tx = await currentToken.burnFrom(otherBurnAddress, ethers.utils.parseEther(burnAmount.toString()))
            }
            this.handleCloseConfirm()
            this.handleShowProgress()
            tx.wait().then(() => {
                this.handleCloseProgress()
                this.handleShowSuccess(`Success burning ${burnAmount} ${currentTokenSymbol} tokens`, `You have successfully burned ${currentTokenSymbol} tokens`)
            })
        } catch (error) {
            this.customError(error)
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
            const tokens = json.body.data
            tokens.forEach(async (v) => {
                const data = await this.getToken(v.address)
                v.tokenSupply = data.tokenSupply
                v.paused = data.paused
            })
            this.setState({
                tokens: json.body.data
            })
        } catch (error) {
            alert(error)
        }
    }

    async getToken(address) {
        try {
            // const provider = new ethers.providers.Web3Provider(window.ethereum)
            // await provider.send("eth_requestAccounts", [])
            // const signer = await provider.getSigner()
            // const Token = new ContractFactory(ERC20Universal.abi, ERC20Universal.bytecode, signer)
            // const tokenContract = Token.attach(address)
            // const tokenSupply = 0
            // const paused = await tokenContract.paused()
            return {
                tokenSupply: '0',
                paused: false
            } 
        } catch (error) {
            console.log(error)
            return '0'
        }
    }

    async addToBlacklist() {
        try {
            const { currentTokenSymbol, currentToken, currentTokenBlacklistAddText, currentTokenBlacklist } = this.state
            const blacklistAdd = currentTokenBlacklistAddText.split('\n')
            this.handleShowConfirm('Add to black list', `Confirm adding addresses to ${currentTokenSymbol} token blacklist`, `Please, confirm transaction in your wallet`)
            const tx = await currentToken.setBlacklistUsers(blacklistAdd)
            this.handleCloseConfirm()
            this.handleShowProgress()
            tx.wait().then(
                () => {
                    this.handleCloseProgress()
                    this.handleShowSuccess('Success adding to blacklist', `You have successfully added addresses to ${currentTokenSymbol} token blacklist`)
                    blacklistAdd.forEach(v => {
                        currentTokenBlacklist.push({
                            address: v,
                            time: new Date()
                        })
                    })
                    this.setState({currentTokenBlacklist})
                    this.handleCloseBlacklistAdd()
                }
            )
        } catch (error) {
            this.customError(error)
        }
    }

    async removeFromBlacklist() {
        try {
            const { currentTokenSymbol, currentToken, currentTokenBlacklistRemove } = this.state
            if (currentTokenBlacklistRemove.length) {
                this.handleShowConfirm('Remove from black list', `Confirm removing addresses from ${currentTokenSymbol} token blacklist`, `Please, confirm transaction in your wallet`)
                const tx = await currentToken.deleteBlacklistUsers(currentTokenBlacklistRemove)
                this.handleCloseConfirm()
                this.handleShowProgress()
                tx.wait().then(
                    () => {
                        this.handleCloseProgress()
                        this.handleShowSuccess('Success removing from blacklist', `You have successfully removed addresses from ${currentTokenSymbol} token blacklist`)
                        this.setState({
                            currentTokenBlacklistRemove: [],
                            currentTokenBlacklist: this.state.currentTokenBlacklist.filter(v => !currentTokenBlacklistRemove.includes(v.address))
                        })
                    }
                )
            } else throw Error('Empty list')
        } catch (error) {
            this.customError(error)
        }
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
        if (error.message.includes('invalid address')) {
            this.handleShowError("Invalid chief administrator's address")
        }
        console.log(error)
    } 

    handleCloseCreate = () => this.setState({showCreate: false})
    handleShowCreate = () => {
        this.setState({showCreate: true, stageOfCreateToken: 1})
    }
    handleShowMint = async (currentTokenSymbol, currentTokenAddress, currentTokenChainid) => {
        this.setState({showMint: true, showLoading: true})
        let provider = new ethers.providers.Web3Provider(window.ethereum)
        const chainid = (await provider.getNetwork()).chainId
        if (chainid.toString() !== currentTokenChainid) {
            await this.changeNetwork(currentTokenChainid)
            provider = new ethers.providers.Web3Provider(window.ethereum)
        }
        await provider.send("eth_requestAccounts", [])
        const signer = await provider.getSigner()
        const Token = new ContractFactory(ERC20Universal.abi, ERC20Universal.bytecode, signer)
        const tokenUsual = Token.attach(currentTokenAddress)  
        const totalSupply = BigInt((await tokenUsual.totalSupply()).toString())
        let cap;
        let mintTokenAvailableToMint = BigInt(0);
        try {
            cap = await tokenUsual.cap()
            cap = BigInt(cap.toString())
            mintTokenAvailableToMint = cap - totalSupply
        } catch (error) {
            cap = BigInt(0)
        }
        // const 
        this.setState({
            currentTokenSymbol, currentTokenAddress, currentTokenChainid, 
            mintTokenTotalSupply: ethers.utils.formatEther(totalSupply.toString()), mintTokenMaxSupply: ethers.utils.formatEther(cap.toString()),
            showLoading: false, mintTokenAvailableToMint: ethers.utils.formatEther(mintTokenAvailableToMint.toString())
        })
    }
    handleCloseMint = () => this.setState({showMint: false})

    handleShowBlacklist = async (currentTokenSymbol, currentTokenAddress, currentTokenChainid) => {
        try {
            this.setState({showBlacklist: true, currentTokenSymbol, currentTokenAddress, showLoading: true})
            let provider = new ethers.providers.Web3Provider(window.ethereum)
            const chainid = (await provider.getNetwork()).chainId
            if (chainid.toString() !== currentTokenChainid) {
                await this.changeNetwork(currentTokenChainid)
                provider = new ethers.providers.Web3Provider(window.ethereum)
            }
            const ethcallProvider = new Provider(provider);
            await ethcallProvider.init();
            await provider.send("eth_requestAccounts", [])
            const signer = await provider.getSigner()
            const Token = new ContractFactory(ERC20Universal.abi, ERC20Universal.bytecode, signer)
            const tokenUsual = Token.attach(currentTokenAddress)
            const tokenMulticall = new Contract(currentTokenAddress, ERC20Universal.abi)
            const lastBlacklistID = await tokenUsual.blacklistLastID()
            const usersPromises = [];
            for (let i = 0; i <= parseInt(lastBlacklistID); i++) {
                usersPromises.push(tokenMulticall.blacklistUsers(i));
            }
            const users = await ethcallProvider.all(usersPromises)
            const timesPromises = []
            for (let i = 0; i < users.length; i++) {
                timesPromises.push(tokenMulticall.blacklistTime(users[i]));
            }
            const times = await ethcallProvider.all(timesPromises)
            let currentTokenBlacklist = []
            for (let i = 0; i < users.length; i++) {
                if (users[i] !== ethers.constants.AddressZero) {
                    currentTokenBlacklist.push({
                        address: users[i],
                        time: new Date(parseInt(times[i])*1000)
                    })
                }
            }
            this.setState({
                currentTokenBlacklist, showLoading: false, provider,
                signer, currentToken: tokenUsual
            })
        } catch (error) {
            this.setState({
                currentTokenBlacklist: [], showLoading: false
            })
            console.log(error)
        }
    }
    handleCloseBlacklist = () => this.setState({showBlacklist: false, currentTokenSymbol: null, currentTokenAddress: null, currentTokenChainid: null, currentTokenBlacklistRemove: []})
    handleShowBlacklistAdd = () => this.setState({showBlacklistAdd: true, showBlacklist: false, currentTokenBlacklistRemove: []})
    handleCloseBlacklistAdd = () => this.setState({showBlacklistAdd: false, showBlacklist: true})

    handleShowRoles = (token) => {
        const mintingManagers = []
        // Добавить на реально созданном токене
        /*token.minting.forEach(v => {
            const mintingId = editMintingManagersElementsLength
            mintingManagers.push(
                {
                    id: mintingId,
                    element: 
                    <div className="user-custom-params">
                        <div className="input-group">
                            <input type="text" id={`edit-property-name-${mintingId}`} defaultValue={v.name} className="form-control" placeholder="Property name"/>
                        </div>
                        <div className="input-group">
                            <input type="text" id={`edit-property-value-${mintingId}`} defaultValue={v.value} className="form-control" placeholder="Property value"/>
                        </div>
                    <button type="button" className="btn btn_primary btn_orange">Revoke</button>
                    </div>,
                    name: v.name,
                    value: v.value,
                    work: true
                }
            )
            editMintingManagersElementsLength += 1
        })*/
        this.setState({showRoles: true})
    }
    handleCloseRoles = () => this.setState({showRoles: false})

    handleShowInfo = (info) =>  {
        this.setState({showInfo: true, tokenInfo: info})
    }
    handleCloseInfo = () =>  this.setState({showInfo: false})

    handleShowPause = async (currentTokenSymbol, currentTokenAddress, currentTokenChainid) => {
        let provider = new ethers.providers.Web3Provider(window.ethereum)
        const chainid = (await provider.getNetwork()).chainId
        if (chainid.toString() !== currentTokenChainid) {
            await this.changeNetwork(currentTokenChainid)
            provider = new ethers.providers.Web3Provider(window.ethereum)
        }
        await provider.send("eth_requestAccounts", [])
        const signer = await provider.getSigner()
        const Token = new ContractFactory(ERC20Universal.abi, ERC20Universal.bytecode, signer)
        const token = Token.attach(currentTokenAddress)
        const paused = await token.paused()
        this.setState({showPause: true, currentTokenSymbol, currentTokenAddress, isCurrentTokenPaused: paused})
    }
    handleClosePause = () => this.setState({showPause: false})
    handleShowConfirm = (confirmTitle, confirmName, confirmText) => this.setState({showConfirm: true, confirmTitle, confirmName, confirmText})
    handleCloseConfirm = () => this.setState({showConfirm: false, confirmName: null, confirmText: null})
    handleShowProgress = () => this.setState({showProgress: true})
    handleCloseProgress = () => this.setState({showProgress: false})
    handleShowSuccess = (successName, successText) => this.setState({showSuccess: true, successName, successText})
    handleCloseSuccess = () => this.setState({showSuccess: false, successName: null, successText: null})
    handleShowError = (errorText) => this.setState({showError: true, errorText})
    handleCloseError = () => this.setState({showError: false})
    handleShowBurn = async (currentTokenSymbol, currentTokenAddress, currentTokenChainid) => {
        this.setState({showLoading: true, showBurn: true})
        let provider = new ethers.providers.Web3Provider(window.ethereum)
        const chainid = (await provider.getNetwork()).chainId
        if (chainid.toString() !== currentTokenChainid) {
            await this.changeNetwork(currentTokenChainid)
            provider = new ethers.providers.Web3Provider(window.ethereum)
        }
        await provider.send("eth_requestAccounts", [])
        const signer = await provider.getSigner()
        const Token = new ContractFactory(ERC20Universal.abi, ERC20Universal.bytecode, signer)
        const token = Token.attach(currentTokenAddress)
        this.setState({showLoading: false, currentTokenSymbol, currentTokenAddress, currentTokenChainid, currentToken: token})
    }
    handleCloseBurn = () => this.setState({showBurn: false, currentTokenSymbol: null, currentTokenAddress: null, currentTokenChainid: null, currentToken: null})
    onChangeName = this.onChangeName.bind(this)
    onChangeSymbol = this.onChangeSymbol.bind(this)
    onChangeEmissionType = this.onChangeEmissionType.bind(this)
    connect = this.connect.bind(this)
    createToken = this.createToken.bind(this)
    getTokens = this.getTokens.bind(this)
    getToken = this.getToken.bind(this)
    handleShowCreate = this.handleShowCreate.bind(this)
    handleCloseCreate = this.handleCloseCreate.bind(this)
    handleShowMint = this.handleShowMint.bind(this)
    handleCloseMint = this.handleCloseMint.bind(this)
    handleShowBlacklist = this.handleShowBlacklist.bind(this)
    handleShowRoles = this.handleShowRoles.bind(this)
    handleShowInfo = this.handleShowInfo.bind(this)
    handleCloseBlacklist = this.handleCloseBlacklist.bind(this)
    handleCloseRoles = this.handleCloseRoles.bind(this)
    handleCloseInfo = this.handleCloseInfo.bind(this)
    handleShowPause = this.handleShowPause.bind(this)
    handleClosePause = this.handleClosePause.bind(this)
    onChangeInitialSupply = this.onChangeInitialSupply.bind(this)
    onChangeMaxSupply = this.onChangeMaxSupply.bind(this)
    onChangePausable = this.onChangePausable.bind(this)
    onChangeBurnable = this.onChangeBurnable.bind(this)
    onChangeBlacklist = this.onChangeBlacklist.bind(this)
    onChangeVerified = this.onChangeVerified.bind(this)
    onChangeRecoverable = this.onChangeRecoverable.bind(this)
    onChangeFpManager = this.onChangeFpManager.bind(this)
    changeNetwork = this.changeNetwork.bind(this)
    onChangeMintTokenAmount = this.onChangeMintTokenAmount.bind(this)
    nextStage = this.nextStage.bind(this)
    prevStage = this.prevStage.bind(this)
    mint = this.mint.bind(this)
    pause = this.pause.bind(this)
    handleShowConfirm = this.handleShowConfirm.bind(this)
    handleCloseConfirm = this.handleCloseConfirm.bind(this)
    handleShowProgress = this.handleShowProgress.bind(this)
    handleCloseProgress = this.handleCloseProgress.bind(this)
    handleShowSuccess = this.handleShowSuccess.bind(this)
    handleCloseSuccess = this.handleCloseSuccess.bind(this)
    handleShowError = this.handleShowError.bind(this)
    handleCloseError = this.handleCloseError.bind(this)
    handleShowBlacklistAdd = this.handleShowBlacklistAdd.bind(this)
    handleCloseBlacklistAdd = this.handleCloseBlacklistAdd.bind(this)
    onChangeBlacklistAddText = this.onChangeBlacklistAddText.bind(this)
    addToBlacklist = this.addToBlacklist.bind(this)
    removeFromBlacklist = this.removeFromBlacklist.bind(this)
    onChangeBlacklistRemove = this.onChangeBlacklistRemove.bind(this)
    handleShowBurn = this.handleShowBurn.bind(this)
    handleCloseBurn = this.handleCloseBurn.bind(this)
    onChangeCurrentBurnType = this.onChangeCurrentBurnType.bind(this)
    burn = this.burn.bind(this)
    onChangeOtherBurnAddress = this.onChangeOtherBurnAddress.bind(this)
    onChangeBurnAmount = this.onChangeBurnAmount.bind(this)

    render() {
        return (
            <>
                <div className="title-header">
                    <div>
                        <h3 className="menu__title">{this.state.stageOfCreateToken === 4 ? 'Congratulations!' : 'Tokens'}</h3>
                        {
                            this.state.showCreate && this.state.stageOfCreateToken !== 4 ? <span className="menu__subtitle">Creating new token: {
                                this.state.stageOfCreateToken === 1 
                                ? 'parameters and settings' :
                                this.state.stageOfCreateToken === 2
                                ? 'wallet connection' :
                                this.state.stageOfCreateToken === 3
                                ? 'roles and privileges'
                                : ''
                            }
                                </span> 
                                : null
                        }
                    </div>
                    {
                        this.state.tokens?.length && !this.state.stageOfCreateToken ? <button onClick={this.handleShowCreate} type="button" className="btn btn_orange btn_primary">Create new token</button> : null
                    }
                </div>

                {
                           this.state.hasLoad ?  <img className="modal__loader_view modal__loader" src={loader}></img>
                           :
                           <>
 {
                     !this.state.tokens?.length && !this.state.showCreate ?
                     <div className="empty">
                       <div className="empty__wrapper">
                           <img src={empty}></img>
                           <span className="empty__desc">You don't have any tokens yet</span>
                           <button onClick={this.handleShowCreate} type="button" className="btn btn_rounded btn_orange btn_sm">Create new token</button>
                       </div>
                     </div>
                     : null
                }

                {
                    this.state.showCreate && this.state.stageOfCreateToken === 1 ?
                    <div className="content__wrap">
                        <h4 className="menu__title-secondary mb-4">Specify the parameters of the new token</h4>
                        <div className="form__groups">

                            <div className="form_row mb-4">
                                <div className="form_col">
                                    <label className="form__label">Token name * <img src={info} className="form__icon-info"/></label>
                                    <div className="input-group">
                                        <input type="text" value={this.state.name} placeholder="e.g. Bitcoin" onChange={this.onChangeName} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4">Choose a name for your token</div>
                                </div>
                                <div className="form_col_last form_col">
                                    <label className="form__label">Symbol * <img src={info} className="form__icon-info"/></label>
                                    <div className="input-group">
                                    <input type="text" value={this.state.symbol} placeholder="e.g. BTC" onChange={this.onChangeSymbol} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4">Choose a symbol for your token</div>
                                </div>
                            </div>

                            <div className="form_row mb-4">
                                <div className="form_col">
                                    <label className="form__label">Supply type * <img src={info} className="form__icon-info"/></label>
                                    <div className="input-group">
                                        <select onChange={this.onChangeEmissionType} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                            {
                                                emissionTypes.map(v => {
                                                    return <option value={v.value} selected={this.state.emissionType === v.value}>
                                                        {v.name}
                                                    </option>
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4">Choose a symbol for your token</div>
                                </div>
                                <div className="form_col_last form_col">
                                    <label className="form__label">Initial supply {this.state.emissionType === "1" ? " *" : null} <img src={info} className="form__icon-info" /></label>
                                    <div className="input-group">
                                    <input onChange={this.onChangeInitialSupply} type="number" placeholder="1 000 000" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4">The number of coins minted during the creation of the contrac</div>
                                </div>
                            </div>

                            <div className="form_row mb-4">
                                {
                                    this.state.emissionType !== "2" 
                                    ? <div className="form_col">
                                    <label className="form__label">Maximum supply * <img src={info} className="form__icon-info" /></label>
                                    <div className="input-group">
                                        <input value={this.state.maxSupply} onChange={this.onChangeMaxSupply} type="text" placeholder="1 000 000" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4">The maximum number of coins ever minted</div>
                                    </div>
                                    : null
                                
                                }
                                
                                <div className="form_col_last form_col">
                                    <label className="form__label">Blockchain * <img src={info} className="form__icon-info" /></label>
                                    <div className="input-group">
                                        <select onChange={e => this.changeNetwork(e.target.value)} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                            <option value={config.status === "test" ? '5' : '1'} selected={this.state.network ? (this.state.network.chainid === (config.status === "test" ? '5' : '1')) : false}>{networks[config.status === "test" ? '5' : '1'].name}</option>
                                            <option value={config.status === "test" ? '97' : '56'} selected={this.state.network ? (this.state.network.chainid === (config.status === "test" ? '97' : '56')) : false}>{networks[config.status === "test" ? '97' : '56'].name}</option>
                                            <option value={config.status === "test" ? '80001' : '137'} selected={this.state.network ? (this.state.network.chainid === (config.status === "test" ? '80001' : '137')) : false}>{networks[config.status === "test" ? '80001' : '137'].name}</option>
                                            <option value={config.status === "test" ? '420' : '10'} selected={this.state.network ? (this.state.network.chainid === (config.status === "test" ? '420' : '10')) : false} disabled={config.status === "test" ? true : false} >{networks[config.status === "test" ? '420' : '10'].name}</option>
                                            <option value={config.status === "test" ? '43113' : '43114'} selected={this.state.network ? (this.state.network.chainid === (config.status === "test" ? '43113' : '43114')) : false}>{networks[config.status === "test" ? '43113' : '43114'].name}</option>
                                            <option value={config.status === "test" ? '421613' : '42161'} selected={this.state.network ? (this.state.network.chainid === (config.status === "test" ? '421613' : '42161')) : false}>{networks[config.status === "test" ? '421613' : '42161'].name}</option>
                                        </select>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4">Choose what emission limit your token will have</div>
                                </div>
                            </div>

                            <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                <label className="form__label_disbaled form__label">Upload a picture of the token </label>
                                    <FileUpload disabled></FileUpload>
                                </div>
                            </div>
                        </div>
                        <h4 className="menu__title-secondary mb-4">Advanced settings</h4>
                        <div className="form__groups">

                            <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                    <label className="form__label_disbaled form__label">Decimals <img src={infoDisabled} className="form__icon-info"/></label>
                                        <div className="input-group">
                                        <input onChange={this.onChangeMaxSupply} disabled type="number" placeholder="1 000 000" className="form-control_disabled form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                        </div>
                                    <div className="form__prompt_disabled form__prompt" id="basic-addon4">Insert the decimals precision of your token</div>
                                </div>
                            </div>

                            <div className="form_row mb-4">
                                <div className="form_col_flex form_col">
                                    <div className="form-check">
                                        <input onChange={() => this.onChangePausable(this.state.pausable ? false : true)} checked={this.state.pausable} type="checkbox" value="" id="flexCheckDefault"/>
                                        <label className="form-check-label" for="flexCheckDefault">
                                            Pausable <img src={info} className="form__icon-info"/>
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input onChange={() => this.onChangeBurnable(this.state.burnable ? false : true)} checked={this.state.burnable} type="checkbox" value="" id="burnable"/>
                                        <label className="form-check-label" for="burnable">
                                            Burnable <img src={info} className="form__icon-info"/>
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input onChange={() => this.onChangeBlacklist(this.state.blacklist ? false : true)} checked={this.state.blacklist} type="checkbox" value="" id="blacklist"/>
                                        <label className="form-check-label" for="blacklist">
                                            Blacklist <img src={info} className="form__icon-info" />
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input onChange={() => this.onChangeVerified(this.state.verified ? false : true)} checked={this.state.verified}  type="checkbox" value="" id="verifiedOnEtherscan"/>
                                        <label className="form-check-label" for="verifiedOnEtherscan">
                                            Verified on Etherscan <img src={info} className="form__icon-info"/>
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input onChange={() => this.onChangeRecoverable(this.state.recoverable ? false : true)} checked={this.state.recoverable} type="checkbox" value="" id="recoverable"/>
                                        <label className="form-check-label" for="recoverable">
                                            Recoverable <img src={info} className="form__icon-info"/>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form_row mb-4">
                                <div className="form_col_action_left form_col_last form_col">
                                    <button className="btn btn_pre-sm  btn_primary btn_gray" onClick={this.prevStage}>
                                        Back
                                    </button>
                                    {
                                    this.state.symbol && this.state.name && this.state.emissionType !=='2' && this.state.maxSupply ? 
                                    <button className="btn btn_pre-sm btn_primary btn_orange" onClick={this.nextStage}>
                                        Next
                                    </button>
                                    :  this.state.symbol && this.state.name && this.state.emissionType ==='2' ? 
                                    <button className="btn btn_pre-sm btn_primary btn_orange" onClick={this.nextStage}>
                                        Next
                                    </button>
                                    :   <button disabled className="btn btn_pre-sm  btn_primary btn_orange btn_disabled">
                                        Next
                                        </button>
                                }
                                </div>
                        </div>
                    </div> : null
                }
                
                {
                    this.state.showCreate && this.state.stageOfCreateToken === 2 && (this.props?.wallet?.chainid?.toString() !== this.state.chainid || !this.props?.wallet?.chainid)
                    ?  <div className="content__wrap">
                         <h4 className="menu__title-secondary">Choose a wallet connection method</h4>
                         <span className="menu__subtitle">To create a token, you need to complete a transaction using a cryptocurrency wallet</span>
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
                    : this.state.showCreate && this.state.stageOfCreateToken === 2 && this.props?.wallet?.chainid?.toString() === this.state.chainid ?
                     <div className="content__wrap">
                    <h4 className="menu__title-secondary mb-4">Configure access settings for token management</h4>

                    <div className="form__groups">
                       <div className="form_row mb-4">
                           <div className="form_col_last form_col">
                               <label className="form__label">Chief administrator of the token (owner) * <img src={info} className="form__icon-info"/></label>
                               <div className="input-group">
                                   <input type="text" value={this.state.network.fpmanager || this.state.address} onChange={this.onChangeFpManager} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                               </div>
                               <div className="form__prompt_warning form__prompt" id="basic-addon4">Attention: the wallet with this role has the right to carry out any actions</div>
                           </div>
                       </div>
                   </div>
                    
                   <div className="form_row mb-4">
                       <div className="form_col_action_left form_col_last form_col">
                           <button className="btn btn_pre-sm  btn_primary btn_gray" onClick={this.prevStage}>
                               Back
                           </button>
                           <button className="btn btn_pre-sm  btn_primary btn_orange" onClick={this.createToken}>
                               Create Token
                           </button>
                       </div>
                   </div>
                   </div>
                    : null
                }
                {
                   this.state.showCreate && this.state.stageOfCreateToken === 3
                    ?  <div className="content__wrap">
                         <h4 className="menu__title-secondary mb-4">Configure access settings for token management</h4>

                         <div className="form__groups">
                            <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                    <label className="form__label">Chief administrator of the token (owner) * <img src={info} className="form__icon-info"/></label>
                                    <div className="input-group">
                                        <input type="text" value={this.state.network.fpmanager || this.state.address} onChange={this.onChangeFpManager} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                    </div>
                                    <div className="form__prompt_warning form__prompt" id="basic-addon4">Attention: the wallet with this role has the right to carry out any actions</div>
                                </div>
                            </div>
                        </div>
                         
                        <div className="form_row mb-4">
                            <div className="form_col_action_left form_col_last form_col">
                                <button className="btn btn_pre-sm  btn_primary btn_gray" onClick={this.prevStage}>
                                    Back
                                </button>
                                <button className="btn btn_pre-sm  btn_primary btn_orange" onClick={this.createToken}>
                                    Create Token
                                </button>
                            </div>
                        </div>
                        </div> 
                    : this.props.chainid && this.state.stageOfCreateToken === 3 && this.props?.wallet?.chainid?.toString() === this.state.chainid ? 
                    <div className="content__wrap">
                    <h4 className="menu__title-secondary mb-4">Token successfully created!</h4>
                    <div className="form__groups">
                       <div className="form_row mb-4">
                           <div className="form_col_last form_col">
                               <label className="form__label">Your token address * <img src={info} className="form__icon-info"/></label>
                               <div className="input-group">
                                   <input type="text" value={'0xE8D562606F35CB14dA3E8faB1174F9B5AE8319c4'}  className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                   <button className="btn btn__copy btn_primary btn_orange ms-3">Copy</button>
                               </div>
                               <div className="form__prompt_warning form__prompt" id="basic-addon4"><a className="link__form-prompt link__primary">Show on etherscan</a></div>
                           </div>
                       </div>
                       <div className="form_row mb-4">
                       <div className="form_col_action_left form_col_last form_col">
                           <button className="btn btn_pre-sm  btn_primary btn_orange">
                               Done
                           </button>
                       </div>
                    </div>
                   </div>
                   </div> 
                    : null
                }
                   {
                     this.state.showCreate && this.state.stageOfCreateToken === 4
                    ?  <div className="content__wrap">
                         <h4 className="menu__title-secondary mb-4">Token successfully created!</h4>
                         <div className="form__groups">
                            <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                    <label className="form__label">Your token address * <img src={info} className="form__icon-info"/></label>
                                    <div className="input-group">
                                        <input type="text" value={'0xE8D562606F35CB14dA3E8faB1174F9B5AE8319c4'}  className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                        <button className="btn btn__copy btn_primary btn_orange ms-3">Copy</button>
                                    </div>
                                    <div className="form__prompt_warning form__prompt" id="basic-addon4"><a className="link__form-prompt link__primary">Show on etherscan</a></div>
                                </div>
                            </div>
                            <div className="form_row mb-4">
                            <div className="form_col_action_left form_col_last form_col">
                                <button className="btn btn_pre-sm  btn_primary btn_orange">
                                    Done
                                </button>
                            </div>
                         </div>
                        </div>
                        </div> 
                    : null
                }
                {
                        this.state.tokens?.length && !this.state.showCreate ? 
                        <div className="content__wrap">
                            <FPTable data={tokenTable}>
                                {
                                  this.state.tokens.map(v =>{
                                      return <tr>
                                          <td>
                                            <div className="token-name">
                                                <img src={customTokeSymbol}></img>
                                                <div>
                                                    <div>
                                                        {v.symbol}
                                                    </div>
                                                    <div>
                                                        {v.name}
                                                    </div>
                                                </div>
                                            </div>
                                          </td>
                                          <td>
                                              (soon)
                                              {/* <a className="info__content-mint_medium info__content-mint">{'[mint]'}</a> */}
                                          </td>
                                          <td>
                                              (soon)
                                              {/* Найти и добавить виджет графика цен */}
                                          </td>
                                          <td>
                                              (soon)
                                          </td>
                                          <td>
                                            <FPDropdown icon={more}>
                                                <Dropdown.Item className="dropdown__menu-item" onClick={() => this.handleShowMint(v.symbol, v.address, v.chainid)} disabled={v.supply_type == 1 ? true : false}>Mint</Dropdown.Item>
                                                <Dropdown.Item className="dropdown__menu-item" onClick={() => this.handleShowPause(v.symbol, v.address, v.chainid)} disabled={!v.pausable}>Pause</Dropdown.Item>
                                                <Dropdown.Item className="dropdown__menu-item" onClick={() => this.handleShowRoles(v.symbol, v.address, v.chainid)}>Roles control</Dropdown.Item>
                                                <Dropdown.Item className="dropdown__menu-item" onClick={() => this.handleShowBlacklist(v.symbol, v.address, v.chainid)} disabled={!v.blacklist}>Blacklist</Dropdown.Item>
                                                <Dropdown.Item className="dropdown__menu-item" onClick={() => this.handleShowInfo(v)}>Token info</Dropdown.Item>
                                            </FPDropdown>
                                          </td>
                                      </tr>
                                  })
                              }
                            </FPTable>
                        </div>
                  : null   
                }
              
                <Modal id="mint" show={this.state.showMint} onHide={this.handleCloseMint} centered>
                    <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                            Mint new {this.state.currentTokenSymbol} tokens
                    </Modal.Header>
                    <Modal.Body>
                        {
                           this.state.showLoading
                           ?
                           <div className="loader-wrapper">
                              <img className="modal__loader" src={loader}></img>
                           </div>
                           :
                           <>
                            <div>
                                <ol className="mint-token-info-list">
                                    <li className="modal-text">
                                        The contract balance: soon <img src={info} className="form__icon-info"/>
                                    </li>
                                    <li className="modal-text">
                                        Total supply: {this.state.mintTokenTotalSupply} {this.state.currentTokenSymbol}  <img src={info} className="form__icon-info"/>
                                    </li>
                                    <li className="modal-text">
                                    Max supply: {
                                            this.state.mintTokenMaxSupply === '0.0'
                                            ?
                                            `Infinity`
                                            :
                                            `${this.state.mintTokenMaxSupply} ${this.state.currentTokenSymbol}`
                                        }  <img src={info} className="form__icon-info"/>
                                    </li>
                                    <li className="modal-text">
                                    Available to mint: {
                                            this.state.mintTokenMaxSupply === '0.0'
                                            ?
                                            `Infinity`
                                            :
                                            `${this.state.mintTokenAvailableToMint} ${this.state.currentTokenSymbol}`
                                        } <img src={info} className="form__icon-info"/>
                                    </li>
                                </ol>
                            </div>
                            <div className="form_row mb-4">
                            <div className="form_col_last form_col">
                                <label className="form__label">Amount to mint * <img src={info} className="form__icon-info"/></label>
                                    <div className="input-group">
                                        <input type="number" onChange={this.onChangeMintTokenAmount} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4">Enter the number of the ABC tokens you want to create</div>
                            </div>
                            </div>
                            <div className="form_row">
                                <div className="form_col">
                                    <label className="form__label">Destination to send:</label>
                                </div>
                            </div>
                            <div className="form_row mb-4">
                                <div className="form_col_flex form_col">
                                    <div className="form-check custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="rd_1" name="rd" value="Contract balance"/>
                                            <label className="form-check-label custom-control-label green" for="rd_1">
                                                Contract balance <img src={info} className="form__icon-info"/>
                                            </label>
                                        </div>
                                        <div className="form-check custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="rd_2" name="rd" value="External wallet" />
                                            <label className="form-check-label custom-control-label red" for="rd_2">
                                                External wallet <img src={info} className="form__icon-info"/>
                                            </label>
                                        </div>
                                </div>
                            </div>
                            <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                    <label className="form__label">Send to:</label>
                                    <div className="input-group">
                                        <input type="text" placeholder="Address" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                    </div>
                                    <div className="form__prompt" id="basic-addon4">Enter a wallet to deliver the tokens to</div>
                                </div>
                            </div>
                            </>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={this.mint} type="button" className="btn btn_secondary btn_orange">Mint</button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showPause} onHide={this.handleClosePause} centered>
                    <Modal.Header closeButton>
                        {this.state.isCurrentTokenPaused ? "Unpause" : "Pause"} {this.state.currentTokenSymbol} token
                    </Modal.Header>
                    <Modal.Footer>
                        <button type="button" className="btn btn_orange" onClick={this.pause}>{this.state.isCurrentTokenPaused ? "Unpause" : "Pause"}</button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showBlacklist} onHide={this.handleCloseBlacklist} centered>
                    <Modal.Header className="modal-newuser__title modal-title modal-header"closeButton>
                            {this.state.currentTokenSymbol} token blacklist 
                    </Modal.Header>
                    <Modal.Body>
                            <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                            <div className="input-group search-input">
                                                <input type="text" placeholder="Search..." className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                            </div>
                                </div>
                            </div>
                        {
                            this.state.showLoading
                            ?
                            <div className="loader-wrapper">
                                   <img className="modal__loader" src={loader}></img>
                            </div>
                            :
                            (
                                /*<table className="table table-bordered border-dark">
                                <thead>
                                    <tr className="table-secondary" >
                                    <th className="table-secondary" scope="col">Select</th>
                                    <th className="table-secondary" scope="col">Wallet</th>
                                    <th className="table-secondary" scope="col">Block Date</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                    this.state.currentTokenBlacklist.map(
                                        v => {
                                            return (
                                                <tr className="table-secondary">
                                                    <td className="table-secondary">
                                                        <div className="form-check">
                                                            <input onChange={() => this.onChangeBlacklistRemove(v.address)} className="form-check-input" type="checkbox" value="" id="flexCheckChecked"/>
                                                        </div>
                                                    </td>
                                                    <td className="table-secondary">
                                                        {createLongStrView(v.address)}
                                                    </td>
                                                    <td className="table-secondary">
                                                        {
                                                            `${v.time.toLocaleDateString()} ${v.time.toLocaleTimeString().slice(0,5)}`
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        )
                                    }
                                </tbody>
                                </table>*/
                                <FPTable data={blacklistTable}>
                                    <td>
                                        <input  className="form-checkbox" type="checkbox" value="" id="flexCheckChecked"/>
                                    </td>
                                    <td>
                                        <span className="table-text">0xE8265C...F98319c4</span>
                                    </td>
                                    <td>
                                        <span className="table-text">22.08.2023 22:11</span>
                                    </td>
                                </FPTable>
                            )
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn_primary btn_gray" onClick={this.removeFromBlacklist}>Remove</button>
                        <button className="btn btn_primary btn_orange" onClick={this.handleShowBlacklistAdd}>Add new</button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showBlacklistAdd} onHide={this.handleCloseBlacklistAdd} centered>
                        <Modal.Header className="modal-newuser__title modal-title modal-header" closeButton>
                            Add to blacklist
                        </Modal.Header>
                        <Modal.Body>
                            <div className="modal-text mb-4">
                            {this.state.currentTokenSymbol} tokens on blacklisted users' wallets will be frozen and cannot be sent from them. Add list of wallets to the text box. Each wallet on a new line.
                            </div>
                            <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                    <textarea className="form__textarea form__textarea_add-blacklist" onChange={this.onChangeBlacklistAddText}></textarea>
                                </div>
                            </div>
                           
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn_secondary btn_orange" onClick={this.addToBlacklist}>Add</button>
                        </Modal.Footer>
                </Modal>
                <Modal show={this.state.showRoles} onHide={this.handleCloseRoles} centered>
                        <Modal.Header className="modal-newuser__title modal-title modal-header" closeButton>
                            Roles
                        </Modal.Header>
                        <Modal.Body>
                        <div className="form__groups">
                            <div className="form_row mb-4">
                                <div className="form_col_last form_col">
                                    <label className="form__label"><img src={infoRed} className="form__icon-info_left form__icon-info"/> Transfer ownership * <img src={info} className="form__icon-info"/></label>
                                    <div className="input-group_absolute input-group">
                                        <input type="text"placeholder="Address" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                        <button className="btn_wide btn btn_primary btn_orange ms-2">Transfer ownership</button>
                                    </div>
                                    <div className="form__prompt form__prompt_absolute" id="basic-addon4">Enter a wallet to transfer ownership of the contract</div>
                                </div>
                            </div>

                            <div className="form__group mb-4">
                            <div className="form__group_top-row">
                                <div className="form__group_top-row-left">
                                        <div>
                                        <label className="form__label_group form__label">Minting managers: <img className="form__icon-info" src={info} />
                                        </label>
                                        <div className="form__prompt" id="basic-addon4">Textual traits that show up as rectangles</div>
                                    </div>
                                </div>
                                <button type="button" className="btn btn_primary btn_orange btn__add-form">Add</button>
                            </div>
                            <div className="form__group_bottom-row">
                            {
                                            /* Добавить на созданном токене
                                            <div id="user-properties">
                                            {
                                                this.state.editPropertiesElements ?
                                                this.state.editPropertiesElements.map(v => v.work ? v.element : null) :
                                                null
                                            }
                                        </div>*/
                                        }
                                <div className="form__group_bottom-row-last">
                                    <div className="input-group_full input-group">
                                        <input type="text" placeholder="Address" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                    </div>
                                </div>
                            </div>
                            
                        </div>

                        <div className="form__group mb-4">
                            <div className="form__group_top-row">
                                <div className="form__group_top-row-left">
                                        <div>
                                        <label className="form__label_group form__label"><img src={infoRed} className="form__icon-info_left form__icon-info"/> Financial managers: <img className="form__icon-info" src={info} />
                                        </label>
                                        <div className="form__prompt" id="basic-addon4">Textual traits that show up as rectangles</div>
                                    </div>
                                </div>
                                <button type="button" className="btn btn_primary btn_orange btn__add-form">Add</button>
                            </div>
                            <div className="form__group_bottom-row">
                            {
                                            /* Добавить на созданном токене
                                            <div id="user-properties">
                                            {
                                                this.state.editPropertiesElements ?
                                                this.state.editPropertiesElements.map(v => v.work ? v.element : null) :
                                                null
                                            }
                                        </div>*/
                                        }
                                <div className="form__group_bottom-row-last">
                                    <div className="input-group_full input-group">
                                        <input type="text" placeholder="Address" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                         </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn_secondary btn_disabled" onClick={this.addToBlacklist}>Save</button>
                        </Modal.Footer>
                </Modal>
                <Modal show={this.state.showInfo} onHide={this.handleCloseInfo} centered>
                        <Modal.Header className="modal-newuser__title modal-title modal-header" closeButton>
                            {this.state.tokenInfo.symbol} token info
                        </Modal.Header>
                        <Modal.Body className="mb-4">
                        <div className="form_row mb-4">
                            <div className="form__group_top-row-left">
                                            <img src={customTokeSymbol}></img>
                                            <div>
                                            <div className="form__label_group form__label">
                                                {
                                                    this.state.tokenInfo.symbol
                                                }
                                            </div>
                                            <div className="modal-text modal-text__caption">
                                                { this.state.tokenInfo.name}
                                            </div>
                                        </div>
                            </div>
                            <div className="info__group-price info__group">
                                {/*<span className="form__label_group form__label">Price: ~ 11.7 USD</span>*/}
                                <span className="form__label_group form__label">Price: (soon)</span>
                                <span className="info__group-price_red info__group-price"> <img src={down} /> <span className="modal-text modal-text__caption">15.4%</span></span>
                            </div>
                        </div>
                            <div className="modal-text mb-4">
                                
                            <ol className="mint-token-info-list">
                                    <li className="modal-text">
                                        Contracts: (soon) <img src={info} className="form__icon-info"/>
                                       {/*<ul className="unlist">
                                            <li className="custom-marker_circle_black"><a className="link__primary">0x2170ed0880ac9a755fd29b2688956bd959f933f8</a> <img src={copy} className="form__icon-info"></img></li>
                                            </ul>*/}
                                    </li>
                                    <li className="modal-text">
                                        Holders: (soon) <img src={info} className="form__icon-info"/>
                                    </li>
                                    <li className="modal-text">
                                        Decimals: {this.state.tokenInfo.decimals ? this.state.tokenInfo.decimals : '-'} <img src={info} className="form__icon-info"/>
                                    </li>
                                    <li className="modal-text">
                                        The contract balance: (soon)<img src={info} className="form__icon-info"/>
                                    </li>
                                    <li className="modal-text">
                                        Total supply: (soon)<img src={info} className="form__icon-info"/>
                                    </li>
                                    <li className="modal-text">
                                        Max supply: {this.state.tokenInfo.max_supply ? this.state.tokenInfo.max_supply : '-'} <img src={info} className="form__icon-info"/>
                                    </li>
                                    <li className="modal-text">
                                        Circulating Supply: (soon) <img src={info} className="form__icon-info"/>
                                    </li>
                                    <li className="modal-text">
                                        Available to mint: (soon) <a className="info__content-mint_medium info__content-mint">{'[mint]'}</a> <img src={info} className="form__icon-info"/>
                                    </li>
                                </ol>
                            </div>

                          
                            <div className="dashboard__chart_reward">
                                <label className="chart__label">Token distribution <br/> statistic</label>
                                <div className="mb-4" style={{position: 'relative', width:'100%', display: 'flex', justifyContent: 'center', padding: '0 24px'}}>
                                <LineChart chartData={this.state.totalUserData}></LineChart>
                                </div>
                            </div>
                           
                        </Modal.Body>
                       {/* <Modal.Footer>
                            <button className="btn btn_secondary btn_orange" onClick={this.addToBlacklist}>Add</button>
                                        </Modal.Footer>*/}
                </Modal>
                <Modal show={this.state.showBurn} onHide={this.handleCloseBurn} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Burn {this.state.currentTokenSymbol} token</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label className="form__label">From who:</label>
                        <div className="choose-reward-node">
                            <div className="form-check">
                                <input 
                                     type="radio" name="flexRadioDefault" id="flexRadioDefault1"
                                    value={burnAddressType.current} checked={this.state.currentBurnAddressType === burnAddressType.current}
                                    onChange={this.onChangeCurrentBurnType}
                                />
                                <label className="form-check-label" for="flexRadioDefault1">
                                    Current account
                                </label>
                            </div>
                            <div className="form-check">
                                <input 
                                    type="radio" name="flexRadioDefault" id="flexRadioDefault2"
                                    value={burnAddressType.other} checked={this.state.currentBurnAddressType === burnAddressType.other}
                                    onChange={this.onChangeCurrentBurnType}
                                />
                                <label className="form-check-label" for="flexRadioDefault2">
                                    Other
                                </label>
                            </div>
                        </div>
                        {
                            this.state.currentBurnAddressType === burnAddressType.other
                            ?
                            <div className="mb-3">
                                <label className="form__label">Other address:</label>
                                <div className="input-group">
                                    <input onChange={this.onChangeOtherBurnAddress} type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                            </div>
                            :
                            null
                        }
                        <div className="mb-3">
                            <label className="form__label">Burn amount:</label>
                            <div className="input-group">
                                <input onChange={this.onChangeBurnAmount} type="number" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-dark" onClick={this.burn}>Burn</button>
                        <button className="btn btn-light" onClick={this.handleCloseBurn}>Cancel</button>
                    </Modal.Footer>
                </Modal>
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
                    successText={this.state.successText}
                />
                <ErrorModal 
                    showError={this.state.showError}
                    handleCloseError={this.handleCloseError}
                    errorText={this.state.errorText}
                />
                           </>
                }
            </>
        )
    }
}

export default Tokens