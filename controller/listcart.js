const model =require('../model/listcart');

module.exports.lisṭcart = async (req, res) => {
    try {
        let { ct_id,userid } = req.body;
        let condition=''
        if (ct_id) {
            condition = `and ct_id='${ct_id}'`

        }
        let listcart = await model.listcartQuery(userid,condition);
        if (listcart.length > 0){
            return res.send({
                result: true,
                message: "data retrieved",
                list: listcart,

            });

    }else {
        return res.send({
            result: false,
            message: "data not found",
        });
    }

}catch (error) {
    return res.send({
        result: false,
        message: error.message,

    });
}
}
