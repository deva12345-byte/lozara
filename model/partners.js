
var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.AddimageQuery=async(link,imagepath)=>{
    var Query =`insert into partners(pt_link,pt_image)values(?,?);`
    var data= query(Query,[link,imagepath]);
    return data;
}
module.exports.listPartnersQuery=async()=>{
    var Query =`select * from partners ;`
    var data= await query(Query);
    return data;

}
module.exports.checkPartnersQuery =async(pt_id)=>{
    var Query= `select * from partners where pt_id=?`;
    var data =await query(Query,[pt_id]);
    return data ;
}
module.exports.removePartnersQuery =async(pt_id)=>{
    var Query =`delete from partners where pt_id=?`
    var data =await query (Query,[pt_id]);
    return data;
}
