var model = require('../model/registration');
var moment = require("moment");
var bcrypt = require("bcrypt");

module.exports.Register = async (req, res) => {
    try {
        var { name, email, password, mobile, address, state, district, pincode, register_method } = req.body
        var date = moment().format('YYYY-MM-DD')

        if (register_method == "userRegister") {

            if (!name || !email || !password || !mobile) {
                return res.send({
                    result: false,
                    message: "insufficent parmeter"
                })
            }
            let checkmobile = await model.CheckMobile(mobile);

            if (checkmobile.length > 0 && checkmobile[0]?.u_role === 'user') {

                return res.send({
                    result: false,
                    message: "Mobile number is already registerd"
                });
            }

            //guest user regitering
            
            if (checkmobile.length > 0 && checkmobile[0]?.u_role === 'guest') {

                let checkmail = await model.CheckMail(email);

                if (checkmail.length > 0) {

                    return res.send({
                        result: false,
                        message: "Email is already registerd"
                    });
                }
                let role = 'user'
                var hashedpasssword = await bcrypt.hash(password, 10)
                let updateuser = await model.UpdateUser(name, email, hashedpasssword, address, state, district, pincode, role, checkmobile[0]?.u_id);

                if (updateuser.affectedRows > 0) {
                    return res.send({
                        result: true,
                        message: "registerd sucessfully"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "error in adding user details"


                    })

                }
            }
            //guest user regitering end


            let checkmail = await model.CheckMail(email);

            if (checkmail.length > 0) {

                return res.send({
                    result: false,
                    message: "Email is already registerd"
                });
            }

            var hashedpasssword = await bcrypt.hash(password, 10)
            let adduser = await model.AddUser(name, email, hashedpasssword, mobile, address, state, district, pincode, date);

            if (adduser.affectedRows) {
                return res.send({
                    result: true,
                    message: "registerd sucessfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "error in adding user details"


                })

            }

        } else {
            if (!mobile) {
                return res.send({
                    result: false,
                    message: "Phone number is required"
                })
            }
            let role = 'guest'

            let checkmobile = await model.CheckMobile(mobile);

            if (checkmobile.length > 0) {

                return res.send({
                    result: false,
                    message: "mobile number already registerd"
                });
            }

            let adduser = await model.AddMobileUser(mobile, date, role);

            if (adduser.affectedRows) {
                return res.send({
                    result: true,
                    message: "registerd sucessfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "error in adding user details"
                })
            }
        }

    } catch (error) {
        console.log(error);

        return res.send({
            result: false,
            message: error.message
        })
    }

}