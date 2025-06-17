const model = require('../model/listorder');
module.exports.listorder = async (req, res) => {
    try {
        let { u_id } = req.body || {}
        let checkuser = await model.Checkuser(u_id)

        var condition = ''

        if (checkuser.u_role == 'user') {
            condition = `where od_u_id='${u_id}'`
        }

        let listorder = await model.listorderQuery(condition);

        if (listorder.length > 0) {
            return res.send({
                result: true,
                message: "data retrieved",
                list: listorder,

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


module.exports.Vieworder = async (req, res) => {
    try {
        let { od_id } = req.body || {}
        let checkorder = await model.CheckOrder(od_id)
        if (checkorder.length == 0) {
            return res.send({
                result: true,
                message: "Order not found",

            });
        }
        let vieworder = await model.listorderproductQuery(od_id);
        if (vieworder.length > 0) {
            return res.send({
                result: true,
                message: "data retrieved",
                list: vieworder,

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