const express = require('express')
const authorization = require('../function/auth')
const Environment = require('../controller/environment')
const environment = new Environment()
const router = express.Router()
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.post('/mail/send', async (req, res, next) => {
	try {
		const email = req.body.email
        const subject ='otp verification code'
		const send_mail = await environment.mail({ email,subject})
		res.status(200).json({
			success: send_mail.data.success,
			message: send_mail.data.message,
			data: send_mail.data.data,
		})
	} catch (error) {
		// console.error(error)
		// res.status(500).json({ error: 'Internal Server Error' })
		next(error)
	}
})

router.post('/otp/verify', async (req, res, next) => {
	try {
		const email = req.body.email
        const otp_code =req.body.otp
		const verify_otp = await environment.verifyOTP({ email,otp_code})
		res.status(200).json({
			success: verify_otp.data.success,
			message: verify_otp.data.message,
		})
	} catch (error) {
		// console.error(error)
		// res.status(500).json({ error: 'Internal Server Error' })
		next(error)
	}
})

module.exports=router