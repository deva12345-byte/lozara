var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);



module.exports.listcartQuery = async (userid) => {
    var Query = `SELECT 
  ct.*, 
  p.*
FROM cart ct 
INNER JOIN products p ON ct.ct_product_id = p.p_id 
WHERE ct.ct_user_id = ? `;
    var data = await query(Query, [userid]);
    return data;
}



module.exports.Getproductprice = async (product_id) => {
    var Query = `select * from product_prize where pp_p_id =?;`
    var data = query(Query, [product_id]);
    return data;
}

module.exports.GetIngredients = async (product_id) => {
    var Query = `select * from product_ingredients where pin_product_id =?;`
    var data = query(Query, [product_id]);
    return data;
}

module.exports.Getproductimages = async (product_id) => {
    var Query = `select * from product_images where pi_product_id =?;`
    var data = query(Query, [product_id]);
    return data;
}
module.exports.GetReviewCount = async (p_id) => {
    var Query = `SELECT COUNT(*) AS review_count FROM review WHERE r_p_id  = ?`;
    var data = await query(Query, [p_id]);
    return data;
}

module.exports.GetReview = async (p_id) => {
    var Query = `SELECT * FROM review WHERE r_p_id  = ?`;
    var data = await query(Query, [p_id]);
    return data;
}

module.exports.GetReviewImage = async (review_id) => {
    var Query = `select * from review_images where ri_review_id =?;`
    var data = query(Query, [review_id]);
    return data;
}