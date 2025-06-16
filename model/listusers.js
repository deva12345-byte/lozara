var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.ListUserQuery = async (condition) => {
    var Query = `SELECT * FROM users ${condition} `;
    var data = query(Query);
    return data;

}
