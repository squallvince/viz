export const toDateString = (date: Date) => {
	const objectToString = Object.prototype.toString.call(date);
	if (objectToString !== '[object Date]') return;

	const dateArr = [];
	const timeArr = [];

	dateArr.push(date.getFullYear());
	dateArr.push(
		date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
	);
	dateArr.push(date.getDate() > 9 ? date.getDate() : '0' + date.getDate());

	timeArr.push(date.getHours() > 9 ? date.getHours() : '0' + date.getHours());
	timeArr.push(
		date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
	);
	timeArr.push(
		date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
	);

	return dateArr.join('-') + ' ' + timeArr.join(':');
};


export const getFromLS = (key: string) => {
  let ls = {};
  if ((window as any).localStorage) {
    try {
      ls = JSON.parse((window as any).localStorage.getItem('dashboardJson')) || {};
    } catch (e) {
      console.log(e);
    }
	}
	if (key) {
		return ls[key];
	}
  return ls;
};

export const saveToLS = (value: object) => {
  if ((window as any).localStorage) {
    (window as any).localStorage.setItem(
      'dashboardJson',
      JSON.stringify(value)
    );
  }
};
