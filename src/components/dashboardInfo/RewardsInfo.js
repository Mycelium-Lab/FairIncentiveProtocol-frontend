import { Component } from "react";
import total from '../../media/dashboard/total_rewards.svg'
import rewarded from '../../media/dashboard/rewarded.svg'
import newRewards from '../../media/dashboard/new_rewards.svg'
import { getBearerHeader } from "../../utils/getBearerHeader";
import { config } from "../../utils/config";

class RewardsInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            total_users: 0,
            total_rewarded_24h: 0
        }
    }

    async componentDidMount() {
        await this.getTotalUsers()
        await this.getTotalRewarded24h()
    }

    async getTotalUsers() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/stat/rewarded_users`, requestOptions)
            const json = await res.json()
            this.setState({
                total_users: json.body.data
            })
        } catch (error) {
            alert(error)
        }
    }

    async getTotalRewarded24h() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/stat/rewarded_24h`, requestOptions)
            const json = await res.json()
            this.setState({
                total_rewarded_24h: json.body.data
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
                        <span className="info__content-amount">{this.props.total}</span>
                        <span className="info__content-desc">The total number of rewards</span>
                    </div>
                    <div className="info__content_right">
                        <img src={total}></img>
                    </div>
                </li>
                <li className="info__list-item_light-blue info__list-item">
                    <div className="info__content_left">
                        <span className="info__content-amount">{this.state.total_users}</span>
                        <span className="info__content-desc">Users rewarded</span>
                    </div>
                    <div className="info__content_right">
                        <img src={rewarded}></img>
                    </div>
                </li>
                <li className="info__list-item_dark-blue info__list-item">
                    <div className="info__content_left">
                        <span className="info__content-amount">{this.state.total_rewarded_24h}</span>
                        <span className="info__content-desc">Rewards in the last 24 hours</span>
                    </div>
                    <div className="info__content_right">
                    <img src={newRewards}></img>
                    </div>
                </li>
            </ul>
            </>
        )
    }
}

export default RewardsInfo