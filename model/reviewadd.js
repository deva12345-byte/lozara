var db = require('../db/db.js');
var util = require("util");
const query =util.promisify(db.query).bind(db);
   


module.exports.reviewaddQuery=async(product_id,comment,heading,rating,user_id)=>{
    var Query =`insert into review(	r_p_id, r_comment, r_heading,r_rating,r_u_id)values(?,?,?,?,?)`;
    var data =query(Query,[product_id,comment,heading,rating,user_id]);
    return data;
    
}
module.exports.checkproductQuery=async(product_id)=>{
    var Query =`select * from products WHERE p_id=?`;
    var data =query(Query,[product_id]);
    return data;
}
module.exports.checkuserQuery=async(user_id)=>{
    var Query= `select * from users where u_id=?`;
    var data =query(Query,[user_id]);
    return data;
}

module.exports.getAllRatingsQuery=async(product_id)=>{
    var Query= `select r_rating from review where r_p_id=?`;
    var data =query(Query,[product_id]);
    return data;
}

module.exports.updateProductRatingQuery=async(product_id,avgRating)=>{
    var Query =`update products set p_rating=? WHERE p_id=?`;
    var data =query(Query,[avgRating,product_id]);
    return data;
}