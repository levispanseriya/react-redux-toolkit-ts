const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
require("../config/secret");
const { sendResetPasswordEmail, sendMail } = require("./emailControllers");
const nodemailer = require("nodemailer");
const Joi = require("joi");
require("dotenv").config();
require("../Models/index");
User = db.user;

const secretKey = process.env.JWT_SECRET;

const signin = async (req, res) => {
  const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  try {
    const { email, password } = await signupSchema.validateAsync(req.body);
    console.log(email, password);

    // Check if the email is already registered
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user record in the database
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    const verifyToken = jwt.sign({ user: newUser }, secretKey, {
      expiresIn: "1h",
    });

    const resetLink = `${process.env.BASEURL}/api/auth/verifyEmail?token=${verifyToken}`;
    const subject = "signUp Verification Mail";
    const text = "Click Below Link for verifid Your Account.";
    const html = `<p>Click on the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`;

    await sendMail(email, subject, text, html);

    const { userid, isVerified } = newUser;

    return res.status(201).json({
      email,
      userid,
      isVerified,
      verifyToken,
      message: "User registered successfully. Check Mail for Verification.",
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ error: "An error occurred during signup" });
  }
};

const login = async (req, res) => {
  const signinSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  const { email, password } = await signinSchema.validateAsync(req.body);

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else if (user.isVerified != true) {
      return res.status(404).json({ message: "User not Verified." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const logintoken = jwt.sign({ email: user.email }, secretKey, {
        expiresIn: "1h",
      });

      console.log(logintoken);

      user.token = logintoken;
      await user.save();
      return res
        .status(200)
        .json({ token: logintoken, message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const verifyToken = (req, res, next) => {
  // Check if the request contains the token in the header
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "authorization token missing" });
  }

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ err, message: "Invalid token" });
    }

    const userEmail = decoded.email;
    const users = await User.findOne({ where: { email: userEmail } });

    const user = await User.findOne({
      where: { email: userEmail },
    });

    if (!user) {
      return res.status(404).json({ message: "User not foundded" });
    }

    req.userData = {
      user,
      authToken: req.headers.authorization,
    };

    console.log(req.userData.user);
    next();
  });
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    // console.log("hello", jwt.verify);
    const decoded = jwt.verify(token, secretKey);
    console.log(decoded.user);

    const { email } = decoded.user;

    // Update the user record to mark email as verified
    await User.update({ isVerified: true }, { where: { email } });
    // const user = await User.findOne({ where: { email: email } });
    const user = await User.findOne({
      where: { email: email },
    });

    const { isVerified, userid } = user;

    return res.status(200).json({
      email,
      isVerified,
      userid,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error during email verification:", error);
    return res
      .status(500)
      .json({ error: "An error occurred during email verification" });
  }
};

const forgotPassword = async (req, res) => {
  const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
  });
  const { email } = await forgotPasswordSchema.validateAsync(req.body);
  console.log(email);

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "1h",
    });

    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000;

    const resetLink = `${process.env.BASEURL}/resetpassword?token=${resetToken}`;
    const subject = "Reset Password ";
    const text = "Click Below Link for Reset Your Password.";
    const html = `<p>Click on the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`;

    await sendMail(email, subject, text, html);
    await user.save();
    console.log(user);
    return res.status(200).json({
      message: `${subject}, Email Sent SucessFully.`,
      resetToken: resetToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;

    // Find the user with the given reset token and ensure it's not expired
    const user = await User.findOne({
      where: { resetToken: token },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();
    console.log(token, newPassword, user);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const logout = async (req, res) => {
  console.log(req.headers);
  req.headers.authorization = "null";
  console.log(req.headers);

  return res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  login,
  signin,
  verifyToken,
  forgotPassword,
  logout,
  verifyEmail,
  resetPassword,
};
