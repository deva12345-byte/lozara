const model = require('../model/deleteorder.js')

module.exports.deleteorder = async (req, res) => {
    try {
        let od_id= req.body.od_id;
        if (od_id) {
            let checkorder = await model.checkorderQuery(od_id);
            if (checkorder.length == 0) {
                return res.send({
                    result: false,
                    message: "order details not found"

                });

            } else {
                var deletesection = await model.removeorderQuery(od_id);
              console.log(deletesection,"gg");
              
                if (deletesection.affectedRows > 0) {
                    return res.send({
                        result: true,
                        messsage: "order deleted sucessfully"
                    });

                } else {
                    return res.send({
                        result: false,
                        message: "failed to delete from order"
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
