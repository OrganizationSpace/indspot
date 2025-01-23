const express = require('express')
const morgan = require('morgan')

const router = express.Router()
const { io } = require('../server')

//functions
const clientAuthorization = require('../function/client_auth')
const uploadfile = require('../function/upload_file')
const { deconverter, converter } = require('../function/converstion')
const { setChannel, sendToQueue, ack, nack } = require('../rabbitmq/channel')
//controller
const Client = require('../controller/client')
const Event = require('../controller/event')
const Integration = require('../controller/integration')
const deleteFile = require('../function/delete_file')

const client = new Client()
const event = new Event()
const integration = new Integration()

router.use(morgan('dev'))
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.post('/add', async (req, res, next) => {
	try {
		const { workspace, email, password, phone_number, name } = req.body
		//const token = req.headers.authorization;

		const country_code = phone_number.slice(0, 2)
		const ten_digit_phone_number = phone_number.slice(2)

		const response = await client.register({
			workspace,
			email,
			password,
			name,
			phone_number: ten_digit_phone_number,
			country_code,
			tag: 'INDSPOT',
		})

		//io.of(`/org-${req.workspace}`).emit('refresh', { model: 'agent' })
		if (response.status == 200) {
			res.status(response.status).json({
				success: response.data.success,
				message: response.data.message,
				data: response.data.data,
			})
		} else {
			// Failed request
			res.status(response.status).json({
				success: false,
				message: response.data.message,
				data: response.data.data,
			})
		}
	} catch (error) {
		console.error(error)
		next(error)
	}
})

