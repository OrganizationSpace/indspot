const axios = require('axios')
class Environment{


	async mail({ email,subject }) {
		try {
			
			const result = await axios.post(
                'https://api.mindvisiontechnologies.com/mail/send',
				{   
                    to:email,
                    subject:subject,
                }
			)
			return result
		} catch (error) {
			throw error
		}
	}

	async verifyOTP({ email,otp_code }) {
		try {
			
			const result = await axios.post(
                'https://api.mindvisiontechnologies.com/otp/verify',
				{   
                    email:email,
                    otp_code:otp_code,
                }
			)
			return result
		} catch (error) {
			throw error
		}
	}
}
module.exports=Environment