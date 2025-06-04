var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);


module.exports.UpdategetintouchtDetails=async (updateQuery, g_id) => {
    var Query= ` update  get_in_touch ${updateQuery} where g_id = ?`;
    var data=await query(Query,[g_id]);
    return data;
  }
  
module.exports.UpdategetintouchImage= async (imagePath, g_id) => {
    var Query = (`UPDATE get_in_touch SET g_image = ? WHERE g_id = ?`);
    var data=await query(Query,[imagePath,g_id]);
    return data;
  }
  module.exports.checkgetintouchQuery =async(g_id)=>{
    var Query =`select * from get_in_touch where g_id =?`;
    var data=await query(Query,[g_id]);
    return data;
  }







































































