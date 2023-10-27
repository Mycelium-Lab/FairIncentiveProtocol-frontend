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
            <Bar data={chartData} 
            height="287px"
            width="800px"
            options={{
                plugins: {
                  legend: {
                    display: false,
                  },   
                  tooltip: {
                    callbacks: {
                      // this callback is used to create the tooltip label
                      label: function(tooltipItem) {
                        let label = `  ${tooltipItem.formattedValue}`
                        return label
                      } 
                    }
                  } 
                },
                maintainAspectRatio : false,
                responsive: true,
                aspectRatio: 1, 
                scales: {
                  x: {
                     grid: {
                       display: false
                     },
                     ticks: {
                      stepSize: 1
                     }
                  }
                  }
              }}
            ></Bar>
        )
    }
}

export default BarChart