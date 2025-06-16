
var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);


module.exports.AddimageQuery=async(title,imagepath)=>{
    var Query =`insert into ourspecialities(osp_title,osp_image)values(?,?);`
    var data= query(Query,[title,imagepath]);
    return data;
}
module.exports.listOurSpecialitiesQuery=async()=>{
    var Query =`select * from ourspecialities ;`
    var data= await query(Query);
    return data;

}
module.exports.checkOurSpecialitiesQuery =async(osp_id)=>{
    var Query= `select * from ourspecialities where osp_id=?`;
    var data =await query(Query,[osp_id]);
    return data ;
}
module.exports.removeOurSpecialitiesQuery =async(osp_id)=>{
    var Query =`delete from ourspecialities where osp_id=?`
    var data =await query (Query,[osp_id]);
    return data;
}
