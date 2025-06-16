
var db = require('../db/db.js');
var util = require("util");
const query = util.promisify(db.query).bind(db);


module.exports.AddFaqQuery = async (question, answer) => {
    var Query = `insert into faq (fq_question,fq_answers) values(?,?)`;
    var data = query(Query, [question, answer]);
    return data;


}
module.exports.ListFaqQuerry = async (condition) => {
    var Query = ` select * from faq ${condition}`;
    var data = await query(Query);
    return data;

}
module.exports.RemoveFaqQuery = async (fq_id) => {
    var Query = `delete from faq where fq_id=?`
    var data = await query(Query, [fq_id]);
    return data;


}
module.exports.UpdateFaqDetails = async (question, answer, fq_id) => {
    var Query = ` UPDATE faq SET fq_question=?,fq_answers=? WHERE fq_id = ?`
    var data = await query(Query, [question, answer, fq_id]);
    return data;
}

module.exports.checkFaqQuery = async (fq_id) => {
    var Query = `select * from faq where fq_id=?`;
    var data = await query(Query, [fq_id]);
    return data;
}

