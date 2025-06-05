var model = require("../model/product");
var formidable = require("formidable");
var fs = require("fs");
const path = require("path");


module.exports.Productadd = async (req, res) => {
    try {
        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "File Upload Failed!",
                    data: err,
                });
            }
            let { productname, prize, discount_prize, discount, description, concern_category, category, rating, stock } = fields

            if (!productname || !prize || !discount_prize || !discount || !description || !concern_category || !category || !stock) {
                return res.send({
                    result: false,
                    message: "insufficent parameter"
                })
            }

            if (files.image) {
                var oldPath = files.image.filepath;
                var newPath =
                    process.cwd() + "/uploads/products/" +
                    files.image.originalFilename;
                let rawData = fs.readFileSync(oldPath);
                fs.writeFile(newPath, rawData, async function (err) {
                    if (err) console.log(err);
                    let imagepath = "uploads/products/" + files.image.originalFilename;

                    await model.AddproductQuery(productname, category, prize, discount_prize, discount, description, concern_category, rating, stock, imagepath);

                })


                return res.send({
                    result: true,
                    message: "product added successfully"
                })
            } else {
                return res.send({
                    result: true,
                    message: "image required"
                })
            }
        })

    } catch (error) {
        console.log(error);
        return res.send({
            result: false,
            message: error.message,
        });
    }

}
module.exports.Listproduct = async (req, res) => {
    try {
        let { p_id, category_id, concern_category_id } = req.body || {}
        var condition = ""
        if (p_id) {
            condition = `where p.p_id ='${p_id}' `
        }
        if (category_id) {
            condition = `where p.p_category ='${category_id}' `
        }
        if (concern_category_id) {
            condition = `where p.p_concern_category='${concern_category_id}'`
        }
        let listproduct = await model.ListproductQuerry(condition);
        if (listproduct.length > 0) {

        let data = await Promise.all(
                listproduct.map(async (el) => {
                    let getreviewcount = await model.GetReview(el.p_id);
                    el.reviewcount = getreviewcount[0]?.review_count;
                    return el;
                })
            );
            return res.send({
                result: true,
                message: "data retrieved",
                list: data
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


module.exports.deleteproduct = async (req, res) => {
    try {
        let p_id = req.body.p_id;
        if (p_id) {
            let checkproduct = await model.checkproductQuery(p_id);
            if (checkproduct.length == 0) {
                return res.send({
                    result: false,
                    message: "product not found"
                });
            } else {
                var deletesection = await model.RemoveproductQuery(p_id);
                if (deletesection.affectedRows > 0) {
                    return res.send({
                        result: true,
                        message: "product deleted successfully"
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


module.exports.Editproduct = async (req, res) => {
    try {
        const form = new formidable.IncomingForm({ multiples: false });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.send({
                    result: false,
                    message: 'File Upload Failed!',
                    data: err,
                });
            }

            const { p_id, productname, prize, category, concern_category, discount_prize, discount, stock, description } = fields;

            if (!p_id) {
                return res.send({
                    result: false,
                    message: 'Insufficient parameters',
                });
            }

            const productExists = await model.checkproductQuery(p_id);
            if (productExists.length === 0) {
                return res.send({
                    result: false,
                    message: 'product does not exist',
                });
            }

            let updates = [];
            if (productname) updates.push(`p_productname='${productname}'`);
            if (prize) updates.push(`p_prize='${prize}'`);
            if (description) updates.push(`p_description='${description}'`);
            if (discount_prize) updates.push(`p_discount_prize='${discount_prize}'`)
            if (discount) updates.push(`p_discount='${discount}'`)
            if (category) updates.push(`p_category='${category}'`)
            if (concern_category) updates.push(`p_concern_category='${concern_category}'`)
            if (stock) updates.push(`p_stocks='${stock}'`)


            if (updates.length > 0) {
                const updateQuery = `SET ${updates.join(', ')}`;
                var updateResult = await model.UpdateproductDetails(updateQuery, p_id);
            }

            if (files.image) {
                const oldPath = files.image.filepath;
                const fileName = files.image.originalFilename;
                const newPath = path.join(process.cwd(), '/uploads/products/', fileName);

                const rawData = fs.readFileSync(oldPath);
                fs.writeFileSync(newPath, rawData);
                const imagePath = `/uploads/products/${fileName}`;
                const imageUpdate = await model.UpdateproductImage(imagePath, p_id);

                if (!imageUpdate.affectedRows) {
                    return res.send({
                        result: false,
                        message: 'Failed to update product image',
                    });
                }
            }

            return res.send({
                result: true,
                message: 'product updated successfully',
            });
        });
    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }

};




