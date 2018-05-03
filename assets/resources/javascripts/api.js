const md5 = require('md5')
const worker = require('worker')

//server
const server = 'http://10.12.32.183:8080',
	key = '5e3c172a3af6657f6b2b6fa061f1469b'

const fetch = ({
	               path = '',
	               data = {},
	               type = 'POST',
	               method = ''
               }) => {
	const authorization = md5.hex_hmac_md5(key, JSON.stringify(data)),
		url = server + path
	console.log('fetch authorization', authorization)
	return worker.getWork.work(url, data, authorization, type, method)
}

// android
const back2App = () => {
	console.log('in back2App')
	if(typeof GameMatserNative === 'undefined') return
	try {
		GameMatserNative && GameMatserNative.finish && GameMatserNative.finish()
	} catch (e) {
		console.log('back2App error:', e)
	}
}

export default {
	fetch,
	back2App
}