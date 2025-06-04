const model = require('../model/getintouchdelete');

module.exports.deletegetintouch = async (req, res) => {
    try {
        const { g_id } = req.body;
        if (!g_id) {
            return res.send({
                result:false,
                message:"get in  touch detials id is  required"
            });
        }

            let getintouchlist = await model.checkgetintouchQuerry(g_id);

             if (!getintouchlist || getintouchlist.length == 0) {
        
                return res.send({
                    result: false,
                    message: "details not found"
                });

            } else {
                var deletesection = await model.RemovegetintouchQuerry(g_id);
                if (deletesection.affectedRows > 0) {
                    return res.send({
                        result: true,
                        message: "details deleted successfully"
                    });
                }
            }
        



    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }
};







