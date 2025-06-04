const model =require('../model/getintouchlist');

module.exports.listgetintouch =async(req,res)=>{
    try{
        let listgetintouch =await model.listgetintouchQuerry();
        if(listgetintouch.length >0){
            return res.send({
                result:true,
                message:"data retrieved",
                list:listgetintouch
            });
        } else{
            return res.send({
                result:false,
                messsage:"data not found",

            });
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }

}