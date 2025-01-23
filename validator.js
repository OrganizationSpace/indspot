const moment = require('moment')

const validator = {

    validateAuthorization : (authorization) => {
        if (typeof authorization !== 'object' || !authorization.last_login || !(authorization.last_login instanceof Date)) {
          return false;
        }
        return true;
      },
      
    validateName: (value) => {
      if (!/^[A-Za-z]+$/.test(value)) {
        return false;
      }
      return true;
    },
    validateEmail: (email) => {
      if (!/[_a-z0-9-]+(\.[_a-z0-9-]+)*(\+[a-z0-9-]+)?@[a-z0-9-]+(\.[a-z0-9-]+)*$/.test(email)) {
        return false;
      }
      return true;
    },
    validatePassword: (password) => {
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        return false;
      }
      return true;
    },
    validateMobile : (mobile) => {
        if (typeof mobile !== 'string' || mobile.length < 9 || mobile.length > 12) {
          return false;
        }
        return true;
      },
    validateBoolean: (boolean) => {
      if (typeof is_new !== 'boolean') {
        return false;
      }
      return true;
    },
    validateUrl: (url) => {
      if (! /^(ftp|http|https):\/\/[^ "]+$/.test(url)) {
        return false;
      }
      return true;
    },
     validateTitle : (title) => {
        if (!/^[a-zA-Z0-9@ ]{1,30}$/.test(title)) {
          return false;
        }
        return true;
      },
    // Template_Schema validator
    validateTemplate: (text) => {
      if (!/^(?!.*\s$)[a-zA-Z0-9@ ]{1,30}$/.test(text)) {
        return false;
      }
      return true;
    },
    validateDate(value) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateRegex.test(value)) {
          const [year, month, day] = value.split('-');
          const timestamp = moment(`${year}-${month}-${day}`).unix();
          return timestamp; // Convert the valid date to a timestamp
        }
        return false; // Return false for invalid dates
      },
    //   validateTimeam(value) {
    //     const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    //     if (timeRegex.test(value)) {
    //       const [hours, minutes] = value.split(':');
    //       const timestamp = moment().add(hours, 'hours').add(minutes, 'minutes').unix();
    //       return timestamp; // Convert the valid time to a timestamp
    //     }
    //     return false; // Return false for invalid times
    //   },
      ValidateTime(value) {
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
        if (timeRegex.test(value)) {
          const [time, indicator] = value.split(' ');
          const [hours, minutes] = time.split(':');
          let militaryHours = parseInt(hours, 10);
          if (indicator.toUpperCase() === 'PM' && militaryHours < 12) {
            militaryHours += 12;
          } else if (indicator.toUpperCase() === 'AM' && militaryHours === 12) {
            militaryHours = 0;
          }
          const timestamp = moment().startOf('day').add(militaryHours, 'hours').add(minutes, 'minutes').unix();
          return timestamp; // Convert the valid time to a timestamp
        }
        return false; // Return false for invalid times
      },
    validateText: (text) => {
      if (!/^[\w\s]{1,512}$/.test(text)) {
        return false;
      }
      return true;
    },
    validateText_coordinator: (text) => {
      if (!/^[1-5](\.\d+)?$/.test(text)) {
        return false;
      }
      return true;
    },
    validateText_rgb: (rgb) => {
      return rgb >= 1 && rgb <= 3;
    },
  
    validateTextFont: (font) => {
     
      return typeof font === 'string' && font.trim().length > 0;
    },
  
    validateText_Size: (size) => {
      return size >= 1 && size <= 3;
    },
     validateLabels : (labels) => {
        const minLength = 1;
        const maxLength = 20;
        const allowedCharacters = /^[a-zA-Z0-9@ ]+$/;
      
        if (typeof labels !== 'string' || labels.length < minLength || labels.length > maxLength || !allowedCharacters.test(labels)) {
          return false;
        }
      
        return true;
      },
      validateCreatedAt : (createdAt) => {
        if (!(createdAt instanceof Date)) {
          return false;
        }
        return true;
      },
      validateSameTypeid:(value)=> {
        if (typeof value !== 'string') {
          return false;
        }
        return true;
      },
      validateDescription: (value) => {
        if (!/^[\s\S]{10,1024}$/.test(value)) {
          return false;
        }
        return true;
      },
      validateIsAvailable(value) {
        return value === 'yes' || value === 'no';
      },
      validateTicketStatus(value) {
        const allowedStatuses = ['CANCELLED_BY_HOST', 'CANCELLED_BY_USER', 'BOOKED', 'EVENT_CANCELLED', 'ARCHIVED', 'AVAILABLE'];
        if (!allowedStatuses.includes(value)) {
          return false;
        }
        return true;
      },
      validateTimeStamp: (value) => {
        if (!/^\d{10}$/.test(value)) {
          return false;
        }
        return true;
      },
      
  };
  
  module.exports = validator;