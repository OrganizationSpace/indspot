require('dotenv').config()

const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3')

// Initialize the S3 client with your configuration
const s3 = new S3Client({
	endpoint: process.env.S3_ENDPOINT,
	region: process.env.S3_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
})

// Function to delete a file from an S3 bucket
async function deleteFile(objectKey) {
	try {
		// Create a DeleteObjectCommand to delete the specified object
		const deleteObjectCommand = new DeleteObjectCommand({
			Bucket: process.env.BUCKET_NAME,
			Key: objectKey,
		})

		// Execute the command to delete the object
		await s3.send(deleteObjectCommand)
		return true

		//console.log(`File '${objectKey}' deleted successfully`)
	} catch (error) {
		console.error(`Error deleting file '${objectKey}':`, error)
		return false
	}
}

// Export the deleteFile function so it can be used in other modules
module.exports = deleteFile
