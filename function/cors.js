const cors = function (req, res, next) {
	//console.log(req.headers)
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST', 'OPTIONS')
	res.setHeader(
		'Access-Control-Allow-Headers',
		'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization,Token'
	)
	res.setHeader('Access-Control-Expose-Headers', '*')
	next()
}

module.exports = cors
