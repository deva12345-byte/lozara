const model =require('../model/listcart');

module.exports.lisṭcart = async (req, res) => {
    try {
        let { userid } = req.body;

        let listcart = await model.listcartQuery(userid);
        
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
