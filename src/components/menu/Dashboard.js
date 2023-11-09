import { Component } from "react";
import { Tab, Tabs } from "react-bootstrap";
import BarChart from "../charts/BarChart";
import NftsInfo from "../dashboardInfo/Nfts";
import RewardsInfo from "../dashboardInfo/RewardsInfo";
import TokensInfo from "../dashboardInfo/TokensInfo";
import UserInfo from "../dashboardInfo/UserInfo";
import { collectionIssue, collectionSupply, newUser , tokensIssue, tokensSupply} from "../../data/data";
import LineChart from "../charts/LineChart";
import DonutChart from "../charts/DonutChart";
import DatePicker from "../DatePicker";
import { getBearerHeader } from "../../utils/getBearerHeader";
import { config } from "../../utils/config";
import { getRandomRGBAColor } from "../../utils/color";
import { subDays } from "date-fns";
import { typesOfDashboard } from "../../utils/constants";
import { ethers } from "ethers";

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            distributionOfRewardsMockData: {
                labels: ['Reward name'],
                datasets: [{
                    data: [100],
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            },
            typeOfRewardsMockData: {
                labels: ['Tokens', 'NFTs'],
                datasets: [{
                    data: [100, 100],
                    backgroundColor: ['rgba(255, 159, 67, 0.85)', 'rgba(255, 159, 67, 0.85)']
                }]
            },
            tokensIssuesMockData: {
                labels: ['Claimed', 'Distributed', 'Available'],
                datasets: [{
                    data: [100, 100, 100],
                    backgroundColor: ['rgba(255, 159, 67, 0.85)', 'rgba(255, 159, 67, 0.85)', 'rgba(255, 159, 67, 0.85)']
                }]
            },
            tokensSupplyMockData: {
                labels: ['Tokens', 'NFTs'],
                datasets: [{
                    data: [100, 100],
                    backgroundColor: ['rgba(255, 159, 67, 0.85)', 'rgba(255, 159, 67, 0.85)']
                }]
            },
            collectionIssueMockData: {
                labels: ['Claimed', 'Distributed', 'Available'],
                datasets: [{
                    data: [100, 100, 100],
                    backgroundColor: ['rgba(255, 159, 67, 0.85)', 'rgba(255, 159, 67, 0.85)', 'rgba(255, 159, 67, 0.85)']
                }]
            },
            collectionSupplyMockData: {
                labels: ['Tokens', 'NFTs'],
                datasets: [{
                    data: [100, 100],
                    backgroundColor: ['rgba(255, 159, 67, 0.85)', 'rgba(255, 159, 67, 0.85)']
                }]
            },
            tokenDistributionMockDdata: {
                labels: [],
                datasets: []
            },
            nftsDistributionMockDdata: {
                labels: [],
                datasets: []
            },
            newUserData: {
                labels: [],
                datasets: []
            },
            totalUserData: {
                labels: [],
                datasets: []
            },
            rewardsRange: {
                labels: [],
                datasets: []
            },
            distributionOfRewardsData: {
                labels: [],
                datasets: []
            },
            typeOfRewardsData: {
                labels: [],
                datasets: []
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
            },
            rewards_total_count: 0,
            new_users_range: null
        }
    }

    async componentDidMount() {
        const now = new Date()
        const nowSub7 = subDays(new Date(), 7)
        await this.getTypeOfRewards()
        await this.getRewardDistribution()
        await this.changeNewUsersRange(nowSub7, now)
        await this.changeRewardsRange(nowSub7, now)
        await this.changeTokensRange(nowSub7, now)
        await this.changeNftsRange(nowSub7, now)
    }

    async getTypeOfRewards() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/stat/total_rewards`, requestOptions)
            const json = await res.json()
            const total = +json.body.data.erc20 + +json.body.data.erc721
            const typeOfRewards = [
                {
                    id: '1',
                    name: 'Tokens',
                    value: json.body.data.erc20 * 100 / total,
                    color: 'rgba(244, 190, 55, 1)',
                },
                {
                    id: '2',
                    name: 'NFTs',
                    value: json.body.data.erc721 * 100 / total,
                    color: 'rgba(255, 159, 64, 1)'
                },
            ]
            this.setState({
                typeOfRewardsData: !typeOfRewards[0]?.value
                    ?  this.state.typeOfRewardsMockData 
                    : {
                    labels: typeOfRewards.map(data => data.name),
                    datasets: [{
                        data: typeOfRewards.map(data => data.value),
                        backgroundColor: typeOfRewards.map(data => data.color)
                    }]
                },
                rewards_total_count: total
            })
        } catch (error) {
            alert(error)
        }
    }

    async getRewardDistribution() {
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/stat/rewards_distribution`, requestOptions)
            const json = await res.json()
            json.body.data = json.body.data.filter(row => row.event_count != 0)
            const total = json.body.data.reduce((total, row) => total + parseInt(row.event_count), 0);
            const distributionOfRewards = json.body.data.map((v, i) => {
                return {
                    id: (i + 1).toString(),
                    name: v.name,
                    value: parseInt(v.event_count) * 100 / total,
                    color: getRandomRGBAColor()
                }
            })
            this.setState({
                distributionOfRewardsData: !distributionOfRewards.length 
                ? this.state.distributionOfRewardsMockData 
                :{
                    labels: distributionOfRewards.map(data => data.name),
                    datasets: [{
                        data: distributionOfRewards.map(data => data.value),
                        backgroundColor: distributionOfRewards.map(data => data.color)
                    }]
                }
            })
        } catch (error) {
            alert(error)
        }
    }

    async changeNewUsersRange(startDate, endDate) {
        const isTodayOrYesterday = startDate.getDate() === endDate.getDate() && startDate.getMonth() === endDate.getMonth()
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())
            let query = new URLSearchParams();
            query.append("startDate", startDate.toString())
            query.append("endDate", endDate.toString())
            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/stat/new_users_range?` + query.toString(), requestOptions)
            const json = await res.json()
            const range = {
                labels: json.body.data.map(v => `${isTodayOrYesterday ? new Date(v.date_interval_end).toLocaleTimeString().replace(/(:\d{2}| [AP]M)$/, "")  : new Date(v.date_interval_end).toLocaleDateString()} `),
                datasets: [{
                    data: json.body.data.map(v => parseInt(v.count)),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            }
            const resTotal = await fetch(`${config.api}/stat/total_users_range?` + query.toString(), requestOptions)
            const jsonTotal = await resTotal.json()
            const rangeTotal = {
                labels: jsonTotal.body.data.map(v => `${isTodayOrYesterday ? new Date(v.end_date).toLocaleTimeString().replace(/(:\d{2}| [AP]M)$/, "") : new Date(v.end_date).toLocaleDateString()} `),
                datasets: [{
                    data: jsonTotal.body.data.map(v => parseInt(v.count)),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            }
            this.setState({
                newUserData: range,
                tokenDistributionMockDdata: {
                    labels: json.body.data.map(v => `${isTodayOrYesterday ? new Date(v.date_interval_end).toLocaleTimeString().replace(/(:\d{2}| [AP]M)$/, "")  : new Date(v.date_interval_end).toLocaleDateString()} `),
                    datasets: [{
                        data: [],
                        backgroundColor: ['rgba(255, 159, 67, 0.85)']
                    }]
                },
                nftsDistributionMockDdata : {
                    labels: json.body.data.map(v => `${isTodayOrYesterday ? new Date(v.date_interval_end).toLocaleTimeString().replace(/(:\d{2}| [AP]M)$/, "")  : new Date(v.date_interval_end).toLocaleDateString()} `),
                    datasets: [{
                        data: [],
                        backgroundColor: ['rgba(255, 159, 67, 0.85)']
                    }]
                },
                totalUserData: rangeTotal
            })
        } catch (error) {
            
        }
    }

    async changeRewardsRange(startDate, endDate) {
        const isTodayOrYesterday = startDate.getDate() === endDate.getDate() && startDate.getMonth() === endDate.getMonth()
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())
            let query = new URLSearchParams();
            query.append("startDate", startDate.toString())
            query.append("endDate", endDate.toString())
            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/stat/rewards_range?` + query.toString(), requestOptions)
            const json = await res.json()
            const range = {
                labels: json.body.data.map(v => `${isTodayOrYesterday ? new Date(v.date_interval_end).toLocaleTimeString().replace(/(:\d{2}| [AP]M)$/, "") : new Date(v.date_interval_end).toLocaleDateString()}`),
                datasets: [{
                    data: json.body.data.map(v => parseInt(v.count)),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            }
            this.setState({
                rewardsRange: range
            })
        } catch (error) {
            
        }
    }

    async changeTokensRange(startDate, endDate) {
        const isTodayOrYesterday = startDate.getDate() === endDate.getDate() && startDate.getMonth() === endDate.getMonth()
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())
            let query = new URLSearchParams();
            query.append("startDate", startDate.toString())
            query.append("endDate", endDate.toString())
            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/stat/tokens_dist_range?` + query.toString(), requestOptions)
            const json = await res.json()
            const range = {
                labels: json.body.data.map(v => {
                    v.count = ethers.utils.formatEther(v.count)
                    return v
                }).map(v => `${isTodayOrYesterday ? new Date(v.date_interval_end).toLocaleTimeString().replace(/(:\d{2}| [AP]M)$/, "") : new Date(v.date_interval_end).toLocaleDateString()}`),
                datasets: [{
                    data: json.body.data.map(v => parseInt(v.count)),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            }
            this.setState({
                tokenDistributionMockDdata: range
            })
        } catch (error) {
            
        }
    }

    async changeNftsRange(startDate, endDate) {
        const isTodayOrYesterday = startDate.getDate() === endDate.getDate() && startDate.getMonth() === endDate.getMonth()
        try {
            const headers = new Headers();
            headers.append("Authorization", getBearerHeader())
            let query = new URLSearchParams();
            query.append("startDate", startDate.toString())
            query.append("endDate", endDate.toString())
            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
              };
            const res = await fetch(`${config.api}/stat/nfts_dist_range?` + query.toString(), requestOptions)
            const json = await res.json()
            console.log(json)
            const range = {
                labels: json.body.data.map(v => `${isTodayOrYesterday ? new Date(v.date_interval_end).toLocaleTimeString().replace(/(:\d{2}| [AP]M)$/, "") : new Date(v.date_interval_end).toLocaleDateString()}`),
                datasets: [{
                    data: json.body.data.map(v => parseInt(v.count)),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            }
            this.setState({
                nftsDistributionMockDdata: range
            })
        } catch (error) {
            
        }
    }

    changeNewUsersRange = this.changeNewUsersRange.bind(this)
    changeRewardsRange = this.changeRewardsRange.bind(this)
    changeTokensRange = this.changeTokensRange.bind(this)
    changeNftsRange = this.changeNftsRange.bind(this)

    render() {
        return (
            <div className="dashboard">
                <h3 className="menu__title">Dashboard</h3>
                <div className="dashboard__tab">
                    <Tabs defaultActiveKey="users">
                        <Tab eventKey="users" title="Users">
                            <UserInfo></UserInfo>
                            <DatePicker changeNewUsersRange={this.changeNewUsersRange} type={typesOfDashboard.users}></DatePicker>
                            <div className="dashboard__chart mb-4">
                                <div className="dashboard__chart_dashboard-info">
                                    <label className="chart__label">New Users</label>
                                    <div className="dashboard__chart_wrapper mb-4" style={{position: 'relative', height:'358px', display: 'flex', justifyContent: 'center'}}>
                                        <BarChart chartData={this.state.newUserData}></BarChart>
                                    </div>
                                </div>
                                <div className="dashboard__chart_dashboard-info  mb-4">
                                    <label className="chart__label">Total Users</label>
                                    <div className="dashboard__chart_wrapper mb-4" style={{position: 'relative', height:'358px', display: 'flex', justifyContent: 'center'}}>
                                        <LineChart chartData={this.state.totalUserData}></LineChart>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="rewards" title="Rewards">
                            <RewardsInfo total={this.state.rewards_total_count}></RewardsInfo>
                            <DatePicker changeRewardsRange={this.changeRewardsRange} type={typesOfDashboard.rewards}></DatePicker>
                            <div className="dashboard__chart_dashboard-info  mb-4">
                            <label className="chart__label">Rewards</label>
                                <div className="dashboard__chart_wrapper mb-4" style={{position: 'relative', height:'358px', display: 'flex', justifyContent: 'center'}}>
                                    <BarChart chartData={this.state.rewardsRange}></BarChart>
                                </div>
                            </div>
                            <div className="chart__group">
                                <div className="dashboard__chart_dashboard-info  mb-4">
                                    <label className="chart__label">Distribution of rewards</label>
                                    <div style={{position: 'relative', height:'358px', display: 'flex', justifyContent: 'center'}}>
                                        <DonutChart chartData={this.state.distributionOfRewardsData}></DonutChart>
                                    </div>
                                </div>
                                <div className="dashboard__chart_dashboard-info  mb-4">
                                    <label className="chart__label">Type of rewards</label>
                                    <div style={{position: 'relative', height:'358px', display: 'flex', justifyContent: 'center'}}>
                                        <DonutChart chartData={this.state.typeOfRewardsData}></DonutChart>
                                    </div>
                                </div>
                            </div>
            
                        </Tab>
                        <Tab eventKey="tokens" title="Tokens">
                            <TokensInfo></TokensInfo>
                            <DatePicker changeTokensRange={this.changeTokensRange} type={typesOfDashboard.tokens}></DatePicker>
                            <div className="dashboard__chart_dashboard-info  mb-4">
                                <label className="chart__label"> Token distribution </label>
                                <div className="dashboard__chart_wrapper mb-4"  style={{position: 'relative', height:'358px', display: 'flex', justifyContent: 'center'}}>
                                    <BarChart chartData={this.state.tokenDistributionMockDdata}></BarChart>
                                </div>
                            </div>
                            <div className="chart__group">
                                <div className="dashboard__chart_dashboard-info  mb-4">
                                    <label className="chart__label">Tokens issue</label>
                                    <div style={{position: 'relative', height:'358px', display: 'flex', justifyContent: 'center'}}>
                                        <DonutChart chartData={this.state.tokensIssuesMockData}></DonutChart>
                                    </div>
                                </div>
                                <div className="dashboard__chart_dashboard-info  mb-4">
                                    <label className="chart__label">Tokens supply</label>
                                    <div style={{position: 'relative', height:'358px', display: 'flex', justifyContent: 'center'}}>
                                        <DonutChart chartData={this.state.tokensSupplyMockData}></DonutChart>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="NFTs" title="NFTs">
                            <NftsInfo></NftsInfo>
                            <DatePicker changeNftsRange={this.changeNftsRange} type={typesOfDashboard.nfts}></DatePicker>
                            <div className="dashboard__chart_dashboard-info  mb-4">
                            <label className="chart__label">NFTs distribution </label>
                            <div className="dashboard__chart_wrapper mb-4" style={{position: 'relative', height:'358px', display: 'flex', justifyContent: 'center'}}>
                                <BarChart chartData={this.state.nftsDistributionMockDdata}></BarChart>
                            </div>
                            </div>
                            <div className="chart__group">
                                <div className="dashboard__chart_dashboard-info  mb-4">
                                    <label className="chart__label">Collection issue</label>
                                    <div style={{position: 'relative', height:'358px', display: 'flex', justifyContent: 'center'}}>
                                        <DonutChart chartData={this.state.collectionIssueMockData}></DonutChart>
                                    </div>
                                </div>
                                <div className="dashboard__chart_dashboard-info  mb-4">
                                    <label className="chart__label">Collection supply</label>
                                    <div style={{position: 'relative', height:'358px', display: 'flex', justifyContent: 'center'}}>
                                        <DonutChart chartData={this.state.collectionSupplyMockData}></DonutChart>
                                    </div>
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