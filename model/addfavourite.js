var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);


module.exports.CheckUser = async (user_id) => {
    var Query = `select * from users where u_id = ?`;
    var data = query(Query, [user_id]);
    return data;
};
module.exports.CheckProduct= async (p_id) => {
    var Query = `select * from products where p_id = ?`;
    var data = query(Query, [p_id]);
    return data;
};

module.exports.AddWish = async (p_id, user_id) => {
    var Query = `INSERT INTO fav (f_p_id, f_u_id) VALUES (?,?) `;
    var data = query(Query, [p_id, user_id]);
    return data;
};

module.exports.CheckWish = async (p_id, user_id) => {
    var Query =` select * from fav where f_p_id = ? and f_u_id = ?`;
    var data = query(Query, [p_id, user_id]);
    return data;
};

module.exports.RemoveWish = async (p_id) => {
    var Query = `DELETE FROM fav where f_p_id = ?`;
    var data = query(Query, [p_id]);
    return data;
};