const workerize = require('workerize')

const getWork = workerize(`
	export function work(url, data, authorization, type, method) {
		function asJson(res) {
			console.log('res', res)
			res = res.json()
			return res;
		}
		type = type.toUpperCase();
		if (type === 'GET') {
			var dataStr = '';
			Object.keys(data).forEach(key => {
				dataStr += key + '=' + data[key] + '&';
			})
			if (dataStr !== '') {
				dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
				url = url + '?' + dataStr;
			}
		}
		if (fetch && method === 'fetch') {
			let requestConfig = {}
			if (type === 'POST') {
				requestConfig.body = JSON.stringify(data)
				requestConfig.headers = {
					"content-type": "application/x-www-form-urlencoded",
					'authorization': authorization
				}
				requestConfig.method = 'POST'
			}
			try {
				return fetch(url, requestConfig).then(asJson);
			} catch (error) {
				throw new Error(error)
			}
		} else {
			console.log('http')
			return new Promise((resolve, reject) => {
				var requestObj;
				if (XMLHttpRequest) {
					requestObj = new XMLHttpRequest();
				} else {
					requestObj = new ActiveXObject;
				}
				var sendData = '';
				if (type === 'POST') {
					sendData = JSON.stringify(data);
				}
				requestObj.open(type, url, true);
				requestObj.setRequestHeader("content-type", "application/x-www-form-urlencoded");
				requestObj.setRequestHeader("content-type", "application/json");
				requestObj.setRequestHeader("Authorization", authorization);
				requestObj.send(sendData);
				requestObj.onreadystatechange = () => {
					if (requestObj.readyState === 4) {
						if (requestObj.status === 200) {
							var obj = requestObj.response
							if (typeof obj !== 'object') {
								obj = JSON.parse(obj);
							}
							resolve(obj)
						} else {
							reject('XMLHttpRequest error')
						}
					}
				}
				console.log('requestObj', requestObj)
			})
		}
	}
`, { type: 'module' })

export default {
	getWork
}