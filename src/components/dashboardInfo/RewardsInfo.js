import { Component } from "react";
import total from '../../media/dashboard/total_rewards.svg'
import rewarded from '../../media/dashboard/rewarded.svg'
import newRewards from '../../media/dashboard/new_rewards.svg'

class RewardsInfo extends Component {
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
                        <span className="info__content-desc">The total number of rewards</span>
                    </div>
                    <div className="info__content_right">
                        <img src={total}></img>
                    </div>
                </li>
                <li className="info__list-item_light-blue info__list-item">
                    <div className="info__content_left">
                        <span className="info__content-amount">9 867</span>
                        <span className="info__content-desc">Users rewarded</span>
                    </div>
                    <div className="info__content_right">
                        <img src={rewarded}></img>
                    </div>
                </li>
                <li className="info__list-item_dark-blue info__list-item">
                    <div className="info__content_left">
                        <span className="info__content-amount">7 824</span>
                        <span className="info__content-desc">Rewards in the last 24 hours</span>
                    </div>
                    <div className="info__content_right">
                    <img src={newRewards}></img>
                    </div>
                </li>
            </ul>

            <div className="dashboard__chart">
            
            </div>
            </>
        )
    }
}

export default RewardsInfo