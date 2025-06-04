var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.SelectImage = async () => {
    var Query = `select * from products;`
    var data = query(Query);
    return data;
}

module.exports.AddproductQuery=async (productname,category,prize,discount_prize,discount,description,imagepath) => {
   var Query = `insert into products (P_productname,p_category,p_prize,p_discount_prize,p_discount,p_description,p_image) values (?,?,?,?,?,?,?);`
    var data = query(Query, [productname,category,prize,discount_prize,discount,description,imagepath]);
    return data;
}

module.exports.ListproductQuerry=async(condition)=>{
    var Query =` select * from products ${condition};`
    var data = await query(Query);
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
    var Query = (`UPDATE products SET p_image = ? WHERE p_id = ?`);
    var data=await query(Query,[imagePath,p_id]);
    return data;
  }