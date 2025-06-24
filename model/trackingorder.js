var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckorderproductQuery = async (op_id) => {
    var Query = `select * from order_product where op_id= ?`;
    var data = query(Query, [op_id]);
    return data;
};

module.exports.TrackorderQuery = async (status, op_id) => {
    var Query = `update order_product set op_delivery_status=? where op_id = ?`;
    var data = query(Query, [status,op_id]);
    return data;
};