const model = require('../model/trackingorder');

module.exports.Trackorder = async (req, res) => {
    try {
        let { op_id, status } = req.body || {};

        // Validate required fields
        if (!op_id || !status) {
            return res.send({
                result: false,
                message: "Missing order ID or status",
            });
        }

        // Allowed status values
        const allowedStatuses = ['Order confirmed','Packing','Shipped','Out for Delivery','delivered','Cancelled'];

        if (!allowedStatuses.includes(status)) {
            return res.send({
                result: false,
                message: "Invalid status value",
            });
        }

        // Check if order exists
        let Checkorder = await model.CheckorderproductQuery(op_id);
        if (Checkorder.length > 0) {
            let Trackorder = await model.TrackorderQuery(status, op_id);
            if (Trackorder.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "Successfully updated product delivery status",
                });
            } else {
                return res.send({
                    result: false,
                    message: "Failed to update product delivery status",
                });
            }
        } else {
            return res.send({
                result: false,
                message: "product Order not found",
            });
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }
};
