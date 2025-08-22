// 转成中国标准时间
export function localTime (time) {
    return convertToLocalTime(time);
    }
    function convertToLocalTime(dateStr) {
      // 将字符串转换为Date对象
      const date = new Date(dateStr);
    
      // 将Date对象转换为本地时间字符串
      const localTime = date.toLocaleString();
    
      return localTime;
}