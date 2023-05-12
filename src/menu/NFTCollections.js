import { Component } from "react";
import { ethers } from "ethers";
import { createLongStrView } from "../utils/longStrView";
import ERC721Mintable from "../contracts/erc721/ERC721Mintable.json";
import { getBearerHeader } from "../utils/getBearerHeader";
import { config } from "../utils/config";
import Modal from 'react-bootstrap/Modal';

class NFTCollections extends Component {

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
            showAddNFT: false,
            addNFTAddress: '',
            addNFTAmount: null,
            addNFTName: '',
            addNFTDescription: null,
            nftCollections: []
        }
    }

    async componentDidMount() {
        await this.getNFTCollections()
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
            alert(error)
        }
    }

    async createNFTCollection() {
        try {
            const NFT = new ethers.ContractFactory(ERC721Mintable.abi, ERC721Mintable.bytecode, this.state.signer)
            const contract = await NFT.deploy(this.state.name, this.state.symbol, config.signerAddress);
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
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/nftCollections/add/collection`, requestOptions)
            if (res.status === 200) {
                alert('Added to database. Please to use wait for tx to complete.')
                const _nfts = this.state.nftCollections
                _nfts.push({
                    name: this.state.name,
                    symbol: this.state.symbol,
                    address: contractAdddress,
                    totalSupply: '0'
                })
                this.setState({
                    nftCollections: _nfts,
                    showCreate: false
                })
            } else {
                alert('Something went wrong')
            }
        } catch (error) {
            alert(error)
        }
    }

    async createNFT() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const chainid = (await provider.getNetwork()).chainId
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())
            const raw = JSON.stringify({
                "address": this.state.addNFTAddress,
                "amount": this.state.addNFTAmount,
                "name": this.state.addNFTName,
                "description": this.state.addNFTDescription,
                "chainid": chainid.toString()
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/nfts/add/nft`, requestOptions)
            if (res.status === 200){
                alert('Done')
                this.setState({
                    showAddNFT: false
                })
            }
            else alert('Something went wrong')
        } catch (error) {
            alert(error)
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
                nftCollections: json.nftCollections
            })
        } catch (error) {
            alert(error)
        }
    }

    handleCloseCreate = () => this.setState({showCreate: false})
    handleShowCreate = () => this.setState({showCreate: true})

    handleCloseAddNFT = () => this.setState({showAddNFT: false})
    handleShowAddNFT = (addNFTAddress) => this.setState({showAddNFT: true, addNFTAddress})

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

    render() {
        return (
            <div>
                <div className="title-header">
                    <h3>NFT collections</h3>
                    <button onClick={this.handleShowCreate} type="button" className="btn btn-dark">Create new collection</button>
                </div>
                <Modal show={this.state.showCreate} onHide={this.handleCloseCreate} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Collection details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <button onClick={this.connect} type="button" className="btn btn-dark">{this.state.address ? createLongStrView(this.state.address) : 'Connect'}</button>
                        <div class="mb-3">
                            <label class="form-label">Name</label>
                            <div class="input-group">
                                <input type="text" placeholder="Example: Treasures of the sea" onChange={this.onChangeName} class="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Symbol</label>
                            <div class="input-group">
                                <input type="text" placeholder="Example: TOS" onChange={this.onChangeSymbol} class="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn-dark" onClick={this.createNFTCollection}>
                        Create
                    </button>
                    <button className="btn btn-light" onClick={this.handleCloseCreate}>
                        Cancel
                    </button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showAddNFT} onHide={this.handleCloseAddNFT} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Add NFT</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div class="mb-3">
                        <label class="form-label">Name</label>
                        <div class="input-group">
                            <input type="text" onChange={this.onChangeAddNFTName} class="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                        </div>
                        <div class="form-text" id="basic-addon4">Mostly for you</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Description (optional)</label>
                        <div class="input-group">
                            <textarea type="text" onChange={this.onChangeAddNFTDescription} class="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"></textarea>
                        </div>
                        <div class="form-text" id="basic-addon4">Mostly for you</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Maximum amount (optional)</label>
                        <div class="input-group">
                            <input type="number" onChange={this.onChangeAddNFTAmount} class="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                        </div>
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn-dark" onClick={this.createNFT}>
                        Create
                    </button>
                    <button className="btn btn-light" onClick={this.handleCloseAddNFT}>
                        Cancel
                    </button>
                    </Modal.Footer>
                </Modal>
                <div>
                    <table className="table table-bordered border-dark">
                        <thead>
                            <tr className="table-secondary" >
                            <th className="table-secondary" scope="col">Name</th>
                            <th className="table-secondary" scope="col">Symbol</th>
                            <th className="table-secondary" scope="col">NFT items</th>
                            <th className="table-secondary" scope="col">Info</th>
                            <th className="table-secondary" scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.nftCollections.map(v =>
                                    <tr className="table-secondary">
                                        <td className="table-secondary">
                                            {v.name}
                                        </td>
                                        <td className="table-secondary">
                                            {v.symbol}
                                        </td>
                                        <td className="table-secondary">
                                            (soon)
                                        </td>
                                        <td className="table-secondary">
                                            (soon)
                                        </td>
                                        <td className="table-secondary">
                                            <button className="btn btn-dark" onClick={() => this.handleShowAddNFT(v.address)}>Add NFT</button>
                                            <button className="btn btn-dark" disabled>Collection details</button>
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

export default NFTCollections