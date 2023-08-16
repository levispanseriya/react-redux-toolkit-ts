const db = require("../Models/index");
const Joi = require("joi");
const fs = require("fs");

const User = db.user;
const Image = db.image;

const createUser = async (req, res) => {
  const createUserSchema = Joi.object({
    firstname: Joi.string().min(2).max(25),
    lastname: Joi.string().min(2).max(25),
    mobile: Joi.number()
      .integer()
      .min(10 ** 9)
      .max(10 ** 10 - 1)
      .required(),
  });
  const { firstname, lastname, mobile } = await createUserSchema.validateAsync(
    req.body
  );

  const email = req.userData.user.dataValues.email;
  const user = await User.findOne({
    where: { email: email },
  });
  if (!user) {
    return res.status(401).json({ message: "User not Found" });
  }

  user.firstname = firstname;
  user.lastname = lastname;
  user.mobile = mobile;

  if (!req.file) {
    return res.status(400).json({ error: "Please upload an image" });
  }

  const { filename } = req.file;

  user.avtar = filename;

  await user.save();

  const { password, resetToken, ...userData } = user.dataValues;
  res.json({
    message: "Data and logo uploaded successfully",
    user: userData,
  });
};

const getAllUser = async (req, res) => {
  currUser = await User.findAll({
    attributes: { exclude: ["password"] },
  });
  res.status(200).json(currUser);
};

const getUser = async (req, res) => {
  const { id } = req.params;
  const currUser = await User.findOne({ where: { userid: id } });
  if (!currUser) {
    res.status(200).json({ error: "User Not Found." });
  }

  res.status(200).json(currUser);
};

const updateUser = async (req, res) => {
  const updateUserSchema = Joi.object({
    firstname: Joi.string().min(2).max(25),
    lastname: Joi.string().min(2).max(25),
    mobile: Joi.number()
      .integer()
      .min(10 ** 9)
      .max(10 ** 10 - 1)
      .required(),
  });

  // const { userid } = req.params;
  const userid = req.userData.user.dataValues.userid;
  const { firstname, lastname, mobile } = await updateUserSchema.validateAsync(
    req.body
  );

  const email = req.userData.user.dataValues.email;
  const user = await User.findOne({
    where: { email: email },
  });

  if (!user) {
    return res.status(401).json({ message: "User not Found" });
  }

  if (req.file) {
    const imagePath = `public/images/${user.avtar}`;
    fs.unlinkSync(imagePath);
    const { filename } = req.file;

    const updateData = await User.update(
      {
        avtar: filename,
        firstname: firstname,
        lastname: lastname,
        mobile: mobile,
      },
      {
        returning: true,
        where: {
          userid: userid,
        },
      }
    );
    res.json({
      message: "User data updated successfully",
      data: updateData,
    });
  } else {
    const updateData = await User.update(
      {
        firstname: firstname,
        lastname: lastname,
        mobile: mobile,
      },
      {
        returning: true,
        where: {
          userid: userid,
        },
      }
    );
    res.json({
      message: "User data updated successfully",
      data: updateData,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const currUser = await User.findOne({ where: { userid: id } });
  if (!currUser) {
    res.status(200).json({ error: "User Not Found." });
  }

  await User.destroy({
    where: {
      userid: id,
    },
  });

  res.status(200).json("User Deleted SucessFully.");
};

module.exports = {
  createUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
};
