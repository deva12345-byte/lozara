var model = require("../model/concerncategorydelete");


module.exports.deleteconcerncategory =async(req,res)=>{
    try{
        let cc_id=req.body.cc_id;
        if(cc_id){
            let checkproduct =await model.checkconcerncategoryQuery(cc_id);
            if(checkproduct.length ==0){
                return res.send({
                    result: false,
                    message:"concern category not found"

                });
            }else {
                var deletesection =await model.removeconcerncategoryQuery(cc_id);
                if(deletesection.affectedRows >0){
                    return res.send({
                        result:true,
                        message:"concern category deleted successfully"
                    });
                }
            }
            }

        }catch(error){
            return res.send({
                resut:false,
                message:error.message,
            });
        }
    }

