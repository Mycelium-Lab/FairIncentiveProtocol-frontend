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
import '../../styles/tokens.scss'
import ConfirmModal from "../common/modals/confirm";
import ProgressModal from "../common/modals/progress";
import SuccessModal from "../common/modals/success";
import ErrorModal from "../common/modals/error";

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
            otherBurnAddress: null
        }
    }

    async componentDidMount() {
        await this.getTokens()
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

    async connect() {
        try {
            const { network } = this.state
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            await provider.send("eth_requestAccounts", [])
            const signer = await provider.getSigner()
            const address = await signer.getAddress()
            const chainid = (await provider.getNetwork()).chainId
            if (chainid.toString() !== network.chainid) {
                try {
                    this.handleShowConfirm('Confirm the network change', 'Please, confirm the network change in your wallet')
                    await window.ethereum.request({
                      method: 'wallet_switchEthereumChain',
                      params: [{ chainId: ethers.utils.hexValue(parseInt(network.chainid)) }]
                    })
                    // .then(() => window.location.reload())
                  } catch (err) {
                    console.log(err)
                    if (err.code === 4902) {
                      await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                          {
                            chainName: network.name,
                            chainId: ethers.utils.hexlify(parseInt(network.chainid)),
                            nativeCurrency: { name: network.currency, decimals: 18, symbol: network.currency},
                            rpcUrls: [network.rpc]
                          }
                        ]
                      })
                    //   .then(() => window.location.reload())
                    }
                  }
                  this.handleCloseConfirm()
            }
            this.setState({
                provider,
                signer,
                address,
                chainid
            })
        } catch (error) {
            console.log(error)
        }
    }

    async changeNetwork(id) {
        const network = networks[id]
        if (window.ethereum.isConnected()) {
            try {
                this.handleShowConfirm('Confirm the network change', 'Please, confirm the network change in your wallet')
                await window.ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: ethers.utils.hexValue(parseInt(network.chainid)) }]
                })
                // .then(() => window.location.reload())
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
        this.setState({
            network
        })
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
                network
            } = this.state
            const Token = new ContractFactory(ERC20Universal.abi, ERC20Universal.bytecode, signer)
            this.handleShowConfirm(`Confirm ${symbol} token creation`, `Please, confirm contract creation in your wallet`)
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
                network.fpmanager
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
                    tokens: _tokens
                })
            } else {
                alert('Something went wrong')
            }
            contract.deployed().then(() => {
                this.handleCloseProgress()
                this.handleShowSuccess(`${symbol} token created`, `The contract creation was successful`)
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
            this.handleShowConfirm(`Confirm the minting of ${mintTokenAmount} ${currentTokenSymbol} tokens`, `Please, confirm transaction in your wallet`)
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
            console.log(await provider.getNetwork())
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
            this.handleShowConfirm(`Confirm ${!isCurrentTokenPaused ? 'pausing' : 'unpausing'} ${currentTokenSymbol} token`, `Please, confirm transaction in your wallet`)
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
            this.handleShowConfirm(`Confirm burning ${currentTokenSymbol} token`, `Please, confirm tx in your wallet`)
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
            this.handleShowConfirm(`Confirm adding addresses to ${currentTokenSymbol} token blacklist`, `Please, confirm transaction in your wallet`)
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
                this.handleShowConfirm(`Confirm removing addresses from ${currentTokenSymbol} token blacklist`, `Please, confirm transaction in your wallet`)
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
        console.log(error)
    } 

    handleCloseCreate = () => this.setState({showCreate: false})
    handleShowCreate = () => this.setState({showCreate: true})
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
    handleShowConfirm = (confirmName, confirmText) => this.setState({showConfirm: true, confirmName, confirmText})
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
    handleCloseBlacklist = this.handleCloseBlacklist.bind(this)
    handleShowPause = this.handleShowPause.bind(this)
    handleClosePause = this.handleClosePause.bind(this)
    onChangeInitialSupply = this.onChangeInitialSupply.bind(this)
    onChangeMaxSupply = this.onChangeMaxSupply.bind(this)
    onChangePausable = this.onChangePausable.bind(this)
    onChangeBurnable = this.onChangeBurnable.bind(this)
    onChangeBlacklist = this.onChangeBlacklist.bind(this)
    onChangeVerified = this.onChangeVerified.bind(this)
    onChangeRecoverable = this.onChangeRecoverable.bind(this)
    changeNetwork = this.changeNetwork.bind(this)
    onChangeMintTokenAmount = this.onChangeMintTokenAmount.bind(this)
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
            <div>
                <div className="title-header">
                    <h3>Tokens</h3>
                    <button onClick={this.handleShowCreate} type="button" className="btn btn-dark">Create new token</button>
                </div>
                <Modal show={this.state.showCreate} onHide={this.handleCloseCreate} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Creating new token</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <button onClick={this.connect} type="button" className="btn btn-dark">{this.state.address ? createLongStrView(this.state.address) : 'Connect'}</button>
                        <h4>Specify the parameters of the new token</h4>
                        <div className="mb-3">
                            <label className="form-label">Token name *</label>
                            <div className="input-group">
                                <input type="text" placeholder="e.g. Bitcoin" onChange={this.onChangeName} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                            <div className="form-text" id="basic-addon4">Choose a name for your token</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Symbol *</label>
                            <div className="input-group">
                                <input type="text" placeholder="e.g. BTC" onChange={this.onChangeSymbol} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                            <div className="form-text" id="basic-addon4">Choose a symbol for your token</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Supply type *</label>
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
                            <div className="form-text" id="basic-addon4">Choose what emission limit your token will have</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Initial supply {this.state.emissionType === "1" ? "*" : null}</label>
                            <div className="input-group">
                                <input onChange={this.onChangeInitialSupply} type="number" placeholder="1 000 000" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                            <div className="form-text" id="basic-addon4">The number of coins minted during the creation of the contract</div>
                        </div>
                        {
                            this.state.emissionType === "0" 
                            ?
                            <div className="mb-3">
                                <label className="form-label">Maximum supply *</label>
                                <input onChange={this.onChangeMaxSupply} type="text" placeholder="1 000 000" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                <div className="form-text" id="basic-addon4">The maximum number of coins ever minted</div>
                            </div>
                            :
                            null
                        }
                        <div className="mb-3">
                            <label className="form-labelerc20_tokens_supply_types">Blockchain</label>
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
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Upload a picture of the token</label>
                            <div className="input-group">
                                <div className="input-image">
                                    <div className="input-image-button">(soon)</div>
                                </div>
                            </div>
                        </div>
                        <h4>Advanced settings</h4>
                        <div className="checks-contracts-types">
                            <div className="form-check">
                                <input onChange={() => this.onChangePausable(this.state.pausable ? false : true)} checked={this.state.pausable} className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                <label className="form-check-label" for="flexCheckDefault">
                                    Pausable
                                </label>
                            </div>
                            <div className="form-check">
                                <input onChange={() => this.onChangeBurnable(this.state.burnable ? false : true)} checked={this.state.burnable} className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                <label className="form-check-label" for="flexCheckDefault">
                                    Burnable
                                </label>
                            </div>
                            <div className="form-check">
                                <input onChange={() => this.onChangeBlacklist(this.state.blacklist ? false : true)} checked={this.state.blacklist} className="form-check-input" type="checkbox" value="" id="flexCheckChecked"/>
                                <label className="form-check-label" for="flexCheckChecked">
                                    Blacklist
                                </label>
                            </div>
                            <div className="form-check">
                                <input onChange={() => this.onChangeVerified(this.state.verified ? false : true)} checked={this.state.verified} className="form-check-input" type="checkbox" value="" id="flexCheckChecked"/>
                                <label className="form-check-label" for="flexCheckChecked">
                                    Verified on Etherscan
                                </label>
                            </div>
                            <div className="form-check">
                                <input onChange={() => this.onChangeRecoverable(this.state.recoverable ? false : true)} checked={this.state.recoverable} className="form-check-input" type="checkbox" value="" id="flexCheckChecked"/>
                                <label className="form-check-label" for="flexCheckChecked">
                                    Recoverable
                                </label>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn-dark" onClick={this.createToken}>
                        Create
                    </button>
                    <button className="btn btn-light" onClick={this.handleCloseCreate}>
                        Cancel
                    </button>
                    </Modal.Footer>
                </Modal>
                <div>
                    <table className="table table-bordered border-dark">
                        <thead>
                            <tr className="table-secondary" >
                            <th className="table-secondary" scope="col">Token</th>
                            <th className="table-secondary" scope="col">Balance</th>
                            <th className="table-secondary" scope="col">Price</th>
                            <th className="table-secondary" scope="col">Supply</th>
                            <th className="table-secondary" scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.tokens.map(v =>{
                                    return <tr className="table-secondary">
                                        <td className="table-secondary">
                                            <div>
                                                {v.symbol}
                                            </div>
                                            <div>
                                                {v.name}
                                            </div>
                                        </td>
                                        <td className="table-secondary">
                                            (soon)
                                        </td>
                                        <td className="table-secondary">
                                            (soon)
                                        </td>
                                        <td className="table-secondary">
                                            (soon)
                                        </td>
                                        <td className="table-secondary">
                                            <button className="btn btn-dark" onClick={() => this.handleShowMint(v.symbol, v.address, v.chainid)} disabled={v.supply_type == 1 ? true : false}>Mint</button>
                                            <button className="btn btn-dark" disabled>Roles control</button>
                                            <button className="btn btn-dark" onClick={() => this.handleShowPause(v.symbol, v.address, v.chainid)} disabled={!v.pausable}>{v.paused ? "Unpause" : "Pause"}</button>
                                            <button className="btn btn-dark" onClick={() => this.handleShowBlacklist(v.symbol, v.address, v.chainid)} disabled={!v.blacklist}>Blacklist</button>
                                            <button className="btn btn-dark" onClick={() => this.handleShowBurn(v.symbol, v.address, v.chainid)} disabled={!v.burnable}>Burn</button>
                                            <button className="btn btn-dark" disabled>Token info</button>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <Modal show={this.state.showMint} onHide={this.handleCloseMint} centered>
                    <Modal.Header closeButton>
                            Mint new {this.state.currentTokenSymbol} tokens
                    </Modal.Header>
                    <Modal.Body>
                        {
                            this.state.showLoading
                            ?
                            <div className="spinner-border" role="status"></div>
                            :
                            <>
                            <div>
                                <ol className="mint-token-info-list">
                                    <li>
                                        Total supply: {this.state.mintTokenTotalSupply} {this.state.currentTokenSymbol} 
                                    </li>
                                    <li>
                                        Max supply: {
                                            this.state.mintTokenMaxSupply === '0.0'
                                            ?
                                            `Infinity`
                                            :
                                            `${this.state.mintTokenMaxSupply} ${this.state.currentTokenSymbol}`
                                        } 
                                    </li>
                                    <li>
                                        Available to mint: {
                                            this.state.mintTokenMaxSupply === '0.0'
                                            ?
                                            `Infinity`
                                            :
                                            `${this.state.mintTokenAvailableToMint} ${this.state.currentTokenSymbol}`
                                        }
                                    </li>
                                </ol>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Amount to mint *</label>
                                <div className="input-group">
                                    <input type="number" onChange={this.onChangeMintTokenAmount} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                                <div className="form-text" id="basic-addon4">Enter the number of the ABC tokens you want to create</div>
                            </div>
                            </>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={this.mint} type="button" className="btn btn-dark">Mint</button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showPause} onHide={this.handleClosePause} centered>
                    <Modal.Header closeButton>
                        {this.state.isCurrentTokenPaused ? "Unpause" : "Pause"} {this.state.currentTokenSymbol} token
                    </Modal.Header>
                    <Modal.Footer>
                        <button type="button" className="btn btn-dark" onClick={this.pause}>{this.state.isCurrentTokenPaused ? "Unpause" : "Pause"}</button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showBlacklist} onHide={this.handleCloseBlacklist} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {this.state.currentTokenSymbol} token blacklist 
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            this.state.showLoading
                            ?
                            <div className="spinner-border" role="status"></div>
                            :
                            (
                                <table className="table table-bordered border-dark">
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
                                </table>
                            )
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-dark" onClick={this.removeFromBlacklist}>Remove</button>
                        <button className="btn btn-light" onClick={this.handleShowBlacklistAdd}>Add new</button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showBlacklistAdd} onHide={this.handleCloseBlacklistAdd} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Add to blacklist</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                            {this.state.currentTokenSymbol} tokens on blacklisted users' wallets will be frozen and cannot be sent from them. Add list of wallets to the text box. Each wallet on a new line.
                            </div>
                            <div>
                                <textarea onChange={this.onChangeBlacklistAddText}></textarea>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-dark" onClick={this.addToBlacklist}>Add</button>
                        </Modal.Footer>
                </Modal>
                <Modal show={this.state.showBurn} onHide={this.handleCloseBurn} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Burn {this.state.currentTokenSymbol} token</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label className="form-label">From who:</label>
                        <div className="choose-reward-node">
                            <div className="form-check">
                                <input 
                                    className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"
                                    value={burnAddressType.current} checked={this.state.currentBurnAddressType === burnAddressType.current}
                                    onChange={this.onChangeCurrentBurnType}
                                />
                                <label className="form-check-label" for="flexRadioDefault1">
                                    Current account
                                </label>
                            </div>
                            <div className="form-check">
                                <input 
                                    className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"
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
                                <label className="form-label">Other address:</label>
                                <div className="input-group">
                                    <input onChange={this.onChangeOtherBurnAddress} type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                            </div>
                            :
                            null
                        }
                        <div className="mb-3">
                            <label className="form-label">Burn amount:</label>
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
            </div>
        )
    }
}

export default Tokens