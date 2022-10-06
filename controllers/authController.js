const User = require("../models/User");

const signup = async (req, res) => {
  try {
    const userAlreadyExist = await User.findOne({ email: req.body.email });
    if (userAlreadyExist) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const user = await User.create({ ...req.body });
    res.status(201).json({ user: user._id });
  } catch (e) {
    res.status(400).json({ e });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide Email and Password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = user.createJWT();
    res.status(200).json({
      userId: user._id,
      token,
    });
  } catch (e) {
    res.status(400).json({ e });
  }
};

module.exports = {
  signup,
  login,
};
