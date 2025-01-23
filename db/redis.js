require('dotenv').config()
const Redis = require('ioredis')
const RedisJson = require('redis-json') // Import the redis-json package

const redis = new Redis({
	password: process.env.REDIS_PASS,
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
})

const redisJson = new RedisJson(redis) // Create a RedisJson instance

// Event listener for successful Redis connection
redis.on('connect', () => {
	console.log('Connected to Redis')
})

// Event listener for Redis connection errors
redis.on('error', (err) => {
	console.error('Error connecting to Redis:', err)
})

module.exports = { redis, redisJson } // Export both the Redis and RedisJson instances
