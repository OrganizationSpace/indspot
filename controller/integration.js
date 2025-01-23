const axios = require('axios')
const { sign, attestation } = require('../function/signature')
const { redis, redisJson } = require('../db/redis')

class Integration {


	async status({ token,activation,code }) {
		try {
			const payload = {
				activation:activation,
				code:code
			}
			   const stringData = JSON.stringify(payload)
			const signature = sign(stringData)
			const result = await axios.post(
				`https://api.mindvisiontechnologies.com/environment/integration/activation`,
				payload,
				{
					headers: {
						"Authorization": token,
						"x-webhook-signature":signature
					},
				}
			)
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async listIntegrationNeed({ token }) {
		try {
			const payload = {
				
			   }
			   const stringData = JSON.stringify(payload)
			const signature = sign(stringData)
			
			const result = await axios.post(
				`https://indcharge.api.mindvisiontechnologies.com/integration/list/INDSPOT`,
				payload,
				
				{
					headers: {
						"Authorization": token,
						"x-webhook-signature":signature
					},
				}
			)
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}
	
	async listActiveIntegration({ workspace }) {
		const result = await redis.smembers(`integration:${workspace}`)
		return result
	}


	async sendMailIndmailBulk({workspace,eid,integration} ) {
		try {
			const dataToSend = {
				workspace:workspace,
                eid:eid,
				integration:integration
			}

			const result = await axios.post(
				'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-f9570e36-6ae9-4731-9b97-ad0ee5dd709a/indmail/event',
				dataToSend,
				
			)
			//  console.log("CCCCCCCCCCCCCCCCCCCCCCCCCccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc");
			// console.log("result"+ result);
			// console.log("data to send ---------------------------",dataToSend);
			//  console.log("CCCCCCCCCCCCCCCCCCCCCCCCCccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc");
			return result
		} catch (error) {
			throw error
		}
	}

	async sendMailIndmail({ token, to, subject }) {
		try {
			const inputData = {
				to: to,
				subject: subject,
				body: subject,
			}

			const payload = JSON.stringify(inputData)
			const signature = sign(payload)
			const result = await axios.post(
				'https://indmail.api.mindvisiontechnologies.com/integration/mail/send',
				inputData,
				//`http://192.168.29.233:1119/integration/mail/send`,inputData,

				{
					headers: {
						Authorization: token,
						'x-webhook-signature': signature,
					},
				}
			)
		//	console.log("sendMailIndmail"+result);
			return result
		} catch (error) {
			throw error
		}
	}

	async sendTemplateInderact({ results, token }) {
		try {
			const inputData = {
				data: results,
			}

			const payload = JSON.stringify(inputData)
			const signature = sign(payload)
			const result = await axios.post(
				'https://inderact.api.mindvisiontechnologies.com/integration/indspot/template/send',
				inputData,
				// ` 192.168.29.142:1115/integration/indspot/template/send`,inputData,
				{
					headers: {
						Authorization: token,
						'x-webhook-signature': signature,
					},
				}
			)
			// console.log('============================================================================================================');
			// console.log('sendTemplateInderact', result)
			// console.log('============================================================================================================');

			return result
		} catch (error) {
			throw error
		}
	}

	async sendTemplateInderactBulk({workspace, eid }) {
		
		try {
			const inputData = {
				workspace:workspace,
				eid:eid
			}

			const result = await axios.post(
				'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-f9570e36-6ae9-4731-9b97-ad0ee5dd709a/inderact/event',
				inputData,
				
			)
		// 	console.log("VVVVVVVVVVVVVVVVVVVVVVVVVVvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
		// 	console.log('sendTemplateInderact', result)
		// 	console.log("input data =--------------------------",inputData);
		//  console.log("VVVVVVVVVVVVVVVVVVVVVVVVVVvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");

			return result
		} catch (error) {
			throw error
		}
	}

	async check({ workspace, code }) {
		try {
			const activation = await redis.sismember('integration:' + workspace, code)
			// console.log("______________________________________________________________________________________________________________________________");
			// console.log('activation-------------------------------',activation);
			// console.log("______________________________________________________________________________________________________________________________");
			return activation
		} catch (error) {
			throw error
		}
	}
}
module.exports = Integration
