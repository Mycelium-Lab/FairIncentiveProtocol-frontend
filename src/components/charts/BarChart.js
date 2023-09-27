import { Component } from "react";
import {Bar} from "react-chartjs-2"
import { Chart as Chart } from "chart.js/auto";


class BarChart extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {chartData} = this.props
        return (
            <Bar data={chartData}></Bar>
        )
    }
}

export default BarChart