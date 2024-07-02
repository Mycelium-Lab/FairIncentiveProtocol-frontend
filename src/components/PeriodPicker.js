import { subDays } from "date-fns";
import React, { Component } from "react";

export default class PeriodPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 1,
    };
  }

  setActiveIndex = (index) => {
    this.setState({ activeIndex: index });
    const now = new Date()
    const nowSub = subDays(new Date(), index)
    if (this.props.changeNewUsersRange) {
        this.props.changeNewUsersRange(nowSub, now)
    }
    if (this.props.changeRewardsRange) {
        this.props.changeRewardsRange(nowSub, now)
    }
    if (this.props.changeTokensRange) {
        this.props.changeTokensRange(nowSub, now)
    }
    if (this.props.changeNftsRange) {
        this.props.changeNftsRange(nowSub, now)
    }
  };

  setActiveIndex = this.setActiveIndex.bind(this)

  render() {
    const { activeIndex } = this.state;

    return (
      <div className="period_picker">
        <div
          onClick={() => this.setActiveIndex(1)}
          className={activeIndex === 1 ? "period period_active" : "period"}
        >
          1D
        </div>
        <div
          onClick={() => this.setActiveIndex(7)}
          className={activeIndex === 7 ? "period period_active" : "period"}
        >
          7D
        </div>
        <div
          onClick={() => this.setActiveIndex(30)}
          className={activeIndex === 30 ? "period period_active" : "period"}
        >
          1M
        </div>
        <div
          onClick={() => this.setActiveIndex(90)}
          className={activeIndex === 90 ? "period period_active" : "period"}
        >
          3M
        </div>
        <div
          onClick={() => this.setActiveIndex(180)}
          className={activeIndex === 180 ? "period period_active" : "period"}
        >
          6M
        </div>
        <div
          onClick={() => this.setActiveIndex(365)}
          className={activeIndex === 365 ? "period period_active" : "period"}
        >
          1Y
        </div>
        <div
          onClick={() => this.setActiveIndex(366)}
          className={activeIndex === 366 ? "period period_active" : "period"}
        >
          All
        </div>
      </div>
    );
  }
}
