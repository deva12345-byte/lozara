var model = require("../model/cancelOrder");
var Razorpay = require('razorpay')
const randtoken = require('rand-token');
var axios = require('axios')
var nodemailer = require("nodemailer");

module.exports.CancelOrder = async (req, res) => {
    try {

        var user_id = req.headers.user_id;
        var order_id = req.body.order_id;
        var order_product_id = req.body.order_product_id;

        if (!user_id || !order_id) {
            return res.send({
                result: false,
                message: "user id and order id is required"
            })
        }
        
        let checkuser = await model.CheckUser(user_id);

        if (checkuser.length == 0) {
            return res.send({
                result: false,
                message: "user not found"
            })
        }
            let checkorder = await model.CheckOrder(order_id, user_id);
             if (checkorder.length== 0) {
                return res.send({
                    result: false,
                    message: "Order not found"
                })
             }

              let checkorderproduct = await model.CheckOrderProduct(order_product_id);
             if (checkorderproduct.length== 0) {
                return res.send({
                    result: false,
                    message: "Order product not found"
                })
             }

            let getaddress = await model.Getaddress(checkorder[0]?.od_address_id);

            var deliverystatus = checkorderproduct[0]?.op_delivery_status

            var order_date = checkorder[0]?.od_created_at

            if (deliverystatus == 'Cancelled') {
                return res.send({
                    result: true,
                    message: "This order is already cancelled "
                })
            }

            if (deliverystatus == 'Delivered' || deliverystatus == 'Out for Delivery') {
                return res.send({
                    result: true,
                    message: "This order cannot be cancelled,You exceeded the cancel time! "
                })
            }
            
            if (checkorder.length > 0) {
                if (checkorder[0].od_payment_method !== 'Cash on Delivery') {
                    var paymentId = checkorder[0].payment_id; // Replace PAYMENT_ID with the actual payment ID

                    // let key_id = "rzp_test_4JJAaipsPAqRRJ"
                    // let key_secret = "Gw6kdV3PCewFzn9kpvWU5zJH"

                    var requestData = {
                        "amount": Number(checkorder[0].od_amount) * 100,
                        "speed": "optimum",
                        "receipt": "Receipt No:" + " " + generateOrderId()
                    }
                    var authHeader = {
                        auth: {
                            username: key_id,
                            password: key_secret,
                        },
                    };

                    axios.post(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, requestData, authHeader)
                        .then(async response => {
                            let removeorder = await model.RemoveOrder(order_product_id);

                            console.log('Refund successful:', response?.data);
                            res.send({
                                result: true,
                                message: response?.data
                            })
                        })

                        .catch(error => {

                            console.error(error?.response?.data?.error?.description);
                            res.send({
                                result: false,
                                message: error.response ? error.response?.data?.error?.description : error?.message
                            })

                        });
                } else {
                    let removeorder = await model.RemoveOrder(order_product_id);

                    let transporter = nodemailer.createTransport({
                        host: "smtp.hostinger.com",
                        port: 587,
                        auth: {
                            type: 'custom',
                            method: 'PLAIN',
                            user: 'nocontact@drlifeboat.com',
                            pass: 'Lozara@2025',
                        },
                    });

                    let data = [{
                        email: ` ${checkuser[0]?.u_email}`,
                        subject: "LOZARA CANCEL ORDER CONFIRMED",
                        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Cancellation Confirmation</title>
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
        p {
            color: #555;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 0.9em;
            color: #555;
        }
        .success-message {
            font-size: 1.2em;
            color: green;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Order Cancellation Successful</h1>
        <p class="success-message">Dear ${checkuser[0]?.u_name}, your order has been successfully canceled.</p>
        
       <p>We are writing to confirm that your order cancellation request has been successfully processed.</p>
 
                <p>If you have any further questions or concerns, feel free to reach out to our support team. We're here to assist you.</p>
                <p>Thank you for your understanding and cooperation.</p>
                <p>Order Id :${order_id}</p>
        <div class="footer">
            <p>Thank you for being with us!</p>
            <p>LOZARA TEAM</p>
        </div>
    </div>
</body>
</html>
`
                    },
                    {
                        email: 'jaisonlunar701@gmail.com',
                        subject: `LOZARA CANCEL ORDER FROM : ${checkuser[0]?.u_name}`,
                        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Cancellation Notification</title>
  <style>
    body {
      background-color: #f0f2f5;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .email-container {
      max-width: 620px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      padding: 30px;
      color: #333;
    }

    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #eaeaea;
    }

    .header h1 {
      font-size: 24px;
      color: #d93025;
      margin: 0;
    }

    .content {
      margin-top: 20px;
      font-size: 16px;
      line-height: 1.6;
    }

    .order-info {
      margin: 20px 0;
      border-collapse: collapse;
      width: 100%;
    }

    .order-info td {
      padding: 10px 5px;
    }

    .order-info td:first-child {
      font-weight: bold;
      width: 40%;
      color: #555;
    }

    .order-info td:last-child {
      color: #111;
    }

    .important {
      color: #d93025;
      font-weight: bold;
    }

    .footer {
      margin-top: 30px;
      padding-top: 20px;
      text-align: center;
      font-size: 14px;
      color: #888;
      border-top: 1px solid #eaeaea;
    }

    @media (max-width: 620px) {
      .email-container {
        margin: 10px;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Order Cancelled</h1>
    </div>

    <div class="content">
      <p>Hello Sir,</p>
      <p>We regret to inform you that the following order has been <span class="important">cancelled</span>:</p>

      <table class="order-info">
        <tr>
          <td>User Name:</td>
          <td>${checkuser[0]?.u_name}</td>
        </tr>
        <tr>
          <td>Order ID:</td>
          <td>${order_id}</td>
        </tr>
        <tr>
          <td>Order Date:</td>
          <td>${order_date}</td>
        </tr>
        <tr>
          <td>Phone Number:</td>
          <td>${getaddress[0]?.adr_phone}</td>
        </tr>
      </table>

      <p>If you require any further information, we encourage you to contact the customer directly.</p>
    </div>

    <div class="footer">
      <p>Thank you for your attention.</p>
      <p><strong>LOZARA TEAM</strong></p>
    </div>
  </div>
</body>
</html>
`
                    }]


                    data.forEach(async (el) => {
                        let infos = await transporter.sendMail({
                            from: "LOZARA <nocontact@drlifeboat.com>",
                            to: el.email,
                            subject: el.subject,
                            html: el.html
                        });
                        nodemailer.getTestMessageUrl(infos);

                    });

                    res.send({
                        result: true,
                        message: "order cancelled successfully"
                    })

                }
                // console.log("in here", checkorder[0].od_payment_method);

            } else {
                return res.send({
                    result: false,
                    message: "order details not found"
                })
            }
        
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};

const generateOrderId = () => {
    return randtoken.generate(4, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
};


