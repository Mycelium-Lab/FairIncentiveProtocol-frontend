import { Component } from "react";
import { ethers, ContractFactory } from "ethers";
import { createLongStrView } from "../utils/longStrView";
import ERC20Mintable from "../contracts/erc20/ERC20Mintable.json";
import ERC20Universal from "../contracts/erc20/ERC20Universal.json"
import { getBearerHeader } from "../utils/getBearerHeader";
import { config } from "../utils/config";
import Modal from 'react-bootstrap/Modal';
import { networks } from "../utils/networks";
import '../styles/tokens.css'
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
            showPause: false,
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
            mintTokenAmount: null,
            tokens: [],
            network: networks[config.status === "test" ? '5' : '1'],
            emissionType: emissionTypes[0].value,
            initialSupply: null,
            maxSupply: null,
            pausable: false,
            burnable: false,
            blacklist: false,
            verified: false,
            recoverable: false
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

    async changeNetwork(event) {
        const network = networks[event.target.value]
        if (this.state.address) {
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
                const token = (await res.json()).token
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
            if (error.message.includes('user rejected transaction')) {
                this.handleCloseProgress()
                this.handleShowError('User rejected transaction')
            }
            if (error.message.includes('Cap is 0')) {
                this.handleCloseConfirm()
                this.handleCloseProgress()
                this.handleShowError('The maximum supply is not set')
            }
            if (error.message.includes('Initial supply is 0')) {
                this.handleCloseConfirm()
                this.handleCloseProgress()
                this.handleShowError('The initial supply is not set')
            }
            console.log(error)
        }
    }

    async mint() {
        try {
            const {
                currentTokenSymbol,
                currentTokenAddress,
                mintTokenAmount
            } = this.state
            //TODO: учитывать сеть
            const provider = new ethers.providers.Web3Provider(window.ethereum)
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
            if (error.message.includes('user rejected transaction')) {
                this.handleCloseConfirm()
                this.handleCloseProgress()
                this.handleShowError('User rejected transaction')
            }
            console.log(error)
        }
    }

    async pause() {
        try {
            const {
                currentTokenSymbol,
                currentTokenAddress,
                isCurrentTokenPaused
            } = this.state
            const provider = new ethers.providers.Web3Provider(window.ethereum)
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
            if (error.message.includes('user rejected transaction')) {
                this.handleCloseConfirm()
                this.handleCloseProgress()
                this.handleShowError('User rejected transaction')
            }
            console.log(error)
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
            const tokens = json.tokens
            tokens.forEach(async (v) => {
                const data = await this.getToken(v.address)
                v.tokenSupply = data.tokenSupply
                v.paused = data.paused
            })
            this.setState({
                tokens: json.tokens
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

    handleCloseCreate = () => this.setState({showCreate: false})
    handleShowCreate = () => this.setState({showCreate: true})
    handleShowMint = (currentTokenSymbol, currentTokenAddress) => this.setState({showMint: true, currentTokenSymbol, currentTokenAddress})
    handleCloseMint = () => this.setState({showMint: false})
    handleShowPause = async (currentTokenSymbol, currentTokenAddress) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
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
                                <select onChange={this.changeNetwork} className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                    <option value={config.status === "test" ? '5' : '1'} selected={this.state.network.chainid === (config.status === "test" ? '5' : '1')}>{networks[config.status === "test" ? '5' : '1'].name}</option>
                                    <option value={config.status === "test" ? '97' : '56'} selected={this.state.network.chainid === (config.status === "test" ? '97' : '56')}>{networks[config.status === "test" ? '97' : '56'].name}</option>
                                    <option value={config.status === "test" ? '80001' : '137'} selected={this.state.network.chainid === (config.status === "test" ? '80001' : '137')}>{networks[config.status === "test" ? '80001' : '137'].name}</option>
                                    <option value={config.status === "test" ? '420' : '10'} selected={this.state.network.chainid === (config.status === "test" ? '420' : '10')} disabled={config.status === "test" ? true : false} >{networks[config.status === "test" ? '420' : '10'].name}</option>
                                    <option value={config.status === "test" ? '43113' : '43114'} selected={this.state.network.chainid === (config.status === "test" ? '43113' : '43114')}>{networks[config.status === "test" ? '43113' : '43114'].name}</option>
                                    <option value={config.status === "test" ? '421613' : '42161'} selected={this.state.network.chainid === (config.status === "test" ? '421613' : '42161')}>{networks[config.status === "test" ? '421613' : '42161'].name}</option>
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
                            <div class="form-check">
                                <input onChange={() => this.onChangePausable(this.state.pausable ? false : true)} checked={this.state.pausable} class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                <label class="form-check-label" for="flexCheckDefault">
                                    Pausable
                                </label>
                            </div>
                            <div class="form-check">
                                <input onChange={() => this.onChangeBurnable(this.state.burnable ? false : true)} checked={this.state.burnable} class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                <label class="form-check-label" for="flexCheckDefault">
                                    Burnable
                                </label>
                            </div>
                            <div class="form-check">
                                <input onChange={() => this.onChangeBlacklist(this.state.blacklist ? false : true)} checked={this.state.blacklist} class="form-check-input" type="checkbox" value="" id="flexCheckChecked"/>
                                <label class="form-check-label" for="flexCheckChecked">
                                    Blacklist
                                </label>
                            </div>
                            <div class="form-check">
                                <input onChange={() => this.onChangeVerified(this.state.verified ? false : true)} checked={this.state.verified} class="form-check-input" type="checkbox" value="" id="flexCheckChecked"/>
                                <label class="form-check-label" for="flexCheckChecked">
                                    Verified on Etherscan
                                </label>
                            </div>
                            <div class="form-check">
                                <input onChange={() => this.onChangeRecoverable(this.state.recoverable ? false : true)} checked={this.state.recoverable} class="form-check-input" type="checkbox" value="" id="flexCheckChecked"/>
                                <label class="form-check-label" for="flexCheckChecked">
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
                                            <button className="btn btn-dark" onClick={() => this.handleShowMint(v.symbol, v.address)} disabled={v.supply_type == 1 ? true : false}>Mint</button>
                                            <button className="btn btn-dark" disabled>Roles control</button>
                                            <button className="btn btn-dark" onClick={() => this.handleShowPause(v.symbol, v.address)} disabled={!v.pausable}>{v.paused ? "Unpause" : "Pause"}</button>
                                            <button className="btn btn-dark" disabled={!v.blacklist}>Blacklist</button>
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
                        <div>
                            <ol className="mint-token-info-list">
                                <li>
                                    Contract balance: (soon) {this.state.currentTokenSymbol} 
                                </li>
                                <li>
                                    Total supply: (soon) {this.state.currentTokenSymbol} 
                                </li>
                                <li>
                                    Max supply: (soon) {this.state.currentTokenSymbol} 
                                </li>
                                <li>
                                    Available to mint: (soon) {this.state.currentTokenSymbol} 
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