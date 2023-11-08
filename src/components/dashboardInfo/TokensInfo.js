import { Component } from "react";
import totalTOkens from '../../media/dashboard/total_tokens.svg'
import tokensAvalible from '../../media/dashboard/tokens_available.svg'
import newTokens from '../../media/dashboard/new_tokens.svg'
import { config } from "../../utils/config";
import { getBearerHeader } from "../../utils/getBearerHeader";

class TokensInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            total: 0
        }
    }

    async componentDidMount() {
        await this.getTotal()
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
            const res = await fetch(`${config.api}/stat/total_tokens`, requestOptions)
            const json = await res.json()
            this.setState({
                total: json.body.data
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
                        <img src={totalTOkens}></img>
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
                        <img src={tokensAvalible}></img>
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
                    <img src={newTokens}></img>
                    </div>
                </li>
            </ul>
            </>
        )
    }
}

export default TokensInfo