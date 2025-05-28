

var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.concerncategoryadd = async (concerncategoryname, imagepath) =>{
    var Query = `insert into concerncategory (cc_name,cc_image)values(?,?)`;
    var data = query(Query, [concerncategoryname, imagepath]);
    return data;
}
