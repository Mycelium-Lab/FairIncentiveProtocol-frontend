import { Component } from "react";
import total from '../../media/dashboard/total.svg'
import newUsers from '../../media/dashboard/new.svg'
import activeUsers from '../../media/dashboard/active_users.svg'

class UserInfo extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <>
             <ul className="info__list unlist">
                <li className="info__list-item_blue info__list-item">
                    <div className="info__content_left">
                        <span className="info__content-amount">10 576</span>
                        <span className="info__content-desc">Total users</span>
                    </div>
                    <div className="info__content_right">
                        <img src={total}></img>
                    </div>
                </li>
                <li className="info__list-item_light-blue info__list-item">
                    <div className="info__content_left">
                        <span className="info__content-amount">274</span>
                        <span className="info__content-desc">New users in last 24 h</span>
                    </div>
                    <div className="info__content_right">
                        <img src={newUsers}></img>
                    </div>
                </li>
                <li className="info__list-item_dark-blue info__list-item">
                    <div className="info__content_left">
                        <span className="info__content-amount">7 824</span>
                        <span className="info__content-desc">Active users</span>
                    </div>
                    <div className="info__content_right">
                    <img src={activeUsers}></img>
                    </div>
                </li>
            </ul>

            <div className="dashboard__chart">
            
            </div>
            </>
        )
    }
}

export default UserInfo