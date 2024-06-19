export default function ProgressCircle (props) {

    let percentage = (props.progressData.val / (props.progressData.max / 100)).toFixed(0) + "%";

    let circleBg = 
        `radial-gradient(closest-side, white 79%, transparent 80% 100%),
        conic-gradient(rgba(255, 58, 41, 1) ${percentage}, rgba(255, 229, 211, 1) 0)`; 
    return (
        <div className="progress_circle" style={{background: circleBg}}>
            <div className="circle__value">
                {props.progressData.val.toFixed(0)}%
            </div>
        </div>
    );
}