router.post('/login', async (req, res, next) => {
	//console.log(req.body)
	try {
		const { workspace, email, password } = req.body

		const response = await client.login({
			workspace: workspace,
			email: email,
			password: password,
			tag: 'INDSPOT',
		})
		if (response.status == 200) {
			const token = response.headers['token']
			//const data = await prefToken(eco_token);

			res.setHeader('token', token)
			res.setHeader('workspace', workspace)
			res.setHeader('email', email)

			// res.setHeader('name', data.name)
			// res.setHeader('role', data.role)

			res.status(response.status).json({
				success: response.data.success,
				message: response.data.message,
				data: response.data.data,
			})
		} else {
			// Failed login
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

router.post(
	'/profile/picture/upload',
	clientAuthorization,
	uploadfile,
	async (req, res, next) => {
		const token = req.headers.authorization
		try {
			const response = await client.uploadPicture({
				token,
				url:
					process.env.SPACE_DOMAIN +
					(req.file ? req.file.originalname : 'undefined'),
			})
			if (response.status == 200) {
				res.status(response.status).json({
					success: response.data.success,
					message: response.data.message,
					data: response.data.data,
				})
			} else {
				// Failed request
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
	}
)

router.post('/profile/fetch', clientAuthorization, async (req, res, next) => {
	const token = req.headers.authorization
	try {
		const response = await client.fetchProfile({
			token,
		})
		//	console.log('indspot_profile_fetch' + response)
		if (response.status == 200) {
			res.status(response.status).json({
				success: response.data.success,
				message: response.data.message,
				data: {
					display_name: response.data.data.name,
					profile_picture: response.data.data.profile_picture,
					email: response.data.data.email,
				},
			})
		} else {
			// Failed request
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

router.post('/event/fetch', async (req, res, next) => {
	// console.log(
	// 	'___________________________________________________________________________________________________________________'
	// )
	// console.log(req.workspace)
	// console.log(
	// 	'________________________________________________________________________________________________________________'
	// )

	try {
		const id = req.body.id


		const event_fetch = await client.fetchEvent({ id })
		
		if(event_fetch.event_status == 'EVENT_CANCELLED'){
				return res.status(400).json({
					success: false,
					message: 'The Event has been cancelled',
				});
			}

		const slots_fetch = await client.fetchSlots({ id })
		// console.log('____________________________')
		// console.log(slots_fetch)
		// console.log('____________________________')
		var convertedSlots = deconverter(slots_fetch)

		// console.log(convertedSlots)

		event_fetch.slots = convertedSlots

		res.status(200).json({
			success: true,
			message: 'event fetched successfully',
			data: event_fetch,
		})
	} catch (error) {
		// console.error(error)
		// res.status(500).json({ success: false, message: error.message, error })
		next(error)
	}
})

// router.post(
// 	'/slot/book',
// 	clientAuthorization,
// 	uploadfile,
// 	async (req, res, next) => {
// 		console.log('_________________________')
// 		console.log(req.body)
// 		console.log('_________________________')

// 		try {
// 			const token = req.headers.authorization
// 			const { eid, sid, description, answers } = req.body
// 			const workspace = req.workspace
// 			const email = req.email // assuming email is in req.body
// 			const phone_number = req.phone_number // assuming phone_number is in req.body
// 			const country_code = req.country_code
//             const name = req.name
// 			const attachment = req.file
// 				? `${process.env.SPACE_DOMAIN}${req.file.originalname}`
// 				: undefined

// 			// Parse answers if it's a string
// 			const parsedAnswers =
// 				typeof answers === 'string' ? JSON.parse(answers) : answers

// 			const event_check = await event.fetchEvent({workspace,eid})

// 			if(event_check.event_status == 'EVENT_CANCELLED'){
// 				return res.status(400).json({
// 					success: false,
// 					message: 'The Event has been cancelled',
// 				});
// 			}
// 			const event_name = event_check.event_name
// 			// Call client.bookSlot with required parameters
// 			const results = await client.bookSlot({
// 				workspace,
// 				user_name:name,
// 				eid,
// 				sid,
// 				email,
// 				phone_number,
// 				country_code,
// 				answers: parsedAnswers,
// 				attachment,
// 				description,
// 			})

// 			results.action = 'book'
// 			results.event_name=event_name
// 			// Log results for debugging
// 			// console.log('****')
// 			// console.log('slot', results)
// 			// console.log("country_code",country_code);
// 			// console.log("tocken",token);
// 			// console.log('****')

// 			// Prepare email details

// 			const to = results.email
// 			const subject = results.status

// 			// Check and send emails if integrations are enabled
// 			if (
// 				await integration.check({
// 					workspace: req.workspace,
// 					code: 'INDMAILINDSPOTEMAILNOTIFIER',
// 				})
// 			) {
// 				try {
// 					sendToQueue('indmail', 'INTEGRATION_MAIL_SEND', {
// 						workspace: req.workspace,
// 						name:name,
// 						to: to,
// 						subject: subject,
// 						body: subject,
// 						name:results.user_name,
// 						email:results.email,
// 						phone_number:results.phone_number,
// 						attachment:results.attachment,
// 						description:results.description,
// 						event_name:results.event_name,
// 						action :results.action,
// 						eid:eid,
// 						sid:sid
// 					})
// 					//integration.sendMailIndmail({ token, to, subject })
// 				} catch (error) {
// 					console.error('Error sending email:', error)
// 				}
// 			}

// 			if (
// 				await integration.check({
// 					workspace: req.workspace,
// 					code: 'INDERACTINDSPOTEWHATSAPPNOTIFIER',
// 				})
// 			) {
// 				try {
// 					sendToQueue('inderact', 'INTEGRATION_INDSPOT_TEMPLATE_SEND', {
// 						...results,
// 						//workspace: workspace,
// 					})
// 					//integration.sendTemplateInderact({ results, token })
// 				} catch (error) {
// 					console.error('Error sending WhatsApp template:', error)
// 				}
// 			}

// 			// Emit socket event
// 			io.of(`/org-${req.workspace}`).emit('slot', results)

// 			// Send response
// 			res.status(200).json({
// 				success: true,
// 				message: 'Slot booked successfully',
// 				data: { sid: results._id },
// 			})

// 			//console.log('Success')
// 		} catch (error) {
// 			// Handle errors
// 			next(error)
// 		}
// 	}
// )

router.post(
	'/slot/book',
	uploadfile,
	async (req, res, next) => {
		console.log('_________________________')
		console.log(req.body)
		console.log('_________________________')

		try {
			//const token = req.headers.authorization
			//const email = req.email // assuming email is in req.body
			const { eid, sid, description, answers,phone_number,email,country_code,name } = req.body
			// const workspace = req.workspace
			// const email = req.email // assuming email is in req.body
			// const phone_number = req.phone_number // assuming phone_number is in req.body
			// const country_code = req.country_code
            // const name = req.name
			const attachment = req.file
				? `${process.env.SPACE_DOMAIN}${req.file.originalname}`
				: undefined

			// Parse answers if it's a string
			const parsedAnswers =
				typeof answers === 'string' ? JSON.parse(answers) : answers

			const event_check = await event.fetchEvent({eid})
			
			const workspace = event_check.workspace
			const event_name = event_check.event_name
console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
			console.log("event_check",event_check);
			console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

			if(event_check.event_status == 'EVENT_CANCELLED'){
				return res.status(400).json({
					success: false,
					message: 'The Event has been cancelled',
				});
			}
			
			// Call client.bookSlot with required parameters
			const results = await client.bookSlot({
				user_name:name,
				eid,
				sid,
				email,
				phone_number,
				country_code,
				answers: parsedAnswers,
				attachment,
				description,
			})

			results.action = 'book'
			results.event_name=event_name
			// Log results for debugging
			// console.log('****')j
			// console.log('slot', results)
			// console.log("country_code",country_code);
			// console.log("tocken",token);
			// console.log('****')

			// Prepare email details

			const to = results.email
			const subject = results.status

			// Check and send emails if integrations are enabled
			if (
				await integration.check({
					workspace: workspace,
					code: 'INDMAILINDSPOTEMAILNOTIFIER',
				})
			) {
				try {
					sendToQueue('indmail', 'INTEGRATION_MAIL_SEND', {
						workspace: workspace,
						name:name,
						to: to,
						subject: subject,
						body: subject,
						name:results.user_name,
						email:results.email,
						phone_number:results.phone_number,
						attachment:results.attachment,
						description:results.description,
						event_name:results.event_name,
						action :results.action,
						eid:eid,
						sid:sid
					})
					//integration.sendMailIndmail({ token, to, subject })
				} catch (error) {
					console.error('Error sending email:', error)
				}
			}

			if (
				await integration.check({
					workspace: workspace,
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

			// Emit socket event
			io.of(`/org-${workspace}`).emit('slot', results)

			// Send response
			res.status(200).json({
				success: true,
				message: 'Slot booked successfully',
				data: { sid: results._id },
			})

			//console.log('Success')
		} catch (error) {
			// Handle errors
			next(error)
		}
	}
)
router.get("/slot/cancel/:eid/:sid", async (req, res,next) => {
	try {
		
		const eid = req.params.eid
		const sid = req.params.sid
		
        var htmlResponse;
		// const fetch = await client.fetchSlot({  eid, sid })
		
					
		const results = await client.cancelSlot({  eid, sid })
		const workspace = results.workspace
		results.action = 'cancel'
		if(results.attachement != null) {
	    const key = results.attachment.split('.com/').pop()
		var del = await deleteFile(key)
		}
		const to = results.email
		const subject = results.status
		

		// await integration.sendMailIndmail({ token, to, subject })
		// await integration.sendTemplateInderact({ results, token })
		// Check and send emails if integrations are enabled
		if (
			await integration.check({
				workspace: results.workspace,
				code: 'INDMAILINDSPOTEMAILNOTIFIER',
			})
		) {
			try {
				sendToQueue('indmail', 'INTEGRATION_MAIL_SEND', {
					// workspace: req.workspace,
					// to: to,
					// subject: subject,
					// body: subject,
					  workspace: workspace,
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
				workspace: workspace,
				code: 'INDERACTINDSPOTEWHATSAPPNOTIFIER',
			})
		) {
			try {
				sendToQueue('inderact', 'INTEGRATION_INDSPOT_TEMPLATE_SEND', {
					...results,
				})
				//integration.sendTemplateInderact({ results, token })
			} catch (error) {
				console.error('Error sending WhatsApp template:', error)
			}
		}

		io.of(`/org-${workspace}`).emit('slot', results)

		 // HTML response
		htmlResponse = `
		 <!DOCTYPE html>
		 <html lang="en">
		 <head>
			 <meta charset="UTF-8">
			 <meta name="viewport" content="width=device-width, initial-scale=1.0">
			 <title>Slot Cancellation</title>
			 <style>
				 body {
					 font-family: Arial, sans-serif;
					 background-color: #f8f9fa;
					 color: #333;
					 padding: 20px;
				 }
				 .container {
					 max-width: 600px;
					 margin: 0 auto;
					 background-color: #fff;
					 padding: 20px;
					 box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
				 }
				 h1 {
					 color: #dc3545;
				 }
			 </style>
		 </head>
		 <body>
			 <div class="container">
				 <h1>Appointment Cancelled Successfully</h1>
				 <p>Your Appointment has been cancelled successfully.</p>
				 <p>Event : ${results.event_name}</p>
				 <p>Name  : ${results.user_name}</p>
				 <p>Time  : ${results.start_time}</p>
				
			 </div>
		 </body>
		 </html>
	 `;
		res.status(200).send(htmlResponse)
		//	console.log('Success') // Log success message to the console
	} catch (error) {
		// res.status(500).json({ success: false, message: error.message, error })
		// console.log(error)
		next(error)
	}
})

// router.post('/slot/cancel', clientAuthorization, async (req, res, next) => {
// 	try {
// 		const token = req.headers.authorization
// 		const workspace = req.workspace
// 		const eid = req.body.eid
// 		const sid = req.body.sid
		

// 		const results = await client.cancelSlot({ workspace, eid, sid })
// 		results.action = 'cancel'
// 		if(results.attachement != null) {
// 	    const key = results.attachment.split('.com/').pop()
// 		var del = await deleteFile(key)
// 		}
// 		const to = results.email
// 		const subject = results.status
		

// 		// await integration.sendMailIndmail({ token, to, subject })
// 		// await integration.sendTemplateInderact({ results, token })
// 		// Check and send emails if integrations are enabled
// 		if (
// 			await integration.check({
// 				workspace: req.workspace,
// 				code: 'INDMAILINDSPOTEMAILNOTIFIER',
// 			})
// 		) {
// 			try {
// 				sendToQueue('indmail', 'INTEGRATION_MAIL_SEND', {
// 					// workspace: req.workspace,
// 					// to: to,
// 					// subject: subject,
// 					// body: subject,
// 					  workspace: req.workspace,
// 						to: to,
// 						subject: subject,
// 						body: subject,
// 						name:results.user_name,
// 						email:results.email,
// 						phone_number:results.phone_number,
// 						description:results.description,
// 						event_name:results.event_name,
// 						action :results.action
// 				})
// 				//integration.sendMailIndmail({ token, to, subject })
// 			} catch (error) {
// 				console.error('Error sending email:', error)
// 			}
// 		}

// 		if (
// 			await integration.check({
// 				workspace: req.workspace,
// 				code: 'INDERACTINDSPOTEWHATSAPPNOTIFIER',
// 			})
// 		) {
// 			try {
// 				sendToQueue('inderact', 'INTEGRATION_INDSPOT_TEMPLATE_SEND', {
// 					...results,
// 				})
// 				//integration.sendTemplateInderact({ results, token })
// 			} catch (error) {
// 				console.error('Error sending WhatsApp template:', error)
// 			}
// 		}

// 		io.of(`/org-${req.workspace}`).emit('slot', results)
// 		res.status(200).json({
// 			success: true,
// 			message: 'slot cancelled successfully',
// 			data: { _id: results._id },
// 		})
// 		//	console.log('Success') // Log success message to the console
// 	} catch (error) {
// 		// res.status(500).json({ success: false, message: error.message, error })
// 		// console.log(error)
// 		next(error)
// 	}
// })


router.post('/ticket/fetch', clientAuthorization, async (req, res, next) => {
    try {
        console.log("Request Body:", req.body);
        const workspace = req.workspace;
		const id = req.clientId
		const email = req.email
        const page = req.body.page ?? 0; 
        const query = req.body.query ?? null;

        const ticket_fetch = await client.fetchTicket({ workspace,id,email,page, query });

        res.status(200).json({
            success: true,
            message: 'ticket listed successfully',
            data: ticket_fetch,
        });
    } catch (error) {
        next(error);
    }
});

// router.post('/ticket/fetch', clientAuthorization, async (req, res, next) => {
//     try {
        
// 		const workspace = req.workspace;
//         const page = req.body.page ?? 0; 
//         const query = req.body.query ?? null;
//         console.log('Workspace:', workspace);
// 		console.log("body ",req.body);
       

//         const ticket_fetch = await client.fetchTicket({ workspace,page, query });

//         res.status(200).json({
//             success: true,
//             message: 'Tickets fetched successfully',
//             data: ticket_fetch,
//         });
//     } catch (error) {
//         next(error);
//     }
// });

router.post('/ticket/delete', clientAuthorization, async (req, res, next) => {
	try {
		// console.log(req.id);
		const workspace = req.workspace
		const sid = req.body.sid

		const ticket_delete = await client.deleteTicket({ workspace, sid })

		res.status(200).json({
			success: true,
			message: 'ticket deleted successfully',
			// data: { _id: deleteTicket._id },
		})
	} catch (error) {
		// res.status(500).json({ success: false, message: error.message, error })
		// console.log(error)
		next(error)
	}
})

router.post('/ticket/archive', clientAuthorization, async (req, res, next) => {
	try {
		const workspace = req.workspace
		const sid = req.body.sid

		const ticket_archive = await client.archiveTicket({ workspace, sid })

		res.status(200).json({
			success: true,
			message: 'ticket archive',
			data: { _id: ticket_archive._id },
		})
	} catch (error) {
		// res.status(500).json({ success: false, message: error.message, error })
		// console.log(error)
		next(error)
	}
})

router.post('/logout', clientAuthorization, async (req, res, next) => {
	try {
		const id = req.clientId
		// const logout = await User_.updateOne(
		//   { _id: req.id },
		//   {
		//     $set: {
		//       "authorization.is_logged_in": false,
		//       "authorization.time_stamp": Date.now(),
		//     },
		//   }
		// );
		const user_logout = await client.logout({ id })
		res.status(200).json({
			success: true,
			message: ' logout successfully',
			data: { _id: user_logout._id },
		})
	} catch (error) {
		// res.status(500).json({ success: false, message: error.message, error })
		// console.log(error)
		next(error)
	}
})

module.exports = router