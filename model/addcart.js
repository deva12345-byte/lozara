var db = require('../db/db.js');
var util = require("util");
const query =util.promisify(db.query).bind(db);



module.exports.addcartQuery= async(userid,productid,packet_size,quantity)=>{
    var Query =`insert into cart(ct_user_id, ct_product_id,ct_packet_size,ct_quantity)values(?,?,?,?)`;
    var data =query(Query,[userid,productid,packet_size,quantity]);
    return data;
}

module.exports.checkcartQuery= async(userid,productid)=>{
    var Query =` SELECT * FROM cart WHERE ct_user_id= ? AND ct_product_id= ?`;
    var data = query(Query,[userid,productid]);
    return data;
}
