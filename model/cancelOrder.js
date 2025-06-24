var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUser = async (user_id) => {
    var Query = `select * from users where u_id = ? and u_status = 'active'`;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.CheckOrder = async (order_id, user_id) => {
    var Query = `SELECT * FROM orders WHERE od_id = ? AND od_u_id = ?`;
    var data = query(Query, [order_id, user_id]);
    return data;
};

module.exports.CheckOrderProduct = async (order_product_id) => {
    var Query = `SELECT * FROM order_product WHERE op_id = ?`;
    var data = query(Query, [order_product_id]);
    return data;
};

module.exports.RemoveOrder = async (order_product_id) => {
    var Query = `UPDATE order_product
    SET op_delivery_status = 'Cancelled' WHERE op_id = ?`;
    var data = query(Query, [order_product_id]);
    return data;
};

module.exports.Getaddress = async (address_id) => {
    var Query = `select * from address where adr_id = ?`;
    var data = query(Query, [address_id]);
    return data;
}