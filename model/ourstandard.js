
var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);


module.exports.AddimageQuery=async(imagepath)=>{
    var Query =`insert into ourstandard(o_image)values(?);`
    var data= query(Query,[imagepath]);
    return data;
}
module.exports.listourstandardQuery=async()=>{
    var Query =`select * from ourstandard ;`
    var data= await query(Query);
    return data;

}
module.exports.checkourstandardQuery =async(o_id)=>{
    var Query= `select * from ourstandard where o_id=?`;
    var data =await query(Query,[o_id]);
    return data ;
}
module.exports.removeourstandardQuery =async(o_id)=>{
    var Query =`delete from ourstandard where o_id=?`
    var data =await query (Query,[o_id]);
    return data;
}
