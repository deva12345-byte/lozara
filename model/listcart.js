var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);



module.exports.listcartQuery=async(userid,condition)=>{
    var Query=`select * from cart where ct_user_id=? ${condition}`;
    var data=await query(Query,[userid]);
    return data;
}