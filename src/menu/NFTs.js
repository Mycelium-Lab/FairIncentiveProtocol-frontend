import { Component } from "react";
import { ethers, ContractFactory } from "ethers";
import { createLongStrView } from "../utils/longStrView";
import ERC721Mintable from "../contracts/erc721/ERC721Mintable.json";
import { getBearerHeader } from "../utils/getBearerHeader";
import { config } from "../utils/config";

class NFTs extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: null,
            symbol: null,
            provider: null,
            chainid: null,
            signer: null,
            address: null,
            nfts: []
        }
    }

    async componentDidMount() {
        await this.getNFTs()
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

    async createNFT() {
        try {
            const NFT = new ContractFactory(ERC721Mintable.abi, ERC721Mintable.bytecode, this.state.signer)
            const contract = await NFT.deploy(this.state.name, this.state.symbol);
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
                referrerPolicy: "unsafe_url"
              };
            const res = await fetch(`${config.api}/nfts/add`, requestOptions)
            if (res.status === 200) {
                alert('Added to database. Please to use wait for tx to complete.')
                const _nfts = this.state.nfts
                _nfts.push({
                    symbol: this.state.symbol,
                    address: contractAdddress,
                    totalSupply: '0'
                })
                this.setState({
                    nfts: _nfts
                })
            } else {
                alert('Something went wrong')
            }
        } catch (error) {
            alert(error)
        }
    }

    async getNFTs() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow',
                referrerPolicy: "unsafe_url"
              };
            const res = await fetch(`${config.api}/nfts`, requestOptions)
            const json = await res.json()
            this.setState({
                nfts: json.nfts
            })
        } catch (error) {
            alert(error)
        }
    }

    onChangeName = this.onChangeName.bind(this)
    onChangeSymbol = this.onChangeSymbol.bind(this)
    connect = this.connect.bind(this)
    createNFT = this.createNFT.bind(this)
    getNFTs = this.getNFTs.bind(this)

    render() {
        return (
            <div>
                <h3>NFTs</h3>
                <button onClick={this.connect} type="button" className="btn btn-success">{this.state.address ? createLongStrView(this.state.address) : 'Connect'}</button>
                <div className="input-group mb-3">
                        <input onChange={this.onChangeName} type="text" className="form-control" placeholder="Name" aria-describedby="basic-addon1"/>
                        <input onChange={this.onChangeSymbol} type="text" className="form-control" placeholder="Symbol" aria-describedby="basic-addon1"/>
                </div>
                <button onClick={this.createNFT} type="button" className="btn btn-primary">Create new NFT</button>
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
                            this.state.nfts.map(v => {
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

export default NFTs