var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);



module.exports.listcartQuery = async (userid) => {
    var Query = `SELECT 
  ct.*, 
  p.*
FROM cart ct 
INNER JOIN products p ON ct.ct_product_id = p.p_id 
WHERE ct.ct_user_id = ? `;
    var data = await query(Query, [userid]);
    return data;
}