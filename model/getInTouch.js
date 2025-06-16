var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);


module.exports.SelectImage = async () => {
    var Query = `select * from get_in_touch;`
    var data = query(Query);
    return data;
}
module.exports.getintouchaddQuery=async(name, email, message)=>{
    var Query=`insert into get_in_touch(g_description,g_heading,g_contact,g_image) values(?,?,?);`
    var data=query(Query,[name, email, message]);
    return data;
}