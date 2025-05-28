var model = require("../model/addfavourite");

module.exports.AddFav = async (req, res) => {
  try {
    var { user_id, p_id, fav } = req.body;
    // var Id = req.body.Id;
    let CheckUser = await model.CheckUser (user_id);

    if (CheckUser.length > 0) {
      let checkproduct = await model.CheckProduct(p_id);
      if (checkproduct.length > 0) {
        let checkwish = await model.CheckWish(p_id, user_id);
        if (checkwish.length > 0) {
          if (fav == 0) {
            let removewish = await model.RemoveWish(p_id, user_id);
            return res.send({
              result: true,
              message: "product removed from favourite ",
            });
          } else {
            return res.send({
              result: false,
              message: "product already added in favourite",
            });
          }
        } else {
          if (fav == 0) {
            return res.send({
              result: true,
              message: "product already removed from favourite",
            });
          } else {
            let addwish = await model.AddWish(p_id, user_id);
            return res.send({
              result: true,
              message: "product added to favourite",
            });
          }
        }
      } else {
        return res.send({
          result: false,
          message: "Product not found",
        });
      }
    } else {
      return res.send({
        result: false,
        message: "user does not exist",
      });
    }
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }
};