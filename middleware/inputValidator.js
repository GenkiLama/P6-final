const validator = require("validator");

const createSauceInputValidator = (req, res, next) => {
  const { name, manufacturer, description, mainPepper } = JSON.parse(
    req.body.sauce
  );
  if (
    !validator.isAlpha(name, "fr-FR", { ignore: " " }) ||
    !validator.isAlpha(description, "fr-FR", { ignore: " " }) ||
    !validator.isAlpha(manufacturer, "fr-FR", { ignore: " " }) ||
    !validator.isAlpha(mainPepper, "fr-FR", { ignore: " " })
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }
  next();
};

const editSauceInputValidator = (req, res, next) => {
  if (req.file) {
    const { name, manufacturer, description, mainPepper } = JSON.parse(
      req.body.sauce
    );
    if (
      !validator.isAlpha(name, "fr-FR", { ignore: " " }) ||
      !validator.isAlpha(description, "fr-FR", { ignore: " " }) ||
      !validator.isAlpha(manufacturer, "fr-FR", { ignore: " " }) ||
      !validator.isAlpha(mainPepper, "fr-FR", { ignore: " " })
    ) {
      return res.status(400).json({ message: "input invalide" });
    }
  } else {
    const { name, manufacturer, description, mainPepper } = req.body;
    if (
      !validator.isAlpha(name, "fr-FR", { ignore: " " }) ||
      !validator.isAlpha(description, "fr-FR", { ignore: " " }) ||
      !validator.isAlpha(manufacturer, "fr-FR", { ignore: " " }) ||
      !validator.isAlpha(mainPepper, "fr-FR", { ignore: " " })
    ) {
      return res.status(400).json({ message: "input invalide" });
    }
  }

  next();
};
module.exports = {
  createSauceInputValidator,
  editSauceInputValidator,
};
