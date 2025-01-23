const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

//schemanode
const Event_ = require('../schema/event')
const Slot_ = require('../schema/slot')

const { conn } = require('../db/mongodb')
const authorization = require('../function/auth')
const uploadfile = require('../function/upload_file')
const { deconverter, converter } = require('../function/converstion')
const Integration = require('../controller/integration')
const eventRateLimiter = require('../rate_limiter/event')
const deleteFile = require('../function/delete_file')
const filterSlots = require('../function/current_slots')
const integration = new Integration()

const {
	slotGeneratorByIntervals,
	slotGeneratorBySlots,
	slots,
} = require('../function/slot_generator')
const Event = require('../controller/event')
const event = new Event()
router.use(express.json())
router.use(express.urlencoded({ extended: true }))


router.post('/create', authorization,eventRateLimiter, async (req, res, next) => {
	const session = await mongoose.startSession();
    session.startTransaction();
    
	try {
		const eid = new mongoose.Types.ObjectId()
		const workspace = req.workspace
		const {
			event_name,
			start_date,
			end_date,
			start_time,
			end_time,
			slot_duration,
			slot_interval,
			holidays,
			questions,
			free_slots,
		} = req.body

		// const newEvent = await Event_.create({

		// 	_id: eid,
		// 	workspace: req.workspace,
		// 	event_name,
		// 	start_date,
		// 	end_date,
		// 	start_time,
		// 	end_time,
		// 	slot_duration,
		// 	questions,
		// 	slot_interval,

		// 	holidays: holidays || [],
		// });

		//console.log('New Event:', newEvent);

		const event_create = await event.create({
			workspace,
			eid,
			event_name,
			start_date,
			end_date,
			start_time,
			end_time,
			slot_duration,
			questions,
			slot_interval,
			holidays,
			session
		})

	// 	console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=');
	// console.log("event data--------",event_create);
	// console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=');

		const slotGeneratorResult = slots({
			start_date,
			end_date,
			start_time,
			end_time,
			duration: parseInt(req.body.slot_duration),
			interval: parseInt(req.body.slot_interval),
			holidays: req.body.holidays ?? [],
		})
		const convertedSlots = converter(
			slotGeneratorResult,
			workspace,
			eid,
			event_name,
			free_slots
		)
		// Update each slot with the event ID
		// convertedSlots.forEach(slot => {
		//     slot.eid = eid;
		// });
		// console.log('____________________________________')
		// console.log(convertedSlots)
		// console.log('____________________________________')
		// const saveSlots = await Slot_.insertMany(convertedSlots);
		const slots_save = await event.saveSlots(convertedSlots,session)
		// console.log(slotGeneratorResult)
		await session.commitTransaction();
        session.endSession();

		res.status(200).json({
			success: true,
			message: 'slot generated successfully',
			data: slots_save,
		})
		//res.json(slotGeneratorResult);
	} catch (error) {
		await session.abortTransaction();
        session.endSession();
		next(error)
	}
})

router.post('/slot/generator', authorization, async (req, res, next) => {
	//console.log(req.body)
	try {
		const { start_date, end_date, start_time, end_time } = req.body
		//console.log(req.body)
		const slotGeneratorResult = slots({
			start_date,
			end_date,
			start_time,
			end_time,
			duration: parseInt(req.body.slot_duration),
			interval: parseInt(req.body.slot_interval),
			holidays: req.body.holidays ?? [],
		})

		// console.log('____________________________________')
		// console.log('slot', slotGeneratorResult)
		// console.log('____________________________________')

		res.status(200).json({
			success: true,
			message: 'slot generated successfully',
			data: slotGeneratorResult,
		})
		//res.json(slotGeneratorResult);
	} catch (error) {
		// console.error(error)
		// res.status(500).json({ success: false, message: error.message, error })
		next(error)
	}
})
router.post('/fetch', authorization, async (req, res, next) => {
	try {

		console.log("Request Body:", req.body);
        const workspace = req.workspace;
        const page = req.body.page ?? 0; 
        const query = req.body.query ?? null;
	
		// const fetchedEvents = await Event_.find({
		// 	workspace: req.workspace,
		// },
		// 	//{slots:0}
		// )
		const event_fetch = await event.fetch({ workspace,page,query })
		res.status(200).json({
			success: true,
			message: 'business event fetched successfully',
			data: event_fetch,
		})
	} catch (error) {
		// console.error(error)
		// res.status(500).json({ success: false, message: error.message, error })
		next(error)
	}
})

