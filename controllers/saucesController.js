const Sauce = require("../models/Sauce");
const fs = require("fs");

// on recupere toutes les sauces
const getSauces = async (req, res) => {
  try {
    const sauces = await Sauce.find();
    if (!sauces) {
      res.status(400).json({ messages: "No sauces to display" });
    }
    res.status(200).json(sauces);
  } catch (error) {
    res.status(400).json({ error });
  }
};

// on recupere une sauce
const getSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id });
    if (!sauce) {
      res.status(400).json({ messages: "No sauce to display" });
    }
    res.status(200).json(sauce);
  } catch (error) {
    res.status(404).json({ error });
  }
};

// on cree une sauce
const createSauce = async (req, res) => {
  try {
    const sauceObj = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
      ...sauceObj,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    });
    console.log(req.body.sauce);
    await Sauce.create(sauce);
    res.status(201).json({ message: "Created Sauce !" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// on modifie une sauce
const editSauce = async (req, res) => {
  try {
    let sauceObj = {};
    const sauce = await Sauce.findOne({ _id: req.params.id });
    if (!sauce) {
      return res.status(400).json({ message: "Sauce does not exist" });
    }
    if (sauce.userId != req.auth.userId) {
      return res.status(400).json({ message: "Unauthorized request" });
    }
    if (req.file) {
      const name = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${name}`, (e) => {
        if (e) console.log(e);
        console.log("Ancienne photo supprimée");
      });
      sauceObj = {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      };
    } else {
      sauceObj = { ...req.body };
    }

    await Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObj, _id: req.params.id }
    );
    res.status(200).json({ message: "Updated Sauce" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// on supprime une sauce
const deleteSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id });
    if (!sauce) {
      return res.status(400).json({ message: "Sauce does not exist" });
    }
    if (sauce.userId != req.auth.userId) {
      return res.status(400).json({ message: "Unauthorized request" });
    }
    const name = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${name}`, async () => {
      await sauce.remove();
      res.status(200).json({ message: "Sauce is now gone ... " });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const likeSauce = async (req, res) => {
  const { like, userId } = req.body;
  try {
    if (like === 1) {
      const sauce = await Sauce.updateOne(
        { _id: req.params.id },
        { $push: { usersLiked: userId }, $inc: { likes: +1 } }
      );
      if (!sauce) {
        return res.status(404).json({ message: "Sauce not found" });
      }
      return res.status(200).json({ message: "Liked" });
    }
    if (like === -1) {
      const sauce = await Sauce.updateOne(
        { _id: req.params.id },
        { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
      );
      if (!sauce) {
        return res.status(404).json({ message: "Sauce not found" });
      }
      return res.status(200).json({ message: "DisLiked" });
    }
    if (like === 0) {
      const sauce = await Sauce.findOne({ _id: req.params.id });
      if (!sauce) {
        return res.status(404).json({ message: "Sauce not found" });
      }
      if (sauce.usersLiked.includes(userId)) {
        await Sauce.updateOne(
          { _id: req.params.id },
          { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
        );
        return res.status(200).json({ message: "Like Removed" });
      }
      if (sauce.usersDisliked.includes(userId)) {
        await Sauce.updateOne(
          { _id: req.params.id },
          { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
        );
        return res.status(200).json({ message: "Dislike Removed" });
      }
    }
    return res.status(400).json({ message: "invalid request" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = {
  getSauces,
  getSauce,
  createSauce,
  editSauce,
  likeSauce,
  deleteSauce,
};
