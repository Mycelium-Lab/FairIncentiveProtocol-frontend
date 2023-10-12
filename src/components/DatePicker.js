import React from "react";
import {DateRangePicker} from "react-date-range"
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

import format from "date-fns/format"
import { addDays } from 'date-fns'

class DatePicker extends React.Component {
    textInput = React.createRef(null);
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            calendar: '',
            range: [
                {
                    startDate: new Date(),
                    endDate: addDays(new Date(), 7),
                    key: 'selection'
                }
            ]
        }
    }

    componentDidMount() {
        // event listeners
        document.addEventListener("keydown", this.hideOnEscape, true)
        document.addEventListener("click", this.hideOnClickOutside, true)
    }
    
    // hide dropdown on ESC press
    hideOnEscape(e) {
        // console.log(e.key)
        if( e.key === "Escape" ) {
            this.setState({open: false})
        }
    }

    hideOnClickOutside(e) {
        //console.log(this.textInput)
        //console.log(e.target)
        if( this.textInput.current && !this.textInput.current.contains(e.target) ) {
            this.setState({open: false})
          }
    }

    handleRange(range) {
        this.setState({range})
    }
     

    handleOpen() {
        this.setState({open: !this.state.open})
    }


    hideOnEscape = this.hideOnEscape.bind(this)
    hideOnClickOutside = this.hideOnClickOutside.bind(this)
    handleRange = this.handleRange.bind(this)
    handleOpen = this.handleOpen.bind(this)
    render() {
        return (
            <div className="datepicker-wrapper">
               <input
                value={`${format(this.state.range[0].startDate, "MM/dd/yyyy")} - ${format(this.state.range[0].endDate, "MM/dd/yyyy")}`}
                readOnly
                className="inputBox mb-4"
                onClick={this.handleOpen}
            />
                <div ref={this.textInput}>
                    {this.state.open 
                    ? 
                    <DateRangePicker
                        onChange={item => this.handleRange([item.selection])}
                        editableDateInputs={true}
                        moveRangeOnFirstSelection={false}
                        ranges={this.state.range}
                        months={2}
                        direction="vertical"
                        className="calendarElement"
                        color="#FF9F43"
                    />
                    : null
                    }
                </div>
            </div>
         
          
    
        )
    }
}

export default DatePicker