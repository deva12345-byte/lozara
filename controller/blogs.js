var model = require("../model/blogs");
var formidable = require("formidable");
var fs = require("fs");
let moment = require('moment')

module.exports.AddBlog = async (req, res) => {
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
            var { bl_heading, bl_name, bl_hashtags, bl_description } = fields;
            if (!bl_heading || !bl_name || !bl_hashtags || !bl_description) {
                return res.send({
                    result: false,
                    message: "insucefficent parameter"
                })
            }
            let bl_created_at = moment().format('YYYY-MM-DD HH:mm:ss');

            if (files) {
                var oldPath = files.image.filepath;
                var newPath =
                    process.cwd() +
                    "/uploads/blogs/" +
                    files.image.originalFilename;
                let rawData = fs.readFileSync(oldPath);
                fs.writeFile(newPath, rawData, async function (err) {
                    if (err) console.log(err);
                    let imagepath =
                        "uploads/blogs/" + files.image.originalFilename;
                    let AddBlogs = await model.AddBlogsQuery(bl_heading, bl_name, bl_hashtags, bl_description, bl_created_at, imagepath)
                    console.log(AddBlogs.insertId, "AddBlogs");

                })
                return res.send({
                    result: true,
                    message: "Insights uploaded successfully"
                });

            } else {
                return res.send({
                    result: true,
                    message: "Insights upload failed"
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


module.exports.lisṭBlogs = async (req, res) => {
    try {
        let {bl_id} = req.body || {}

        let condition = ''

        if (bl_id) {
            condition = `where bl_id = ${bl_id}`
        }
        let listBlogs = await model.listBlogsQuery(condition);

        if (listBlogs.length > 0) {
            return res.send({
                result: true,
                message: "data retrieved",
                list: listBlogs,

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


module.exports.EditBlogs = async (req, res) => {
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

            let { bl_id, bl_heading, bl_name, bl_hashtags, bl_description } = fields

            if (!bl_id) {
                return res.send({
                    result: false,
                    messaage: "user id is required"
                })
            }

            var checkblog = await model.CheckBlogQuery(bl_id)

            console.log(checkblog);

            if (checkblog.length > 0) {
                console.log(bl_id);

                let condition = ``;

                if (bl_heading) {
                    if (condition == '') {
                        condition = `set bl_heading ='${bl_heading}'`
                    } else {
                        condition += `,bl_heading='${bl_heading}'`
                    }
                }
                if (bl_name) {
                    if (condition == '') {
                        condition = `set bl_name='${bl_name}'`
                    } else {
                        condition += `,bl_name='${bl_name}'`
                    }
                }
                if (bl_hashtags) {
                    if (condition == '') {
                        condition = `set bl_hashtags ='${bl_hashtags}'`
                    } else {
                        condition += `,bl_hashtags='${bl_hashtags}'`
                    }
                }
                if (bl_description) {
                    if (condition == '') {
                        condition = `set bl_description ='${bl_description}' `
                    } else {
                        condition += `,bl_description='${bl_description}'`
                    }
                }


                if (condition !== '') {
                    var EditBlogs = await model.ChangeBlogInfo(condition, bl_id)
                }

                if (EditBlogs.affectedRows > 0) {

                    if (files.image) {
                        var oldPath = files.image.filepath;
                        var newPath =
                            process.cwd() +
                            "/uploads/blogs/" + files.image.originalFilename
                        let rawData = fs.readFileSync(oldPath);
                        console.log(oldPath);

                        fs.writeFileSync(newPath, rawData)
                        var image = "/uploads/blogs/" + files.image.originalFilename

                        var Insertblogimage = await model.Updateimage(image, bl_id)

                        if (Insertblogimage.affectedRows) {
                            return res.send({
                                result: true,
                                message: "blog updated successfully"
                            })
                        } else {
                            return res.send({
                                result: false,
                                message: "failed to update Insights"
                            })
                        }
                    }
                    return res.send({
                        result: true,
                        message: "Insights updated successfully"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "failed to update Insights"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "Insight details not found"
                })
            }
        })

    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })

    }
}

module.exports.DeleteBlogs = async (req, res) => {
    try {
        let bl_id = req.body.bl_id

        let listBlogs = await model.CheckBlogQuery(bl_id);

        if (listBlogs.length > 0) {

            let deleteBlogs = await model.DeleteBlogsQuery(bl_id);

            if (deleteBlogs.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "Insight deleted sucessfully",
                });
            }


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