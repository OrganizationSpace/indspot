const express = require('express')
const { redis, redisJson } = require('../db/redis')
const router = express.Router()
const { sign, attestation } = require('../function/signature')
//schema

// const Business_ = require('../schema/business')
// const Preference_ = require('../schema/preference')
//const Masfob = require('../function/masfob')
const prefToken = require('../function/pref_token')
const Slot_ = require('../schema/slot')
const { conn } = require('../db/mongodb')
const jsonwebtoken = require('jsonwebtoken')
const authorization = require('../function/auth')
const deleteFile = require('../function/delete_file')
const uploadfile = require('../function/upload_file')
const mongoose = require('mongoose')
const Agent = require('../controller/agent')
const Integration = require('../controller/integration')
const { setChannel, sendToQueue, ack, nack } = require('../rabbitmq/channel')

const integration = new Integration()

const agent = new Agent()
//const masfob = new Masfob()
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

// router.post("/registration", async (req, res, next) => {
//   try {
//     const {
//       workspace,
//       owner_name,
//       business_name,
//       mobile,
//       location,
//       cover_picture,
//       profile_picture,
//       business_description,
//       website,
//     } = req.body;

//     // const existingBusiness = await Preference_.findOne({ workspace })
//     const existing_business = await business.exiting({ workspace });

//     console.log(req.body);

//     if (!existing_business) {
//       // const newBusiness = await Preference_({
//       // 	workspace,
//       // 	owner_name,
//       // 	business_name,
//       // 	mobile,
//       // 	location,
//       // 	cover_picture,
//       // 	profile_picture,
//       // 	business_description,
//       // 	website,
//       // }).save()
//       const new_business = await business.create({
//         workspace,
//         owner_name,
//         business_name,
//         mobile,
//         location,
//         cover_picture,
//         profile_picture,
//         business_description,
//         website,
//       });

//       res.status(200).json({
//         success: true,
//         message: "Registration successful",
//         data: { _id: new_business._id },
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         message: "Business with this email already exists",
//       });
//     }
//   } catch (error) {
//     // res.status(500).json({ success: false, message: error.message, error })
//     // console.log(error)
//     next(error);
//   }
// });

router.post('/preference/init', attestation, async (req, res, next) => {
	try {
		const workspace = req.body.workspace
		const set_preference = await agent.initPreference({ workspace })
		res.status(200).json({
			success: true,
			message: 'profile fetched successfully',
			data: set_preference,
		})
	} catch (error) {
		next(error)
	}
})

router.post('/login', async (req, res, next) => {
	//console.log(req.body)
	try {
		const { email, password } = req.body

		const response = await agent.login({
			email,
			password,
			tag: 'indspot',
		})

		if (response.status == 200) {
			const eco_token = response.headers['token']
			const limit = response.headers['calendar_limit']
			const agent_id = response.headers['agent_id']

			const existing_user = await redis.hexists('indspot_users', agent_id)
			if (existing_user) {
				res.status(409).json({ message: 'user already logged in' })
			} else {
				const data = await prefToken(eco_token)

				// console.log('++++++++++++++++++++++++')
				// console.log(data)
				// console.log('++++++++++++++++++++++++')

				res.setHeader('token', data.token)
				res.setHeader('workspace', data.workspace)
				res.setHeader('limit', limit)
				res.setHeader('email', data.email)

				res.status(response.status).json({
					success: response.data.success,
					message: response.data.message,
					data: data.token,
				})
			}
		} else {
			// Failed login
			res.status(401).json({ success: false, message: 'Invalid credentials' })
		}
	} catch (error) {
		console.error(error)
		next(error)
	}
})

router.get('/organization/info', authorization, async (req, res, next) => {
	try {
		const token = req.headers.authorization

		const response = await agent.organizationInfo({
			token,
		})
		//console.log(response.data)
		// Assuming you are checking some condition in the response
		if (response.status === 200) {
			res.status(response.status).json({
				success: response.data.success,
				message: response.data.message,
				data: response.data.data,
			})
		} else {
			res.status(response.status).json({
				success: response.data.success,
				message: response.data.message,
				data: response.data.data,
			})
		}
	} catch (error) {
		console.error(error)
		next(error)
	}
})

// router.post('/login', async (req, res,next) => {
// 	try {
// 		const { workspace, email, password } = req.body
// 		// const session = await conn.startSession()
// 		// session.startTransaction()

