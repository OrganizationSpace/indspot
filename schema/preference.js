
const mongoose = require('mongoose');
//const validator=require('../validator')

const prference_schema = mongoose.Schema({
  workspace: {
    type: String,
    trim: true,
    minlength: [3, "Workspace name should be at least 3 characters long"],
    maxlength: [50, "Workspace name should not exceed 50 characters"],
    match: [/^[a-zA-Z0-9\s]+$/,"only use alphaneumeric characters"]
  },
  is_set: {
		type: Boolean,
		default:false
	}, 
      // owner_name:{
      //   type: String,
      // //   required: true, 
      //   trim: true,
      //   minlength: [3, "Organization name should be at least 3 characters long"],
      //   maxlength: [50, "Organization name should not exceed 50 characters"],
      //   match: [/^[a-zA-Z0-9\s]+$/,"only use alphaneumeric characters"]
      //   },
      // mobile: {
      //   type: String,
      //   match: [/^\d{10}$/,"invalid phone_number, must be 10 digits"]
      
      //   },

      //   email: {
      //     type: String,
      //     // trim: true,
      //     // lowercase: true,
      //     // unique: true,
      //     // match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"only use alphaneumeric characters"]
      //     },
      //   password: {
      //     type: String,
      //     match:  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/
      //     //  required: true,
      //   },
      //   location:{
      //     type:String,
    
      //   },
         
      // cover_picture:{
      //   type: String,
      //   match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,"use your logo"]
      // },

      // profile_picture:{
      //   type: String,
      //   match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,"use your logo"]
      // },
      
      // business_name: {
      //   type: String,
      // //   required: true, 
      //   trim: true,
      //   minlength: [3, "Organization name should be at least 3 characters long"],
      //   maxlength: [50, "Organization name should not exceed 50 characters"],
      //   match: [/^[a-zA-Z0-9\s]+$/,"only use alphaneumeric characters"]
      //   }, 

      //  website:{
      //   type: String,
      //   match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,"use your logo"]
      // },

      //   business_description:{
      //     type:String,
         
      //   },
      //   is_profile_updated:{
      //     type:String,
      //     // validate: {
      //     //   validator: validator.validateBoolean,
      //     //   message: 'Invalid profile_updated.',
      //     //   },
      //     default:false
      //   },
      //   authorization:
      //   {
      //     is_logged_in:
      //     {
      //       type:Boolean,
      //       // validate: {
      //       //   validator: validator.validateAuthorization,
      //       //   message: 'Invalid Authorization.',
      //       //   },
          
      //     },
      //       time_stamp:{
      //         type:String,
      //         // validate: {
      //         //   validator: validator.validateTimeStamp,
      //         //   message: 'Invalid value for time_stamp field. Please provide a valid timestamp.',
      //         //   },
      //       }
      //     }

         
         
});
module.exports = mongoose.model('Preference_',prference_schema);