var db =require("../db/db");
var util =require("util")
const query =util.promisify(db.query).bind(db);


module.exports.CheckEmailQuery =async (email,role)=>{
    var Query= `select * from users where u_email=? and u_role =?`;
    var data = await query(Query,[email, role]);
    return data;

};
module.exports.updatepassword =async (password,email)=>{
    var Query= `update users set u_password=? where u_email=?`;
    var data =await query(Query,[password,email]);
    return data;
};


module.exports.StoreResetToken = async (token, expirationDate, u_id) => {
    var Query = `update users SET u_token = ?, u_token_expiry = ? WHERE u_id = ?`;
    var data = await query(Query, [token, expirationDate, u_id]);
    return data;
};
module.exports.ValidateResetToken =async(email,otp)=>{
    var Query= `select * FROM users WHERE u_email=? AND u_token=? AND u_otp_status='unverified' `;
    var data =await query(Query,[email,otp]);
    return  data;
};
module.exports.updateOtpStatus =async (email,status)=>{
    var Query=`update users set u_otp_status=? where u_email=?`;
    return await query(Query,[status,email])
}
