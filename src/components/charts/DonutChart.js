import { Component } from "react";
import {Doughnut} from "react-chartjs-2"
import { Chart as Chart } from "chart.js/auto";


class DonutChart extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {chartData} = this.props
        return (
            <Doughnut data={chartData}></Doughnut>
        )
    }
}

export default DonutChart