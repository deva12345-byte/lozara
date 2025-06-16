var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckorderQuery = async (u_id) => {
    var Query = `select * from orders where od_id= ?`;
    var data = query(Query, [u_id]);
    return data;
};

module.exports.TrackorderQuery = async (status, od_id) => {
    var Query = `update orders set od_delivery_status=? where od_id = ?`;
    var data = query(Query, [status,od_id]);
    return data;
};