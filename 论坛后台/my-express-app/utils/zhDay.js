const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
// 使用插件
dayjs.extend(utc);
dayjs.extend(timezone);
// 清空时间
function getStartOfDayCST(dayjsObj) {
    // 设置时分秒为0
    return dayjsObj.startOf('day');
}
// 计算相差天数
function daysBetweenDatesCST(dateStr1, dateStr2) {
    if (!dateStr2) {
        dateStr2 = getCurrentTimeCST(new Date())
    }
    // 使用 dayjs 解析输入的日期字符串
    const date = dayjs(dateStr1);
    const date2 = dayjs(dateStr2);
    // 格式化日期为所需的格式
    const formattedDateStr1 = formatDate(date);
    const formattedDateStr2 = formatDate(date2);
    // // 获取两个日期的开始时间
    // console.log(formattedDateStr1, formattedDateStr2);
    // const startOfDay1 = getStartOfDayCST(formattedDateStr1);
    // const startOfDay2 = getStartOfDayCST(formattedDateStr2);
    // // 计算两个日期之间的毫秒数差值
    const millisecondsBetween = Math.abs(new Date(formattedDateStr1) - new Date(formattedDateStr2));
    // // 将毫秒数转换为天数
    let daysBetween = millisecondsBetween / (1000 * 60 * 60 * 24);
    // // 返回两个时间之差
    daysBetween = daysBetween - 1
    if (daysBetween < 0) {
        daysBetween = 0
    }
    return daysBetween;
}
// 转换为中国标准时间
function getCurrentTimeCST() {
    // 获取当前时间
    const now = dayjs().utc().format();
    // 转换为中国标准时间
    let cstTime = dayjs.tz(now, 'UTC').tz('Asia/Shanghai');
    cstTime = getStartOfDayCST(cstTime)
    return cstTime.format('YYYY-MM-DD');
}
function formatDate(inputDateStr) {
    // 使用 dayjs 解析输入的日期字符串
    const date = dayjs(inputDateStr);
    // 格式化日期为所需的格式
    const formattedDateStr = date.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    return formattedDateStr;
}
// 导出函数
module.exports = {
    getStartOfDayCST,
    daysBetweenDatesCST,
    getCurrentTimeCST
}
