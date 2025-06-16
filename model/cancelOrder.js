var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUser = async (user_id) => {
    var Query = `select * from users where u_id = ? and u_status = 'active'`;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.CheckOrder = async (order_id, user_id) => {
    var Query = `SELECT * FROM orders WHERE od_id = ? AND od_u_id = ? AND od_delivery_status NOT IN ('Out for Delivery', 'Delivered')`;
    var data = query(Query, [order_id, user_id]);
    return data;
};

module.exports.RemoveOrder = async (order_id) => {
    var Query = `UPDATE orders
    SET od_delivery_status = 'Cancelled' WHERE od_id = ?`;
    var data = query(Query, [order_id]);
    return data;
};

module.exports.Getaddress = async (address_id) => {
    var Query = `select * from address where adr_id = ?`;
    var data = query(Query, [address_id]);
    return data;
}