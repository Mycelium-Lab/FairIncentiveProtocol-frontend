export default function ProgressBar(props) {

    let percentage = (props.progressData.val / (props.progressData.max / 100)).toFixed(0) + "%";

    return (
        <div className="progress_bar">
            <div className="progress_bar__text">
                <div className="text__name">{props.progressData.name}</div>
                <div className="text__value" style={{color: props.progressData.color}}>{props.progressData.val}</div>
            </div>
            <div className="progress_bar__bar" style={{background: props.progressData.backgroundColor}}>
                <div className="progress_bar__bar-done" style={{background: props.progressData.color, width: percentage}}></div>
            </div>
        </div>
    );
}