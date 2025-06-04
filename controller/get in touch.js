var model = require("../model/get in touch");
var formidable = require("formidable");
var fs = require("fs");
const path = require("path");

module.exports.getintouchadd = async (req, res) => {
    try {
        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "file upload failed!",
                    data: err,
                });

            }
            let { description, heading, contact } = fields
            if (!description || !heading || !contact) {
                return res.send({
                    result: false,
                    message: "insufficent parameter"
                })
            }


            if (files.image) {
                var oldpath = files.image.filepath;
                var newpath =
                    process.cwd() + "/uploads/get_in_touch/" +
                    files.image.originalFilename;
                let rawData = fs.readFileSync(oldpath);
                fs.writeFile(newpath, rawData, async function (err) {
                    if (err) console.log(err);
                    let imagepath = "uploads/get_in_touch/" + files.image.originalFilename;

                    await model.getintouchaddQuery(description, heading, contact, imagepath);


                })
                return res.send({
                    result: true,
                    message: "details added successfully"

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



