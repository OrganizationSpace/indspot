
require('dotenv').config();
const Event_ = require('../schema/event')


const eventRateLimiter = async (req, res, next) => {
    try {
        const maxEvents = parseInt(process.env.MAX_EVENTS);
        const result = await Event_.aggregate([
            { $match: { workspace: req.workspace } },
            {  $count: "totalEvents"  }
        ]);

        if ( result.length > 0 &&result[0].totalEvents >= maxEvents) {
            return res.status(429).json({
                success: false,
                message: 'Workspace already has the maximum number of EVENTS (100)',
            });
        }

        next();
    } catch (error) {
        console.error(error);
        next(error); 
    }
};
module.exports =eventRateLimiter
