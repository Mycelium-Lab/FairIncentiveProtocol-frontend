import { Component } from "react";
import totalNfts from '../../media/dashboard/total_nfts.svg'
import nftsAvalible from '../../media/dashboard/nft_available.svg'
import newNfts from '../../media/dashboard/nft_new.svg'
import { getBearerHeader } from "../../utils/getBearerHeader";
import { config } from "../../utils/config";

class NftsInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            total: 0,
            total_24h: 0
        }
    }

    async componentDidMount() {
        await this.getTotal()
        await this.getTotal24h()
    }

    async getTotal() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/stat/total_nfts`, requestOptions)
            const json = await res.json()
            this.setState({
                total: json.body.data
            })
        } catch (error) {
            alert(error)
        }
    }
    
    async getTotal24h() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/stat/total_nfts_24h`, requestOptions)
            const json = await res.json()
            this.setState({
                total_24h: json.body.data
            })
        } catch (error) {
            alert(error)
        }
    }

    render() {
        return (
            <>
             <ul className="info__list unlist">
                <li className="info__list-item_blue info__list-item">
                    <div className="info__content_left">
                        <span className="info__content-amount">{this.state.total}</span>
                        <span className="info__content-desc">Total distributed</span>
                    </div>
                    <div className="info__content_right">
                        <img src={totalNfts}></img>
                    </div>
                </li>
                <li className="info__list-item_light-blue info__list-item">
                    <div className="info__content_left">
                        <div className="info__content-amount-info">
                            <span className="info__content-amount">1 000 500</span><a className="info__content-mint">[mint]</a>
                        </div>
                        <span className="info__content-desc">Available to distribute</span>
                    </div>
                    <div className="info__content_right">
                        <img src={nftsAvalible}></img>
                    </div>
                </li>
                <li className="info__list-item_dark-blue info__list-item">
                    <div className="info__content_left">
                        <div className="info__content-amount-info_new info__content-amount-info">
                            <span className="info__content-amount">{this.state.total_24h}</span><span className="info__content-dymanic_positive info__content-dymanic">15.4%</span>
                        </div>
                        <span className="info__content-desc">Distributed last 24h</span>
                    </div>
                    <div className="info__content_right">
                    <img src={newNfts}></img>
                    </div>
                </li>
            </ul>
            </>
        )
    }
}

export default NftsInfo