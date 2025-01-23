const express = require('express')
const http = require('http')
const configureSocket = require('./socket') // Import the configureSocket function from the appropriate file

const app = express()
const server = http.createServer(app)
const io = configureSocket(server)

// You can add any additional server-related configurations or routes here

module.exports = { app, server, io }