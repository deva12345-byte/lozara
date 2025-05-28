const model = require('../model/deletecart')
module.exports.deletecart = async (req, res) => {
    try {
        let cart_id = req.body.cart_id;
        if (cart_id) {
            let checkcart = await model.checkcartQuery(cart_id);
            if (checkcart.length == 0) {
                return res.send({
                    result: false,
                    message: "Item not found in cart"

                });
            } else {
                var deletesection = await model.removecartQuery(cart_id);
                if (deletesection.affectedRows > 0) {
                    return res.send({
                        result: true,
                        messsage: "cart is deleted successfully"
                    });
                }else{
                   return res.send({
                        result: false,
                        messsage: "failed to delete cart"
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
