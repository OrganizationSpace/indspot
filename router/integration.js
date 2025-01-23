const express = require('express')
const authorization = require('../function/auth')
const Integration = require('../controller/integration')
const integration = new Integration()
const router = express.Router()
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.post('/list', authorization, async (req, res) => {
	const token = req.headers.authorization
	try {
		const integrationneed_list = await integration.listIntegrationNeed({
			token,
		})

		res.status(200).json(integrationneed_list.data)
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post('/activation', authorization, async (req, res) => {
	const token = req.headers.authorization
	try {
		const { activation, code } = req.body
		const result = await integration.status({
			token,activation,code,
		})
		res.status(200).json( result.data)
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post('/active/list', authorization, async (req, res) => {
	try {
		const active_integrations = await integration.listActiveIntegration({
			workspace: req.workspace,
		})

		res.status(200).json({ data: active_integrations })
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

module.exports=router