import { useState } from "react";

export default function PeriodPicker() {

    let [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="period_picker">
            <div onClick={() => {setActiveIndex(0)}} className={activeIndex == 0 ? "period period_active" : "period"}>1D</div>
            <div onClick={() => {setActiveIndex(1)}} className={activeIndex == 1 ? "period period_active" : "period"}>7D</div>
            <div onClick={() => {setActiveIndex(2)}} className={activeIndex == 2 ? "period period_active" : "period"}>1M</div>
            <div onClick={() => {setActiveIndex(3)}} className={activeIndex == 3 ? "period period_active" : "period"}>3M</div>
            <div onClick={() => {setActiveIndex(4)}} className={activeIndex == 4 ? "period period_active" : "period"}>6M</div>
            <div onClick={() => {setActiveIndex(5)}} className={activeIndex == 5 ? "period period_active" : "period"}>1Y</div>
            <div onClick={() => {setActiveIndex(6)}} className={activeIndex == 6 ? "period period_active" : "period"}>All</div>
        </div>
    );
}