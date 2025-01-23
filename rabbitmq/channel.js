// queueController.js
let channel

const setChannel = (ch) => {
    channel = ch
}

const sendToQueue = (queue, action, content) => {
    try {
        data = {
            action: action,
            data: content,
        }
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)))
        console.log(`Message sent to queue: ${queue}`)
        return true
    } catch (error) {
        console.error('Failed to send message to queue', error)
        return false
    }
}
const ack = (data) => {
    channel.ack(data)
}
const nack = (data) => {
    channel.nack(data)
}

module.exports = {
    setChannel,
    sendToQueue,
    ack,
    nack,
}