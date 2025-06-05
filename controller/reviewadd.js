var model = require("../model/reviewadd");

module.exports.reviewadd = async (req, res) => {
    try {
        let { product_id, comment, heading, rating,user_id } = req.body
        if (!product_id || !comment || !heading || !rating||!user_id) {
            return res.send({
                result: false,
                messsage: "insufficent parameter"

            });

        }

        let checkuser = await model.checkuserQuery(user_id);
        if (checkuser.length == 0) {
            return res.send({
                result: false,
                message: "user not found"
            })
        }

        let checkproduct = await model.checkproductQuery(product_id);
        if (checkproduct.length == 0) {
            return res.send({
                result: false,
                message: "product not found"
            })

        } else {
            reviewadd = await model.reviewaddQuery(product_id, comment, heading,user_id, rating);

            if (reviewadd.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "review added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    messsage: "Failed to add review"

                })
            }


        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }


}