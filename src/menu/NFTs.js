import { Component } from "react";
import { getBearerHeader } from "../utils/getBearerHeader";
import { config } from "../utils/config";

class NFTs extends Component {

    constructor() {
        super()
        this.state = {
            nfts: []
        }
    }

    async componentDidMount() {
        await this.getNFTs()
    }

    async getNFTs() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/nfts/nfts`, requestOptions)
            const json = await res.json()
            const nfts = []
            const keys = Object.keys(json.nfts)
            for (let i = 0; i < keys.length; i++) {
                for (let j = 0; j < json.nfts[keys[i]].length; j++) {
                    let nft = {}
                    nft = json.nfts[keys[i]][j]
                    const _res = await (await fetch(json.nfts[keys[i]][j].image)).json() 
                    const jsonImage = _res.image
                    nft.real_image = jsonImage
                    nfts.push(nft)
                } 
            }
            console.log(nfts)
            this.setState({
                nfts
            })
        } catch (error) {
            alert(error)
        }
    }

    async deleteNFT(id) {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", getBearerHeader())
            const raw = JSON.stringify({
                id
            })
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
            };
            const res = await fetch(`${config.api}/nfts/delete/nft`, requestOptions)
            if (res.status === 200) {
                const nfts = this.state.nfts.filter(v => v.nft_id !== id)
                this.setState({nfts})
                alert('Done')
            } else alert("Something went wrong")
        } catch (error) {
            console.log(error)
        }
    }

    getNFTs = this.getNFTs.bind(this)
    deleteNFT = this.deleteNFT.bind(this)

    render() {
        return (
            <div>
                <h3>NFTs</h3>
                    <table className="table table-bordered border-dark">
                        <thead>
                            <tr className="table-secondary" >
                            <th className="table-secondary" scope="col">Collection name</th>
                            <th className="table-secondary" scope="col">NFT name</th>
                            <th className="table-secondary" scope="col">NFT description</th>
                            <th className="table-secondary" scope="col">Maximum amount</th>
                            <th className="table-secondary" scope="col">Image</th>
                            <th className="table-secondary" scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.nfts ? this.state.nfts.map(v => {
                                    return (
                                        <tr className="table-secondary">
                                            <td className="table-secondary">
                                                {v.collection_name}
                                            </td>
                                            <td className="table-secondary">
                                                {v.nft_name}
                                            </td>
                                            <td className="table-secondary">
                                                {v.nft_description ? v.nft_description : '-'}
                                            </td>
                                            <td className="table-secondary">
                                                {v.nft_amount ? v.nft_amount : '-'}
                                            </td>
                                            <td className="table-secondary">
                                                <img width="300px" height="300px" src={v.real_image}/>
                                            </td>
                                            {
                                                parseInt(v.rewards_count) === 0
                                                ?
                                                <td className="table-secondary">
                                                    <button className="btn btn-dark" onClick={() => this.deleteNFT(v.nft_id)}>Delete</button>
                                                </td>
                                                :
                                                null
                                            }
                                        </tr>
                                    )
                                }) : null
                            }
                        </tbody>
                    </table>
            </div>
        )
    }
}

export default NFTs