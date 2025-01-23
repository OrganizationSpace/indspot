// socket.js
const { Server } = require('socket.io')
const { instrument } = require('@socket.io/admin-ui')
const { redis, redisJson } = require('./db/redis')
const authenticateUser = require('./socket_auth')

function configureSocket(server) {
	try{
	const io = new Server(server, {
		cors: {
			origin: ['https://admin.socket.io'],
		},
	})

	instrument(io, {
		auth: false,
	})

	const nameSpace = io.of(/^\/org-.+$/)
	nameSpace.use((socket, next) => authenticateUser(io, socket, next))
	nameSpace.on('connect', (socket) => {
		// console.log('a user connected')
		// console.log(socket.id)
		// console.log(socket.nsp.name)
		nameSpace.emit('notification', 'new person joined in your workspace')

		// socket.on('join', (data) => {
		// 	socket.join(data.room)
		// 	nameSpace
		// 		.in(data.room)
		// 		.emit('notification', `New person joined the ${data.room} room`)
		// })

		socket.on('disconnect', async () => {
			console.log('user disconnected')
			var result = await redis.hdel('indspot_users', socket.agent_id)
			if (result > 0) console.log('U S E R   D E L E T E D')
			const entries = await redis.hgetall('indspot_users')
			//console.log(entries)
		})

		socket.on('ticket', async (data) => {
			//console.log('message: ' + data.msg)
		})

		socket.on('refresh', (data) => {
			//console.log('message: ' + data.msg)
		})
	})

	return io // Export the io object
} catch (error) {
	throw error
}
}

module.exports = configureSocket
