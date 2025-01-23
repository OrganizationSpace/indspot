// const axios = require('axios')

// const errorHandler = async (err, req, res, next) => {
// 	const errorData = {
// 		title: err.message,
// 		description: err.stack,
// 		service: 'indspot',
// 	}

// 	try {
// 		// Await the response from the API
// 		const apiResponse = await axios.post(
// 			'https://indesk.api.mindvisiontechnologies.com/ticket/create/server',
// 			errorData
// 		)
// 		console.log('Error reported:', apiResponse.data)
// 	} catch (apiError) {
// 		// Catch any errors that occur during the API call
// 		console.error('API error:', apiError)
// 	}

// 	// Send a response to the client
// 	res.status(500).send('An internal server error occurred')
// }

// module.exports = errorHandler
const axios = require('axios')

const errorHandler = async (err, req, res, next) => {
    if (axios.isAxiosError(err)) {
        // Extract the status code from the Axios error response or use a default
        const statusCode = err.response ? err.response.status : 502 // Default to 502 Bad Gateway
        const errorMessage =
            err.response && err.response.data
                ? err.response.data.message
                : 'An error occurred in the external service'

        const errorSuccess =
                err.response && err.response.data
                    ? err.response.data.success
                    : 'An error occurred in the external service'
                    
        const errorData =
                    err.response && err.response.data
                        ? err.response.data.data
                        : 'An error occurred in the external service'

        // Return the response with the extracted status code and error message
        return res.status(statusCode).json({success:errorSuccess, message: errorMessage,data:errorData });
    } else {
        const errorData = {
            title: err.message,
            description: err.stack,
            service: 'ACCOUNT CENTER',
        }

        try {
            // Await the response from the API
            const apiResponse = await axios.post(
                'https://indesk.api.mindvisiontechnologies.com/ticket/create/server',
                errorData
            )
            res
                .status(err.statusCode || 500)
                .send('An internal server error occurred')
            //console.log('Error reported:', apiResponse.data)
        } catch (apiError) {
            // Catch any errors that occur during the API call
            console.error('API error:', apiError)
        }
    }

    // Send a response to the client
}

module.exports = errorHandler