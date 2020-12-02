/**
 * @author 马骁
 * @time 2020-10-30
 * @desc 封装请求相关的方法
 */
import { message as AntdMessage } from 'antd';

export interface IResponseStructure {
	context: {
		timestamp: number;
		message: string;
		status: number;
	};
	data: any;
}

//  转换为get方法需要的查询字符串Ex:?name="maxiao";
export function transferQueryStr(data = {}) {
	let str = '?';
	for (let [key, value] of Object.entries(data)) {
		str += `${key}=${value}&`;
	}
	str = str.substring(0, str.length - 1);
	return str;
}

// 对返回数据的状态码进行处理
function checkStatus(response: IResponseStructure) {
	const {
		context: { status, message },
		data,
	} = response;
	if (status === 200) {
		return data;
	} else {
		AntdMessage.error(message);
		throw new CustomError(status, message);
	}
}

// 扩展原生的Error对象，使其可以返回错误码
class CustomError extends Error {
	name = 'CustomError';
	message = '';
	code = -1;
	constructor(code: number, message?: string) {
		super();
		this.code = code;
		this.message = message || '请求失败';
	}
}

export const customFetch = async (
	url: string,
	method: string = 'GET',
	data = {},
	options?: RequestInit
) => {
	const customHeaders: RequestInit = {
		mode: 'cors',
		redirect: 'follow',
		referrer: 'no-referrer',
		...options,
	};
	method = method.toUpperCase();
	if (method === 'GET') {
		const queryStr = transferQueryStr(data);
		url = url + queryStr;
		customHeaders.method = 'GET';
	}
	if (method === 'POST') {
		const reqData = JSON.stringify(data);
		customHeaders.method = 'POST';
		customHeaders.body = reqData;
		customHeaders.headers = {
			'content-Type': 'application/json',
		};
	}
	return fetch(url, customHeaders)
		.then((response) => {
			if (response.ok) {
				const isStream =
					response.headers.get('content-type') === 'application/octet-stream';
				if (isStream) {
					// 如果是流的话直接返回
					return response.blob();
				} else {
					return response.json().then((data) => {
						return checkStatus(data);
					});
				}
			} else {
				AntdMessage.error('服务端响应异常');
				throw new CustomError(response.status, '服务端响应异常');
			}
		})
		.catch((error) => {
			throw new CustomError(error.code, error.message);
		});
};

// export const fileFecth = async (url: string, data = {}) => {
//   const customHeaders: RequestInit = {
//     mode: "cors",
//     redirect: "follow",
//     referrer: "no-referrer",
//   };
//   const queryStr = transferQueryStr(data);
//   url = url + queryStr;
//   customHeaders.method = "GET";
//   return fetch(url, customHeaders)
//     .then((response) => {
//       return response.blob();
//     })
//     .catch((error) => {
//       throw new CustomError(error.code, error.message);
//     });
// };
