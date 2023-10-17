import { Component } from "react";
import {Doughnut} from "react-chartjs-2"
import { Chart as Chart } from "chart.js/auto";


class DonutChart extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {chartData} = this.props
        const options = {
            plugins: {
                legend: {
                  position: 'right',
                  align: 'center'
                },
                tooltip: {
                    callbacks: {
                      // this callback is used to create the tooltip label
                      label: function(tooltipItem) {
                        let label = `  ${tooltipItem.formattedValue}%`
                        return label
                      } 
                    }
                  } 
              }
            }
        return (
            <Doughnut data={chartData} options={options}></Doughnut>
        )
    }
}

export default DonutChart