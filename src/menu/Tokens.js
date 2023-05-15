import { Component } from "react";
import { ethers, ContractFactory } from "ethers";
import { createLongStrView } from "../utils/longStrView";
import ERC20Mintable from "../contracts/erc20/ERC20Mintable.json";
import { getBearerHeader } from "../utils/getBearerHeader";
import { config } from "../utils/config";
import Modal from 'react-bootstrap/Modal';

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
            tokens: []
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
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <div className="input-group">
                                <input type="text" placeholder="e.g. Bitcoin" onChange={this.onChangeName} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Symbol</label>
                            <div className="input-group">
                                <input type="text" placeholder="e.g. BTC" onChange={this.onChangeSymbol} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
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