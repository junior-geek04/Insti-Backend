const router = require("express").Router();
const User = require("../Modals/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("./verifytoken");
const Post = require("../Modals/Post");
const JWTSEC = "4#22@23322##2";

router.post(
  "/create/user",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("username").isLength({ min: 5 }),
  body("phonenumber").isLength({ min: 10 }),
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json("some errror occured");
    }
    try {
      let user = await User.findOne({ email: req.body.email }); //if user already there

      if (user) {
        return res.status(200).json("please login with correct pasword");
      }
      const salt = await bcrypt.genSalt(10);
      const secpass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: secpass,
        profile: req.body.profile,
        phonenumber: req.body.phonenumber,
      });
      const accessToken = jwt.sign(
        {
          id: user._id,
          username: user.username,
        },
        JWTSEC
      );
      await user.save();
      res.status(200).json({ user, accessToken });
    } catch (error) {
      // console.log(error);
      return result.status(400).json("internal server error");
    }
  }
);

//login
router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("username").isLength({ min: 5 }),
  async (req, res) => {
    const error = validationResult(req);

    // if (!error.isEmpty()) {

    //     console.log(error);
    //   return res.status(400).json("some errror occured1");

    // }

    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json("user doesnt found");
      }
      const Comparepassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!Comparepassword) {
        return res.status(400).json("password error");
      }
      const accessToken = jwt.sign(
        {
          id: user._id,
          username: user.username,
        },
        JWTSEC
      );
      const { password, ...other } = user._doc;
      res.status(200).json({ other, accessToken });
    } catch (error) {
      res.status(500).json("internal error ocuured");
    }
  }
);

//following

router.put("/following/:id", verifyToken, async (req, res) => {
  if (req.params.id !== req.body.user) {
    const user = await User.findById(req.params.id);
    const otheruser = await User.findById(req.body.user);

    if (!user.Followers.includes(req.body.user)) {
      await user.updateOne({ $push: { Followers: req.body.user } });
      await otheruser.updateOne({ $push: { Following: req.params.id } });
      return res.status(200).json("User has followed");
    } else {
      return res.status(400).json("you already follow this user");
    }
  } else {
    return res.status(400).json("you cannot follow yourself");
  }
});

//fetch post from followers

router.get("/flw/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const followersPost = await Promise.all(
      user.Following.map((item) => {
        return Post.find({ user: item });
      })
    );
    res.status(200).json(followersPost);
  } catch (error) {
    return res.status(400).json("internal server error");
  }
});

//update user profile
router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(req.body.password, salt);
        req.body.password = secpass;
        const updateuser = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        await updateuser.save();
        res.status(200).json(updateuser);
      }
    } else {
      return res.status(400).json("")
    }
  } catch (error) {
    res.status(500).json("internal server error");
  }
});

//delete user acccount

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    if (req.params.id != req.user.id) {
      return res.status(400).json("account does not match");
    } else {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("USER account has been deleted");
    }
  } catch (error) {}
});

module.exports = router;
