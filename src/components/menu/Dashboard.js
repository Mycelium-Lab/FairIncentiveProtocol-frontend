import { Component } from "react";
import { Tab, Tabs } from "react-bootstrap";
import BarChart from "../charts/BarChart";
import NftsInfo from "../dashboardInfo/Nfts";
import RewardsInfo from "../dashboardInfo/RewardsInfo";
import TokensInfo from "../dashboardInfo/TokensInfo";
import UserInfo from "../dashboardInfo/UserInfo";
import { collectionIssue, collectionSupply, distributionOfRewards, newUser , tokensIssue, tokensSupply, typeOfRewards} from "../../data/data";
import LineChart from "../charts/LineChart";
import DonutChart from "../charts/DonutChart";

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newUserData: {
                labels: newUser.map(data => data.time),
                datasets: [{
                    data: newUser.map(data => data.amount),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            },
            totalUserData: {
                labels: newUser.map(data => data.time),
                datasets: [{
                    data: newUser.map(data => data.amount),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            },
            distributionOfRewardsData: {
                labels: distributionOfRewards.map(data => data.name),
                datasets: [{
                    data: distributionOfRewards.map(data => data.value),
                    backgroundColor: distributionOfRewards.map(data => data.color)
                }]
            },
            typeOfRewardsData: {
                labels: typeOfRewards.map(data => data.name),
                datasets: [{
                    data: typeOfRewards.map(data => data.value),
                    backgroundColor: typeOfRewards.map(data => data.color)
                }]
            },
            tokensIssuesData: {
                labels: tokensIssue.map(data => data.name),
                datasets: [{
                    data: tokensIssue.map(data => data.value),
                    backgroundColor: tokensIssue.map(data => data.color)
                }]
            },
            tokensSupplyData: {
                labels: tokensSupply.map(data => data.name),
                datasets: [{
                    data: tokensSupply.map(data => data.value),
                    backgroundColor: tokensSupply.map(data => data.color)
                }]
            },
            collectionIssueData: {
                labels: collectionIssue.map(data => data.name),
                datasets: [{
                    data: collectionIssue.map(data => data.value),
                    backgroundColor: collectionIssue.map(data => data.color)
                }]
            },
            collectionSupply: {
                labels: collectionSupply.map(data => data.name),
                datasets: [{
                    data: collectionSupply.map(data => data.value),
                    backgroundColor: collectionSupply.map(data => data.color)
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
                            <div className="dashboard__chart mb-4" style={{position: 'relative', height:'40vh', width:'73vw', display: 'flex', justifyContent: 'center'}}>
                            <label className="chart__label">New Users</label>
                                <BarChart chartData={this.state.newUserData}></BarChart>
                            </div>
                            <div className="dashboard__chart  mb-4" style={{position: 'relative', height:'40vh', width:'73vw', display: 'flex', justifyContent: 'center'}}>
                            <label className="chart__label">Total Users</label>
                                <LineChart chartData={this.state.totalUserData}></LineChart>
                            </div>
                        </Tab>
                        <Tab eventKey="rewards" title="Rewards">
                            <RewardsInfo></RewardsInfo>
                            <div className="dashboard__chart  mb-4" style={{position: 'relative', height:'40vh', width:'73vw', display: 'flex', justifyContent: 'center'}}>
                            <label className="chart__label">Rewards</label>
                                <BarChart chartData={this.state.newUserData}></BarChart>
                            </div>
                            <div className="chart__group">
                                <div className="dashboard__chart  mb-4" style={{position: 'relative', height:'40vh', width:'50vw', display: 'flex', justifyContent: 'center'}}>
                                    <label className="chart__label">Distribution of rewards</label>
                                    <DonutChart chartData={this.state.distributionOfRewardsData}></DonutChart>
                                </div>
                                <div className="dashboard__chart  mb-4" style={{position: 'relative', height:'40vh', width:'50vw', display: 'flex', justifyContent: 'center'}}>
                                <label className="chart__label">Type of rewards</label>
                                <DonutChart chartData={this.state.typeOfRewardsData}></DonutChart>
                            </div>
                            </div>
            
                        </Tab>
                        <Tab eventKey="tokens" title="Tokens">
                            <TokensInfo></TokensInfo>
                            <div className="dashboard__chart  mb-4" style={{position: 'relative', height:'40vh', width:'73vw', display: 'flex', justifyContent: 'center'}}>
                                <label className="chart__label">                Token distribution </label>
                                <BarChart chartData={this.state.newUserData}></BarChart>
                            </div>
                            <div className="chart__group">
                                <div className="dashboard__chart  mb-4" style={{position: 'relative', height:'40vh', width:'50vw', display: 'flex', justifyContent: 'center'}}>
                                    <label className="chart__label">Tokens issue</label>
                                    <DonutChart chartData={this.state.tokensIssuesData}></DonutChart>
                                </div>
                                <div className="dashboard__chart  mb-4" style={{position: 'relative', height:'40vh', width:'50vw', display: 'flex', justifyContent: 'center'}}>
                                    <label className="chart__label">Tokens supply</label>
                                    <DonutChart chartData={this.state.tokensSupplyData}></DonutChart>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="NFTs" title="NFTs">
                            <NftsInfo></NftsInfo>
                            <div className="dashboard__chart  mb-4" style={{position: 'relative', height:'40vh', width:'73vw', display: 'flex', justifyContent: 'center'}}>
                            <label className="chart__label">NFTs distribution </label>
                                <BarChart chartData={this.state.newUserData}></BarChart>
                            </div>
                            <div className="chart__group">
                                <div className="dashboard__chart  mb-4" style={{position: 'relative', height:'40vh', width:'50vw', display: 'flex', justifyContent: 'center'}}>
                                    <label className="chart__label">Collection issue</label>
                                    <DonutChart chartData={this.state.collectionIssueData}></DonutChart>
                                </div>
                                <div className="dashboard__chart  mb-4" style={{position: 'relative', height:'40vh', width:'50vw', display: 'flex', justifyContent: 'center'}}>
                                    <label className="chart__label">Collection supply</label>
                                    <DonutChart chartData={this.state.collectionSupply}></DonutChart>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default Dashboard