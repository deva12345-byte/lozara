var model =require("../model/deliverystatus");


module.exports.DeliveryStatus =async (req,res)=>{
    try{
        var{delivery_status ,order_id} =req.body;
        if(!delivery_status|| !order_id){
            return res.send({
                result:false,
                message:"insufficent parameter"
            })
        }
            let DeliveryStatus= await model.DeliveryStatusQuery(delivery_status ,order_id);
            if(DeliveryStatus.affectedRows > 0){
                return res.send({
                    result:true,
                    message:"Delivery status changed"


                });

            }else{
                return res.send({
                    result:false,
                    message:"failed to change Delivery status"
                });
            }
        } catch(error){
            return res.send({
                result:false,
                result:error.message,
            });
        }
    }

            
        
    
