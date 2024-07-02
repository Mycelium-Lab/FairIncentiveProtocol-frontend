import { useState } from "react";

export default function ProgressCircle (props) {

    let 
        [barIndex, setBarIndex] = useState(0);
    
    return (
        <div>
            <div className="progress_circle">
                <div className="progress_circle-outer" style={{background: props.progressData[barIndex].backgroundColor}}>
                    <div className="progress_circle-inner">
                        <div className="progress_circle-value" style={{background: props.progressData[barIndex].color}}>
                            {(props.progressData[barIndex].val / (props.progressData[barIndex].max / 100)).toFixed(0)}%
                        </div>
                    </div>
                </div>
                <svg style={{transform: `rotate(${(props.progressData[barIndex].val / (props.progressData[barIndex].max / 100)).toFixed(0) / 100 * 565}deg)`}} class="prg_round" onClick={() => {
                        if (barIndex + 1 == props.progressData.length) {
                            setBarIndex(0);
                        }
                        else {
                            setBarIndex(barIndex + 1);
                        }
                        
                    }} xmlns="http://www.w3.org/2000/svg" version="1.1" width="194" height="194">
                    <circle style={{strokeDashoffset: 565 - 565 * (props.progressData[barIndex].val / (props.progressData[barIndex].max / 100)).toFixed(0) / 100}} stroke={props.progressData[barIndex].color} class="prg_fill" cx="97" cy="97" r="90" stroke-linecap="round" /> 
                </svg>
            </div>
        </div>
    );

    // let circleBg = 
    //     `radial-gradient(closest-side, white 79%, transparent 80% 100%),
    //     conic-gradient(rgba(255, 58, 41, 1) ${percentage}, rgba(255, 229, 211, 1) 30%)`;
    // return (
    //     <div className="progress_circle" style={{background: circleBg}}>
    //         <div className="circle__value">
    //             {props.progressData.val.toFixed(0)}%
    //         </div>
    //     </div>
    // );
}