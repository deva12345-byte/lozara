
var db = require('../db/db');
var util = require("util");
const query=util.promisify(db.query).bind(db);
 

module.exports.removeconcerncategoryQuery=async(cc_id)=>{
    var Query=`delete from concerncategory where cc_id=?`
    var data =await query (Query,[cc_id]);
    return data;

}
module.exports.checkconcerncategoryQuery=async(cc_id)=>{
    var Query=`select * from concerncategory where cc_id=?`;
    var data =await query (Query,[cc_id]);
    return data;

}

