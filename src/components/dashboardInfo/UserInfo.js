import { Component } from "react";
import total from '../../media/dashboard/total.svg'
import newUsers from '../../media/dashboard/new.svg'
import activeUsers from '../../media/dashboard/active_users.svg'
import { getBearerHeader } from "../../utils/getBearerHeader";
import { config } from "../../utils/config";

class UserInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            total_users: 0,
            new_users_24h: 0
        }
    }

    async componentDidMount() {
        await this.getTotalUsers()
        await this.getUsers24h()
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
            const res = await fetch(`${config.api}/stat/total_users`, requestOptions)
            const json = await res.json()
            this.setState({
                total_users: json.body.data
            })
        } catch (error) {
            alert(error)
        }
    }

    async getUsers24h() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/stat/users_24h`, requestOptions)
            const json = await res.json()
            this.setState({
                new_users_24h: json.body.data
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
                        <span className="info__content-amount">{this.state.total_users}</span>
                        <span className="info__content-desc">Total users</span>
                    </div>
                    <div className="info__content_right">
                        <img src={total}></img>
                    </div>
                </li>
                <li className="info__list-item_light-blue info__list-item">
                    <div className="info__content_left">
                        <span className="info__content-amount">{this.state.new_users_24h}</span>
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
            </>
        )
    }
}

export default UserInfo