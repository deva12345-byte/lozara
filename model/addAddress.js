
var db = require('../db/db.js');
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.AddAddressQuery = async (user_id, type, heading, address, state, district, pincode, phone, setdefault) => {
    var Query = `insert into address (adr_user_id,adr_type,adr_heading,adr_address,adr_state,adr_district,adr_pincode,adr_phone,adr_setdefault) values(?,?,?,?,?,?,?,?,?)`;
    var data = query(Query, [user_id, type, heading, address, state, district, pincode, phone, setdefault]);
    return data;
}

module.exports.ListAddressQuerry = async (user_id) => {
    var Query = `select * from address where adr_user_id=?`;
    var data = await query(Query, [user_id]);
    return data;
}

module.exports.RemoveAddressQuery = async (adr_id) => {
    var Query = `delete from address where adr_id=?`
    var data = await query(Query, [adr_id]);
    return data;
}

module.exports.UpdateAddressDetails = async (condition, adr_id) => {
    var Query = ` UPDATE address ${condition} WHERE adr_id = ?`
    var data = await query(Query, [adr_id]);
    return data;

}

module.exports.checkaddressQuery = async (adr_id) => {
    var Query = `select * from address where adr_id=?`;
    var data = await query(Query, [adr_id]);
    return data;
}

module.exports.ClearallDefaultAddress = async (u_id) => {
    var Query = ` UPDATE address set adr_setdefault = '0'  WHERE adr_user_id = ?`
    var data = await query(Query, [u_id]);
    return data;

}