// 		const loggedInBusiness = await Preference.findOneAndUpdate(
// 			{
// 				workspace,
// 				email,
// 				password,
// 			},
// 			{
// 				$set: {
// 					'authorization.is_logged_in': true,
// 					'authorization.time_stamp': Date.now(),
// 				},
// 			},
// 			{ new: true }
// 		)

// 		if (loggedInBusiness) {
// 			let token = await jsonwebtoken.sign(
// 				{ id: loggedInBusiness.id, workspace: loggedInBusiness.workspace },
// 				process.env.SECRET
// 			)
// 			console.log(token)

// 			// Set the token as a response header

// 			res.setHeader('token', token)
// 			res.setHeader('workspace', loggedInBusiness.workspace)

// 			res.setHeader('email', loggedInBusiness.email)

// 			// Send the token as a response in the JSON body along with other necessary data
// 			res.status(200).json({
// 				success: true,
// 				message: 'successfully logged_in',
// 				data: {
// 					token: token,

// 				},
// 			})
// 		} else {
// 			// await session.abortTransaction()
// 			// session.endSession()
// 			res.status(400).json({ message: 'INVALID CREDENTIALS' })
// 		}
// 	} catch (error) {
// 		// res.status(500).json({ success: false, message: error.message, error })
// 		// console.log(error)
// 		next(error)
// 	}
// })

// router.post("/slot/cancel", authorization, async (req, res, next) => {
//   console.log(req.body);
//   try {
//     const token = req.headers.authorization
//     const workspace = req.workspace;
//     const eid = req.body.eid;
//     const sid = req.body.sid;
//     const results = await business.cancelSlot({ workspace, eid, sid });

//     console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
//     console.log("business",results);
//     console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
//     const to =results.email
//     const subject =results.status
//     await integration.sendMailIndmail({token,to ,subject})
//     await integration.sendTemplateInderact({results,token})

//     // const cancelResult = await Slot_.findOneAndUpdate(
//     // 	{
//     // 		workspace: req.workspace,
//     // 		eid: req.body.eid,
//     // 		_id: req.body.sid,
//     // 	},
//     // 	{
//     // 		$set: {
//     // 			is_available: true,
//     // 			status: 'CANCELLED_BY_HOST',
//     // 		},
//     // 	}
//     // )
//     //console.log('+++++++++++++++++++')
//     // console.log(cancelResult)
//     res.status(200).json({
//       success: true,
//       message: "business slot cancelled  successfully",
//       data: { _id: results._id },
//     });

//     console.log("Success"); // Log success message to the console
//   } catch (error) {
//     // res.status(500).json({ success: false, message: error.message, error })
//     // console.log(error)
//     next(error);
//   }
// });

