/**
 * [dateAddDays 从某个日期增加n天后的日期]
 * @param  {[string]} dateStr  [日期字符串]
 * @param  {[int]} dayCount [增加的天数]
 * @return {[string]}[增加n天后的日期字符串]
 */
const dateAddDays = (dateStr:string, dayCount:number) => {
  const tempDate = new Date(dateStr);// 把日期字符串转换成日期格式
  console.log(dateStr,tempDate)
  const resultDate = new Date((tempDate / 1000 + (86400 * dayCount)) * 1000);// 增加n天后的日期
  const resultDateStr = `${resultDate.getFullYear()}-${resultDate.getMonth() + 1}-${resultDate.getDate()}`;// 将日期转化为字符串格式
  return resultDateStr;
};


function randomPassword() {
  
  let passwordArray = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890'];
  let password = [];
  for (let i = 0; i < 4; i++) {
    // If password length less than 9, all value random
    let arrayRandom = Math.floor(Math.random() * 3);
      // Get password array value
      let passwordItem = passwordArray[arrayRandom];
      // Get password array value random index
      // Get random real value
      let item = passwordItem[Math.floor(Math.random() * passwordItem.length)];
      password.push(item);
  }
  return password.join("");
}


export { dateAddDays, randomPassword };
