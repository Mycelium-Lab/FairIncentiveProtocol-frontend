import { Component } from "react";
import { Tab, Tabs } from "react-bootstrap";
import NftsInfo from "../dashboardInfo/Nfts";
import RewardsInfo from "../dashboardInfo/RewardsInfo";
import TokensInfo from "../dashboardInfo/TokensInfo";
import UserInfo from "../dashboardInfo/UserInfo";

class Dashboard extends Component {
    render() {
        return (
            <div className="dashboard">
                <h3 className="menu__title">Dashboard</h3>
                <div className="dashboard__tab">
                    <Tabs defaultActiveKey="users">
                        <Tab eventKey="users" title="Users">
                            <UserInfo></UserInfo>
                        </Tab>
                        <Tab eventKey="rewards" title="Rewards">
                            <RewardsInfo></RewardsInfo>
                        </Tab>
                        <Tab eventKey="tokens" title="Tokens">
                            <TokensInfo></TokensInfo>
                        </Tab>
                        <Tab eventKey="NFTs" title="NFTs">
                            <NftsInfo></NftsInfo>
                        </Tab>
                    </Tabs>
                </div>

                <div className="dashboard__chart">
                
                </div>
            </div>
        )
    }
}

export default Dashboard