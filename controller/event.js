const axios = require("axios");
const moment = require('moment');
const Event_ = require("../schema/event");
const Slot_ = require("../schema/slot");
class Event {
  async create({
    workspace,
    eid,
    event_name,
    start_date,
    end_date,
    start_time,
    end_time,
    slot_duration,
    questions,
    slot_interval,
    holidays,
    session
  }) {
    try {
      const result = await Event_({
        _id: eid,
        workspace: workspace,
        event_name: event_name,
        start_date: start_date,
        end_date: end_date,
        start_time: start_time,
        end_time: end_time,
        slot_duration: slot_duration,
        questions: questions,
        slot_interval: slot_interval,

        holidays: holidays || [],
      }).save({ session });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async saveSlots(convertedSlots, session) {
    try {
      const result = await Slot_.insertMany(convertedSlots, { session: session });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async fetch({ workspace, page, query }) {
    try {
      const limit = 5;
      var criteria = { workspace }
      if (query) {
        const eventNameRegex = new RegExp(query, 'i')
        criteria.event_name = eventNameRegex

      }

      const result = await Event_.find(
        criteria,

      )
        .sort({ created_at: -1 })
        .skip(page * limit)
        .limit(limit);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async fetchSlot({ workspace, eid }) {
    try {
      const result = await Slot_.find(
        {
          workspace: workspace,
          eid: eid
        }
        //{slots:0}
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async fetchEvent({  eid }) {
    try {
      const result = await Event_.findOne(
        {
          _id: eid
        }
        //{slots:0}
      ).lean();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async fetchCurrentSlot({ workspace, eid }) {
    try {
      const currentDate = new Date();
      const date = currentDate.toISOString().split('T')[0] + "T00:00:00.000Z";

     // console.log("date", date);

      const currentTime = moment().format('hh:mm A');;

     // console.log("current time", currentTime);

      const endOfDay = moment().endOf('day').format('hh:mm A');
     // console.log("end of day", endOfDay);

      const result = await Slot_.find({
        workspace: workspace,
        eid: eid,
        status: 'BOOKED',
        date: {$gte:date},  
        
      }).lean();
      return result;
    } catch (error) {
      throw error;
    }
  }

  // async  fetchCurrentSlot({ workspace, eid }) {
  //   try {
  //     const currentDate = new Date();
  //     const formattedDate = new Date(currentDate).toISOString().split('T')[0] + "T00:00:00.000Z";
  //     const currentTime = moment().format('hh:mm A');
  //     const endOfDay = moment().endOf('day').format('hh:mm A');
      
      
  //     // Query for slots within today's time range
  //     const todaySlots = await Slot_.find({
  //       workspace: workspace,
  //       eid: eid,
  //       status: 'BOOKED',
  //       date: formattedDate,
  //     }).lean();
     
  //     const futureSlots = await Slot_.find({
  //       workspace: workspace,
  //       eid: eid,
  //       status: 'BOOKED',
  //       date: { $gt: formattedDate }
  //     }).lean();

  //     const result = [];
  //     const now = moment(currentTime, 'hh:mm A');
  //     //const now = '01:00 PM'
      
  //     for (const slot of todaySlots) {
  //       const slotDate = moment(slot.date).format('YYYY-MM-DD');
  //       if (moment(currentDate).format('YYYY-MM-DD') === slotDate) {
  //         const slotTime = moment(slot.start_time, 'hh:mm A');
  //         if (now.isBefore(slotTime)) {
  //           console.log(slot.start_time); // Optional: Log the start time
  //           result.push(slot);
  //         }
  //       }
  //     }
    
  //   result.push(...futureSlots);
  //     return result;
  //   } catch (error) {
  //     console.error("Error fetching current slot:", error);
  //     throw error;
  //   }
  // }
  

  async cancel({ workspace, id }) {
    try {
      const result = await Event_.findOneAndUpdate(
        {
          workspace: workspace,
          _id: id,
        },
        {
          $set: {
            event_status: "EVENT_CANCELLED",
          },
        },
        { new: true }
      );

      await Slot_.updateMany(
        {
          workspace: workspace,
          eid: id,
        },
        {
          $set: {
            status: "EVENT_CANCELLED",
          },
        }
      );



      // Return the cancelled event along with email and status
      return result
    } catch (error) {
      throw error;
    }
  }

  async listSlots({ eid }) {
    try {
      const result = await Slot_.find(
        {

          eid: eid
        }
        //{slots:0}
      );
      return result;
    } catch (error) {
      throw error;
    }
  }


  async delete({ workspace, id }) {
    try {
      const result = await Event_.deleteOne({
        workspace: workspace,
        _id: id,
      })
      await Slot_.deleteMany({
        workspace: workspace,
        eid: id,
      })
    //  console.log("result", result);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = Event;