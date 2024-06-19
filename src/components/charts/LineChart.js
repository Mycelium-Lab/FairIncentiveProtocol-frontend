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
          <Line data={chartData}
          options={{
              plugins: {
                legend: {
                  display: false,
                },   
                tooltip: {
                  enabled: false,
                  external: (context) => {
                    
                    // Tooltip Element
                    let tooltipEl = document.getElementById('chartjs-tooltip');
    
                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<div class="label_window"></div>';
                        document.body.appendChild(tooltipEl);
                    }
    
                    // Hide if no tooltip
                    const tooltipModel = context.tooltip;
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = 0;
                        return;
                    }
    
                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }
    
                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }
    
                    // Set Text
                    if (tooltipModel.body) {
                        const titleLines = tooltipModel.title || [];
                        const bodyLines = tooltipModel.body.map(getBody);
    
                        let innerHtml = '<thead>';
    
                        titleLines.forEach(function(title) {
                            innerHtml += '<tr><th>' + title + '</th></tr>';
                        });
                        innerHtml += '</thead><tbody>';
    
                        bodyLines.forEach(function(body, i) {
                            const colors = tooltipModel.labelColors[i];
                            let style = 'background:' + "colors.backgroundColor"; // Label's VALUE Background
                            style += '; border-color:' + colors.borderColor; // 
                            style += '; border-width: 2px';
                            const span = '<span style="' + style + '">' + body + '</span>';
                            innerHtml += '<tr><td>' + span + '</td></tr>';
                        });
                        innerHtml += '</tbody>';
    
                        let tableRoot = tooltipEl.querySelector('.label_window');
                        tableRoot.innerHTML = innerHtml;
                    }
    
                    const position = context.chart.canvas.getBoundingClientRect();
                    const bodyFont = "HelveticaNeueCyr";
    
                    // Display, position, and set styles for font
                    tooltipEl.style.transition = "all 0.2s ease";
                    tooltipEl.style.opacity = 1;
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 20 + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - 70 + 'px';
                    tooltipEl.style.font = bodyFont;
                    tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                  },
                  callbacks: {
                    // this callback is used to create the tooltip label
                    label: function(tooltipItem) {
                      let label = 
                      `<div class="tooltip_info"> 
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g filter="url(#filter0_d_1_14860)">
                          <circle cx="9" cy="7" r="5" fill="#FF9F43"/>
                          <circle cx="9" cy="7" r="6" stroke="white" stroke-width="2"/>
                          </g>
                          <defs>
                          <filter id="filter0_d_1_14860" x="0" y="0" width="18" height="18" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                          <feOffset dy="2"/>
                          <feGaussianBlur stdDeviation="1"/>
                          <feComposite in2="hardAlpha" operator="out"/>
                          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_14860"/>
                          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_14860" result="shape"/>
                          </filter>
                          </defs>
                        </svg>
                        ${chartData.chartTooltip}: <b>${tooltipItem.formattedValue}</b> 
                      </div>\n `;
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
                  max: window.innerWidth > 720 ? 80 : 20,
                  grid: {
                    display: false
                  },
                  ticks: {
                    padding: 5,
                    stepSize: 1,
                    autoSkip: true,
                    maxTicksLimit: 7,
                    maxRotation: 0,
                    font: {
                      family: "HelveticaNeueCyr",
                      size: 12
                    }
                  }
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 200,
                    padding: window.innerWidth > 720 ? 30 : 10,
                    font: {
                      family: "HelveticaNeueCyr",
                      size: 12
                    }
                  }
                },
                y1: {
                  position: "right",
                  ticks: {
                    color: "rgba(0, 0, 0, 0)",
                    padding: window.innerWidth > 720 ? 30 : 10,
                    stepSize: 10,
                    font: {
                      family: "HelveticaNeueCyr",
                      size: 12
                    }
                  }
                }
              }
            } 
          }
          ></Line>
      )
  }
}

export default LineChart