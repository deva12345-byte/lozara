var model = require("../model/order");
var moment = require("moment");
var nodemailer = require("nodemailer");

module.exports.AddOrder = async (req, res) => {
    try {
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
        var { u_id, amount, payment_method, user_name, user_email, user_mobile_no,address_id, product_details } = req.body;
        if (!u_id || !amount || !payment_method || !user_name || !user_email || !user_mobile_no || !address_id || !product_details) {
            return res.send({
                result: false,
                messagae: "insufficent parameter"
            })
        }
        if (payment_method == "cash on delivery") {
            let date = moment().format("YYYY-MM-DD");
            var addorder = await model.AddOrderquery(u_id, amount, date, payment_method, user_name, user_email, user_mobile_no, address_id);
            console.log(addorder.insertId, "orderid");

            if (addorder.affectedRows) {
                // var product = product_details
                //  console.log(product,"ppp");
                var tablehtml = "";
                 let products = typeof product_details === "string" ? JSON.parse(product_details) : product_details;

                 console.log(products,"vvvvv");

                await Promise.all(
                    products.map(async (element) => {

                        var insertproduct = await model.ProductInsert(
                            addorder.insertId,
                            element)

                        console.log(element.product_id);

                        let checkproduct = await model.getproduct(element.product_id);
                        console.log(checkproduct);
                        if (checkproduct.length > 0) {

                            var balancestock = checkproduct[0].p_stocks - element.quantity
                            console.log(balancestock);
                            let addstock = await model.AddStocks(balancestock, element.product_id)

                            tablehtml += `<tr>
                        <td>${checkproduct[0].p_productname}</td>
                        <td>${checkproduct[0].p_discount_prize}</td>
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
                                from: "LOZARA <noreply@drlifeboat.com>",
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
                   
                                   let key_id = "rzp_live_uWwzPjKoomxUqv"
                                   let key_secret = "ImoGHKUUoqKw7JfTKt3IAnBX"
                   
                                   //-------test -----------//
                   
                                   // let key_id = "rzp_test_OV69louybHZfVB"
                                   // let key_secret = "n53FP19r6Wy35LLdlqBCxoCH"
                   
                                   let callbackurl = `https://lunarsenterprises.com:6029/lozara/razorpay/callback?order_id=${addorder.insertId}`
                                   var authHeader = {
                                       auth: {
                                           username: key_id,
                                           password: key_secret,
                                       },
                                   };
                                   var paymentLinkData = {
                                       amount: Number(amount) * 100, // Amount in paisa
                                       currency: 'INR',
                                       description: 'payment for product', // You can use the merchantReference or any appropriate description here
                                       customer: {
                                           name: user_name,
                                           email: user_email,
                                           phone: user_mobile_no // Assuming user is an object with name, contact, and email properties
                                       },
                                       callback_url: callbackurl
                                   };
                   
                   
                                   axios.post('https://api.razorpay.com/v1/payment_links', paymentLinkData, authHeader)
                                       .then(response => {
                                           console.log('Payment link created successfully:', response.data);
                                           return res.json({
                                               result: true,
                                               message: 'order added successfully',
                                               paymentLinkUrl: response.data.short_url
                                           });
                                           // Handle response data as needed
                                       })
                                       .catch(error => {
                                           console.error('Error creating payment link:', error.response.data.error);
                                           // Handle error response
                                       });
                               
                }

            } else {
                return res.send({
                    result: false,
                    message: "failed to order product "
                })
            }
        } else {
            return res.send({
                result: false,
                message: "online payment not avilable "
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })

    }
}
