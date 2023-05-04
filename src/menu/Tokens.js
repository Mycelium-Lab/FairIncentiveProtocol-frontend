import { Component } from "react";
import { ethers, ContractFactory } from "ethers";
import { createLongStrView } from "../utils/longStrView";
import ERC20Mintable from "../contracts/erc20/ERC20Mintable.json";
import { getBearerHeader } from "../utils/getBearerHeader";
import { config } from "../utils/config";

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

    async createToken() {
        try {
            const Token = new ContractFactory(ERC20Mintable.abi, ERC20Mintable.bytecode, this.state.signer)
            const contract = await Token.deploy(this.state.name, this.state.symbol);
            const contractAdddress = await contract.getAddress()
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
                redirect: 'follow',
                mode: 'no-cors'
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
                redirect: 'follow',
                mode: 'no-cors'
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

    onChangeName = this.onChangeName.bind(this)
    onChangeSymbol = this.onChangeSymbol.bind(this)
    connect = this.connect.bind(this)
    createToken = this.createToken.bind(this)
    getTokens = this.getTokens.bind(this)
    getTokenSupply = this.getTokenSupply.bind(this)

    render() {
        return (
            <div>
                <h3>Tokens</h3>
                <button onClick={this.connect} type="button" className="btn btn-success">{this.state.address ? createLongStrView(this.state.address) : 'Connect'}</button>
                <div className="input-group mb-3">
                        <input onChange={this.onChangeName} type="text" className="form-control" placeholder="Name" aria-describedby="basic-addon1"/>
                        <input onChange={this.onChangeSymbol} type="text" className="form-control" placeholder="Symbol" aria-describedby="basic-addon1"/>
                </div>
                <button onClick={this.createToken} type="button" className="btn btn-primary">Create new token</button>
                <div>
                    <ul className="list-group list-group-flush">
                        <ul className="list-group list-group-horizontal">
                            <li className="list-group-item">
                                Symbol
                            </li>
                            <li className="list-group-item">
                                Address
                            </li>
                        </ul>
                        {
                            this.state.tokens.map(v => {
                                return <ul className="list-group list-group-horizontal">
                                    <li className="list-group-item">
                                        {v.symbol}
                                    </li>
                                    <li className="list-group-item">
                                        {v.address}
                                    </li>
                                </ul>
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

export default Tokens