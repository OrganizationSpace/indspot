const axios = require('axios')
//const User_ = require("../schema/user");
const Event_ = require('../schema/event')
const Slot_ = require('../schema/slot')
const { sign, attestation } = require('../function/signature')

class Client {
	constructor() {
		this.baseUrl = 'https://api.mindvisiontechnologies.com'
		//  this.baseUrl = 'http://192.168.29.233:1118';
	}

	async register({
		workspace,
		email,
		password,
		name,
		country_code,
		phone_number,
		tag,
	}) {
		try {
			//const signature = sign()
			const response = await axios.post(
				`${this.baseUrl}/client/add/unauthorised`,
				{ password, workspace, name, email, tag, country_code, phone_number }
				// {
				// 	headers: {
				// 		"x-webhook-signature":signature
				// 	},
				// }
			)
			return response
		} catch (error) {
			throw error
		}
	}

	async login({ email, password, workspace, tag }) {
		try {
			const inputData = {
				email,
				password,
				workspace,
				tag,
			}

			const payload = JSON.stringify(inputData)
			const signature = sign(payload)
			const response = await axios.post(
				`${this.baseUrl}/client/login`,
				inputData,
				{
					headers: {
						'x-webhook-signature': signature,
					},
				}
			)
			return response
		} catch (error) {
			throw error
		}
	}

	async uploadPicture({ token, url }) {
		try {
			const inputData = {
				url: url,
			}

			const payload = JSON.stringify(inputData)
			const signature = sign(payload)
			const response = await axios.post(
				`${this.baseUrl}/client/profile/picture/upload`,
				inputData,
				{
					headers: {
						Authorization: token,
						'x-webhook-signature': signature,
					},
				}
			)
			return response
		} catch (error) {
			throw error
		}
	}

	async fetchProfile({ token }) {
		try {
			const inputData = {}

			const payload = JSON.stringify(inputData)
			const signature = sign(payload)
			const response = await axios.post(
				`${this.baseUrl}/client/profile/fetch`,
				{},
				{
					headers: {
						Authorization: token,
						'x-webhook-signature': signature,
					},
				}
			)

			return response
		} catch (error) {
			throw error
		}
	}

	async bookSlot({
		eid,
		sid,
		email,
		answers,
		attachment,
		country_code,
		phone_number,
		description,
		user_name
	}) {
		try {
			const result = await Slot_.findOneAndUpdate(
				{
					eid: eid,
					_id: sid,
				},
				{
					$set: {
						user_name:user_name,
						phone_number: phone_number,
						country_code: country_code,
						email: email,
						answers: answers,
						attachment: attachment,
						description: description,
						is_available: false,
						is_archive: false,
						status: 'BOOKED',
					},
				},
				{ new: true }
			).lean()
			//console.log("result",result);
			return result
		} catch (error) {
			throw error
		}
	}

	async cancelSlot({ eid, sid }) {
		try {
			const result = await Slot_.findOneAndUpdate(
				{
					eid: eid,
					_id: sid,
				},
				{
					$set: {
						is_available: true,
						status: 'CANCELLED_BY_USER',
					},
				},
				{ new: true }
			).lean()
		//	console.log('result', result)
			return result
		} catch (error) {
			throw error
		}
	}

	async fetchSlot({ eid, sid }) {
		try {
			const result = await Slot_.findOne(
				{
					eid: eid,
					_id: sid,
				}
			).lean()
			//console.log('result', result)
			return result
		} catch (error) {
			throw error
		}
	}

	async  fetchTicket({ workspace ,id,email,query, page }) {
		//console.log("fetchticket",workspace,query,page);
		try {
			const limit = 5;
			const criteria = { workspace,uid: id,email: email };
	
			if (query) {
				const ticketNameRegex = new RegExp(query, 'i');
				criteria.event_name = ticketNameRegex;
			}
	
			const result = await Slot_.find(criteria)
				.sort({ created_at: -1 })
				.skip(page * limit)
				.limit(limit);
			// 	console.log("1111111111111111111");
			// console.log("result", result);
			// console.log("111111111111111111111");
			return result;
		} catch (error) {
			throw error;
		}
	}

	async deleteTicket({ workspace, sid }) {
		try {
			const result = await Slot_.deleteOne({
				workspace: workspace,
				_id: sid,
			})
			return result
		} catch (error) {
			throw error
		}
	}

	async archiveTicket({ workspace, sid }) {
		try {
			const result = await Slot_.findOneAndUpdate(
				{
					workspace: workspace,
					_id: sid,
				},
				{
					$set: {
						is_archive: true,
					},
				}
			)
			return result
		} catch (error) {
			throw error
		}
	}

	async fetchEvent({ id }) {
		try {
			const result = await Event_.findOne({
				_id: id,
			}).lean()
			return result
		} catch (error) {
			throw error
		}
	}

	async fetchSlots({ id }) {
		try {
			const result = await Slot_.find({
				eid: id,
			}).lean()
			return result
		} catch (error) {
			throw error
		}
	}
}
module.exports = Client