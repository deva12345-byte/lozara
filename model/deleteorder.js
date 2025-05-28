var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.checkorderQuery =async(od_id)=>{
    var Query=`select *from orders where od_id=?`;
    var data =await query(Query,[od_id]);
    return data;
}
module.exports.removeorderQuery= async(od_id)=>{
    var Query =`delete from orders where od_id=?`;
    var data= await query(Query,[od_id]);
    return data;
}