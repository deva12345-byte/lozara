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
            let { productname, prize, discount_prize, discount, description, concern_category, category, stock, p_upcoming } = fields

            if (!productname || !prize || !discount_prize || !discount || !description || !concern_category || !category || !stock || !p_upcoming) {
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

                    await model.AddproductQuery(productname, category, prize, discount_prize, discount, description, concern_category, stock, p_upcoming, imagepath);

                })


                return res.send({
                    result: true,
                    message: "product added successfully"
                })
            } else {
                return res.send({
                    result: true,
                    message: "image is required"
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

        let { p_id, category_id, concern_category_id, upcoming, bestsellers, search } = req.body || {}

        var condition = ""
        if (p_id) {
            condition = `where p.p_id ='${p_id}' `
        }
        if (upcoming) {
            condition = `where p.p_upcoming = '1' `
        }
        if (category_id) {
            condition = `where p.p_category ='${category_id}' `
        }
        if (concern_category_id) {
            condition = `where p.p_concern_category='${concern_category_id}'`
        }
        if (search) {
            condition = `where (p.p_productname like '%${search}%') `
        }
        if (bestsellers) {
            let topseller = await model.GetTopseller()

            if (topseller.length > 0) {
                let data = await Promise.all(
                    topseller.map(async (el) => {
                        let p_id = el.op_product_id
                        if (p_id) {
                            condition = `where p.p_id ='${p_id}' `
                        }
                        // Fetch product details if needednpm i
                        let product = await model.ListproductQuerry(condition);
                        // You might want to merge product data into el, e.g.:
                        el.productDetails = product;

                        // Fetch review count safely
                        let getreviewcount = await model.GetReview(p_id);
                        el.reviewcount = getreviewcount[0]?.review_count ?? 0;

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
        }

        if (p_id) {
            let listproduct = await model.ListproductQuerry(condition);
            if (listproduct.length > 0) {

                let data = await Promise.all(
                    listproduct.map(async (el) => {
                        let getreview = await model.GetReview(el.p_id);
                        el.reviews = getreview;
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
        }
        if(condition==""){
            condition=`where p.p_upcoming = '0' `
        }
        let listproduct = await model.ListproductQuerry(condition);
        
        if (listproduct.length > 0) {

            let data = await Promise.all(
                listproduct.map(async (el) => {
                    let getreviewcount = await model.GetReviewCount(el.p_id);
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

            const { p_id, productname, prize, category, concern_category, discount_prize, discount, stock, description,p_upcoming } = fields;

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
            if (p_upcoming) updates.push(`p_upcoming='${p_upcoming}'`)

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




