
var db = require('../db/db.js');
var util = require("util");
const query =util.promisify(db.query).bind(db);
 

module.exports.AddcategoryQuery=async(categoryname)=>{
    var Query=`insert into category (c_name) values(?)`;
    var data =query(Query,[categoryname]);
    return data;


}
    module.exports. ListcategoryQuerry =async(condition) =>{
        var Query=` select * from category ${condition}`;
        var data =await query(Query);
        return data;

    }
    module.exports.RemovecategoryQuery=async(c_id)=>{
        var Query=`delete from category where c_id=?`
        var data =await query (Query,[c_id]);
        return data;


    }
    module.exports.UpdatecategoryDetails=async(categoryname,c_id)=>{
       var Query=` UPDATE category SET c_name =? WHERE c_id = ?`
        var data=await query(Query,[categoryname,c_id]);
        return data;
        
        
    }
    module.exports.checkcateorgyQuery=async(c_id)=>{
        var Query =`select * from category where c_id=?`;
        var data=await query (Query,[c_id]);
        return data;

    }

        