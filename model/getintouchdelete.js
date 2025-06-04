var db = require('../db/db');
var util = require("util");
const query=util.promisify(db.query).bind(db);



module.exports.checkgetintouchQuerry=async(g_id)=>{
    var Query=`select * from get_in_touch where g_id=?`;
    var data =await query (Query,[g_id]);
    return data;
}
module.exports.RemovegetintouchQuerry=async(g_id)=>{
    var Query=`delete from get_in_touch where g_id=?`
    var data =await query (Query,[g_id]);
    return data;
}