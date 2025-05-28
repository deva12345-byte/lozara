var model = require("../model/category");



module.exports.categoryadd = async (req, res) => {

    try {
        let { categoryname } =req.body

        if (!categoryname ) {
            return res.send({
                result: false,
                message: "insufficent parameter"
            });
        }

        let addcategoryname = await model.AddcategoryQuery(categoryname);

        if (addcategoryname.affectedRows > 0) {
            return res.send({
                result: true,
                message: "category added successfully"
            })


        }
        else {
            return res.send({
                result: failed,
                message: "category added failed"
            })
        }





    } catch (error) {
        console.log(error);
        return res.send({
            result: false,
            message: error.message,
        });
    }

}



module.exports.Listcategory = async (req, res) => {
    try {
        let { c_id } = req.body || {}
        var condition = ""
        if (c_id) {
            condition = `where c_id ='${c_id}' `
        }
        let listcategory = await model.ListcategoryQuerry(condition);
        if (listcategory.length > 0) {
            return res.send({
                result: true,
                message: "data retrieved",
                list: listcategory
            });
        } else {
            return res.send({
                result: false,
                message: "data not found",
            });

        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message,

        });
    }
}

module.exports.deletecategory = async (req, res) => {
    try {
        let c_id = req.body.c_id;
        if (c_id) {
            let checkcategory = await model.checkcateorgyQuery(c_id);
            if (checkcategory.length == 0) {
                return res.send({
                    result: false,
                    message: "category not found"
                });
            } else {
                var deletesection = await model.RemovecategoryQuery(c_id);
                if (deletesection.affectedRows > 0) {
                    return res.send({
                        result: true,
                        message: "category deleted successfully"
                    });

                }
            }
        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message,

        });
    }
}
module.exports.Editcategory = async (req, res) => {
    try {


        const { c_id,categoryname } = req.body;

        if (!c_id) {
            return res.send({
                result: false,
                message: 'Insufficient parameters',
            });
        }

        const categoryExists = await model.checkcateorgyQuery(c_id);
        if (categoryExists.length === 0) {
            return res.send({
                result: false,
                message: 'category does not exist',
            });
        } else {

            var updateResult = await model.UpdatecategoryDetails(categoryname,c_id);
        }




        return res.send({
            result: true,
            message: 'category updated successfully',
        });

    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }

}




