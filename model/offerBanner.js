var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db); // this is the promisified query function

// Get the existing offer banner
module.exports.GetOfferBanner = async () => {
    const sql = `SELECT * FROM offer_banner`;
    return await query(sql); // use the promisified query
};

// Update the offer banner by ID
module.exports.UpdateOfferBanner = async (text, id) => {
    const sql = `UPDATE offer_banner SET ob_text = ? WHERE ob_id = ?`;
    return await query(sql, [text, id]);
};

// Add a new offer banner
module.exports.AddOfferBannerQuery = async (text) => {
    const sql = `INSERT INTO offer_banner (ob_text) VALUES (?)`;
    return await query(sql, [text]);
};
