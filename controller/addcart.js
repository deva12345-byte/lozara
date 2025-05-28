const model = require('../model/addcart');


module.exports.addcart = async (req, res) => {
    try {
        let { userid, productid,quantity} = req.body

        

        if (!userid || !productid) {
            return res.send({
                result: false,
                message: "insufficent parameter"
            });
        }
        let checkcart = await model.checkcartQuery(userid, productid)
        console.log(checkcart);
        if (checkcart.length == 0) {
            addtocart = await model.addcartQuery(userid, productid,quantity);
            if (addtocart.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "product added to cart"

                })
            } else {
                return res.send({
                    result: false,
                    message: "failed to add product to cart"

                })
            }
        } else {
            return res.send({
                result: false,
                messsage: "product already added to cart"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}



