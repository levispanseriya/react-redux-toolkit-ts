const db = require("../Models/index");
const fs = require("fs");
const Joi = require("joi");

const User = db.user;
const Image = db.image;

const uploadImage = async (req, res) => {
  const email = req.userData.user.dataValues.email;

  const user = await User.findOne({
    where: { email: email },
  });
  if (!user) {
    return res.status(401).json({ message: "User not Found" });
  }

  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image" });
    }

    const { filename, mimetype, size, path } = req.file;

    const image = await Image.create({
      userLogo: filename,
      filePath: path,
      mimetype: mimetype,
      size: size,
      UserId: user.userid,
    });

    image.UserId = user.userid;

    await image.save();
    return res.status(201).json({ image });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong", error });
  }
};

const deleteImage = async (req, res) => {
  const imageIdSchema = Joi.object({
    imageId: Joi.number().integer().required(),
  });
  try {
    // console.log(req.params, "req.params");
    const { error, value } = imageIdSchema.validate(req.params);
    console.log(imageIdSchema.validate(req.params));
    // console.log(value.imageId, "imageid");

    const image = await Image.findByPk(value.imageId);
    console.log(image, "image");

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    fs.unlinkSync(image.filePath);
    await image.destroy();

    await fs.unlink(image.filePath, () => {
      console.log("File Deleted SucessFully.");
    });

    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const updateImage = async (req, res) => {
  const imageIdSchema = Joi.object({
    imageid: Joi.number().integer().required(),
  });

  try {
    const { error, value } = imageIdSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: "Invalid imageId" });
    }

    const { imageid } = value;
    const image = await Image.findByPk(imageid);

    console.log(imageid, image, "imageIdimageIdimageIdimageId");

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    fs.unlinkSync(image.filePath);

    console.log(image.filePath, "image.filePath");
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image" });
    }

    const { filename, mimetype, size, path } = req.file;

    await Image.update(
      {
        userLogo: filename,
        filename: filename,
        filePath: path,
        mimetype: mimetype,
        size: size,
      },
      { where: { imageid: imageid } }
    );
    return res.status(201).json({ message: "Image Updated." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  updateImage,
};
