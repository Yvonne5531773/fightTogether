import md5 from './md5'

const key = '5e3c172a3af6657f6b2b6fa061f1469b',
	data = {
		"token": "RlIzRIZXE3dQ6UxY0qvsiBFiROh97n95",
		"ts": Date.parse(new Date()),
		"uuid": "test"
	}

const fetch = () => {
	md5.hex_hmac_md5(key, JSON.stringify(data))
}

export default {

}