router.post('/slot/fetch', authorization, async (req, res, next) => {
	//console.log(req.body)
	try {
		const workspace = req.workspace
		const eid = req.body.eid

		// const fetchedEvents = await Slot_.find({
		// 	workspace: req.workspace,
		// 	eid: req.body.eid
		// })
		//  console.log(fetchedEvents);
		const slot_fetch = await event.fetchSlot({ workspace, eid })

	//	console.log('slot_Fetch', slot_fetch)
		const convertedSlots = deconverter(slot_fetch)
		//console.log(convertedSlots)
		res.status(200).json({
			success: true,
			message: 'business event slot fetched successfully',
			data: convertedSlots,
		})
	} catch (error) {
		// console.error(error)
		// res.status(500).json({ success: false, message: error.message, error })
		next(error)
	}
})



router.post('/slot/list', async (req, res, next) => {
	//console.log(req.body)
	try {
		const workspace = req.body.workspace
		const eid = req.body.eid

		// const fetchedEvents = await Slot_.find({
		// 	workspace: req.workspace,
		// 	eid: req.body.eid
		// })
		//  console.log(fetchedEvents);
		const slot_fetch = await event.fetchSlot({ workspace, eid })

	//	console.log('slot_Fetch', slot_fetch)
		// const convertedSlots = deconverter(slot_fetch);
		// console.log(convertedSlots);
		res.status(200).json({
			success: true,
			message: 'business event slot fetched successfully',
			data: slot_fetch,
		})
	} catch (error) {
		// console.error(error)
		// res.status(500).json({ success: false, message: error.message, error })
		next(error)
	}
})

router.post('/slot/list/current', async (req, res, next) => {
	try {
		const workspace = req.body.workspace
		const eid = req.body.eid

		const slot_ = await event.fetchCurrentSlot({ workspace, eid })
		//console.log(slot_);

		const fetch_slots = await filterSlots(slot_)
		// console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
		// console.log("workspace=",workspace);
		// console.log("eid=",eid);
		// console.log("fetch_slots",slot_fetch);
		// console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');


		res.status(200).json({
			success: true,
			message: 'business event current slot fetched successfully',
			data: fetch_slots,
		})
	} catch (error) {
		
		next(error)
	}
})


// its working
// router.post("/cancel", authorization, async (req, res, next) => {
//   try {
//       const token = req.headers.authorization;
//       const workspace = req.workspace;
//       const id = req.body.id;

//       const event_cancel = await event.cancel({ workspace, id });

//       // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
//       // console.log("event", event_cancel);
//       // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");

//       const slots = await event.listSlots({ eid: id });

//       console.log("###################");
//       console.log("slots event cancel" + slots);
//       console.log("###################");
//       for (const slot of slots) {
//         if (slot.email) {
//             const to = slot.email;
//             const subject = "Event Cancelled";
//             console.log("Sending email to:", to);
//             await integration.sendMailIndmail({ token, to, subject });
//         } else if (slot.phone_number) {
//             const results = {
//                 workspace: slot.workspace,
//                 status: slot.status,
//                 phone_number: slot.phone_number
//             };
//             console.log("++++++++++++++++Slot Event Cancel++++++++++++++");
//             console.log(results);
//             console.log("++++++++++++++++Slot Event Cancel++++++++++++++");
//             await integration.sendTemplateInderact({ results,token });
//         } else {
//             console.log("Slot email is not defined, and phone number is not available:", slot);
//         }
//     }

//       res.status(200).json({
//           success: true,
//           message: "business event cancel successfully",
//           data: { _id: event_cancel._id },
//       });
//   } catch (error) {
//       next(error);
//   }
// });

