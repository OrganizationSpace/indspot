require('dotenv').config()
const amqp = require('amqplib')
//const { setChannel, sentToQueue, ack, nack } = require('./channel')
const router = require('./router')

const connectRabbitMQ = async () => {
	try {
		const connection = await amqp.connect(process.env.RABBITMQ_CONNECTION) // Replace with your RabbitMQ server URL
		const channel = await connection.createChannel()
		channel.consume('indspot', (data) => {
			router(data)
		})
		console.log('Connected to RabbitMQ')
		return channel
	} catch (error) {
		console.error('Failed to connect to RabbitMQ', error)
		throw error
	}
}

module.exports = connectRabbitMQ