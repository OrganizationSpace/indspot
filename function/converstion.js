function converter(inputJson, workspace, eid, event_name, free_slots) {
	try{
	const outputJson = []

	inputJson.forEach((day) => {
		day.slots.forEach((slot) => {
			outputJson.push({
				date: day.date.toISOString(),
				eid: eid,
				event_name: event_name,
				workspace: workspace,
				uid: null,
				start_time: slot.start_time,
				end_time: slot.end_time,
				attachment: null,
				// status: free_slots.includes(slot.start_time) ? 'FREE' : 'AVAILABLE',
				// is_available: free_slots.includes(slot.start_time) ? false : true,
				status: (free_slots && free_slots.includes(slot.start_time)) ? 'FREE' : 'AVAILABLE',
				is_available: (free_slots && free_slots.includes(slot.start_time)) ? false : true,
			})
		})
	})

	return outputJson
} catch (error) {
	throw error
}
}

function deconverter(inputJson) {
	try{
	const outputJson = []
	const groupedData = inputJson.reduce((acc, item) => {
		// Group the input data by date
		if (!acc[item.date]) {
			acc[item.date] = []
		}
		acc[item.date].push(item)
		return acc
	}, {})
	// console.log('==================================')
	// console.log('groupedDate', groupedData)
	// console.log('+====================================+')
	for (const date in groupedData) {
		const slots = groupedData[date].map((slot) => ({
			workspace: slot.workspace,
			uid: slot.uid,
			sid: slot._id,
			event_name: slot.event_name,
			date: slot.date, // Assuming slot.date exists
			slot_interval: slot.slot_interval,
			email: slot.email,
			description: slot.description,
			start_time: slot.start_time,
			end_time: slot.end_time,
			attachment: slot.attachment,
			status: slot.status,
			available: slot.available,
			answers: slot.answers,
			is_available: slot.is_available,
			is_archive: slot.is_archive,
		}))

		// console.log('+====================================+')
		// console.log('slot', slots)
		outputJson.push({
			date: date, // Accessing date from the loop variable
			slots: slots,
		})
	}
	//console.log('+====================================+')
	return outputJson
} catch (error) {
	throw error
}
}

// // Your function to transform the input JSON to the desired output JSON format
// function deconverter(inputJson) {
//     const outputJson = [];
//     const groupedData = inputJson.reduce((acc, item) => {    // Group the input data by date
//         if (!acc[item.date]) {
//             acc[item.date] = [];
//         }
//         acc[item.date].push(item);
//         return acc;
//     }, {});
// console.log("Group",groupedData);
//     for (const date in groupedData) {                     // Convert the grouped data to the desired output format
//         const slots = groupedData[date].map(slot => ({
//             "workspace":slot.workspace,
//             "uid": slot.uid,
//             "sid":slot._id,
//             "event_name":slot.event_name,
//             "date":slot.date,
//             "slot_interval":slot.slot_interval,
//             "email":slot.email,
//             "description":slot.description,
//             "start_time": slot.start_time,
//             "end_time": slot.end_time,
//             "attachment": slot.attachment,
//             "status": slot.status,
//             "available": slot.available,
//             "answers":slot.answers,
//             "is_available":slot.is_available,
//             "is_archive":slot.is_archive,
//         }));

//         console.log("+====================================+");
// console.log("slot",slots);
//         outputJson.push({
//             "date":slots.date,
//             "slots": slots
//         });
//     }
//     console.log("+====================================+");
//     return outputJson;
// }

module.exports = { converter, deconverter }