router.post('/cancel', authorization, async (req, res) => {
	try {
		const token = req.headers.authorization
		const workspace = req.workspace
		const eid = req.body.id
		// console.log(token)
		// console.log(workspace)

		
		const slots = await event.listSlots({ eid: eid })

		function getAttachments(slots) {
			return slots
			  .map(slot => slot.attachment)
			  .filter(attachment => attachment !== null);
		  }
		  
		  const attachments = getAttachments(slots);
		  //console.log("Attachments:", attachments);

		// console.log("********************************************************************************");
		// console.log("slots ",attachments);
		// console.log("********************************************************************************");

		for (const attachment of attachments) {
			const key = attachment.split('.com/').pop();
			await deleteFile(key);
		}

		const activation = await integration.check({
			workspace: workspace,
			code: 'INDMAILINDSPOTEMAILNOTIFIER',
		})

		const isActive = activation === 1 ? true : false;

		// console.log('_______________________________________________________________________________');
		// console.log('activation',isActive)
		// console.log('_______________________________________________________________________________');


			// Check and send emails if integrations are enabled
			if (isActive) {
				try {
					const sendmail = await integration.sendMailIndmailBulk({workspace, eid,integration:isActive})
					// console.log('00000000000000000')

					// console.log(sendmail)
			
					// console.log('000000000000000000')
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
					const sentInderactTemplate = await integration.sendTemplateInderactBulk({
						workspace,
						eid
					})
					

		// console.log('111111111111 ___HHHHHHHHHHHHHHHHHHHHHHHHHHH__ 11111111111111')

		// console.log(sentInderactTemplate)

		// console.log('11111111111111111111111')
				} catch (error) {
					console.error('Error sending WhatsApp template:', error)
				}
			}

		
		
		const event_cancel = await event.cancel({ workspace, id: eid })
		res
			.status(200)
			.json({ message: 'Event cancellation notifications sent successfully.' })
	} catch (error) {
		console.error('Error occurred:', error)
		res
			.status(500)
			.json({ error: 'An error occurred while processing the request.' })
	}
})

// router.post("/cancel", authorization, async (req, res, next) => {
//   try {
//     const token = req.headers.authorization
//       const workspace = req.workspace
// 	  const id = req.body.id

//       const event_cancel = await event.cancel({workspace,id})

//       console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
//       console.log("event",event_cancel);
//       console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
//     // const to =event_cancel.email
//     // const subject =event_cancel.status
//     var slots = await event.lisSlots({ eid: id })
//     for(const slot of  slots){
//       var to = slot.email
//       var subject =slot.status
//       await integration.sendMailIndmail({token,to ,subject})
//     }
//     // const session = await conn.startSession();
//     // session.startTransaction();

//     // const cancellationResult = await Event_.findOneAndUpdate(
//     //   {
//     //     workspace: req.workspace,
//     //     _id: req.body.id,
//     //   },
//     //   {
//     //     $set: {
//     //       event_status: "EVENT_CANCELLED",
//     //     },
//     //   },
//     //   { new: true }
//     // ).session(session);

//     // await Slot_.updateMany(
//     //   {
//     //     workspace: req.workspace,
//     //     eid: req.body.id,
//     //   },
//     //   {
//     //     $set: {
//     //       status: "EVENT_CANCELLED",
//     //     },
//     //   }
//     // ).session(session);

//     // console.log(cancellationResult);

//     // await session.commitTransaction();
//     // session.endSession();
//     res.status(200).json({
//       success: true,
//       message: "business event cancel  successfully",
//       data: { _id: event_cancel._id },
//     });
//   } catch (error) {
//     // res.status(500).json({ success: false, message: error.message, error })
//     // console.log(error)
//     next(error);
//   }
// });

//   for (const slot of slots) {
//     // Check if email is defined
//         const to = slot.email;
//         const subject = "Event Cancelled"; // Customize the subject
//         console.log("Sending email to:", to);
//         if (slot.email)      await integration.sendMailIndmail({ token, to, subject });
//         if (slot.phone_number) await integration.sendTemplateInderact({ results: slot });

// }

router.post('/delete', authorization, async (req, res, next) => {
	try {
		// const session = await conn.startSession();
		// session.startTransaction();

		// const deletionResult = await Event_.deleteOne({
		//   workspace: req.workspace,
		//   _id: req.body.id,
		// }).session(session);
		// await Slot_.deleteMany({
		//   workspace: req.workspace,
		//   eid: req.body.id,
		// }).session(session);

		// await session.commitTransaction();
		// session.endSession();
		const workspace = req.workspace
		const id = req.body.id

		const event_delete = await event.delete({ workspace, id })
		res.status(200).json({
			success: true,
			message: 'business event deleted successfully',
		})
	} catch (error) {
		// console.error(error)
		// res.status(500).json({ success: false, message: error.message, error })
		next(error)
	}
})
//event
module.exports = router  