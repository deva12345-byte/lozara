var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);


module.exports.listorderQuery= async (condition) => {
    var Query = `SELECT * FROM orders
    INNER JOIN order_product ON orders.od_id = order_product.op_order_id
    INNER JOIN products ON order_product.op_product_id = products.p_id
    WHERE orders.od_status = 'active' ${condition}
    ORDER BY orders.od_created_at DESC`;
    var data = query(Query);
    return data;

}
