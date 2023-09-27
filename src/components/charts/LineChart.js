import { Component } from "react";
import {Line} from "react-chartjs-2"
import { Chart as Chart } from "chart.js/auto";


class LineChart extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {chartData} = this.props
        return (
            <Line data={chartData}></Line>
        )
    }
}

export default LineChart