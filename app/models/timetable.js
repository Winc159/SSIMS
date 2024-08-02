// utils/dateUtils.js

function formatDateToChinese(date) {
    const weekDays = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const weekDay = weekDays[date.getDay()];

    return `${year}年${month}${day}日 ${weekDay}`;
}

function getDay(date) {
    if (!(date instanceof Date)) {
        throw new Error('Invalid date format for getDay function');
    }
    return formatDateToChinese(date); // 例如: "2024年七月12日 星期五"
}

function getTime(date) {
    if (!(date instanceof Date)) {
        throw new Error('Invalid date format for getTime function');
    }
    return date.toTimeString().split(' ')[0]; // 例如: "12:34:56"
}

module.exports = {
    getDay,
    getTime
};
