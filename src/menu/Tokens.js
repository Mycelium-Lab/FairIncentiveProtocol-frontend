import { Component } from "react";
import { ethers, ContractFactory } from "ethers";
import { createLongStrView } from "../utils/longStrView";
import ERC20Mintable from "../contracts/erc20/ERC20Mintable.json";
import { getBearerHeader } from "../utils/getBearerHeader";
import { config } from "../utils/config";
import Modal from 'react-bootstrap/Modal';
import { networks } from "../utils/networks";
import '../styles/tokens.css'

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
            tokens: [],
            network: networks[config.status === "test" ? '5' : '1'],

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

    async connect() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            await provider.send("eth_requestAccounts", [])
            const signer = await provider.getSigner()
            const address = await signer.getAddress()
            const chainid = (await provider.getNetwork()).chainId
            this.setState({
                provider,
                signer,
                address,
                chainid
            })
        } catch (error) {
            alert(error)
        }
    }

    async createToken() {
        try {
            const Token = new ContractFactory(ERC20Mintable.abi, ERC20Mintable.bytecode, this.state.signer)
            const contract = await Token.deploy(this.state.name, this.state.symbol);
            const contractAdddress = contract.address
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())
            const raw = JSON.stringify({
                "address": contractAdddress,
                "name": this.state.name,
                "symbol": this.state.symbol,
                "chainid": this.state.chainid.toString()
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/tokens/add`, requestOptions)
            if (res.status === 200) {
                alert('Added to database. Please to use wait for tx to complete.')
                const _tokens = this.state.tokens
                _tokens.push({
                    symbol: this.state.symbol,
                    address: contractAdddress,
                    totalSupply: '0'
                })
                this.setState({
                    tokens: _tokens
                })
            } else {
                alert('Something went wrong')
            }
        } catch (error) {
            alert(error)
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
                v.tokenSupply = await this.getTokenSupply(v.address)
            })
            this.setState({
                tokens: json.tokens
            })
        } catch (error) {
            alert(error)
        }
    }

    async getTokenSupply(address) {
        try {
            const tokenContract = new ethers.Contract(address, ERC20Mintable.abi, this.state.signer)
            const tokenSupply = await tokenContract.tokenSupply()
            return tokenSupply.toString()
        } catch (error) {
            return '0'
        }
    }

    handleCloseCreate = () => this.setState({showCreate: false})
    handleShowCreate = () => this.setState({showCreate: true})

    onChangeName = this.onChangeName.bind(this)
    onChangeSymbol = this.onChangeSymbol.bind(this)
    connect = this.connect.bind(this)
    createToken = this.createToken.bind(this)
    getTokens = this.getTokens.bind(this)
    getTokenSupply = this.getTokenSupply.bind(this)
    handleShowCreate = this.handleShowCreate.bind(this)
    handleCloseCreate = this.handleCloseCreate.bind(this)

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
                                <select className="form-select" id="floatingSelectDisabled" aria-label="Floating label select example">
                                    <option>Capped</option>
                                    <option>Fixed</option>
                                    <option>Unlimited</option>
                                </select>
                            </div>
                            <div className="form-text" id="basic-addon4">Choose what emission limit your token will have</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Initial supply</label>
                            <div className="input-group">
                                <input type="text" placeholder="e.g. BTC" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                            <div className="form-text" id="basic-addon4">The number of coins minted during the creation of the contract</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Maximum supply *</label>
                            <input type="text" placeholder="1 000 000" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            <div className="form-text" id="basic-addon4">The maximum number of coins ever minted</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Blockchain</label>
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
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                <label class="form-check-label" for="flexCheckDefault">
                                    Pausable
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                <label class="form-check-label" for="flexCheckDefault">
                                    Burnable
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"/>
                                <label class="form-check-label" for="flexCheckChecked">
                                    Blacklist
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"/>
                                <label class="form-check-label" for="flexCheckChecked">
                                    Verified on Etherscan
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"/>
                                <label class="form-check-label" for="flexCheckChecked">
                                    Revoverable
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
                                this.state.tokens.map(v =>
                                    <tr className="table-secondary">
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
                                            <button className="btn btn-dark" disabled>Mint</button>
                                            <button className="btn btn-dark" disabled>Roles control</button>
                                            <button className="btn btn-dark" disabled>Pause</button>
                                            <button className="btn btn-dark" disabled>Blacklist</button>
                                            <button className="btn btn-dark" disabled>Token info</button>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default Tokens