

var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.listconcerncategoryQuery=async(condition)=>{
    var Query =`select * from concerncategory ${condition}`;
    var data =await query (Query);
    return data;

}