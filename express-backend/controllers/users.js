const User = require("../model/User");
const bcrypt = require("bcrypt");

exports.getUser = (req, res) => {
  res.send("You fetched a user!");
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (isPasswordCorrect) {
        return res.send("You are logged in!");
      }
      const error = new Error(`Password does not match email ${email}`);
      error.statusCode = 401;
      throw error;
    }
    const error = new Error(`This email ${email} does not exist`);
    error.statusCode = 401;
    throw error;
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (await User.findOne({ email })) {
      return res
        .status(409)
        .send(`An account with the mail ${email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });
    const result = await user.save();
    res.send(result);
  } catch (err) {
    next(err);
  }
};
