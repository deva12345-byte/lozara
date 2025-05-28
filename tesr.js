var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.DeliveryStatusQuery = async (delivery_status, order_id) => {
    var Query = `update orders set od_delivery_status=? where od_id   = ? `;
    var data = query(Query, [delivery_status, order_id]);
    return data;

}