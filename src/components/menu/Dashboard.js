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
import PeriodPicker from "../PeriodPicker";
import MiniBarChart from "../charts/MiniBarChart";
import ProgressBar from "../charts/ProgressBar";
import ProgressCircle from "../charts/ProgressCircle";
import { getBearerHeader } from "../../utils/getBearerHeader";
import { config } from "../../utils/config";
import { addDays, subDays } from "date-fns";
import { formated, isWithin, isWithin7Days } from "../../utils/time";
import { getRandomRGBAColor } from "../../utils/color";
import { ethers } from "ethers";

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rewards_total_count: 0,
            newUserData: {
                chartTooltip: "New users",
                labels: newUser.map(data => data.time).concat(newUser.map(data => data.time)).concat(newUser.map(data => data.time)),
                datasets: [{
                    // data: newUser.map(data => data.amount)
                    data: newUser.map(data => data.amount).concat([780, 750, 300, 730, 100, 500, 750, 300, 730, 100, 500, 750, 300, 730, 100, 500]),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            },
            newUser24Data: {
                chartTooltip: "New users",
                labels: ['11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM'],
                datasets: [{
                    // data: newUser.map(data => data.amount),
                    data: [89, 85, 12, 82, 19, 85, 66, 84, 0, 12, 29, 52, 51, 72, 95, 27, 72, 33, 80, 50, 47, 5, 46, 61, 84, 25, 67, 16, 25, 20, 71, 56, 99, 30, 55, 74, 97, 58, 94, 65, 21, 63, 91, 66, 12, 92, 32, 8, 11, 74, 5, 42, 21, 2, 54, 29, 26, 7, 23, 32, 65, 6, 41, 58, 65, 10, 68, 27, 81, 81, 8, 50, 76, 41, 42, 90, 35, 69, 81, 36, 93, 24, 35, 39, 82, 33, 82, 17, 18, 72, 55, 11, 21, 48, 54, 85, 40, 56, 94, 84],
                    backgroundColor: ['rgba(211, 225, 243, 1)']
                }]
            },
            totalUserData: {
                chartTooltip: "Total users",
                // labels: newUser.map(data => data.time),
                labels: ['Jan', 'Jan', 'Jan', 'Jan', 'Jan', 'Jan', 'Jan', 'Jan', 'Jan', 'Jan', 'Feb', 'Feb', 'Feb', 'Feb', 'Feb', 'Feb', 'Feb', 'Feb', 'Feb', 'Feb', 'Mar', 'Mar', 'Mar', 'Mar', 'Mar', 'Mar', 'Mar', 'Mar', 'Mar', 'Mar', 'Apr', 'Apr', 'Apr', 'Apr', 'Apr', 'Apr', 'Apr', 'Apr', 'Apr', 'Apr'],
                datasets: [{
                    // data: newUser.map(data => data.amount),
                    data: [615, 606, 605, 622, 629, 612, 638, 650, 643, 600, 615, 637, 612, 618, 630, 623, 643, 644, 613, 600, 629, 611, 525, 100, 660, 666, 682, 193, 808, 67, 381, 309, 50, 612, 862, 227, 421, 123, 187, 992, 942],
                    borderColor: ['rgba(255, 159, 67, 0.85)'],
                    pointStyle: false,
                    fill: true,
                    backgroundColor: (context) => {
                        if (!context.chart.chartArea) {
                            return;
                        }
                        const {ctx, data, chartArea: {top, bottom} } = context.chart;
                        const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
                        gradientBg.addColorStop(0.6, "rgba(255, 159, 67, 0.85)");
                        gradientBg.addColorStop(1, "rgba(255, 255, 255, 0)");
                        
                        return gradientBg;
                    },
                    tension: 0.5
                }]
            },
            rewardsData: {
                chartTooltip: "Rewards",
                labels: newUser.map(data => data.time).concat(newUser.map(data => data.time)).concat(newUser.map(data => data.time)),
                datasets: [{
                    // data: newUser.map(data => data.amount)
                    data: newUser.map(data => data.amount).concat([780, 750, 300, 730, 100, 500, 750, 300, 730, 100, 500, 750, 300, 730, 100, 500]),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            },
            rewards24Data: {
                chartTooltip: "Rewards",
                labels: ['11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM', '11:59PM'],
                datasets: [{
                    // data: newUser.map(data => data.amount),
                    data: [89, 85, 12, 82, 19, 85, 66, 84, 0, 12, 29, 52, 51, 72, 95, 27, 72, 33, 80, 50, 47, 5, 46, 61, 84, 25, 67, 16, 25, 20, 71, 56, 99, 30, 55, 74, 97, 58, 94, 65, 21, 63, 91, 66, 12, 92, 32, 8, 11, 74, 5, 42, 21, 2, 54, 29, 26, 7, 23, 32, 65, 6, 41, 58, 65, 10, 68, 27, 81, 81, 8, 50, 76, 41, 42, 90, 35, 69, 81, 36, 93, 24, 35, 39, 82, 33, 82, 17, 18, 72, 55, 11, 21, 48, 54, 85, 40, 56, 94, 84],
                    backgroundColor: ['rgba(211, 225, 243, 1)']
                }]
            },
            distributionOfRewardsData: {
                chartTooltip: "Tokens distributed",
                labels: distributionOfRewards.map(data => data.name),
                datasets: [{
                    data: distributionOfRewards.map(data => data.value),
                    backgroundColor: distributionOfRewards.map(data => data.color)
                }]
            },
            typeOfRewardsData: {
                chartTooltip: "Tokens distributed",
                labels: typeOfRewards.map(data => data.name),
                datasets: [{
                    data: typeOfRewards.map(data => data.value),
                    backgroundColor: typeOfRewards.map(data => data.color)
                }]
            },
            tokensIssuesData: {
                chartTooltip: "Tokens distributed",
                labels: tokensIssue.map(data => data.name),
                datasets: [{
                    data: tokensIssue.map(data => data.value),
                    backgroundColor: tokensIssue.map(data => data.color)
                }]
            },
            tokensSupplyData: {
                chartTooltip: "Tokens distributed",
                labels: tokensSupply.map(data => data.name),
                datasets: [{
                    data: tokensSupply.map(data => data.value),
                    backgroundColor: tokensSupply.map(data => data.color)
                }]
            },
            collectionIssueData: {
                chartTooltip: "Tokens distributed",
                labels: collectionIssue.map(data => data.name),
                datasets: [{
                    data: collectionIssue.map(data => data.value),
                    backgroundColor: collectionIssue.map(data => data.color)
                }]
            },
            collectionSupply: {
                chartTooltip: "Tokens distributed",
                labels: collectionSupply.map(data => data.name),
                datasets: [{
                    data: collectionSupply.map(data => data.value),
                    backgroundColor: collectionSupply.map(data => data.color)
                }]
            },
            progressData: [
                {name: "Reward #1", max: 100000, val: 65376, backgroundColor: "rgba(255, 245, 204, 1)", color: "rgba(255, 178, 0, 1)"},
                {name: "Reward #2", max: 20000, val: 12109, backgroundColor: "rgba(218, 215, 254, 1)", color: "rgba(67, 57, 242, 1)"},
                {name: "Reward #3", max: 160000, val: 132645, backgroundColor: "rgba(204, 248, 254, 1)", color: "rgba(2, 160, 252, 1) "},
                {name: "Reward #4", max: 200000, val: 100429, backgroundColor: "rgba(255, 229, 211, 1)", color: "rgba(255, 58, 41, 1)"}
            ],
            tokenDistributionData: {
                chartTooltip: "Tokens",
                labels: [],
                datasets: []
            },
            nftsDistributionData: {
                chartTooltip: "NFTs",
                labels: [],
                datasets: []
            }
        }
    }

    async componentDidMount() {
        const now = new Date()
        const nowSub = subDays(new Date(), 1)
        await this.changeNewUsersRange(nowSub, now)
        await this.changeRewardsRange(nowSub, now)
        await this.changeTokensRange(nowSub, now)
        await this.changeNftsRange(nowSub, now)
        await this.getRewardDistribution()
        await this.getTypeOfRewards()
    }

    async changeNewUsersRange(startDate, endDate) {
        const isTodayOrYesterday = isWithin(startDate, endDate)
        const is7Days = isWithin7Days(startDate, endDate)
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
                chartTooltip: "New users",
                labels: json.body.data.map(v => `${formated(new Date(v.date_interval_end), isTodayOrYesterday, is7Days)} `),
                datasets: [{
                    data: json.body.data.map(v => parseInt(v.count)),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            }
            const resTotal = await fetch(`${config.api}/stat/total_users_range?` + query.toString(), requestOptions)
            const jsonTotal = await resTotal.json()
            const rangeTotal = {
                chartTooltip: "Total users",
                labels: jsonTotal.body.data.map(v => `${formated(new Date(v.end_date), isTodayOrYesterday, is7Days)} `),
                datasets: [{
                    data: jsonTotal.body.data.map(v => parseInt(v.count)),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            }
            this.setState({
                newUserData: range,
                // tokenDistributionMockDdata: {
                //     labels: json.body.data.map(v => `${isTodayOrYesterday ? new Date(v.date_interval_end).toLocaleTimeString().replace(/(:\d{2}| [AP]M)$/, "")  : new Date(v.date_interval_end).toLocaleDateString()} `),
                //     datasets: [{
                //         data: [],
                //         backgroundColor: ['rgba(255, 159, 67, 0.85)']
                //     }]
                // },
                // nftsDistributionMockDdata : {
                //     labels: json.body.data.map(v => `${isTodayOrYesterday ? new Date(v.date_interval_end).toLocaleTimeString().replace(/(:\d{2}| [AP]M)$/, "")  : new Date(v.date_interval_end).toLocaleDateString()} `),
                //     datasets: [{
                //         data: [],
                //         backgroundColor: ['rgba(255, 159, 67, 0.85)']
                //     }]
                // },
                totalUserData: rangeTotal
            })
        } catch (error) {
            console.log(error)
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
                    max: parseInt(total),
                    val: parseInt(v.event_count),
                    backgroundColor: getRandomRGBAColor(),
                    color: getRandomRGBAColor()
                }
            })
            this.setState({
                progressData: distributionOfRewards
            })
        } catch (error) {
            alert(error)
        }
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
                typeOfRewardsData: {
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

    async changeRewardsRange(startDate, endDate) {
        const isTodayOrYesterday = isWithin(startDate, endDate)
        const is7Days = isWithin7Days(startDate, endDate)
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
                chartTooltip: "Rewards",
                labels: json.body.data.map(v => `${formated(new Date(v.date_interval_end), isTodayOrYesterday, is7Days)} `),
                datasets: [{
                    data: json.body.data.map(v => parseInt(v.count)),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            }
            this.setState({
                rewardsData: range
            })
        } catch (error) {
            
        }
    }

    async changeTokensRange(startDate, endDate) {
        const isTodayOrYesterday = isWithin(startDate, endDate)
        const is7Days = isWithin7Days(startDate, endDate)
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
                chartTooltip: "Tokens",
                labels: json.body.data.map(v => {
                    v.count = ethers.utils.formatEther(v.count)
                    return v
                }).map(v => `${formated(new Date(v.date_interval_end), isTodayOrYesterday, is7Days)} `),
                datasets: [{
                    data: json.body.data.map(v => parseInt(v.count)),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            }
            this.setState({
                tokenDistributionData: range
            })
        } catch (error) {
            console.log(error)
        }
    }

    async changeNftsRange(startDate, endDate) {
        const isTodayOrYesterday = isWithin(startDate, endDate)
        const is7Days = isWithin7Days(startDate, endDate)
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
            const range = {
                chartTooltip: "NFTs",
                labels: json.body.data.map(v => `${formated(new Date(v.date_interval_end), isTodayOrYesterday, is7Days)} `),
                datasets: [{
                    data: json.body.data.map(v => parseInt(v.count)),
                    backgroundColor: ['rgba(255, 159, 67, 0.85)']
                }]
            }
            this.setState({
                nftsDistributionData: range
            })
        } catch (error) {
            console.log(error)
        }
    }

    changeNewUsersRange = this.changeNewUsersRange.bind(this)
    getRewardDistribution = this.getRewardDistribution.bind(this)
    changeRewardsRange = this.changeRewardsRange.bind(this)
    changeTokensRange = this.changeTokensRange.bind(this)
    changeNftsRange = this.changeNftsRange.bind(this)

    render() {
        return (
            <div className="dashboard">
                <h3 className="menu__title">Dashboard</h3>
                <div className="dashboard__tab">
                    <Tabs defaultActiveKey="rewards">
                        <Tab eventKey="users" title="Users">
                            <PeriodPicker changeNewUsersRange={this.changeNewUsersRange}></PeriodPicker>
                            <UserInfo></UserInfo>
                            <div className="dashboard__chart">
                                <h2 className="dashboard__chart-title">
                                    New users
                                </h2>
                                <div className="dashboard__chart-graph">
                                    <BarChart chartTooltip="New users" chartData={this.state.newUserData}></BarChart>
                                </div>
                                {/* <div className="dashboard__chart-sub_graph">
                                    <MiniBarChart chartTooltip="New users" chartData={this.state.newUser24Data}></MiniBarChart>
                                </div> */}
                            </div>
                            <div className="dashboard__chart">
                                <h2 className="dashboard__chart-title">
                                    Total users
                                </h2>
                                <div className="dashboard__chart-graph">
                                    <LineChart chartTooltip="Total users" chartData={this.state.totalUserData}></LineChart>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="rewards" title="Rewards">
                            <PeriodPicker changeRewardsRange={this.changeRewardsRange}></PeriodPicker>
                            <RewardsInfo rewards_total_count={this.state.rewards_total_count}></RewardsInfo>
                            <div className="dashboard__chart">
                                <h2 className="dashboard__chart-title">
                                    Rewards
                                </h2>
                                <div className="dashboard__chart-graph">
                                    <BarChart chartTooltip="Rewards" chartData={this.state.rewardsData}></BarChart>
                                </div>
                                {/* <div className="dashboard__chart-sub_graph">
                                    <MiniBarChart chartTooltip="Rewards" chartData={this.state.rewards24Data}></MiniBarChart>
                                </div> */}
                            </div>
                            <div className="dashboard__progress">
                                <div className="dashboard__progress-wrapper">
                                    <div className="progress__bars_wrapper">
                                        <h2 className="progress__bars-title">Distribution of rewards</h2>
                                        <div className="progress__bars">
                                            {
                                                this.state.progressData.map((v) => {
                                                    return <ProgressBar progressData={v}></ProgressBar>
                                                })
                                            }
                                        </div>
                                    </div>
                                    {/* <div className="progress_circle_wrapper">
                                        <h2 className="progress__circle-title">Type of rewards</h2>
                                        <div className="progress_circle_block">
                                        <div className="progress__legend">
                                            {this.state.progressData.map((i, i_index) => {
                                                return (
                                                    <div class="progress__legend-name">
                                                        <div className="progress__legend-marker" style={{backgroundColor: i.color}}></div>
                                                        {i.name} <b>{(i.val / (i.max / 100)).toFixed(0)}%</b>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                            <ProgressCircle progressData={[
                                                this.state.progressData[0], 
                                                this.state.progressData[1], 
                                                this.state.progressData[2], 
                                                this.state.progressData[3]
                                            ]}></ProgressCircle>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="tokens" title="Tokens">
                            <PeriodPicker changeTokensRange={this.changeTokensRange}></PeriodPicker>
                            <TokensInfo></TokensInfo>
                            <div className="dashboard__chart">
                                <h2 className="dashboard__chart-title">
                                    Token distribution
                                </h2>
                                <div className="dashboard__chart-graph">
                                    <BarChart chartTooltip="Rewards" chartData={this.state.tokenDistributionData}></BarChart>
                                </div>
                                {/* <div className="dashboard__chart-sub_graph">
                                    <MiniBarChart chartTooltip="Rewards" chartData={this.state.rewards24Data}></MiniBarChart>
                                </div> */}
                            </div>
                            {/* <div className="dashboard__progress">
                                <div className="dashboard__progress-wrapper">
                                    <div className="progress__bars_wrapper">
                                        <h2 className="progress__bars-title">Distribution of rewards</h2>
                                        <div className="progress__bars">
                                            <ProgressBar progressData={{name: "Reward #1", max: 100000, val: 65376, backgroundColor: "rgba(255, 245, 204, 1)", color: "rgba(255, 178, 0, 1)"}}></ProgressBar>
                                            <ProgressBar progressData={{name: "Reward #1", max: 20000, val: 12109, backgroundColor: "rgba(218, 215, 254, 1)", color: "rgba(67, 57, 242, 1)"}}></ProgressBar>
                                            <ProgressBar progressData={{name: "Reward #1", max: 160000, val: 132645, backgroundColor: "rgba(204, 248, 254, 1)", color: "rgba(2, 160, 252, 1) "}}></ProgressBar>
                                            <ProgressBar progressData={{name: "Reward #1", max: 200000, val: 100429, backgroundColor: "rgba(255, 229, 211, 1)", color: "rgba(255, 58, 41, 1)"}}></ProgressBar>
                                        </div>
                                    </div>
                                    <div className="progress_circle_wrapper">
                                        <h2 className="progress__circle-title">Type of rewards</h2>
                                        <div className="progress_circle_block">
                                        <div className="progress__legend">
                                            {this.state.progressData.map((i, i_index) => {
                                                return (
                                                    <div class="progress__legend-name">
                                                        <div className="progress__legend-marker" style={{backgroundColor: i.color}}></div>
                                                        {i.name} <b>{(i.val / (i.max / 100)).toFixed(0)}%</b>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                            <ProgressCircle progressData={[
                                                this.state.progressData[0], 
                                                this.state.progressData[1], 
                                                this.state.progressData[2], 
                                                this.state.progressData[3]
                                            ]}></ProgressCircle>
                                        </div>
                                    </div>
                                </div>
                            </div>  */}
                        </Tab>
                        <Tab eventKey="NFTs" title="NFTs">
                            <PeriodPicker changeNftsRange={this.changeNftsRange}></PeriodPicker>
                            <NftsInfo></NftsInfo>
                            <div className="dashboard__chart">
                                <h2 className="dashboard__chart-title">
                                    NFT distribution
                                </h2>
                                <div className="dashboard__chart-graph">
                                    <BarChart chartTooltip="Rewards" chartData={this.state.nftsDistributionData}></BarChart>
                                </div>
                                {/* <div className="dashboard__chart-sub_graph">
                                    <MiniBarChart chartTooltip="Rewards" chartData={this.state.rewards24Data}></MiniBarChart>
                                </div> */}
                            </div>
                            {/* <div className="dashboard__progress">
                                <div className="dashboard__progress-wrapper">
                                    <div className="progress__bars_wrapper">
                                        <h2 className="progress__bars-title">Distribution of rewards</h2>
                                        <div className="progress__bars">
                                            <ProgressBar progressData={{name: "Reward #1", max: 100000, val: 65376, backgroundColor: "rgba(255, 245, 204, 1)", color: "rgba(255, 178, 0, 1)"}}></ProgressBar>
                                            <ProgressBar progressData={{name: "Reward #1", max: 20000, val: 12109, backgroundColor: "rgba(218, 215, 254, 1)", color: "rgba(67, 57, 242, 1)"}}></ProgressBar>
                                            <ProgressBar progressData={{name: "Reward #1", max: 160000, val: 132645, backgroundColor: "rgba(204, 248, 254, 1)", color: "rgba(2, 160, 252, 1) "}}></ProgressBar>
                                            <ProgressBar progressData={{name: "Reward #1", max: 200000, val: 100429, backgroundColor: "rgba(255, 229, 211, 1)", color: "rgba(255, 58, 41, 1)"}}></ProgressBar>
                                        </div>
                                    </div>
                                    <div className="progress_circle_wrapper">
                                        <h2 className="progress__circle-title">Type of rewards</h2>
                                        <div className="progress_circle_block">
                                        <div className="progress__legend">
                                            {this.state.progressData.map((i, i_index) => {
                                                return (
                                                    <div class="progress__legend-name">
                                                        <div className="progress__legend-marker" style={{backgroundColor: i.color}}></div>
                                                        {i.name} <b>{(i.val / (i.max / 100)).toFixed(0)}%</b>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                            <ProgressCircle progressData={[
                                                this.state.progressData[0], 
                                                this.state.progressData[1], 
                                                this.state.progressData[2], 
                                                this.state.progressData[3]
                                            ]}></ProgressCircle>
                                        </div>
                                    </div>
                                </div>
                            </div>                             */}
                        </Tab>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default Dashboard