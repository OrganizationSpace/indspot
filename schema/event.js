// const mongoose = require('mongoose')

// //const validator=require('../validator')

// const event_schema = mongoose.Schema({
// 	workspace: {
// 		type: String,
// 	},
// 	bid: {
// 		type: String,
// 		// validate: {
// 		//     validator: validator.validateSameTypeid,
// 		//     message: ' invalid bid.',
// 		//   },
// 	},
// 	event_name: {
// 		type: String,
// 		// validate: {
// 		//     validator: validator.validateName,
// 		//     message: ' event name.',
// 		//   },
// 	},
// 	start_date: {
// 		type: String,
// 		// validate: {
// 		//  validator: validator.validateDate,
// 		//  message: 'Invalid value for time_stamp field. Please provide a valid timestamp in start_date.',
// 		//  },
// 	},
// 	end_date: {
// 		type: String,
// 		// validate: {
// 		//  validator: validator.validateDate,
// 		//  message: 'Invalid value for time_stamp field. Please provide a valid timestamp in end_date.',
// 		//  },
// 	},
// 	start_time: {
// 		type: String,
// 		// validate: {
// 		//  validator: validator.ValidateTime,
// 		//  message: 'Invalid value for time_stamp field. Please provide a valid timestamp in start_time.',
// 		//  },
// 	},
// 	end_time: {
// 		type: String,
// 		// validate: {
// 		//  validator: validator.ValidateTime,
// 		//  message: 'Invalid value for time_stamp field. Please provide a valid timestamp in end_time.',
// 		//  },
// 	},
// 	slot_duration: {
// 		type: String,
// 	},
// 	location: {
// 		type: String,
// 	},
// 	holidays: {
// 		type: Array,
// 	},
// 	slot_interval: {
// 		type: String,
// 	},
// 	event_status: {
// 		type: String,
// 		enum: ['EVENT_CANCELLED', 'ARCHIVED', 'AVAILABLE'],
// 		// validate: {
// 		//     validator: validator.validateTicketStatus,
// 		//     message:'Invalid value for event_status field.',
// 		//   },
// 		default: 'AVAILABLE',
// 	},
// 	questions: {
// 		type: Map,
// 		of: String,
// 	},
// })
// module.exports = mongoose.model('Event', event_schema)


const mongoose = require('mongoose')

//const validator=require('../validator')

const event_schema = mongoose.Schema({
    workspace:{
        type: String,
        trim: true,
        minlength: [3, "Workspace name should be at least 3 characters long"],
        maxlength: [50, "Workspace name should not exceed 50 characters"],
        match: [/^[a-zA-Z0-9\s]+$/,"only use alphaneumeric characters"]
      },
    bid:{
        type: mongoose.Schema.Types.ObjectId,
        
    },
    event_name: {
        type: String,
       required: true, 
        trim: true,
        minlength: [3, "Organization name should be at least 3 characters long"],
        maxlength: [50, "Organization name should not exceed 50 characters"],
        match: [/^[a-zA-Z0-9\s]+$/,"only use alphaneumeric characters"]
      },
    start_date: {
        type: String,
       
    },
    end_date: {
        type: String,
        // validate: {
        //  validator: validator.validateDate,
        //  message: 'Invalid value for time_stamp field. Please provide a valid timestamp in end_date.',
        //  },
    },
    start_time: {
        type: String,
      //  match: [/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, "Invalid time format"]
    },
    end_time: {
        type: String,
      //  match: [/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, "Invalid time format"]
    },
    slot_duration: {
        type: String,
        match: [/^(15|30|45|60)\smin$/, "Invalid time format"]
    },
    // location: {
    //     type: String,
    // },
    holidays: {
        type: Array,
    },
    slot_interval: {
        type: String,
       // match: [/^(05|10|15|30)\smin$/, "Invalid time format"]
    },
    event_status: {
        type: String,
        enum: ['EVENT_CANCELLED', 'ARCHIVED', 'AVAILABLE'],
        // validate: {
        //     validator: validator.validateTicketStatus,
        //     message:'Invalid value for event_status field.',
        //   },
        default: 'AVAILABLE',
    },
    questions: {
        type: Map,
        of: String,
    },
    created_at:{
        type:Date,
        default:Date.now
      }
})
module.exports = mongoose.model('Event_', event_schema)