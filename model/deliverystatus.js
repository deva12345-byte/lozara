var db= require ("../db/db");
var util =require("util");
const query = util.promisify(db.query).bind(db);


module.exports.DeliveryStatusQuery=async(delivery_status,op_id)=>{
     var Query = `update order_product set op_delivery_status=? where op_id = ? `;
    var data = query(Query, [delivery_status, op_id]);
    return data;

}

module.exports.listorderQuery=async(order_id)=>{
     var Query = `select * from orders where od_id   = ? `;
    var data = query(Query, [order_id]);
    return data;

}