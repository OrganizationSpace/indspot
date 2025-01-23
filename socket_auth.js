// authenticator.js

const jsonwebtoken = require('jsonwebtoken')
const { redis, redisJson } = require('./db/redis')

//const users = new Map()

async function authenticateUser(io, socket, next) {
	try{
	const token = socket.handshake.query.token
	if (!token) return next(new Error('Authentication failed'))

	// Your authentication logic here, e.g., verify the token and fetch user information
	var tokenResult = jsonwebtoken.verify(token, process.env.SECRET)
	// console.log('#####################################')
	// console.log('#####################################')
	// console.log(tokenResult)
	// console.log('#####################################')
	// console.log('#####################################')

	if (tokenResult) {
		const workspace = tokenResult.workspace
		const email = tokenResult.email
		const agent_id = tokenResult.agent_id

		//const existingSocketId = users.get(userId)
		const existing = await redis.hexists('indspot_users', agent_id)
		if (existing) {
			console.log('E X I S T I N G    U S E R S')
			socket.isok = false
			return next(new Error('Authentication failed'))
		}
		await redis.hset('indspot_users', agent_id, socket.id)

		const entries = await redis.hgetall('indspot_users')
		//console.log(entries)
		socket.user = email
		socket.isok = true
		socket.workspace = workspace
		socket.agent_id = agent_id

		return next()
	} else {
		// If authentication fails, reject the connection
		return next(new Error('Authentication failed'))
	}
} catch (error) {
	throw error
}
}

module.exports = authenticateUser
