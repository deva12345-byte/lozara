var model = require('../model/listfavourite')

module.exports.FavList = async (req, res) => {
    try {

        let { user_id } = req.body
        if (!user_id) {
            return res.send({
                result: false,
                message: "user id is required"
            })
        }
        let checkproduct = await model.CheckProduct(user_id)
        if (checkproduct.length > 0) {

            let data = await Promise.all(
                checkproduct.map(async (el) => {
                    let getproductprice = await model.Getproductprice(el.p_id);
                    let getingredients = await model.GetIngredients(el.p_id);
                    let getproductimage = await model.Getproductimages(el.p_id);
                    let getreviewcount = await model.GetReviewCount(el.p_id);
                    let getreview = await model.GetReview(el.p_id);

                    let reviewdata = await Promise.all(
                        getreview.map(async (elem) => {
                            let reviewimages = await model.GetReviewImage(elem.r_id)
                            elem.reviewimages = reviewimages
                            return elem
                        })
                    )

                    el.reviewcount = getreviewcount[0]?.review_count;
                    el.product_price = getproductprice
                    el.ingredients = getingredients;
                    el.productimage = getproductimage;
                    el.reviews = reviewdata;

                    return el;
                })
            );

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