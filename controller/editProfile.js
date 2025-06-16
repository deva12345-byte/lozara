var model = require('../model/editProfile')
var formidable = require('formidable')
var fs = require('fs')

module.exports.EditPersonalInfo = async (req, res) => {
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

            let { u_id, name, email, mobile, address, district, state, zip_code } = fields

            if (!u_id) {
                return res.send({
                    result: false,
                    messaage: "user id is required"
                })
            }

            var checkprofile = await model.CheckUserQuery(u_id)
         
            console.log(checkprofile);

            if (checkprofile.length > 0) {
                console.log(u_id);

                let condition = ``;

                if (name) {
                    if (condition == '') {
                        condition = `set u_name ='${name}' `
                    } else {
                        condition += `,u_name='${name}'`
                    }
                }
                if (email) {
                    if (condition == '') {
                        condition = `set u_email='${email}' `
                    } else {
                        condition += `,u_email='${email}'`
                    }
                }
                if (mobile) {
                    if (condition == '') {
                        condition = `set u_mobile ='${mobile}' `
                    } else {
                        condition += `,u_mobile='${mobile}'`
                    }
                }
                if (address) {
                    if (condition == '') {
                        condition = `set u_address ='${address}' `
                    } else {
                        condition += `,u_address='${address}'`
                    }
                }
                if (district) {
                    if (condition == '') {
                        condition = `set u_district ='${district}' `
                    } else {
                        condition += `,u_district='${district}'`
                    }
                }
                if (state) {
                    if (condition == '') {
                        condition = `set u_state ='${state}' `
                    } else {
                        condition += `,u_state='${state}'`
                    }
                }
                if (zip_code) {
                    if (condition == '') {
                        condition = `set u_pincode ='${zip_code}' `
                    } else {
                        condition += `,u_pincode='${zip_code}'`
                    }
                }

                if (condition !== '') {
                    var EditpersonalInfo = await model.ChangeUserInfo(condition, u_id)
                }

                if (EditpersonalInfo) {

                    if (files.image) {
                        var oldPath = files.image.filepath;
                        var newPath =
                            process.cwd() +
                            "/uploads/profiles/" + files.image.originalFilename
                        let rawData = fs.readFileSync(oldPath);
                        console.log(oldPath);

                        fs.writeFileSync(newPath, rawData)
                        var image = "/uploads/profiles/" + files.image.originalFilename

                        var Insertprofileimage = await model.Updateimage(image, u_id)

                        if (Insertprofileimage.affectedRows) {
                            return res.send({
                                result: true,
                                message: "profile updated successfully"
                            })
                        } else {
                            return res.send({
                                result: false,
                                message: "failed to update profile"
                            })
                        }
                    }
                    return res.send({
                        result: true,
                        message: "profile updated successfully"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "failed to update profile"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "user not found"
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

