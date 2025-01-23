const Agent=require('../controller/agent')
const agent= new Agent();
const { setChannel, sendToQueue, ack, nack } = require('./channel')
async function brokerRouter(data) {
	try {
		var payload = JSON.parse(Buffer.from(data.content).toString())
		//console.log(payload.action)
		switch (payload.action) {
			case 'PREFERENCE_INIT':
				const workspace= payload.data.workspace
				await agent.initPreference({ workspace })
				ack(data)
				break
				case 'DEMO':
					const work= payload.data.workspace
					await agent.initPreference({ work })
					ack(data)
					break
			default:
				//console.log('OTHER', payload.data)
				//channel.nack(data)
				break
		}
	} catch (error) {
		console.error('Error processing message:', error)
		ack(data)
		// Handle error if needed
	}
}
module.exports = brokerRouter