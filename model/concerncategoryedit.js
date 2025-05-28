var db = require('../db/db');
var util = require("util");
const query=util.promisify(db.query).bind(db);

module.exports.checkconcerncategoryQuery = async (cc_id) => {
    var Query = `SELECT * FROM concerncategory WHERE cc_id = ?`;
    var data = await query(Query, [cc_id]);
    return data;
};

module.exports.updateconcerncategoryQuery=async(updateQuery,cc_id)=>{
    var Query=`update concerncategory ${updateQuery} where cc_id =?`;
    var data =await query(Query,[cc_id]);
    return data;
    
}

module.exports.UpdateconcerncategoryImage=async(imagePath,cc_id)=>{
    var Query=`update concerncategory set cc_image=? where cc_id =?`;
    var data =await query(Query,[imagePath,cc_id]);
    return data;
    
}