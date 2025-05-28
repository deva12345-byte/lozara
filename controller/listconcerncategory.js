var model = require("../model/listconcerncategory");



module.exports.concerncategorylist = async (req, res) => {
    try {
        let { cc_id } = req.body || {}
        var condition = ""
        if (cc_id) {
            condition = `where cc_id='${cc_id}'`
        }
        let listconcerncategory = await model.listconcerncategoryQuery(condition);
        if (listconcerncategory.length > 0) {
            return res.send({
                result: true,
                message: "data retrived",
                data:listconcerncategory
                
            })

        }else{
 return res.send({
                result: false,
                message: "data not found",
            })
        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }
}

