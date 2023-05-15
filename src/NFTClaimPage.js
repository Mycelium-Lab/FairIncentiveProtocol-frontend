import { Component } from "react";
import './styles/claimNFT.css'
import { config } from "./utils/config";

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
            nft_description: null,
            chainid: null,
            user_wallet: null,
            v: null,
            r: null,
            s: null
        }
    }

    async componentDidMount() {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
          });
        this.setState({
            event_id: params.id,
            user_id: params.user_id
        })
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
        const res = await fetch(`${config.api}/rewards/get/nfts`, requestOptions)
        const json = await res.json()
        console.log(json)
    }

    render() {
        return (
            <div>
                <div className="center-div">
                    collection_name, collection_address, nft_name, description, image, chainid, user_wallet, v, r, s
                </div>
            </div>
        )
    }

}

export default NFTClaimPage