const dotenv = require('dotenv')
dotenv.config()

const { Scheduler } = require('@ssense/sscheduler')
const date = require('date-and-time')

const bodyParser = require('body-parser')
const morgan = require('morgan')
const path = require('path')
const scheduler = new Scheduler()

const connectRabbitMQ = require('./rabbitmq/rabbitmq')
const { setChannel, sendToQueue, ack, nack } = require('./rabbitmq/channel')


//create server
const express = require('express')

const cors = require('./function/cors')
const errorHandler = require('./function/error_handler')
const { app, server, io } = require('./server')

app.use(bodyParser.json())
app.use(express.json())
//cors
app.use(cors)
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))

connectRabbitMQ()
	.then((ch) => {
		setChannel(ch)
	})
	.catch((error) => {
		console.error('Error connecting to RabbitMQ', error)
	})

//listening server at port 1112
server.listen(1112, () => {
    console.log('INDSPOT SERVER STARTED 💐 ')
})

// root

app.get('/', async (req, res) => {
    res.json('SLOT WELCOME')
})
//router

const agent = require('./router/agent')
const event = require('./router/event')
const client = require('./router/client')
const integration = require('./router/integration')
const environment = require('./router/environment')

//middleware
app.use('/agent', agent)
app.use('/agent/event', event)
app.use('/client', client)
app.use('/integration',integration)
app.use('/environment',environment)
app.get('/error', async (req, res, next) => {
	try {
		//console.log(name) // This will throw a ReferenceError
		res.json({ name: name })
	} catch (error) {
		next(error)
	}
})

app.post('/', async (req, res) => {
    try {
        const success = sendToQueue('indspot', 'PREFERENCE_INIT', {
            name: 'github',
        })
        if (success) {
            res.status(200).send(`Message sent to queue: `)
        } else {
            res.status(500).send('Failed to send message to queue')
        }
    } catch (error) {
        console.error('Failed to send message to queue', error)
        res.status(500).send('Failed to send message to queue')
    }
})
app.use(errorHandler)

module.exports = app
//cmd