import { Component } from "react";
import {Line} from "react-chartjs-2"
import { Chart as Chart } from "chart.js/auto";


class LineChart extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {chartData} = this.props
        const options = {
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
               }
            }
            },
            elements: {
              point:{
                  radius: 0
              }
          }
        }
        return (
            <Line data={chartData}
            height="287px"
            width="800px"
            options={options}></Line>
        )
    }
}

export default LineChart