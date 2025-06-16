var model = require("../model/addAddress");

module.exports.addAddress = async (req, res) => {

    try {
        let { user_id, type, heading, address, state, district, pincode,phone, setdefault } = req.body

        if (!user_id || !type || !heading || !address || !state || !district || !pincode || !phone) {
            return res.send({
                result: false,
                message: "all fields are required"
            });
        }

        let addAddress = await model.AddAddressQuery(user_id, type, heading, address, state, district, pincode,phone, setdefault);

        if (addAddress.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Address added successfully"
            })
        } else {
            return res.send({
                result: failed,
                message: "Address added failed"
            })
        }

    } catch (error) {
        console.log(error);
        return res.send({
            result: false,
            message: error.message,
        });
    }

}

module.exports.ListAddress = async (req, res) => {
    try {
        let { user_id } = req.body || {}

        let listAddress = await model.ListAddressQuerry(user_id);
        if (listAddress.length > 0) {
            return res.send({
                result: true,
                message: "data retrieved",
                list: listAddress,

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

module.exports.deleteAddress = async (req, res) => {
    try {
        let adr_id = req.body.adr_id;
        if (adr_id) {
            let checkAddress = await model.checkaddressQuery(adr_id);
            if (checkAddress.length == 0) {
                return res.send({
                    result: false,
                    message: "Address not found"
                });
            } else {
                var deletesection = await model.RemoveAddressQuery(adr_id);

                if (deletesection.affectedRows > 0) {
                    return res.send({
                        result: true,
                        message: "Address deleted successfully"
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
module.exports.EditAddress = async (req, res) => {
    try {
        const { adr_id, type, heading, address, state, district, pincode, setdefault } = req.body;

        if (!adr_id) {
            return res.send({
                result: false,
                message: 'Insufficient parameters',
            });
        }

        const AddressExists = await model.checkaddressQuery(adr_id);
        if (AddressExists.length === 0) {

            return res.send({
                result: false,
                message: 'Address does not exist',
            });

        } else {
            let condition = ``;

            if (type) {
                if (condition == '') {
                    condition = `set adr_type ='${type}' `
                } else {
                    condition += `,adr_type='${type}'`
                }
            }
            if (heading) {
                if (condition == '') {
                    condition = `set adr_heading='${heading}' `
                } else {
                    condition += `,adr_heading='${heading}'`
                }
            }
            if (address) {
                if (condition == '') {
                    condition = `set adr_address ='${address}' `
                } else {
                    condition += `,adr_address='${address}'`
                }
            }
            if (state) {
                if (condition == '') {
                    condition = `set adr_state ='${state}' `
                } else {
                    condition += `,adr_state='${state}'`
                }
            }
            if (district) {
                if (condition == '') {
                    condition = `set adr_district ='${district}' `
                } else {
                    condition += `,adr_district='${district}'`
                }
            }
            if (pincode) {
                if (condition == '') {
                    condition = `set adr_pincode ='${pincode}' `
                } else {
                    condition += `,adr_pincode='${pincode}'`
                }
            }
            if (setdefault) {
                if (condition == '') {
                    condition = `set adr_setdefault ='${setdefault}' `
                } else {
                    condition += `,adr_setdefault='${setdefault}'`
                }
            }

            if (condition !== '') {
                var Editaddress = await model.UpdateAddressDetails(condition, adr_id)
            }

            if (Editaddress.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: 'Address updated successfully',
                });
            }
        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }

}




