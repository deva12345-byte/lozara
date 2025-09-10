const model = require('../model/listcart');

module.exports.lisṭcart = async (req, res) => {
    try {
        let { userid } = req.body;

        let listcart = await model.listcartQuery(userid);

        if (listcart.length > 0) {

            let data = await Promise.all(
                listcart.map(async (el) => {
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
                list: data,

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
