var model = require("../model/partners");
const path = require('path');
var fs = require("fs");
var formidable = require("formidable");

module.exports.addPartners = async (req, res) => {
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

            let { link } = fields

            if (files.image) {
                var oldPath = files.image.filepath;
                var newPath =
                    process.cwd() + "/uploads/partners/" +
                    files.image.originalFilename;
                let rawData = fs.readFileSync(oldPath);
                fs.writeFile(newPath, rawData, async function (err) {
                    if (err) console.log(err);
                    let imagepath = "uploads/partners/" + files.image.originalFilename;

                    await model.AddimageQuery(link, imagepath);

                })
                return res.send({
                    result: true,
                    message: "Partners details added successfully"
                })

            }
            else {
                return res.send({
                    result: false,
                    message: "image required "
                })
            }


        })


    } catch (error) {
        console.log(error);
        return res.send({
            result: false,
            message: error.message,
        })

    }
}
module.exports.listPartners = async (req, res) => {
    try {

        let listPartners = await model.listPartnersQuery();
        if (listPartners.length > 0) {
            return res.send({
                result: true,
                message: "data retrieved",
                list: listPartners,

            });

        } else {
            return res.send({
                result: false,
                messsage: "data not found",
            });
        }


    } catch (error) {
        return res.send({
            reult: false,
            message: error.message,
        });

    }
}
module.exports.deletePartners = async (req, res) => {
    try {
        let pt_id = req.body.pt_id;

        
        if (!pt_id) {
            return res.send({
                result: false,
                message: "missing id",
            })
        }

        let checkPartners = await model.checkPartnersQuery(pt_id);

        if (checkPartners.length > 0) {

            var deletesection = await model.removePartnersQuery(pt_id);

            if (deletesection.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "image deleted successfully"
                })

            } else {
                return res.send({
                    result: false,
                    message: "failed to delete image",
                })
            }

        } else {
            return res.send({
                result: false,
                message: "Partners details not found",
            })
        }


    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }

}
