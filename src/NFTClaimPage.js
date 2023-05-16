import { Component } from "react";
import './styles/claimNFT.css'
import { config } from "./utils/config";
import { createLongStrView } from "./utils/longStrView";
import { ethers } from "ethers";
import ERC721Mintable from "./contracts/erc721/ERC721Mintable.json";

class NFTClaimPage extends Component {

    constructor() {
        super()
        this.state = {
            event_id: null,
            user_id: null,
            collection_name: null,
            collection_address: null,
            nft_name: null,
            nft_image: null,
            nft_jsonImage: null,
            nft_description: null,
            chainid: null,
            user_wallet: null,
            v: null,
            r: null,
            s: null,
            provider: null,
            signer: null,
            address: null,
            chainid: null,
            contract: null
        }
    }

    async componentDidMount() {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
          });
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
        const res = await fetch(
            `${config.api}/rewards/events/claimablenft?id=${params.id}&user_id=${params.user_id}`, requestOptions)
        const json = await res.json()
        const resImage = await fetch(json.claimableNFT.nft_image)
        const imageJson = await resImage.json()
        this.setState({
            event_id: params.id,
            user_id: params.user_id,
            collection_name: json.claimableNFT.collection_name,
            collection_address: json.claimableNFT.collection_address,
            nft_name: json.claimableNFT.nft_name,
            nft_image: imageJson.image,
            nft_jsonImage: json.claimableNFT.nft_image,
            nft_description: json.claimableNFT.nft_description,
            chainid: json.claimableNFT.chainid,
            user_wallet: json.claimableNFT.user_wallet,
            v: json.claimableNFT.v,
            r: json.claimableNFT.r,
            s: json.claimableNFT.s
        })
    }

    async connect() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            await provider.send("eth_requestAccounts", [])
            const signer = await provider.getSigner()
            const address = await signer.getAddress()
            const chainid = (await provider.getNetwork()).chainId
            this.setContract(signer)
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

    setContract(signer) {
        try {
            const NFT = new ethers.ContractFactory(ERC721Mintable.abi, ERC721Mintable.bytecode, signer)
            const contract = NFT.attach(this.state.collection_address);
            this.setState({
                contract
            })
        } catch (error) {
            console.log(error)
        }
    }

    async claim() {
        try {
            const { contract, r, v, s, nft_jsonImage } = this.state
            await contract.safeMintSigner(r, v, s, nft_jsonImage)
        } catch (error) {
            console.log(error)
        }
    }

    connect = this.connect.bind(this)
    setContract = this.setContract.bind(this)
    claim = this.claim.bind(this)

    render() {
        return (
            <div>
                <div className="center-div">
                    <div>
                        <button type="button" className="btn btn-dark" onClick={this.connect}>{this.state.address ? createLongStrView(this.state.address) : 'Connect'}</button>
                    </div>
                    <div>User address for claim: <b>{createLongStrView(this.state.user_wallet ? this.state.user_wallet : '')}</b></div>
                    <div>You can claim <b>{this.state.nft_name}</b> from <b>{this.state.collection_name}</b> collection</div>
                    <div>
                        <img width="300px" height="300px" src={this.state.nft_image}/>
                    </div>
                    {
                        this.state.nft_description 
                        ?
                        <div>NFT description: {this.state.nft_description}</div>
                        :
                        null
                    }
                    <div>
                        <button type="button" className="btn btn-dark" onClick={this.claim}>Claim</button>
                    </div>
                </div>
            </div>
        )
    }

}

export default NFTClaimPage