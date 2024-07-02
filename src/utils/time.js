export function isWithin(now, before) {
    const differenceInMilliseconds = Math.abs(now.getTime() - before.getTime());
    const millisecondsIn24Hours = 24 * 60 * 60 * 1000;
    return differenceInMilliseconds <= millisecondsIn24Hours;
}

export function isWithin7Days(now, before) {
    const differenceInMilliseconds = Math.abs(now.getTime() - before.getTime());
    const millisecondsIn7Days = 7 * 24 * 60 * 60 * 1000;
    const millisecondsIn24Hours = 24 * 60 * 60 * 1000;
    return (differenceInMilliseconds <= millisecondsIn7Days) && (differenceInMilliseconds > millisecondsIn24Hours);
}

export function formated(date, isTodayOrYesterday, is7Days) {
    if (isTodayOrYesterday) {
        return date.toLocaleTimeString().replace(/(:\d{2}| [AP]M)$/, "")
    } else if (is7Days) {
        const dayOfWeek = date.getDay();
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = daysOfWeek[dayOfWeek];
        return dayName
    } else {
        return date.toLocaleDateString()
    }
}