import { Component } from "react";
import { Tab, Tabs } from "react-bootstrap";
import BarChart from "../charts/BarChart";
import NftsInfo from "../dashboardInfo/Nfts";
import RewardsInfo from "../dashboardInfo/RewardsInfo";
import TokensInfo from "../dashboardInfo/TokensInfo";
import UserInfo from "../dashboardInfo/UserInfo";
import { newUser } from "../../data/data";
import LineChart from "../charts/LineChart";
import DonutChart from "../charts/DonutChart";

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newUserData: {
                labels: newUser.map(data => data.time),
                datasets: [{
                    label: 'New users',
                    data: newUser.map(data => data.amount),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            },
            totalUserData: {
                labels: newUser.map(data => data.time),
                datasets: [{
                    label: 'Total users',
                    data: newUser.map(data => data.amount),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            }
        }
    }
    render() {
        return (
            <div className="dashboard">
                <h3 className="menu__title">Dashboard</h3>
                <div className="dashboard__tab">
                    <Tabs defaultActiveKey="users">
                        <Tab eventKey="users" title="Users">
                            <UserInfo></UserInfo>
                            <div className="dashboard__chart">
                                <BarChart chartData={this.state.newUserData}></BarChart>
                            </div>
                            <div className="dashboard__chart">
                                <LineChart chartData={this.state.totalUserData}></LineChart>
                            </div>
                        </Tab>
                        <Tab eventKey="rewards" title="Rewards">
                            <RewardsInfo></RewardsInfo>
                            <div className="dashboard__chart">
                                <BarChart chartData={this.state.newUserData}></BarChart>
                            </div>
                            <div className="dashboard__chart">
                                <DonutChart chartData={this.state.newUserData}></DonutChart>
                            </div>
                        </Tab>
                        <Tab eventKey="tokens" title="Tokens">
                            <TokensInfo></TokensInfo>
                            <div className="dashboard__chart">
                                <BarChart chartData={this.state.newUserData}></BarChart>
                            </div>
                            <div className="dashboard__chart">
                                <DonutChart chartData={this.state.newUserData}></DonutChart>
                            </div>
                        </Tab>
                        <Tab eventKey="NFTs" title="NFTs">
                            <NftsInfo></NftsInfo>
                            <div className="dashboard__chart">
                                <BarChart chartData={this.state.newUserData}></BarChart>
                            </div>
                            <div className="dashboard__chart">
                                <DonutChart chartData={this.state.newUserData}></DonutChart>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default Dashboard