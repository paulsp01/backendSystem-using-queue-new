const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

const register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    // Log the user registration after the user is successfully saved
    logger.info(`User registered: ${user.username}`);

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).send({ user, token });
  } catch (err) {
    // Log the error if registration fails
    logger.error(`User registration failed: ${err.message}`);
    res.status(400).send({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await user.comparePassword(req.body.password))) {
      throw new Error("Invalid login credentials");
    }

    // Log successful login
    logger.info(`User logged in: ${user.username}`);

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.send({ user, token });
  } catch (err) {
    // Log the error if login fails
    logger.error(`Login failed: ${err.message}`);
    res.status(400).send({ error: err.message });
  }
};

module.exports = { register, login };
