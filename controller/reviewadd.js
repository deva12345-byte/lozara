var model = require("../model/reviewadd");
var formidable = require('formidable')
var fs = require('fs')

module.exports.reviewadd = async (req, res) => {
    try {
        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "file upload failed!",
                    data: err,
                });

            }
            let { product_id, comment, heading, rating, user_id } = fields;

            if (!product_id || !comment || !heading || !rating || !user_id) {
                return res.send({
                    result: false,
                    message: "All fields are required"
                });
            }

            if (rating < 0 || rating > 5) {
                return res.send({
                    result: false,
                    message: "Rating should be between 0 and 5"
                })
            }


            let checkproduct = await model.checkproductQuery(product_id);
            if (checkproduct.length == 0) {
                return res.send({
                    result: false,
                    message: "product not found"
                });
            }

            // Add review
            let reviewadd = await model.reviewaddQuery(product_id, comment, heading, rating, user_id);

            if (reviewadd.affectedRows > 0) {
                let review_id = reviewadd.insertId
                if (Array.isArray(files.image)) {

                    for (const file of files.image) {
                        var oldPath = file.filepath;
                        var newPath = process.cwd() + "/uploads/review_image/" + file.originalFilename;
                        let rawData = fs.readFileSync(oldPath);
                        fs.writeFileSync(newPath, rawData);
                        var imagepath = ("/uploads/review_image/" + file.originalFilename);
                        var Insertreviewimages = await model.AddReviewImagesQuery(review_id, imagepath)
                        if (Insertreviewimages.affectedRows == 0) {
                            return res.send({
                                result: false,
                                message: "failed to add review image"
                            })
                        }

                    }
                }

                let ratings = await model.getAllRatingsQuery(product_id);

                if (ratings.length > 0) {
                    let totalRating = ratings.reduce((acc, cur) => acc + cur.r_rating, 0);

                    let avgRating = (totalRating / ratings.length).toFixed(1);

                    await model.updateProductRatingQuery(product_id, avgRating);
                }

                return res.send({
                    result: true,
                    message: "review and rating added successfully"
                });
            } else {
                return res.send({
                    result: false,
                    message: "failed to add review"
                });
            }
        })
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        });
    }
};



module.exports.ListReviews = async (req, res) => {
    try {
        let { u_id, p_id } = req.body

        let condition = ''

        if (p_id) {
            condition = `where r.r_p_id='${p_id} '`
        }
        if (p_id && u_id) {
            condition = `where r.r_p_id='${p_id}' and r.r_u_id = '${u_id}' `
        }

        let Reviewslist = await model.ListReviewsQuery(condition);

        if (Reviewslist.length > 0) {

            let data = await Promise.all(
                Reviewslist.map(async (el) => {
                    let review_id = el.r_id
                    let getreviewimages = await model.GetReviewImages(review_id)
                    el.reviewimages = getreviewimages
                    return el
                })
            )
            return res.send({
                result: true,
                message: "Data retrived",
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