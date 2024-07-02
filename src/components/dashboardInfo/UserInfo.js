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
            active_users: 0,
            new_users_24h: 0
        }
    }

    async componentDidMount() {
        await this.getTotalUsers()
        await this.getUsers24h()
        await this.getActiveUsers()
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

    async getActiveUsers() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/stat/users_active`, requestOptions)
            const json = await res.json()
            this.setState({
                active_users: json.body.data
            })
        } catch (error) {
            alert(error)
        }
    }

    render() {
        return (
            <>
             <ul className="info__list unlist">
                <li className="info__list-item_white info__list-item">
                    <div className="info__content_left">
                        <span className="info__content-amount">{this.state.total_users}</span>
                        <span className="info__content-desc">Total users</span>
                    </div>
                    <div className="info__content_right">
                        {/* <img src={total}></img> */}
                        <svg width="71" height="70" viewBox="0 0 71 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <ellipse cx="35.096" cy="35" rx="35.096" ry="35" fill="#FFF5D9"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M26 27.5C26 25.0147 28.0147 23 30.5 23C32.9853 23 35 25.0147 35 27.5C35 29.9853 32.9853 32 30.5 32C28.0147 32 26 29.9853 26 27.5ZM30.5 20C26.3579 20 23 23.3579 23 27.5C23 31.6421 26.3579 35 30.5 35C34.6421 35 38 31.6421 38 27.5C38 23.3579 34.6421 20 30.5 20ZM24.5 38C22.5109 38 20.6032 38.7902 19.1967 40.1967C17.7902 41.6032 17 43.5109 17 45.5V48.5C17 49.3284 17.6716 50 18.5 50C19.3284 50 20 49.3284 20 48.5V45.5C20 44.3065 20.4741 43.1619 21.318 42.318C22.1619 41.4741 23.3065 41 24.5 41H36.5C37.6935 41 38.8381 41.4741 39.682 42.318C40.5259 43.1619 41 44.3065 41 45.5V48.5C41 49.3284 41.6716 50 42.5 50C43.3284 50 44 49.3284 44 48.5V45.5C44 43.5109 43.2098 41.6032 41.8033 40.1967C40.3968 38.7902 38.4891 38 36.5 38H24.5ZM45.5476 39.32C45.7547 38.5179 46.5729 38.0355 47.375 38.2426C48.984 38.6581 50.4095 39.5961 51.4276 40.9095C52.4457 42.2228 52.9988 43.8371 53 45.4989V48.5C53 49.3284 52.3284 50 51.5 50C50.6716 50 50 49.3284 50 48.5V45.5011C49.9992 44.5042 49.6673 43.5354 49.0565 42.7475C48.4457 41.9595 47.5904 41.3966 46.625 41.1474C45.8229 40.9403 45.3405 40.1221 45.5476 39.32ZM41.3721 20.2419C40.5695 20.0364 39.7524 20.5204 39.5469 21.3229C39.3414 22.1255 39.8254 22.9426 40.6279 23.1481C41.5959 23.396 42.4539 23.9589 43.0665 24.7482C43.6792 25.5375 44.0118 26.5083 44.0118 27.5075C44.0118 28.5067 43.6792 29.4775 43.0665 30.2668C42.4539 31.0561 41.5959 31.619 40.6279 31.8669C39.8254 32.0724 39.3414 32.8895 39.5469 33.6921C39.7524 34.4946 40.5695 34.9786 41.3721 34.7731C42.9853 34.3601 44.4153 33.4218 45.4364 32.1063C46.4575 30.7908 47.0118 29.1728 47.0118 27.5075C47.0118 25.8422 46.4575 24.2242 45.4364 22.9087C44.4153 21.5932 42.9853 20.6549 41.3721 20.2419Z" fill="#FF9F43"/>
                        </svg>

                    </div>
                </li>
                <li className="info__list-item_white info__list-item">
                    <div className="info__content_left">
                        <span className="info__content-amount">{this.state.new_users_24h}</span>
                        <span className="info__content-desc">New users in last 24 h</span>
                    </div>
                    <div className="info__content_right">
                        {/* <img src={newUsers}></img> */}
                        <svg width="71" height="70" viewBox="0 0 71 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <ellipse cx="35.096" cy="35" rx="35.096" ry="35" fill="#FFF5D9"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M19.1967 40.1967C20.6032 38.7902 22.5109 38 24.5 38H35C36.9891 38 38.8968 38.7902 40.3033 40.1967C41.7098 41.6032 42.5 43.5109 42.5 45.5V48.5C42.5 49.3284 41.8284 50 41 50C40.1716 50 39.5 49.3284 39.5 48.5V45.5C39.5 44.3065 39.0259 43.1619 38.182 42.318C37.3381 41.4741 36.1935 41 35 41H24.5C23.3065 41 22.1619 41.4741 21.318 42.318C20.4741 43.1619 20 44.3065 20 45.5V48.5C20 49.3284 19.3284 50 18.5 50C17.6716 50 17 49.3284 17 48.5V45.5C17 43.5109 17.7902 41.6032 19.1967 40.1967Z" fill="#FF9F43"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M29.75 23C27.2647 23 25.25 25.0147 25.25 27.5C25.25 29.9853 27.2647 32 29.75 32C32.2353 32 34.25 29.9853 34.25 27.5C34.25 25.0147 32.2353 23 29.75 23ZM22.25 27.5C22.25 23.3579 25.6079 20 29.75 20C33.8921 20 37.25 23.3579 37.25 27.5C37.25 31.6421 33.8921 35 29.75 35C25.6079 35 22.25 31.6421 22.25 27.5Z" fill="#FF9F43"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M47 27.5C47.8284 27.5 48.5 28.1716 48.5 29V38C48.5 38.8284 47.8284 39.5 47 39.5C46.1716 39.5 45.5 38.8284 45.5 38V29C45.5 28.1716 46.1716 27.5 47 27.5Z" fill="#FF9F43"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M41 33.5C41 32.6716 41.6716 32 42.5 32H51.5C52.3284 32 53 32.6716 53 33.5C53 34.3284 52.3284 35 51.5 35H42.5C41.6716 35 41 34.3284 41 33.5Z" fill="#FF9F43"/>
                        </svg>

                    </div>
                </li>
                <li className="info__list-item_white info__list-item">
                    <div className="info__content_left">
                        <span className="info__content-amount">{this.state.active_users}</span>
                        <span className="info__content-desc">Active users</span>
                    </div>
                    <div className="info__content_right">
                    {/* <img src={activeUsers}></img> */}
                    <svg width="71" height="70" viewBox="0 0 71 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="35.096" cy="35" rx="35.096" ry="35" fill="#FFF5D9"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.1967 40.1967C20.6032 38.7902 22.5109 38 24.5 38H35C36.9891 38 38.8968 38.7902 40.3033 40.1967C41.7098 41.6032 42.5 43.5109 42.5 45.5V48.5C42.5 49.3284 41.8284 50 41 50C40.1716 50 39.5 49.3284 39.5 48.5V45.5C39.5 44.3065 39.0259 43.1619 38.182 42.318C37.3381 41.4741 36.1935 41 35 41H24.5C23.3065 41 22.1619 41.4741 21.318 42.318C20.4741 43.1619 20 44.3065 20 45.5V48.5C20 49.3284 19.3284 50 18.5 50C17.6716 50 17 49.3284 17 48.5V45.5C17 43.5109 17.7902 41.6032 19.1967 40.1967Z" fill="#FF9F43"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M29.75 23C27.2647 23 25.25 25.0147 25.25 27.5C25.25 29.9853 27.2647 32 29.75 32C32.2353 32 34.25 29.9853 34.25 27.5C34.25 25.0147 32.2353 23 29.75 23ZM22.25 27.5C22.25 23.3579 25.6079 20 29.75 20C33.8921 20 37.25 23.3579 37.25 27.5C37.25 31.6421 33.8921 35 29.75 35C25.6079 35 22.25 31.6421 22.25 27.5Z" fill="#FF9F43"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M52.5607 29.4393C53.1464 30.0251 53.1464 30.9749 52.5607 31.5607L46.5607 37.5607C45.9749 38.1464 45.0251 38.1464 44.4393 37.5607L41.4393 34.5607C40.8536 33.9749 40.8536 33.0251 41.4393 32.4393C42.0251 31.8536 42.9749 31.8536 43.5607 32.4393L45.5 34.3787L50.4393 29.4393C51.0251 28.8536 51.9749 28.8536 52.5607 29.4393Z" fill="#FF9F43"/>
                    </svg>

                    </div>
                </li>
            </ul>
            </>
        )
    }
}

export default UserInfo