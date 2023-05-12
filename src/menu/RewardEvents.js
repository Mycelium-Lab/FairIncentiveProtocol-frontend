import { Component } from "react";
import { config } from "../utils/config";
import { getBearerHeader } from "../utils/getBearerHeader";
import { createLongStrView } from "../utils/longStrView";

class RewardEvents extends Component {

    constructor() {
        super()
        this.state = {
            rewardTokenEvents: []
        }
    }

    async componentDidMount() {
        await this.getRewardTokenEvents()
    }

    async getRewardTokenEvents() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
                };
            const res = await fetch(`${config.api}/rewards/events/tokens`, requestOptions)
            const json = await res.json()
            const rewardEvents = json.rewardEvents
            this.setState({
                rewardTokenEvents: rewardEvents
            })
        } catch (error) {
            alert(error)
        }
    }

    render() {
        return (
            <div>
                <h3>Reward Events</h3>
                <table className="table table-bordered border-dark">
                    <thead>
                        <tr className="table-secondary" >
                        <th className="table-secondary" scope="col">id</th>
                        <th className="table-secondary" scope="col">Status</th>
                        <th className="table-secondary" scope="col">Reward</th>
                        <th className="table-secondary" scope="col">Distributed</th>
                        <th className="table-secondary" scope="col">User</th>
                        <th className="table-secondary" scope="col">Comment</th>
                        <th className="table-secondary" scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                            this.state.rewardTokenEvents.map(v =>
                            <tr className="table-secondary">
                                <td className="table-secondary">
                                    {createLongStrView(v.event_id)}
                                </td>
                                <td className="table-secondary">
                                    {v.status}
                                </td>
                                <td className="table-secondary">
                                    {v.reward_name}
                                </td>
                                <td className="table-secondary">
                                    {v.token_amount} {v.token_symbol}
                                </td>
                                <td className="table-secondary">
                                    <div>
                                        {v.user_external_id}
                                    </div>
                                    <div>
                                        (FAIR id: {createLongStrView(v.user_id)})
                                    </div>
                                </td>
                                <td className="table-secondary">
                                    {v.event_comment}
                                </td>
                                <td className="table-secondary">
                                    <button className="btn btn-dark" disabled>Revoke</button>
                                </td>
                            </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default RewardEvents