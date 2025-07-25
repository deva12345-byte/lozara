var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.AddBlogsQuery = async (bl_heading, bl_name, bl_hashtags, bl_description, bl_created_at, imagepath) => {
    var Query = `insert into blog (bl_heading,bl_name,bl_hashtags,bl_description,bl_image,bl_created_at) values (?,?,?,?,?,?) `;
    var data = query(Query, [bl_heading, bl_name, bl_hashtags, bl_description, imagepath, bl_created_at]);
    return data;

}

module.exports.listBlogsQuery = async (condition) => {
    var Query = `select * from blog ${condition} `;
    var data = query(Query);
    return data;
};

module.exports.CheckBlogQuery = async (bl_id) => {
    var Query = `select * from blog where bl_id= ?`;
    var data = query(Query, [bl_id]);
    return data;
};

module.exports.ChangeBlogInfo = async (condition, bl_id) => {
    var Query = `update blog ${condition} where bl_id = ?`;
    var data = query(Query, [bl_id]);
    return data;
};
module.exports.Updateimage = async (image, bl_id) => {
    var Query = `update blog set bl_image = ?  where bl_id = ? `;
    var data = query(Query, [image, bl_id]);
    return data;
};

module.exports.DeleteBlogsQuery = async (bl_id) => {
    var Query = `delete from blog where bl_id= ?`;
    var data = query(Query, [bl_id]);
    return data;
};