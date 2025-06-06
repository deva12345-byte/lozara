var  db = require('../db/db'); // Your DB connection
var util = require('util');
const query = util.promisify(db.query).bind(db);

module.exports.addcontactQuery = async (name, email, message) => {
    var Query = `INSERT INTO ContactUs (c_name, c_email, c_message) VALUES (?, ?, ?)`;
    var data= query(Query, [name, email, message]);
    return  data;
};
module.exports.listcontactQuery=async()=>{
     var Query =`select * from ContactUs ;`
    var data= await query(Query);
    return data;
}
module.exports.checkcontactQuery =async(c_id)=>{
    var Query= `select * from ContactUs where c_id=?`;
    var data =await query(Query,[c_id]);
    return data ;
}
module.exports.removecontactQuery =async(c_id)=>{
    var Query =`delete from ContactUs where c_id=?`
    var data =await query (Query,[c_id]);
    return data;
}
