const Sauce = require("../models/Sauce");

const hasPermission = async (req, res, next) => {
  const sauce = await Sauce.findOne({ _id: req.params.id });
  if (sauce.userId != req.auth.userId) {
    return res.status(401).json({
      message:
        "Unauthorized request, you can only delete / edit your own sauces",
    });
  }
  console.log("Permission verifiee et validee");
  next();
};

module.exports = {
  hasPermission,
};
