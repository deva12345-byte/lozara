var model = require('../model/listfavourite')

module.exports.FavList = async (req, res) => {
    try {

        let { user_id } = req.body
        if (!user_id) {
            return res.send({
                result: false,
                message: "insucefficent parameter"
            })
        }
        let data = await model.CheckProduct(user_id)
        if (data.length > 0) {
            return res.send({
                result: true,
                message: "data retrieved",
                data: data
            })
        } else {
            return res.send({
                result: false,
                message: "no favorites found"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}