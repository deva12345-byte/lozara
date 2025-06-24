var db = require('../db/db.js');
var util = require("util");
const query = util.promisify(db.query).bind(db);


module.exports.TotalsalesQuery = async () => {
    var Query = `SELECT SUM(od_amount) AS total_amount FROM orders;`;
    var data = query(Query);
    return data;
}

module.exports.TotalUserQuery = async () => {
    var Query = `SELECT COUNT(*) AS total_users FROM users; `;
    var data = await query(Query);
    return data;
}

module.exports.TotalProductsQuery = async () => {
    var Query = `SELECT COUNT(*) AS total_products FROM products; `;
    var data = await query(Query);
    return data;
}

module.exports.TotalUpcomingProductQuery = async () => {
    var Query = `SELECT COUNT(*) AS upcoming_products FROM products 
WHERE p_upcoming = 1 `;
    var data = await query(Query);
    return data;
}


module.exports.ThisMonthSalesQuery = async () => {
    var Query = `SELECT SUM(od_amount) AS total_sales_this_month FROM orders
WHERE MONTH(od_created_at) = MONTH(CURDATE()) AND YEAR(od_created_at) = YEAR(CURDATE())`;
    var data = await query(Query);
    return data;
}

module.exports.ThisYearSalesQuery = async () => {
    var Query = `SELECT SUM(od_amount) AS total_sales_this_year FROM orders
    WHERE YEAR(od_created_at) = YEAR(CURDATE())`;
    var data = await query(Query);
    return data;
}