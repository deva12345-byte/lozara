var model = require("../model/order");
var moment = require("moment");
var nodemailer = require("nodemailer");
let axios = require('axios')

module.exports.AddOrder = async (req, res) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 587,
            auth: {
                type: "custom",
                method: "PLAIN",
                 user:process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
            },
        });

        let date = moment().format("YYYY-MM-DD");

        var { u_id, amount, payment_method, user_name, user_email, user_mobile_no, address_id, user_address, user_state, user_district, landmark, user_city, user_zipcode, product_details } = req.body;

        if (!amount || !payment_method || !user_name || !user_email || !user_mobile_no || !product_details) {
            return res.send({
                result: false,
                messagae: "insufficent parameter"
            })
        }

        if (!u_id) {

            let checkmobile = await model.CheckMobile(user_mobile_no);

            if (checkmobile.length > 0) {
                u_id = checkmobile[0]?.u_id

            } else {
                let role = 'guest'

                let adduser = await model.AddUser(user_name, user_email, user_mobile_no, user_address, user_state, user_district, user_city, user_zipcode, date, role);
                if (adduser.affectedRows == 0) {
                    return res.send({
                        result: false,
                        message: "error in adding user details"

                    })
                } else {
                    u_id = adduser.insertId

                }
            }

        }

        console.log("user_id :", u_id);

        var addorder = await model.AddOrderquery(u_id, amount, date, payment_method, user_name, user_email, user_mobile_no, address_id, user_address, user_state, user_district, user_city, user_zipcode);
        console.log(addorder.insertId, "orderid");

        if (addorder.affectedRows) {
            // var product = product_details
            //  console.log(product,"ppp");
            var tablehtml = "";
            let products = typeof product_details === "string" ? JSON.parse(product_details) : product_details;

            // console.log(products, "vvvvv");

            await Promise.all(
                products.map(async (element) => {

                    var insertproduct = await model.ProductInsert(
                        addorder.insertId,
                        element)

                    console.log(element.product_id);

                    let checkproduct = await model.getproduct(element.product_id);
                    // console.log(checkproduct);
                    if (checkproduct.length > 0) {

                        var balancestock = checkproduct[0].p_stocks - element.quantity
                        // console.log(balancestock);
                        let addstock = await model.AddStocks(balancestock, element.product_id)

                        tablehtml += `<tr>
                        <td>${checkproduct[0].p_productname}</td>
                        <td>${checkproduct[0].p_discount_prize}</td>
                        <td>${element.packet_size}</td>
                        <td>${element.quantity}</td>
                        <td>${parseFloat(checkproduct[0].p_discount_prize) *
                            parseFloat(element.quantity)}</td>
                            </tr>`;
                    } else {
                        return res.send({
                            result: false,
                            message: "product not found"
                        })
                    }
                }));

            if (payment_method == "cash on delivery") {

                let data = [{
                    email: user_email,
                    subject: "LOZARA ORDER",
                    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cash on Delivery Details</title>
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
        <h1>Cash on Delivery Order Details</h1>
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Packet Quantity</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                   ${tablehtml}
                <tr>
                    <td class="total" colspan="3"><span class="deleveryfee">(include delivery fee)</span>Total:</td>
                    <td class="total">${amount}</td>
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
`}


                ]
                let output = await Promise.all(
                    data.map(async (element) => {
                        let info = await transporter.sendMail({
                            from: `LOZARA <${process.env.EMAIL}>`,
                            to: element.email,
                            subject: element.subject,
                            html: element.html,
                        });

                        nodemailer.getTestMessageUrl(info);
                        // console.log(info, "check");
                        return true;
                    })
                );
                if (output.length > 0) {
                    return res.send({
                        result: true,
                        message: "order added successfully",
                    });
                } else {
                    return res.send({
                        result: false,
                        message: "order not confirmed ,pls try again",
                    });
                }
            } else {

                //------live--------------//

                // let key_id = process.env.KEY_ID
                // let key_secret =process.env.KEY_SECRET

                //-------test -----------//

                const key_id = process.env.TEST_KEY_ID
                const key_secret = process.env.TEST_KEY_SECRET
console.log("api key",key_id,key_secret);

                let callback_url = `https://lunarsenterprises.com:6029/lozara/razorpay/callback?order_id=${addorder.insertId}`
                const authHeader = {
                    auth: {
                        username: key_id,
                        password: key_secret,
                    },
                };
                const paymentLinkData = {
                    amount: Number(amount) * 100, // Amount in paisa
                    currency: 'INR',
                    description: 'payment for product', // You can use the merchantReference or any appropriate description here
                    customer: {
                        name: user_name,
                        email: user_email,
                        phone: user_mobile_no // Assuming user is an object with name, contact, and email properties
                    },
                    callback_url,
                };


                axios.post('https://api.razorpay.com/v1/payment_links', paymentLinkData, authHeader)
                    .then(response => {
                        console.log('Payment link created successfully:', response.data);
                        return res.json({
                            result: true,
                            message: 'Payment link created successfully',
                            paymentLinkUrl: response.data.short_url
                        });
                        // Handle response data as needed
                    })
                    .catch(error => {
                        console.error('Error creating payment link:', error.response.data.error);
                        return res.json({
                            result: false,
                            message: 'failed to generate payment link',
                        });
                        // Handle error response
                    });

            }

        } else {
            return res.send({
                result: false,
                message: "failed to order product "
            })
        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })

    }
}
