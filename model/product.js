var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.SelectImage = async () => {
    var Query = `select * from products;`
    var data = query(Query);
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

module.exports.GetReviewImage = async (review_id) => {
    var Query = `select * from review_images where ri_review_id =?;`
    var data = query(Query, [review_id]);
    return data;
}

module.exports.GetTopseller = async () => {
    var Query = `SELECT 
    op_product_id
FROM 
    order_product
GROUP BY 
    op_product_id
ORDER BY 
    COUNT(*) DESC
`
    var data = query(Query);
    return data;
}

module.exports.AddproductQuery = async (productname, category, concern_category,
    description, material_content,
    how_it_works, how_to_use, suitable_for, stock, p_upcoming) => {

    var Query = `insert into products (P_productname,p_category,p_concern_category,p_description, p_material_content,
                p_how_it_works, p_how_to_use, p_suitable_for,p_stocks,p_upcoming) values (?,?,?,?,?,?,?,?,?,?);`

    var data = await query(Query, [productname, category, concern_category,
        description, material_content,
        how_it_works, how_to_use, suitable_for, stock, p_upcoming]);

    return data;
}

module.exports.AddpriceQuery = async (price,discount_prize,discount,packet_size,product_id) => {
    var Query = `insert into product_prize (pp_p_id,pp_packet_size,pp_prize,pp_discount_prize,pp_discount) values (?,?,?,?,?)`
    var data = query(Query, [product_id,packet_size,price,discount_prize,discount]);
    return data;
}

module.exports.AddProductImageQuery = async (product_id, imagePath) => {
    var Query = `insert into product_images (pi_product_id,pi_image) values (?,?)`
    var data = query(Query, [product_id, imagePath]);
    return data;
}

module.exports.AddProductIngeridientsQuery = async (product_id, name, description, imagePath) => {
    var Query = `insert into product_ingredients (pin_product_id,pin_name,pin_description,pin_image) values (?,?,?,?)`
    var data = query(Query, [product_id, name, description, imagePath]);
    return data;
}

module.exports.ListproductQuerry = async (condition) => {
    var Query = ` SELECT p.*, c.c_name,cc.cc_name FROM products p 
    LEFT JOIN category c ON p.p_category = c.c_id 
    LEFT JOIN concerncategory cc ON p.p_concern_category = cc.cc_id ${condition}`
    var data = await query(Query);
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

module.exports.RemoveproductQuery = async (p_id) => {
    var Query = `delete from products where p_id=?`;
    var data = await query(Query, [p_id]);
    return data;
}
module.exports.checkproductQuery = async (p_id) => {
    var Query = `select * from products where p_id =?`;
    var data = await query(Query, [p_id]);
    return data;
}

module.exports.UpdateproductDetails = async (updateQuery, p_id) => {
    var Query = ` update products ${updateQuery} where p_id = ?`;
    var data = await query(Query, [p_id]);
    return data;
}

module.exports.UpdateproductImage = async (imagePath, p_id) => {
    var Query = `UPDATE products SET p_image = ? WHERE p_id = ?`;
    var data = await query(Query, [imagePath, p_id]);
    return data;
}