require('dotenv').config()
const multer = require('multer')
const multers3 = require('multer-s3')
const { S3Client } = require('@aws-sdk/client-s3')
const path = require('path')

const s3 = new S3Client({
	endpoint: process.env.S3_ENDPOINT,
	region: process.env.S3_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
})

const upload = multer({
	storage:multers3({
		s3,
		bucket: process.env.BUCKET_NAME,
		contentType: multers3.AUTO_CONTENT_TYPE,
		acl: 'public-read',
		metadata: (req, file, cb) => {
			cb(null, {
				fieldname: file.fieldname,
			})
		},
		key: (req, file, cb) => {
			cb(null, file.originalname)
		},
	}),
	fileFilter: function (req, file, callback) {
		try{
		var ext = path.extname(file.originalname)
		if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
			return callback(new Error('Only images are allowed'))
		}
		callback(null, true)
	} catch (error) {
		callback(error);
	}}
	// limits: {
	// 	fileSize: 1024 * 1024,
	// },
}).single('file')

module.exports = upload
