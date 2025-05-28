const model = require('../model/listorder');
module.exports.listorder = async (req, res) => {
    try {
        let { u_id } = req.body || {}
        let condition = ''
        if (u_id) {
            condition = `and orders.od_u_id='${u_id}'`
        }
        let listorder =await model.listorderQuery(condition);
        if(listorder.length>0){
            return res.send({
                result:true,
                message:"data retrieved",
                list:listorder,

            });
            
        }else{
            return res.send({
                result:false,
                message:"data not found",
            });

        }
    }catch(error){
        return res.send({
            result:false,
            message:error.message,
        });
    }
   

}