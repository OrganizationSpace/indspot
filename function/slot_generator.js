const date = require('date-and-time')

function slots({
    start_date, //     '2022-11-22'                 STRING (YYYY-MM-DD)
    end_date, //       '2022-11-30'                 STRING (YYYY-MM-DD)
    start_time, //     '11:00:00'                   STRING (HH:MM:SS)
    end_time, //       '13:00:00'                   STRING (HH:MM:SS)
    duration,
    interval, //          10                          INT    (minutes)
    holidays, // .     ['Saturday', 'Sunday']       ARRAY
}) {
    try{
    const _start_date = new Date(start_date)
    const _end_date = new Date(end_date)
    var current_date = _start_date

    var st = new Date(`${start_date}T${start_time}`)
    var et = new Date(`${start_date}T${end_time}`)
    var ct = st

    var allSlots = []

    while (current_date <= _end_date) {
        if (holidays.includes(date.format(current_date, 'dddd'))) {
            current_date = date.addDays(current_date, 1)
            continue
        }
        var slots = slotGeneratorByIntervals(st, et, duration, interval)

        //var formatedDate = date.format(current_date, 'DD-MM-YYYY')
        var json = { date: current_date, slots: slots }

        allSlots.push(json)

        current_date = date.addDays(current_date, 1)

        st = date.addDays(st, 1)
        et = date.addDays(et, 1)
    }
   // console.log(allSlots)
    return allSlots
} catch (error) {
	throw error
}
}

function slotGeneratorBySlots(start_time, end_time, no_of_slots) {
    try{
    const start = new Date(start_time)
    const end = new Date(end_time)
    var interval_in_minutes = (end - start) / 1000
    interval_in_minutes /= 60
    interval_in_minutes /= no_of_slots
    var result = slotGeneratorByIntervals(
        start_time,
        end_time,
        interval_in_minutes
    )
    return result
} catch (error) {
	throw error
}
}

function slotGeneratorByIntervals(
    start_time,
    end_time,
    interval_in_minutes,
    excuse
) {
    try{
    const start = new Date(start_time)
    const end = new Date(end_time)
    const intervals = interval_in_minutes

    var current = start
    var slots = []

    while (current < end) {
        var last = current
        current = date.addMinutes(current, intervals)

        var slot = {
            uid: null,
            start_time: date.format(last, 'hh:mm A'),
            end_time: date.format(current, 'hh:mm A'),
            attachment: null,
            status: null,
            available: true,
        }

        current = date.addMinutes(current, excuse)
        if (current > end) {
            break
        }
        slots.push(slot)
    }
    return slots
} catch (error) {
	throw error
}
}
module.exports = { slotGeneratorByIntervals, slotGeneratorBySlots, slots }