const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY_ID,
  region: process.env.S3_BUCKET_REGION,
});

const upload = () =>
  multer({
    storage: multerS3({
      s3,
      bucket: "image-upload-task",
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, "image.jpeg");
      },
    }),
  });

const login_user = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;
      await user.save();
      // user
      return res.status(200).json(user);
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
};

const registrate_user = async (req, res) => {
  try {
    const { first_name, last_name, email, password, token } = req.body;
    // Validate user input
    if (!(email && password && first_name && last_name)) {
      return res.status(400).send("All input is required");
    }
    // check if user already exist
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    encryptedPassword = await bcrypt.hash(password, 10);
    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      token,
    });

    // return new user
    return res.status(201).json(user);
  } catch (err) {
    console.log(`error ${err}`);
  }
};

const get_user = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token });
    console.log(user);
    //bad case
    if (user.token !== token) {
      return res.status(400).json({
        isToken: false,
      });
    }
    return res.status(200).send({
      isToken: true,
      user: user,
    });
  } catch (err) {
    return res.status(404).json({
      meessage: "error",
    });
  }
};

const get_all_users = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } });
    res.send({
      message: "ok",
      users,
    });
  } catch (e) {
    res.send({
      message: e.message,
    });
  }
};

const edit_user = async (req, res) => {
  try {
    console.log(req.file);
    res.send({
      message: "ok",
    });
  } catch (e) {
    res.send({
      message: e.message,
    });
  }
};

const set_profile_pic = (req, res, err) => {
  res.status(200).send({
    message: "ok",
    data: req.body,
  });

  console.log(req.body, "body");
};

module.exports = {
  registrate_user,
  login_user,
  get_user,
  get_all_users,
  edit_user,
  set_profile_pic,
};
