// const mongoose = require('mongoose')

// const slot_schema = mongoose.Schema({
// 	workspace: {
// 		type: String,
// 	},

// 	date: {
// 		type: String,
// 	},

// 	uid: {
// 		type: String,
// 		// validate: {
// 		//     validator: validator.validateSameTypeid,
// 		//     message: ' invalid uid.',
// 		//   },
// 	},
// 	tid: {
// 		type: String,
// 		// validate: {
// 		//     validator: validator.validateSameTypeid,
// 		//     message: ' invalid tid.',
// 		//   },
// 	},
// 	bid: {
// 		type: String,
// 		// validate: {
// 		//     validator: validator.validateSameTypeid,
// 		//     message: ' invalid bid.',
// 		//   },
// 	},

// 	eid: {
// 		type: String,
// 		// validate: {
// 		//     validator: validator.validateSameTypeid,
// 		//     message: ' invalid eid.',
// 		//   },
// 	},

// 	start_time: {
// 		type: String,
// 		// validate: {
// 		//  validator: validator.validateTimeStamp,
// 		//  message: 'Invalid value for time_stamp field. Please provide a valid timestamp in start_date.',
// 		//  },
// 	},
// 	end_time: {
// 		type: String,
// 		// validate: {
// 		//  validator: validator.validateTimeStamp,
// 		//  message: 'Invalid value for time_stamp field. Please provide a valid timestamp in end_date.',
// 		//  },
// 	},
// 	email: {
// 		type: String,
// 		// validate: {
// 		//     validator: validator.validateName,
// 		//     message: ' Invalid user_name.',
// 		//   },
// 	},
// 	event_name: {
// 		type: String,
// 		// validate: {
// 		//     validator: validator.validateName,
// 		//     message: ' Invalid event_name.',
// 		//   },
// 	},
// 	attachment: {
// 		type: String,
// 		// validate: {
// 		//  validator: validator.validateUrl,
// 		//  message: 'Invalid attachment.',
// 		//  },
// 	},
// 	description: {
// 		type: String,
// 		// validate: {
// 		//     validator: validator.validateDescription,
// 		//     message:'Invalid description ',
// 		//     },
// 	},
// 	is_available: {
// 		type: Boolean,
// 		// validate: {
// 		//     validator: validator.validateBoolean,
// 		//     message: 'Invalid ',
// 		//     },
// 	},
// 	is_archive: {
// 		type: Boolean,
// 		// validate: {
// 		//     validator: validator.validateBoolean,
// 		//     message: 'Invalid ',
// 		//     },
// 	},
// 	status: {
// 		type: String,
// 		enum: [
// 			'CANCELLED_BY_HOST',
// 			'CANCELLED_BY_USER',
// 			'BOOKED',
// 			'AVAILABLE',
// 			'EVENT_CANCELLED',
// 			'ARCHIVED',
// 		],
// 		// validate: {
// 		//     validator: validator.validateTicketStatus,
// 		//     message:'Invalid value for ticket_status field.',
// 		//   },
// 		default: 'AVAILABLE',
// 	},
// 	answers: {
// 		type: Map,
// 		of: String,
// 	},
// })
// module.exports = mongoose.model('Slot', slot_schema)

const mongoose = require('mongoose')
const slot_schema = mongoose.Schema({
	workspace: {
		type: String,
		trim: true,
		minlength: [3, 'Workspace name should be at least 3 characters long'],
		maxlength: [50, 'Workspace name should not exceed 50 characters'],
		match: [/^[a-zA-Z0-9\s]+$/, 'only use alphaneumeric characters'],
	},
	date: {
		type: String,
		//	match: [/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, "Invalid date format, use YYYY-MM-DDTHH:mm:ss"]
	},
	uid: {
		type: mongoose.Schema.Types.ObjectId,
	},
	tid: {
		type: mongoose.Schema.Types.ObjectId,
	},
	bid: {
		type: mongoose.Schema.Types.ObjectId,
	},
	eid: {
		//type: mongoose.Schema.Types.ObjectId,
		type: String,
		match: [/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format'],
	},

	email: {
		type: String,
		match: [
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|undefined$/,
			'only use alphaneumeric characters',
		],
	},
	start_time: {
		type: String,
		//	match: [/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i, "Invalid time format, use hh:mm AM/PM"]
	},
	end_time: {
		type: String,
		//match: [/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i, "Invalid time format, use hh:mm AM/PM"]
	},
	phone_number: {
		type: String,
		match: [/^\d{10}$|undefined$/, 'invalid phone number'],
	},
	country_code: {
		type: String,
		trim: true,
		minlength: [1, 'Country code should be at least 1 character long'],
		maxlength: [10, 'Country code should not exceed 10 characters'],
	}, //new
	user_name: {
		type: String,
		trim: true,
		minlength: [3, 'Organization name should be at least 3 characters long'],
		maxlength: [50, 'Organization name should not exceed 50 characters'],
		match: [/^[a-zA-Z0-9\s]+$/, 'only use alphaneumeric characters'],
	},
	event_name: {
		type: String,
		required: true,
		trim: true,
		minlength: [3, 'Organization name should be at least 3 characters long'],
		maxlength: [50, 'Organization name should not exceed 50 characters'],
		match: [/^[a-zA-Z0-9\s]+$/, 'only use alphaneumeric characters'],
	},
	attachment: {
		type: String,
		match: [
			/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$|undefined$/,
			'use your logo',
		],
	},
	description: {
		type: String,
		match: [/^[a-zA-Z0-9\s_]+$/, 'only use alphaneumeric characters'],
	},
	is_available: {
		type: Boolean,
	},
	is_archive: {
		type: Boolean,
	},
	status: {
		type: String,
		enum: [
			'CANCELLED_BY_HOST',
			'CANCELLED_BY_USER',
			'BOOKED',
			'AVAILABLE',
			'EVENT_CANCELLED',
			'ARCHIVED',
			'FREE',
		],

		default: 'AVAILABLE',
	},
	answers: {
		type: Map,
		of: String,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
})
module.exports = mongoose.model('Slot_', slot_schema)
