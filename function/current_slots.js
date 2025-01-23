const moment = require('moment');

async function filterSlots(slots) {
    const now = moment(); // Current date and time
    const currentDate = now.format('YYYY-MM-DD'); // Current date

    const combinedSlots = [];

    for (const slot of slots) {
        const slotDate = moment(slot.date).format('YYYY-MM-DD');
        const slotStartTime = moment(slot.start_time, 'hh:mm A');

        if (slotDate === currentDate && now.isBefore(slotStartTime)) {
            combinedSlots.push(slot);
        } else if (slotDate !== currentDate) {
            combinedSlots.push(slot);
        }
    }

    console.log('Filtered Slots:');
   // console.log(combinedSlots);

    return combinedSlots;
}

module.exports = filterSlots;