router.post('/slot/cancel', authorization, async (req, res, next) => {
	//console.log(req.body)
	try {
		const token = req.headers.authorization
		const workspace = req.workspace
		const eid = req.body.eid
		const sid = req.body.sid
		const results = await agent.cancelSlot({ workspace, eid, sid })


		if(results.attachement != null) {
			const key = results.attachment.split('.com/').pop()
			var del = await deleteFile(key)
			}
		// console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
		// console.log('business', results)
		// console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
		results.action = 'agentCancel'
		const to = results.email
		const subject = results.status

		// Check and send emails if integrations are enabled
		{
			try {
				sendToQueue('indmail', 'INTEGRATION_MAIL_SEND', {
					  workspace: req.workspace,
						to: to,
						subject: subject,
						body: subject,
						name:results.user_name,
						email:results.email,
						phone_number:results.phone_number,
						description:results.description,
						event_name:results.event_name,
						action :results.action
				})
				//integration.sendMailIndmail({ token, to, subject })
			} catch (error) {
				console.error('Error sending email:', error)
			}
		}

		if (
			await integration.check({
				workspace: req.workspace,
				code: 'INDERACTINDSPOTEWHATSAPPNOTIFIER',
			})
		) {
			try {
				sendToQueue('inderact', 'INTEGRATION_INDSPOT_TEMPLATE_SEND', {
					...results,
					//workspace: workspace,
				})
				//integration.sendTemplateInderact({ results, token })
			} catch (error) {
				console.error('Error sending WhatsApp template:', error)
			}
		}

		// const cancelResult = await Slot_.findOneAndUpdate(
		// 	{
		// 		workspace: req.workspace,
		// 		eid: req.body.eid,
		// 		_id: req.body.sid,
		// 	},
		// 	{
		// 		$set: {
		// 			is_available: true,
		// 			status: 'CANCELLED_BY_HOST',
		// 		},
		// 	}
		// )
		//console.log('+++++++++++++++++++')
		// console.log(cancelResult)
		res.status(200).json({
			success: true,
			message: 'business slot cancelled  successfully',
			data: { _id: results._id },
		})

	//	console.log('Success') // Log success message to the console
	} catch (error) {
		// res.status(500).json({ success: false, message: error.message, error })
		// console.log(error)
		next(error)
	}
})
// router.post(
// 	'/profile/picture/upload',
// 	authorization,
// 	uploadfile,
// 	async (req, res, next) => {
// 		try {
// 			const workspace = req.workspace
// 			const profile_picture = req.file
// 				? `${process.env.SPACE_DOMAIN}${req.file.originalname}`
// 				: undefined
// 			const picture_upload = await agent.uploadPicture({
// 				workspace,
// 				profile_picture,
// 			})
// 			//   const updatedBusiness = await Preference_.findOneAndUpdate(
// 			//     {
// 			//       workspace: req.workspace,
// 			//     },
// 			//     {
// 			//       $set: {
// 			//         profile_picture:profile_picture
// 			//       },
// 			//     }
// 			//   );
// 			//  console.log(updatedBusiness);
// 			res.status(200).json({
// 				success: true,
// 				message: 'profile picture upload successfully',
// 				data: { _id: picture_upload._id },
// 			})
// 		} catch (error) {
// 			// console.error(error)
// 			// res.status(500).json({ success: false, message: error.message, error })
// 			next(error)
// 		}
// 	}
// )

// router.post('/profile/update', authorization, async (req, res, next) => {
// 	try {
// 		const {
// 			email,
// 			business_name,
// 			website,
// 			mobile,
// 			business_description,
// 			owner_name,
// 		} = req.body
// 		const workspace = req.workspace
// 		const profile_update = await agent.updateProfile({
// 			workspace,
// 			owner_name,
// 			email,
// 			business_name,
// 			business_description,
// 			mobile,
// 			website,
// 		})
// 		// const updateProfile = await Preference_.findOneAndUpdate(
// 		//   {
// 		//     workspace: workspace,
// 		//   },
// 		//   {
// 		//     $set: {
// 		//       owner_name,
// 		//       email,
// 		//       business_name,
// 		//       business_description,
// 		//       mobile,
// 		//       website,
// 		//       is_profile_updated: true,
// 		//     },
// 		//   }
// 		// );

// 		res.status(200).json({
// 			success: true,
// 			message: 'business profile updated ',
// 			data: { _id: profile_update._id },
// 		})
// 	} catch (error) {
// 		// console.error(error)
// 		// res.status(500).json({ success: false, message: error.message, error })
// 		next(error)
// 	}
// })

// router.post('/profile/fetch', authorization, async (req, res, next) => {
// 	try {
// 		const workspace = req.workspace
// 		const profile_fetch = await agent.fetch({ workspace })
// 		// const profileFetch = await Preference_.findOne(
// 		//   {
// 		//     workspace: req.workspace,
// 		//   },
// 		//   { password: 0 }
// 		// );
// 		res.status(200).json({
// 			success: true,
// 			message: 'profile fetched successfully',
// 			data: profile_fetch,
// 		})
// 	} catch (error) {
// 		// console.error(error)
// 		// res.status(500).json({ success: false, message: error.message, error })
// 		next(error)
// 	}
// })

// router.post('/logout', authorization, async (req, res, next) => {
// 	try {
// 		const workspace = req.workspace
// 		const business_logout = await agent.logout({ workspace })
// 		// const logoutResult = await Preference_.updateOne(
// 		//   { workspace: req.workspace },
// 		//   {
// 		//     $set: {
// 		//       "authorization.is_logged_in": false,
// 		//       "authorization.time_stamp": Date.now(),
// 		//     },
// 		//   }
// 		// );
// 		res.status(200).json({
// 			success: true,
// 			message: 'business logout successfully',
// 			data: { _id: business_logout._id },
// 		})
// 	} catch (error) {
// 		// console.error(error)
// 		// res.status(500).json({ success: false, message: error.message, error })
// 		next(error)
// 	}
// })

module.exports = router