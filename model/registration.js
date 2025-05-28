var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckMail = async (email) => {
    var Query = `select * from users where u_email `
    var data = query(Query, [email]);
    return data;
}

module.exports.AddUser= async (name, email,hashedpasssword, mobile,address,state,district,pincode, date) => {
    var Query = `insert into users(u_name,u_email,u_password,u_mobile,u_address,u_state,u_district,u_pincode,u_joindate)values(?,?,?,?,?,?,?,?,?)`;
    var data = await query(Query, [name, email,hashedpasssword, mobile,address,state,district,pincode, date])
    return data;
}



