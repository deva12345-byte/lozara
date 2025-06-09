var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);
var nodemailer = require('nodemailer')

module.exports.RazorpayCallback = async (req, res) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 587,
        auth: {
            type: "custom",
            method: "PLAIN",
            user: 'noreply@drlifeboat.com',
            pass: 'Drlifeboat@noreply123',
        },
    });

    let order_id = req.query.order_id
    if (req.query.razorpay_payment_link_status == 'paid') {
        let updateOrder = await UpdateOrderChnge(order_id)
        if (updateOrder.affectedRows > 0) {
            let orders = await getOrder(order_id)

            var tablehtml = "";
            let checkproduct = await getproduct(order_id);
            await Promise.all(
                checkproduct.map(async (element) => {

                    tablehtml += '<tr>' +
                        '<td>' + element.p_productname + ' (' + element.op_quantity + ' ' + element.p_unit + ')</td>' +
                        '<td>' + element.p_prize + '</td>' +
                        '<td>' + element.op_quantity + '</td>' +
                        '<td>' + (parseFloat(element.p_prize) * parseFloat(element.op_quantity)) + '</td>' +
                        '</tr>';

                }));

            let info = await transporter.sendMail({
                from: "LOZARA <noreply@drlifeboat.com>",
                to: orders[0]?.user_email,
                subject: "MESSAGE FROM LOZARA",
                html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products Order Details</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: auto;
        }
        h1 {
            color: #333;
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #007bff;
            color: white;
        }
        tr:hover {
            background-color: #f1f1f1;
        }
        .deleveryfee{
            color:red;
            font-size:13px;
        }
        .total {
            font-weight: bold;
            font-size: 1.2em;
            text-align: right;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 0.9em;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Products Order Details</h1>
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                   ${tablehtml}
                <tr>
                    <td class="total" colspan="3"><span class="deleveryfee">(include delivery fee)</span>Total:</td>
                    <td class="total">${orders[0]?.od_amount}</td>
                </tr>
            </tbody>
        </table>
        <div class="footer">
            <p>Thank you for your order!</p>
            <p>If you have any questions, feel free to contact us.</p>
        </div>
    </div>
</body>
</html>
`,
            });

            nodemailer.getTestMessageUrl(info);

            return res.send(`<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Payment Successful</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f0f0f0;
                            margin: 0;
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                        }
                
                        .container {
                            background-color: #fff;
                            border-radius: 8px;
                            padding: 20px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            text-align: center;
                        }
                
                        h1 {
                            color: #27ae60;
                            margin-bottom: 20px;
                        }
                
                        p {
                            color: #333;
                            margin-bottom: 30px;
                        }
                
                        .button {
                            background-color: #27ae60;
                            color: #fff;
                            padding: 10px 20px;
                            border-radius: 5px;
                            text-decoration: none;
                            transition: background-color 0.3s ease;
                        }
                
                        .button:hover {
                            background-color: #219653;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Payment Successful</h1>
                        <p>Your payment was successful. Thank you for your purchase!</p>
                        <a href="https://lozara.com/" class="button">Back to Home</a>
                    </div>
                </body>
                </html>
                `)

        }
    } else {
        await DeleteOrder(order_id)
        return res.send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Failed</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: azure;
                    color: #721c24;
                    text-align: center;
                    padding: 50px;
                }
                .container {
                    display: inline-block;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    font-size: 24px;
                    margin-bottom: 20px;
                }
                p {
                    font-size: 18px;
                    margin-bottom: 20px;
                }
                a {
                    color: #007bff;
                    text-decoration: none;
                    font-weight: bold;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Payment Failed</h1>
                <p>We're sorry, but your payment could not be processed at this time.</p>
                <p>Please try again later or contact our support team if the issue persists.</p>
                <a href="https://lozara.com/">Go back to Home</a>
            </div>
        </body>
        </html>
        `)
    }
}


async function DeleteOrder(order_id) {
    var Query = `delete from orders where od_id = ?`;
    var data = await query(Query, [order_id]);
    return data;
};

async function UpdateOrderChnge(order_id) {
    var Query = `update orders set od_payment_status = ? where od_id = ?`;
    var data = await query(Query, ['paid', order_id]);
    return data;
};


async function getOrder(order_id) {
    var Query = `select * from orders where od_id = ?`;
    var data = await query(Query, [order_id]);
    return data;
};


async function getproduct(order_id) {
    var Query = `select * from order_product
    inner join products on products.p_id = order_product.op_product_id
    where op_order_id = ?`
    var data = await query(Query, [order_id]);
    return data;
}

