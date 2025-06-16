var model = require('../model/registration');
var moment = require("moment");
var bcrypt =require("bcrypt");

module.exports.Register = async (req, res) => {
    try {
        var { name, email, password, mobile, address, state,district,pincode } = req.body
        if (!name || !email || !password || !mobile || !address || !state||!district||!pincode) {
            return res.send({
                result: false,
                message: "insufficent parmeter"
            })
        }
        var date = moment().format('YYYY-MM-DD')
        let checkmail = await model.CheckMail(email);

        if (checkmail.length > 0) {

            return res.send({
                result: false,
                message: "email already registerd"
            });

        } else {
            var hashedpasssword = await bcrypt.hash(password, 10)
            let adduser = await model.AddUser(name, email,hashedpasssword, mobile,address,state,district,pincode, date);

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
        // if (adduser.affectedRows) {
        //     return res.send({
        //         result: true,
        //         message: "registerd sucessfully"
        //     })

        // } else {
        //     return res.send({
        //         result: false,
        //         message: "failed to registerd "
        //     })
        // }
    } catch (error) {
        console.log(error);

        return res.send({
            result: false,
            message: error.message
        })
    }

}