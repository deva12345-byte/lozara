var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.AddOrderquery = async (u_id, amount, date, payment_method, user_name, user_email, user_mobile_no, address_id,user_address,user_state,user_district,user_city,user_zipcode) => {
    var Query = `insert into orders (od_u_id,od_amount, od_created_at, od_payment_method, user_name, user_email, user_mobile_no, od_address_id,user_address,user_state,user_district,user_city,user_zipcode)
     values(?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    var data = await query(Query, [u_id, amount, date, payment_method, user_name, user_email, user_mobile_no, address_id,user_address,user_state,user_district,user_city,user_zipcode]);
    return data;
};
module.exports.ProductInsert = async (order_id, element) => {
    console.log(element.product_id);
    var Query =`insert into order_product (op_order_id,op_product_id,op_packet_size,op_quantity)values(?,?,?,?)`;
    var data = await query(Query, [order_id, element.product_id,element.packet_size, element.quantity]);
    return data;
};

module.exports.getproduct = async (product_id) => {
    var Query = `select * from products where p_id = ?`;
    var data = await query(Query, [product_id]);
    return data;
}

module.exports.AddStocks = async (balancestock, product_id) => {
    var Query = `update products set p_stocks =?  where p_id = ?`;
    var data = await query(Query, [balancestock, product_id]);
    return data;
}

module.exports.AddUser = async (user_name, user_email, user_mobile_no,user_address,user_state,user_district,user_city,user_zipcode, date,role) => {
    var Query = `insert into users (u_name,u_email,u_mobile,u_address,u_state,u_district,u_city,u_pincode,u_joindate,u_role)values(?,?,?,?,?,?,?,?,?,?)`;
    var data = await query(Query, [user_name, user_email, user_mobile_no,user_address,user_state,user_district,user_city,user_zipcode, date,role])
    return data;
}

module.exports.CheckMobile = async (mobile) => {
    var Query = `select * from users where u_mobile=? `
    var data = query(Query, [mobile]);
    return data;
}