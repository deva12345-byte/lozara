const model = require('../model/refundTermsAndPolicy');

module.exports.AddTermsNconditionRefund = async (req, res) => {
    try {
        let { terms_and_condition, privacy_policy } = req.body; // Assuming you're using req.body, not `fields`


        // Step 1: Check if TermsNconditionRefund already exists
        const existingTermsNconditionRefund = await model.GetTermsNconditionRefund(); // Replace with your actual query to fetch

        let response;

        if (existingTermsNconditionRefund.length > 0) {
            let tc_id = existingTermsNconditionRefund[0]?.tc_id;
            let condition = "";
            if (terms_and_condition) {
                if (condition == "") {
                    condition = `set tc_termsNcondition = '${terms_and_condition}'`
                } else {
                    condition += `,tc_termsNcondition = '${terms_and_condition}'`

                }
            }

            if (privacy_policy) {
                if (condition == "") {
                    condition = `set tc_refund = '${privacy_policy}'`
                } else {
                    condition += `,tc_refund = '${privacy_policy}'`

                }
            }
            response = await model.UpdateTermsNconditionRefund(condition,tc_id);
        } else {
            // Step 3: Insert if not exists
            response = await model.AddTermsNconditionRefundQuery(terms_and_condition, privacy_policy);
        }

        if (response.affectedRows > 0) {
            return res.status(200).json({
                result: true,
                message: existingTermsNconditionRefund.length > 0 ? 'Terms and conditions and Refund policy updated successfully' : 'Terms and conditions and Refund policy added successfully',
            });
        } else {
            return res.status(200).json({
                result: false,
                message: 'Failed to save Terms and conditions and Refund policy',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            result: false,
            message: 'An unexpected error occurred.',
            data: error,
        });
    }
};



module.exports.ListTermsNconditionRefunds = async (req, res) => {
    try {

        let ListTermsNconditionRefunds = await model.GetTermsNconditionRefund();
        if (ListTermsNconditionRefunds.length > 0) {
            return res.send({
                result: true,
                message: "data retrieved",
                list: ListTermsNconditionRefunds
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