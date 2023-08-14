import { Component } from "react";
import { ethers } from "ethers";
import { createLongStrView } from "../utils/longStrView";
import ERC721Mintable from "../contracts/erc721/ERC721Mintable.json";
import ERC721DefaultRoyalty from "../contracts/erc721/ERC721DefaultRoyalty.json";
import ERC721TokenRoyalty from "../contracts/erc721/ERC721TokenRoyalty.json";
import { getBearerHeader } from "../utils/getBearerHeader";
import { config } from "../utils/config";
import { networks } from '../utils/networks'
import Modal from 'react-bootstrap/Modal';
import '../styles/nftCollections.css'
import ConfirmModal from "../common/modals/confirm";
import ProgressModal from "../common/modals/progress";
import SuccessModal from "../common/modals/success";
import ErrorModal from "../common/modals/error";

const beneficialTypes = {
    company: "company",
    owner: "owner"
}

class NFTCollections extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: null,
            symbol: null,
            description: null,
            chainid: 1,
            provider: null,
            chainid: null,
            signer: null,
            address: null,
            showCreate: false,
            showCreateImagesPage: false,
            showCreateBeneficialPage: false,
            showCreateLinkPage: false,
            showAddNFT: false,
            showConfirm: false,
            showProgress: false,
            showSuccess: false,
            showError: false,
            successName: null,
            successText: null,
            errorText: null,
            confirmName: null,
            confirmText: null,
            addNFTAddress: '',
            addNFTAmount: null,
            addNFTName: '',
            addNFTDescription: null,
            nftCollections: [],
            network: networks[config.status === "test" ? '5' : '1'],
            beneficialAddress: this.props.auth.wallet,
            beneficialType: beneficialTypes.company,
            royalties: null,
            website: null,
            instagram: null,
            telegram: null,
            medium: null,
            facebook: null,
            discord: null,
            other: null
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

    onChangeDescription(event) {
        this.setState({
            description: event.target.value
        })
    }

    onChangeBeneficialType(event) {
        this.setState({
            beneficialType: event.target.value
        })
    }

    onChangeBeneficialAddress(event) {
        this.setState({
            beneficialAddress: event.target.value
        })
    }

    onChangeRoyalties(event) {
        this.setState({
            royalties: event.target.value
        })
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
            this.handleShowConfirm(`Confirm ${symbol} collection creation`, `Please, confirm contract creation in your wallet`)
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
                beneficiary: beneficialAddress,
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
                    showCreate: false,
                    name: null,
                    symbol: null,
                    description: null,
                    beneficialType: beneficialTypes.company,
                    royalties: null,
                    website: null, instagram: null, telegram: null, medium: null, facebook: null, discord: null, other: null
                })
            } else {
                alert('Something went wrong')
            }
            contract.deployed().then(() => {
                this.handleCloseProgress()
                this.handleShowSuccess(`${symbol} collection created`, `The contract creation was successful`)
            })
        } catch (error) {
            alert(error)
        }
    }

    async createNFT() {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())
            const raw = JSON.stringify({
                "address": this.state.addNFTAddress,
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
                nftCollections: json.body.data
            })
        } catch (error) {
            alert(error)
        }
    }

    handleCloseCreate = () => this.setState({showCreate: false})
    handleShowCreate = () => this.setState({showCreate: true})

    handleCloseCreateImagesPage = () => this.setState({showCreateImagesPage: false})
    handleShowCreateImagesPage = () => this.setState({showCreateImagesPage: true})

    handleCloseCreateBeneficialPage = () => this.setState({showCreateBeneficialPage: false})
    handleShowCreateBeneficialPage = () => this.setState({showCreateBeneficialPage: true})

    handleCloseCreateLinkPage = () => this.setState({showCreateLinkPage: false})
    handleShowCreateLinkPage = () => this.setState({showCreateLinkPage: true})

    handleCloseAddNFT = () => this.setState({showAddNFT: false})
    handleShowAddNFT = (addNFTAddress) => this.setState({showAddNFT: true, addNFTAddress})
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
    onChangeDescription = this.onChangeDescription.bind(this)
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
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <div className="input-group">
                                <input type="text" value={this.state.name} placeholder="Example: Treasures of the sea" onChange={this.onChangeName} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Symbol</label>
                            <div className="input-group">
                                <input type="text" value={this.state.symbol} placeholder="Example: TOS" onChange={this.onChangeSymbol} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description (optional)</label>
                            <div className="input-group">
                                <textarea type="text" value={this.state.description} onChange={this.onChangeDescription} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"></textarea>
                            </div>
                            <div className="form-text" id="basic-addon4"><a href="https://www.markdownguide.org/cheat-sheet/" target="blank">Markdown</a> syntax is supported. 0 of 1000 characters used</div>
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
                            <div className="form-text" id="basic-addon4">Select the blockchain where you'd like new items from this collection to be added by default</div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    {
                        (
                            !this.state.address
                            ||
                            this.state.name === null
                            ||
                            this.state.name === ''
                            ||
                            this.state.symbol === null
                            ||
                            this.state.symbol === ''
                        )
                        ?
                        null
                        :
                        <button className="btn btn-dark" onClick={() => {
                            this.handleShowCreateImagesPage()
                            this.handleCloseCreate()
                        }}>
                            Next
                        </button>
                    }
                    <button className="btn btn-light" onClick={this.handleCloseCreate}>
                        Cancel
                    </button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showCreateImagesPage} onHide={this.handleCloseCreateImagesPage}>
                    <Modal.Header closeButton>
                        <Modal.Title>Collection graphics</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3">
                            <label className="form-label">Logo image *</label>
                            <div className="input-group">
                                <div className="input-image">
                                    <div className="input-image-button">(soon)</div>
                                </div>
                            </div>
                            <div className="form-text" id="basic-addon4">This image will also be used for display purposes. File types supported: JPG, PNG, GIF, SVG. Max size: 100 MB</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Featured image *</label>
                            <div className="input-group">
                                <div className="input-image">
                                    <div className="input-image-button">(soon)</div>
                                </div>
                            </div>
                            <div className="form-text" id="basic-addon4">This image will be used for featuring your collection on the homepage, category pages, or other display areas. File types supported: JPG, PNG, GIF, SVG. Max size: 100 MB</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Banner image *</label>
                            <div className="input-group">
                                <div className="input-image">
                                    <div className="input-image-button">(soon)</div>
                                </div>
                            </div>
                            <div className="form-text" id="basic-addon4">This image will appear at the top of your collection page. File types supported: JPG, PNG, GIF, SVG. Max size: 100 MB</div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-dark" onClick={() => {
                            this.handleCloseCreateImagesPage()
                            this.handleShowCreateBeneficialPage()
                        }}>Next</button>
                        <button type="button" className="btn btn-light" onClick={() => {
                            this.handleCloseCreateImagesPage()
                            this.handleShowCreate()
                        }}>Back</button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showCreateBeneficialPage} onHide={this.handleCloseCreateBeneficialPage}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Beneficial owner
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label className="form-label">Collection beneficiary can collect creator earnings when a user re-sells an item they created</label>
                        <label className="form-label">Beneficial recipient:</label>
                        <div className="choose-reward-node">
                            <div className="form-check">
                                <input 
                                    className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"
                                    value={beneficialTypes.company} checked={this.state.beneficialType === beneficialTypes.company}
                                    onChange={this.onChangeBeneficialType}
                                />
                                <label className="form-check-label" for="flexRadioDefault1">
                                    The company
                                </label>
                            </div>
                            <div className="form-check">
                                <input 
                                    className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"
                                    value={beneficialTypes.owner} checked={this.state.beneficialType === beneficialTypes.owner}
                                    onChange={this.onChangeBeneficialType}
                                />
                                <label className="form-check-label" for="flexRadioDefault2">
                                First owner of a NFT
                                </label>
                            </div>
                        </div>
                        {
                            this.state.beneficialType === beneficialTypes.company
                            ?
                            <div className="mb-3">
                                <label className="form-label">Beneficial address:</label>
                                <div className="input-group">
                                    <input type="text" onChange={this.onChangeBeneficialAddress} value={this.state.beneficialAddress} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                                <div className="form-text" id="basic-addon4">Wallet for receiving commissions from re-sales of the collection items</div>
                            </div>
                            :
                            null
                        }
                        <div className="mb-3">
                            <label className="form-label">Resale royalties:</label>
                            <div className="input-group">
                                <input type="number" onChange={this.onChangeRoyalties} value={this.state.royalties} min={0} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                            </div>
                            <div className="form-text" id="basic-addon4">Total creator earnings must be between 0% and 100%</div>
                        </div>
                        <Modal.Footer>
                            {
                                (
                                    this.state.royalties === null
                                    ||
                                    this.state.royalties === ''
                                    ||
                                    (
                                        this.state.beneficialType === beneficialTypes.company ? 
                                        !ethers.utils.isAddress(this.state.beneficialAddress) 
                                        : false
                                    )
                                )
                                ?
                                null
                                :
                                <button type="button" className="btn btn-dark" onClick={() => {
                                    this.handleCloseCreateBeneficialPage()
                                    this.handleShowCreateLinkPage()
                                }}>Next</button>
                            }
                            <button type="button" className="btn btn-light" onClick={() => {
                                this.handleCloseCreateBeneficialPage()
                                this.handleShowCreateImagesPage()
                            }}>Back</button>
                        </Modal.Footer>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showCreateLinkPage} onHide={this.handleCloseCreateLinkPage}>
                    <Modal.Header closeButton>
                        <Modal.Title>Links</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="mb-3">
                                <label className="form-label">Website:</label>
                                <div className="input-group">
                                    <input placeholder="https://yourwebsite.io" value={this.state.website} onChange={this.onChangeWebsite} type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                            </div>
                            <label className="form-label">Socials:</label>
                            <div className="mb-3">
                                <div className="input-group">
                                    <input placeholder="Instagram" type="text" value={this.state.instagram} onChange={this.onChangeInstagram} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="input-group">
                                    <input placeholder="Telegram" type="text" value={this.state.telegram} onChange={this.onChangeTelegram} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="input-group">
                                    <input placeholder="Medium" type="text" value={this.state.medium} onChange={this.onChangeMedium} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="input-group">
                                    <input placeholder="Facebook" type="text" value={this.state.facebook} onChange={this.onChangeFacebook} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="input-group">
                                    <input placeholder="Discord" type="text" value={this.state.discord} onChange={this.onChangeDiscord} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="input-group">
                                    <input placeholder="Other" type="text" value={this.state.other} onChange={this.onChangeOther} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                                </div>
                            </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-dark" onClick={() => {
                            this.createNFTCollection()
                        }}>Create</button>
                        <button type="button" className="btn btn-light" onClick={() => {
                            this.handleCloseCreateLinkPage()
                            this.handleShowCreateBeneficialPage()
                        }}>Back</button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showAddNFT} onHide={this.handleCloseAddNFT} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Add NFT</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <div className="input-group">
                            <input type="text" onChange={this.onChangeAddNFTName} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
                        </div>
                        <div className="form-text" id="basic-addon4">Mostly for you</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description (optional)</label>
                        <div className="input-group">
                            <textarea type="text" onChange={this.onChangeAddNFTDescription} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"></textarea>
                        </div>
                        <div className="form-text" id="basic-addon4">Mostly for you</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Maximum amount (optional)</label>
                        <div className="input-group">
                            <input type="number" onChange={this.onChangeAddNFTAmount} className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"/>
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

export default NFTCollections