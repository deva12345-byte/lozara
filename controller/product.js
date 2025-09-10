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

            let {
                productname, description,
                concern_category, category, quantity_types_price, material_content,
                how_it_works, how_to_use, suitable_for,
                before_use, after_use, stock, p_upcoming
            } = fields;

            if (!productname || !quantity_types_price || !description ||
                !concern_category || !category || !material_content ||
                !how_it_works || !how_to_use || !suitable_for ||
                !stock || !p_upcoming) {
                return res.send({
                    result: false,
                    message: "All fields are required"
                });
            }

            // First insert the product basic details (excluding images)
            let addproduct = await model.AddproductQuery(
                productname, category, concern_category,description, material_content,
                how_it_works, how_to_use, suitable_for, stock, p_upcoming
            );
            const quantity_types_prices = await JSON.parse(quantity_types_price);

            if (addproduct.affectedRows > 0) {

                try {
                    for (const price of quantity_types_prices) {
                        console.log("quantity_types_price:", price.price,price.discount_prize,price.discount,price.packet_size,addproduct.insertId);

                        const addprice = await model.AddpriceQuery(price.price,price.discount_prize,price.discount,price.packet_size,addproduct.insertId);

                        if (addprice.affectedRows == 0) {
                            await model.RemoveproductQuery(addproduct.insertId);
                            return res.send({
                                result: false,
                                message: "Failed to add product price"
                            });
                        }
                    }

                } catch (error) {
                    // Cleanup and respond in case of unhandled error
                    await model.RemoveproductQuery(addproduct.insertId);
                    return res.send({
                        result: false,
                        message: "An error occurred while adding product prices",
                        error: error.message
                    });
                }

                const product_id = addproduct.insertId; // Assuming you get insertId
                const productImages = Array.isArray(files.image) ? files.image : [files.image];
                if (files.image) {
                    // Save product images
                    for (const file of productImages) {
                        if (!file || !file.filepath || !file.originalFilename) continue;

                        const oldPath = file.filepath;
                        const newPath = path.join(process.cwd(), '/uploads/products', file.originalFilename);
                        const rawData = fs.readFileSync(oldPath);
                        fs.writeFileSync(newPath, rawData);

                        const imagePath = "/uploads/products/" + file.originalFilename;

                        // Save each image with product_id
                        await model.AddProductImageQuery(product_id, imagePath);
                    }
                } else {
                    return res.send({
                        result: false,
                        message: "Product images are required"
                    });
                }

                return res.send({
                    result: true,
                    message: "Product details added successfully"
                });
            } else {
                return res.send({
                    result: false,
                    message: "Failed to add product details"
                });
            }
        });

    } catch (error) {
        console.log(error);
        return res.send({
            result: false,
            message: error.message,
        });
    }
};

module.exports.AddProductIngeridients = async (req, res) => {
    try {
        const form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error(err);
                return res.status(400).json({
                    result: false,
                    message: 'File upload failed!',
                    data: err,
                });
            }
            let { product_id, name, description } = fields
            if (!files.image || !product_id || !name || !description) {
                return res.status(400).json({
                    result: false,
                    message: 'all fields are required / No image file uploaded.',
                });
            }


            if (files.image) {

                const oldPath = files.image.filepath;
                const newFileName = files.image.originalFilename;
                const newPath = path.join(process.cwd(), 'uploads', 'ingredients', newFileName);

                try {
                    const rawData = fs.readFileSync(oldPath);
                    fs.writeFileSync(newPath, rawData);

                    const imagePath = path.join('uploads', 'ingredients', newFileName);
                    let addProductIngeridients = await model.AddProductIngeridientsQuery(product_id, name, description, imagePath);

                    if (addProductIngeridients.affectedRows > 0) {

                        return res.status(200).json({
                            result: true,
                            message: 'Product Ingeridients added successfully',
                        });
                    } else {
                        return res.status(200).json({
                            result: false,
                            message: 'Failed to added Product Ingeridients',
                        });
                    }

                } catch (fileErr) {
                    console.error(fileErr);
                    return res.status(500).json({
                        result: false,
                        message: 'Failed to save the image file.',
                        data: fileErr,
                    });
                }
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            result: false,
            message: 'An unexpected error occurred.',
            data: error,
        });
    }
};

module.exports.Listproduct = async (req, res) => {
    try {

        let { p_id, category_id, concern_category_id, upcoming, bestsellers, search,all } = req.body || {}

        var condition = ""

        if (condition == "") {
            condition = `where p.p_upcoming = '0' `
        }
        if (all) {
            condition = ``
        }
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
                        
                        let getproductprice = await model.Getproductprice(el.p_id);
                        let getingredients = await model.GetIngredients(el.p_id);
                        let getproductimage = await model.Getproductimages(el.p_id);
                        let getreviewcount = await model.GetReviewCount(el.p_id);
                        let getreview = await model.GetReview(el.p_id);

                        let reviewdata = await Promise.all(
                            getreview.map(async (elem) => {
                                let reviewimages = await model.GetReviewImage(elem.r_id)
                                elem.reviewimages = reviewimages
                                return elem
                            })
                        )

                        el.reviewcount = getreviewcount[0]?.review_count;
                        el.product_price = getproductprice
                        el.ingredients = getingredients;
                        el.productimage = getproductimage;
                        el.reviews = reviewdata;

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
                        let getproductprice = await model.Getproductprice(el.p_id);
                        let getingredients = await model.GetIngredients(el.p_id);
                        let getproductimage = await model.Getproductimages(el.p_id);
                        let getreviewcount = await model.GetReviewCount(el.p_id);
                        let getreview = await model.GetReview(el.p_id);

                        let reviewdata = await Promise.all(
                            getreview.map(async (elem) => {
                                let reviewimages = await model.GetReviewImage(elem.r_id)
                                elem.reviewimages = reviewimages
                                return elem
                            })
                        )

                        el.reviewcount = getreviewcount[0]?.review_count;
                        el.product_price = getproductprice
                        el.ingredients = getingredients;
                        el.productimage = getproductimage;
                        el.reviews = reviewdata;

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

        let listproduct = await model.ListproductQuerry(condition);

        if (listproduct.length > 0) {

            let data = await Promise.all(
                listproduct.map(async (el) => {
                    let getproductprice = await model.Getproductprice(el.p_id);
                    let getreviewcount = await model.GetReviewCount(el.p_id);
                    let getingredients = await model.GetIngredients(el.p_id);
                    let getproductimage = await model.Getproductimages(el.p_id);
                    let getreview = await model.GetReview(el.p_id);
                    let reviewdata = await Promise.all(
                        getreview.map(async (elem) => {
                            let reviewimages = await model.GetReviewImage(elem.r_id)
                            elem.reviewimages = reviewimages
                            return elem
                        })
                    )

                    el.reviewcount = getreviewcount[0]?.review_count;
                    el.product_price = getproductprice
                    el.ingredients = getingredients;
                    el.productimage = getproductimage;
                    el.reviews = reviewdata;
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

            const { p_id, productname, prize, category, concern_category, discount_prize, discount, stock, description, p_upcoming } = fields;

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




