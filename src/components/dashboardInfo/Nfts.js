import { Component } from "react";
import totalNfts from '../../media/dashboard/total_nfts.svg'
import nftsAvalible from '../../media/dashboard/nft_available.svg'
import newNfts from '../../media/dashboard/nft_new.svg'

class NftsInfo extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <>
             <ul className="info__list unlist">
                <li className="info__list-item_blue info__list-item">
                    <div className="info__content_left">
                        <span className="info__content-amount">125 576</span>
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
                            <span className="info__content-amount">77 824</span><span className="info__content-dymanic_positive info__content-dymanic">15.4%</span>
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