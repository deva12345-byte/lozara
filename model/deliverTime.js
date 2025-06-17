
var db = require('../db/db.js');
var util = require("util");
const query = util.promisify(db.query).bind(db);


module.exports.AddDeliveryTimeQuery = async (pincode,duration) => {
    var Query = `insert into delivery_time (dt_pincode,dt_duration) values(?,?)`;
    var data = query(Query, [pincode,duration]);
    return data;
}

module.exports.ListDeliveryTimeQuerry = async () => {
    var Query = ` select * from delivery_time`;
    var data = await query(Query);
    return data;
}

module.exports.RemoveDeliveryTimeQuery = async (dt_id) => {
    var Query = `delete from delivery_time where dt_id=?`
    var data = await query(Query, [dt_id]);
    return data;
}

module.exports.checkDeliveryDurationQuery = async (pincode) => {
    var Query = `select * from delivery_time where dt_pincode=?`;
    var data = await query(Query, [pincode]);
    return data;

}

module.exports.checkDeliveryTimeQuery = async (dt_id) => {
    var Query = `select * from delivery_time where dt_id=?`;
    var data = await query(Query, [dt_id]);
    return data;

}

