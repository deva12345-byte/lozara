var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db); // this is the promisified query function

// Get the existing offer banner
module.exports.GetTermsNconditionRefund = async () => {
    const sql = `SELECT * FROM termsNcondition_refund`;
    return await query(sql); // use the promisified query
};

// Update the offer banner by ID
module.exports.UpdateTermsNconditionRefund = async (condition, tc_id) => {
    const sql = `UPDATE termsNcondition_refund ${condition} WHERE tc_id = ?`;
    return await query(sql, [tc_id]);
};

// Add a new offer banner
module.exports.AddTermsNconditionRefundQuery = async (terms_and_condition,privacy_policy) => {
    const sql = `INSERT INTO termsNcondition_refund (tc_termsNcondition,tc_refund) VALUES (?,?)`;
    return await query(sql, [terms_and_condition,privacy_policy]);
};
