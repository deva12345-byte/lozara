var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.SelectImage = async () => {
    var Query = `select * from products;`
    var data = query(Query);
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

module.exports.AddproductQuery=async (productname, category, prize, discount_prize, discount, description, concern_category, stock,p_upcoming, imagepath) => {
   var Query = `insert into products (P_productname,p_category,p_prize,p_discount_prize,p_discount,p_description,p_concern_category,p_stocks,p_upcoming,p_image) values (?,?,?,?,?,?,?,?,?,?);`
    var data = await query(Query, [productname, category, prize, discount_prize, discount, description, concern_category, stock,p_upcoming, imagepath]);
    return data;
}

module.exports.ListproductQuerry=async(condition)=>{
    var Query =` SELECT p.*, c.c_name,cc.cc_name FROM products p 
    LEFT JOIN category c ON p.p_category = c.c_id 
    LEFT JOIN concerncategory cc ON p.p_concern_category = cc.cc_id ${condition}`
    var data = await query(Query);
    return data;

}

module.exports.GetReviewCount =async(p_id)=>{
    var Query =`SELECT COUNT(*) AS review_count FROM review WHERE r_p_id  = ?`;
     var data = await query(Query,[p_id]);
    return data;
}

module.exports.GetReview =async(p_id)=>{
    var Query =`SELECT * FROM review WHERE r_p_id  = ?`;
     var data = await query(Query,[p_id]);
    return data;
}

module.exports.RemoveproductQuery =async(p_id)=>{
    var Query =`delete from products where p_id=?`;
    var data = await query(Query,[p_id]);
    return data;
}
module.exports.checkproductQuery =async(p_id)=>{
    var Query =`select * from products where p_id =?`;
    var data=await query(Query,[p_id]);
    return data;
}

module.exports.UpdateproductDetails=async (updateQuery, p_id) => {
    var Query= ` update products ${updateQuery} where p_id = ?`;
    var data=await query(Query,[p_id]);
    return data;
  }
  
module.exports.UpdateproductImage= async (imagePath, p_id) => {
    var Query = `UPDATE products SET p_image = ? WHERE p_id = ?`;
    var data=await query(Query,[imagePath,p_id]);
    return data;
  }