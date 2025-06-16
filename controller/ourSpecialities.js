var model = require("../model/ourSpecialities");
const path = require('path');
var fs = require("fs");
var formidable = require("formidable");
const { checkorderQuery } = require("../model/deleteorder");

module.exports.addOurSpecialities = async (req, res) => {
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

            let { title } = fields
            if (!title) {
                return res.send({
                    result: false,
                    message: "title is required",
                });

            }
            if (files.image) {
                var oldPath = files.image.filepath;
                var newPath =
                    process.cwd() + "/uploads/ourspecialities/" +
                    files.image.originalFilename;
                let rawData = fs.readFileSync(oldPath);
                fs.writeFile(newPath, rawData, async function (err) {
                    if (err) console.log(err);
                    let imagepath = "uploads/ourspecialities/" + files.image.originalFilename;

                    await model.AddimageQuery(title, imagepath);

                })
                return res.send({
                    result: true,
                    message: "image added successfully"
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
module.exports.listOurSpecialities = async (req, res) => {
    try {

        let listOurSpecialities = await model.listOurSpecialitiesQuery();
        if (listOurSpecialities.length > 0) {
            return res.send({
                result: true,
                message: "data retrieved",
                list: listOurSpecialities,

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
module.exports.deleteOurSpecialities = async (req, res) => {
    try {
        let osp_id = req.body.osp_id;
        if (!osp_id) {

            return res.send({
                result: false,
                message: "missing required id",

            })
        }
        let checkOurSpecialities = await model.checkOurSpecialitiesQuery(osp_id);
        if (checkOurSpecialities.length == 0) {
            return res.send({
                result: false,
                message: " Our Specialities details is not found"
            })
        } else {
            var deletesection = await model.removeOurSpecialitiesQuery(osp_id);
            if (deletesection.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "deleted successfully"

                })
            } else {
                return res.send({
                    result: false,
                    message: "failed to delete"
                })
            }
        }


    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }


}
