var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.checkcartQuery=async (ct_id)=>{
    var Query=`select * from cart where ct_id=?`;
    var data =await query (Query,[ct_id]);
    return data;

}
module.exports.removecartQuery=async(ct_id )=>{
    var Query =`delete from cart where ct_id=?`;
    var data = await query(Query,[ct_id]);
    return data;
}
                