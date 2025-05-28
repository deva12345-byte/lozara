var model = require("../model/concerncategoryadd");
var formidable = require("formidable");
var fs = require("fs");
var path = require("path");

module.exports.concerncategoryadd = async (req, res) => {
    try {
        var form = new formidable.IncomingForm({ multiplies: true })
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "file upload failed!",
                    data: err,

                });
            }
            let { concerncategoryname } = fields
            if (!concerncategoryname) {
                return res.send({
                    result: false,
                    message: "insufficent parameter"
                })
            }
            if (files.image) {
                var oldpath = files.image.filepath;
                var newPath = process.cwd() + "/uploads/concerncategories/" + files.image.orginalFilename;
                let rawData = fs.readFileSync(oldpath);
                fs.writeFile(newPath, rawData, async function (err) {
                    if (err) console.log(err);
                    let imagepath = "uploads/concerncategories/" + files.image.orginalFilename;
                    await model.concerncategoryadd(concerncategoryname,imagepath);
                })
                return res.send({
                    result: true,
                    message: "concern added successsfully"

                });
            } else {
                return res.send({
                    result: true,
                    message: "image required"
                });
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


