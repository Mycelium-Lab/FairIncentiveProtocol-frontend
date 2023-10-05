import { Component } from "react";
import { getBearerHeader } from "../../utils/getBearerHeader";
import { config } from "../../utils/config";
import etherscan from '../../media/social/etherscan_icon.svg'
import web from '../../media/social/web_icon.svg'
import discord from '../../media/social/discord_icon.svg'
import twitter from '../../media/social/twitter_icon.svg'
import stars from '../../media/social/stars.svg'
import shared from '../../media/social/shared.svg'
import more from '../../media/social/more_horizontal.svg'
import nft1 from '../../media/collectionDetail/default_nft_1.png'
import nft2 from '../../media/collectionDetail/default_nft_2.png'
import nft3 from '../../media/collectionDetail/default_nft_3.png'
import nft4 from '../../media/collectionDetail/default_nft_4.png'
import { Card } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';

class NFTs extends Component {

    constructor() {
        super()
        this.state = {
            nfts: [],
            showNFT: false
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
            const keys = Object.keys(json.body.data)
            for (let i = 0; i < keys.length; i++) {
                for (let j = 0; j < json.body.data[keys[i]].nfts.length; j++) {
                    let nft = {}
                    nft = json.body.data[keys[i]].nfts[j]
                    const _res = await (await fetch(nft.image)).json() 
                    const jsonImage = _res.image
                    nft.collection_name = json.body.data[keys[i]].collection_name
                    nft.real_image = jsonImage
                    nfts.push(nft)
                } 
            }
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

    handleShowNFT = () => { this.setState({showNFT: true})}
    handleCloseMFT = () => { this.setState({showNFT: false})}

    getNFTs = this.getNFTs.bind(this)
    deleteNFT = this.deleteNFT.bind(this)
    handleShowNFT = this.handleShowNFT.bind(this)
    handleCloseMFT = this.handleCloseMFT.bind(this)

    render() {
        return (
            <>
                <div className="title-header">
                <h3 className="menu__title">NFTs</h3>
                </div>
                <div className="content__wrap">
                  <div className="collection-detail__wrap">
                    <div className="profile__head">
                        <div className="profile__cover">
                            <div className="profile__photo"></div>
                        </div>
                    </div>
                    <div className="profile__social">
                        <ul className="profile__social-list unlist">
                            <li className="profile__social-item">
                                <a>
                                    <img src={etherscan}></img>
                                </a>
                            </li>
                            <li className="profile__social-item">
                                <a>
                                    <img src={web}></img>
                                </a>
                            </li>
                            <li className="profile__social-item">
                                <a>
                                    <img src={discord}></img>
                                </a>
                            </li>
                            <li className="profile__social-item">
                                <a>
                                    <img src={twitter}></img>
                                </a>
                            </li>
                            <li className="profile__social-item_devider profile__social-item">
                               <span></span>
                            </li>
                            <li className="profile__social-item">
                                <a>
                                    <img src={stars}></img>
                                </a>
                            </li>
                            <li className="profile__social-item">
                                <a>
                                    <img src={shared}></img>
                                </a>
                            </li>
                            <li className="profile__social-item">
                                <a>
                                    <img src={more}></img>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="profile__decs">
                        <h4 className="menu__title-secondary">ABC collection</h4>
                        <ul className="profile__decs_stats unlist">
                            <li className="profile__decs_stats-item">
                                <span className="text_gray text_primary">Items 1,000</span></li>
                                <li className="profile__decs_stats-item_decor profile__decs_stats-item"><span className="text_gray text_primary">Distributed 500</span></li>
                                <li className="profile__decs_stats-item_decor profile__decs_stats-item"><span className="text_gray text_primary">Available to distribution 500</span></li>
                                <li className="profile__decs_stats-item_decor profile__decs_stats-item"><span className="text_gray text_primary">Created Mar 2023</span></li>
                                <li className="profile__decs_stats-item_decor profile__decs_stats-item"><span className="text_gray text_primary">Creator earnings 7.5%</span></li>
                                <li className="profile__decs_stats-item_decor profile__decs_stats-item"><span className="text_gray text_primary">Chain: Ethereum</span></li>
                        </ul>
                        <p className="text_gray text_primary">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        </p>
                    </div>
                    <div className="profile__nfts">
                        <ul className="profile__nfts-list unlist">
                            <li className="profile__nfts-list-item" onClick={this.handleShowNFT}>
                            <Card className="profile__nfts-card">
                                <Card.Img variant="top" src={nft1} />
                                <Card.Body>
                                    <Card.Title className="title_secondary ">Card Title</Card.Title>
                                    <Card.Text className="text_gray text_card text_primary">
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                    </Card.Text>
                                    </Card.Body>
                                </Card>
                            </li>
                            <li className="profile__nfts-list-item" onClick={this.handleShowNFT}>
                            <Card className="profile__nfts-card">
                                <Card.Img variant="top" src={nft2} />
                                <Card.Body>
                                    <Card.Title className="title_secondary ">Card Title</Card.Title>
                                    <Card.Text className="text_gray text_card text_primary">
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                    </Card.Text>
                                    </Card.Body>
                                </Card>
                            </li>
                            <li className="profile__nfts-list-item" onClick={this.handleShowNFT}>
                            <Card className="profile__nfts-card">
                                <Card.Img variant="top" src={nft3} />
                                <Card.Body>
                                    <Card.Title className="title_secondary ">Card Title</Card.Title>
                                    <Card.Text className="text_gray text_card text_primary">
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                    </Card.Text>
                                    </Card.Body>
                                </Card>
                            </li>
                            <li className="profile__nfts-list-item" onClick={this.handleShowNFT}>
                            <Card className="profile__nfts-card">
                                <Card.Img variant="top" src={nft4} />
                                <Card.Body>
                                    <Card.Title className="title_secondary">Card Title</Card.Title>
                                    <Card.Text className="text_gray text_card text_primary">
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                    </Card.Text>
                                    </Card.Body>
                                </Card>
                            </li>
                        </ul>
                    </div>
                  </div>
                </div>
                <Modal className="modal__nft" show={this.state.showNFT} onHide={this.handleCloseMFT} centered>
                    <Modal.Header className="modal-newuser__title modal-title" closeButton>
                        ABC collection
                    </Modal.Header>
                    <Modal.Body className="modal__nft-body">
                            <div className="modal__nft-top">
                                <img className="modal__nft-img" src={nft1}></img>
                                <div className="modal__nft-top-left">
                                    <div className="mb-3">
                                        <span className="title_primary">ABC collection</span>
                                        <h4 className="title_preLgTitile">Pepemigos #3357</h4>
                                        <span className="text_gray modal-text_regular modal-text">Owned by User <a className="text_gray link__primary">#123</a></span>
                                    </div>
                                    <div className="modal-text">
                                        <p className="modal__nft-text">Status: Minted</p>
                                        <p className="modal__nft-text">Contract Address: <a className="link__primary">0x06f8...fe4c</a></p>
                                        <p className="modal__nft-text">Token ID: <a className="link__primary">3357</a></p>
                                        <p className="modal__nft-text">Token Standard: ERC-721</p>
                                        <p className="modal__nft-text">Chain: Ethereum</p>
                                        <p className="modal__nft-text">Creator Earnings info: 6.9%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal__nft-bottom">
                                <span className="text_primary">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                </span>
                            </div>
                    </Modal.Body>
                </Modal>
                   {/* <table className="table table-bordered border-dark">
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
                                                {v.name}
                                            </td>
                                            <td className="table-secondary">
                                                {v.description ? v.description : '-'}
                                            </td>
                                            <td className="table-secondary">
                                                {v.amount ? v.amount : '-'}
                                            </td>
                                            <td className="table-secondary">
                                                <img width="300px" height="300px" src={v.real_image}/>
                                            </td>
                                            {
                                                parseInt(v.count) === 0
                                                ?
                                                <td className="table-secondary">
                                                    <button className="btn btn-dark" onClick={() => this.deleteNFT(v.id)}>Delete</button>
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
                        */}
            </>
        )
    }
}

export default NFTs