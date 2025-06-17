var model = require("../model/deliverTime");

module.exports.AddDeliveryTime = async (req, res) => {

    try {
        let { pincode,duration } = req.body

        if (!pincode || !duration) {
            return res.send({
                result: false,
                message: "Pincode and Duartiom is required"
            });
        }

        let addDeliveryTime = await model.AddDeliveryTimeQuery(pincode,duration);

        if (addDeliveryTime.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Delivery Time added successfully"
            })


        }
        else {
            return res.send({
                result: failed,
                message: "DeliveryTime added failed"
            })
        }

    } catch (error) {
        console.log(error);
        return res.send({
            result: false,
            message: error.message,
        });
    }

}



module.exports.ListDeliveryTime = async (req, res) => {
    try {

        let listDeliveryTime = await model.ListDeliveryTimeQuerry();

        if (listDeliveryTime.length > 0) {
            return res.send({
                result: true,
                message: "data retrieved",
                list: listDeliveryTime,

            });

        } else {
            return res.send({
                result: false,
                message: "data not found",
            });

        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message,

        });
    }
}

module.exports.deleteDeliveryTime = async (req, res) => {
    try {
        let dt_id = req.body.dt_id;
        if (dt_id) {
            let checkDeliveryTime = await model.checkDeliveryTimeQuery(dt_id);
            if (checkDeliveryTime.length == 0) {
                return res.send({
                    result: false,
                    message: "Delivery Time not found"
                });
            } else {
                var deletesection = await model.RemoveDeliveryTimeQuery(dt_id);
                if (deletesection.affectedRows > 0) {
                    return res.send({
                        result: true,
                        message: "Delivery Time deleted successfully"
                    });

                }
            }
        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message,

        });
    }
}



module.exports.CheckDeliveryTime = async (req, res) => {
    try {

        const { pincode } = req.body;

        if (!pincode) {
            return res.send({
                result: false,
                message: 'pincode is required',
            });
        }

        const DeliveryTimeExists = await model.checkDeliveryDurationQuery(pincode);
        if (DeliveryTimeExists.length === 0) {
            return res.send({
                result: true,
                message: 'no accurate pincode data found',
                data:'4-5'
            });
        } else {

            return res.send({
            result: true,
            message: 'data retrived',
            data:DeliveryTimeExists
        });
        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }

}




