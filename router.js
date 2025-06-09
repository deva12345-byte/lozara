var express = require("express");
var route = express.Router();
// var {verifyToken}=require('./components/jwt')

var { login } = require('./controller/login')
route.post('/login', login)

var { AddBanner } = require('./controller/banner')
route.post('/add/banner', AddBanner)

var { ListBanners } = require('./controller/banner')
route.post('/list/banner', ListBanners)

var { deleteBanners } = require('./controller/banner');
route.post('/delete/banner', deleteBanners)

var { EditBanner } = require('./controller/banner');
route.post('/edit/banner', EditBanner)

var { Register } = require('./controller/registration');
route.post('/register', Register)

var { Productadd } = require('./controller/product')
route.post('/product/add', Productadd)

var { Editproduct } = require('./controller/product')
route.post('/product/edit', Editproduct)

var { deleteproduct } = require('./controller/product')
route.post('/product/delete', deleteproduct)

var { Listproduct } = require('./controller/product')
route.post('/product/list', Listproduct)

var { categoryadd } = require('./controller/category')
route.post('/category/add', categoryadd)

var { Listcategory } = require('./controller/category')
route.post('/category/list', Listcategory)

var { deletecategory } = require('./controller/category')
route.post('/category/delete', deletecategory)

var { Editcategory } = require('./controller/category')
route.post('/category/edit', Editcategory)

var { concerncategoryadd } = require('./controller/concerncategoryadd')
route.post('/concerncategory/add', concerncategoryadd)

var { concerncategoryedit } = require('./controller/concerncategoryedit')
route.post('/concerncategory/edit', concerncategoryedit)

var { concerncategorylist } = require('./controller/listconcerncategory')
route.post('/concerncatogry/list', concerncategorylist)

var { deleteconcerncategory } = require('./controller/concerncategorydelete')
route.post('/concerncategory/delete', deleteconcerncategory)

var { addcart } = require('./controller/addcart')
route.post('/add/cart', addcart)

var { lisṭcart } = require('./controller/listcart')
route.post('/list/cart', lisṭcart)

var { deletecart } = require('./controller/deletecart')
route.post('/delete/cart', deletecart)

var { AddFav } = require('./controller/addfavourate')
route.post('/add/favourite', AddFav)

var { FavList } = require('./controller/listfavourite')
route.post('/list/favourite', FavList)


var { AddOrder } = require('./controller/order')
route.post('/add/order', AddOrder)                                     //payment gateway integration

var { RazorpayCallback } = require('./controller/razorpaycallback')
route.get('/razorpay/callback', RazorpayCallback)                          //payment gateway integration callback


var { listorder } = require('./controller/listorder')
route.post('/list/order', listorder)

var { deleteorder } = require('./controller/deleteorder')
route.post('/delete/order', deleteorder)

var { DeliveryStatus } = require('./controller/deliverystatus')
route.post('/update/deliverystatus', DeliveryStatus)

var { forgotpassword } = require('./controller/forgotpassword')
route.post('/forgotpassword', forgotpassword)

var { ResetPassword } = require('./controller/forgotpassword')
route.post('/changepassword', ResetPassword)

var { verifyOtp } = require('./controller/forgotpassword')
route.post('/verifyOtp', verifyOtp)

var { getintouchadd } = require('./controller/get in touch')
route.post('/add/get_in_touch', getintouchadd)

var { listgetintouch } = require('./controller/getintouchlist')
route.post('/list/get_in_touch', listgetintouch)

var { deletegetintouch } = require('./controller/getintouchdelete')
route.post('/delete/get_in_touch', deletegetintouch)

var { editgetintouch } = require('./controller/getintouchedit')
route.post('/edit/get_in_touch', editgetintouch)

var { reviewadd } = require('./controller/reviewadd')
route.post('/add/review', reviewadd)

var { addourstandard } = require('./controller/ourstandard')
route.post('/add/ourstandard', addourstandard)

var{listourstandard}=require('./controller/ourstandard')
route.post('/list/listourstandard',listourstandard)


var{deleteourstandard }=require('./controller/ourstandard')
route.post('/delete/ourstandard',deleteourstandard )

var{ContactUs}=require('./controller/contactus ')
route.post('/add/contact',ContactUs)

var{listcontact}=require('./controller/contactus ')
route.post('/list/contact',listcontact)

var{deletecontact}=require('./controller/contactus ')
route.post('/delete/contact',deletecontact)





module.exports = route
