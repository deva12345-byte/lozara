var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.Checkuser = async (u_id) => {
    var Query = `SELECT * FROM users where u_id=? `;
    var data = query(Query,[u_id]);
    return data;
}

module.exports.listorderQuery= async (condition) => {
    var Query = `SELECT * FROM orders ${condition}`;
    var data = query(Query);
    return data;
}

module.exports.CheckOrder = async (od_id) => {
    var Query = `SELECT * FROM orders where od_id=? `;
    var data = query(Query,[od_id]);
    return data;

}

module.exports.listorderproductQuery= async (od_id) => {
    var Query = `SELECT * FROM order_product
    INNER JOIN products ON order_product.op_product_id = products.p_id
    WHERE order_product.op_order_id = ?`
    var data = query(Query,[od_id]);
    return data;

}
