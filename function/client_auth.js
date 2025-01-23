const jsonwebtoken = require('jsonwebtoken')

const clientAuthorization = function (req, res, next) {
	//console.log(req.headers)
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
	//const token = req.params.token

	if (token == null) return res.sendStatus(401)
	try {
		let tokenResult = jsonwebtoken.verify(token, process.env.SECRET)
		//console.log("indspot",tokenResult)

		if (tokenResult) {
			req.id = tokenResult.clientId
			req.workspace = tokenResult.workspace,
			req.name=tokenResult.name,
			req.email = tokenResult.email
			req.phone_number = tokenResult.phone_number
			req.country_code = tokenResult.country_code

			next()
		} else {
			res.status(500).json({
				message: 'Something wrong',
			})
		}
	} catch (error) {
		return res.status(401).json({
			message: error.message,
		})
	}
}
module.exports = clientAuthorization
