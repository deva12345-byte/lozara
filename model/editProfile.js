var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (u_id) => {
    var Query = `select * from users where u_id= ?`;
    var data = query(Query, [u_id]);
    return data;
};

module.exports.ChangeUserInfo = async (condition, u_id) => {
    var Query = `update users ${condition} where u_id = ?`;
    var data = query(Query, [u_id]);
    return data;
};
module.exports.Updateimage = async (image, u_id) => {
    var Query = `update users set u_image = ?  where u_id = ? `;
    var data = query(Query, [image, u_id]);
    return data;
};
