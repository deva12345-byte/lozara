var db = require('../db/db.js');
var util = require("util");
const query = util.promisify(db.query).bind(db);



module.exports.reviewaddQuery = async (product_id, comment, heading, rating, user_id) => {
    var Query = `insert into review(r_p_id,r_u_id, r_comment, r_heading,r_rating)values(?,?,?,?,?)`;
    var data = query(Query, [product_id, user_id, comment, heading, rating]);
    return data;

}

module.exports.AddReviewImagesQuery = async (review_id, imagepath) => {
    var Query = `insert into review_images (ri_review_id,ri_image)values(?,?)`;
    var data = query(Query, [review_id, imagepath]);
    return data;

}
module.exports.checkproductQuery = async (product_id) => {
    var Query = `select * from products WHERE p_id=?`;
    var data = query(Query, [product_id]);
    return data;
}
module.exports.checkuserQuery = async (user_id) => {
    var Query = `select * from users where u_id=?`;
    var data = query(Query, [user_id]);
    return data;
}

module.exports.getAllRatingsQuery = async (product_id) => {
    var Query = `select r_rating from review where r_p_id=?`;
    var data = query(Query, [product_id]);
    return data;
}

module.exports.updateProductRatingQuery = async (product_id, avgRating) => {
    var Query = `update products set p_rating=? WHERE p_id=?`;
    var data = query(Query, [avgRating, product_id]);
    return data;
}

module.exports.ListReviewsQuery = async (condition) => {
    var Query = `select r.*,u.u_name,u.u_image from review r
    LEFT JOIN users u ON r.r_u_id = u.u_id ${condition}`;
    var data = query(Query);
    return data;
}

module.exports.GetReviewImages = async (review_id) => {
    var Query = `select * from review_images  where ri_review_id=?`;
    var data = query(Query, [review_id]);
    return data;
}