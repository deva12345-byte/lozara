var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckMobile = async (mobile) => {
    var Query = `select * from users where u_mobile=? `
    var data = query(Query, [mobile]);
    return data;
}

module.exports.CheckMail = async (email) => {
    var Query = `select * from users where u_email=? `
    var data = query(Query, [email]);
    return data;
}

module.exports.AddUser = async (name, email, hashedpasssword, mobile, address, state, district,city, pincode, date) => {
    var Query = `insert into users(u_name,u_email,u_password,u_mobile,u_address,u_state,u_district,u_city,u_pincode,u_joindate)values(?,?,?,?,?,?,?,?,?,?)`;
    var data = await query(Query, [name, email, hashedpasssword, mobile, address, state, district,city, pincode, date])
    return data;
}

module.exports.AddMobileUser = async (mobile, date, role) => {
    var Query = `insert into users(u_mobile,u_joindate,u_role)values(?,?,?)`;
    var data = await query(Query, [mobile, date, role])
    return data;
}

module.exports.UpdateUser = async (name, email, hashedpasssword, address, state, district,city, pincode, role,u_id) => {
    var Query = `update users set u_name=?,u_email=?,u_password=?,u_address=?,u_state=?,u_district=?,u_city=?,u_pincode=?,u_role=? where u_id =?`;
    var data = await query(Query, [name, email, hashedpasssword, address, state, district,city, pincode, role,u_id])
    return data;
}


