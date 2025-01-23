const Preference_ = require('../schema/preference')
const jsonwebtoken = require('jsonwebtoken')

async function prefToken(token) {
	try {
		let tokenResult = jsonwebtoken.verify(token, process.env.SECRET)
// 		console.log("1111111111111111111111111111")
// console.log(tokenResult);

		const result = await Preference_.findOne({
			workspace: tokenResult.workspace,
		})
// 		console.log("22222222222222222222222222")
// console.log(result);
// console.log("3333333333333333333333333333")
		
		var data = {
			//owner_name: result.owner_name,
		//	id: result._id,
			workspace: result.workspace,

			//
			agent_id: tokenResult.agentId,
			name: tokenResult.name,
			role: tokenResult.role,
			email: tokenResult.email,
			phone_number: tokenResult.phone_number,
		}
		// console.log('--------------------------------')
		// console.log(data)
		// console.log('--------------------------------')
		const pref_token = jsonwebtoken.sign(data, process.env.SECRET)
		data.token = pref_token

		return data
	} catch (error) {
		return {
			success: false,
			message: error.message,
			error,
		}
	}
}

module.exports = prefToken
