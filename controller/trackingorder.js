const model = require('../model/trackingorder');

module.exports.Trackorder = async (req, res) => {
    try {
        let { od_id, status } = req.body || {};

        // Validate required fields
        if (!od_id || !status) {
            return res.send({
                result: false,
                message: "Missing order ID or status",
            });
        }

        // Allowed status values
        const allowedStatuses = ['Pending', 'Cash on Delivery', 'Out for Delivery', 'Delivered', 'Cancelled'];

        if (!allowedStatuses.includes(status)) {
            return res.send({
                result: false,
                message: "Invalid status value",
            });
        }

        // Check if order exists
        let Checkorder = await model.CheckorderQuery(od_id);
        if (Checkorder.length > 0) {
            let Trackorder = await model.TrackorderQuery(status, od_id);
            if (Trackorder.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "Successfully updated delivery status",
                });
            } else {
                return res.send({
                    result: false,
                    message: "Failed to update delivery status",
                });
            }
        } else {
            return res.send({
                result: false,
                message: "Order not found",
            });
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }
};
