
var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.listgetintouchQuerry=async(condition)=>{
    var Query =`select * from get_in_touch ${condition};`
    var data =await query(Query);
    return data;
}