
var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.AddBannerQuery = async (heading, title, description, imagePath) => {
    var Query = `insert into banner(b_heading,b_title,b_description,b_image)values(?,?,?,?)`;
    var data = query(Query, [heading, title, description, imagePath]);
    return data;

}

module.exports.ListBannersQuerry =async(condition)=>{
    var Query =`select * from banner ${condition}`;
    var data=await query(Query);
    return data;

}
module.exports.RemoveBannerQuery =async(b_id)=>{
    var Query =`delete from banner where b_id=?`;
    var data = await query(Query,[b_id]);
    return data;
}
module.exports.checkbannerQuery =async(b_id)=>{
    var Query =`select * from banner where b_id =?`;
    var data=await query(Query,[b_id]);
    return data;

}

module.exports.UpdateBannerDetails=async (updateQuery,b_id) => {
    var Query= ` update banner ${updateQuery} where b_id = ?`;
    var data=await query(Query,[b_id]);
    return data;
  }

  module.exports.UpdateBannerImage=async (imagePath, banner_id) => {
    var Query= ` update banner set b_image=? where b_id = ?`;
    var data=await query(Query,[imagePath, banner_id]);
    return data;
  }


  




