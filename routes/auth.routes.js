const { Router } = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const router = Router();

// /api/auth/register
router.post(
  "/register",
  [
    // checking whether passed email by user was actually an email or not
    check("email", "Invalid email").isEmail(),
    check("password", "The minimal password length is 6 symbols").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      console.log("Body", req.body);

      // validationResult is checking email and password for their validity.
      const errors = validationResult(req);
      // stop post method in case of an error.
      if (!errors.isEmpty()) {
        return res.status(400).json({
          // Provide user with an array of errors on front-end.
          errors: errors.array(),
          message: "Invalid registration information",
        });
      }
      // receiving email and password from user in our req
      // Basically checking whether we received email and password from the user or not.
      const { email, password } = req.body;
      // Since we do not know whether there is going to be inside candidate or not, we are setting
      // our User model to await.
      const candidate = await User.findOne({ email: email });
      // Once we fetched the candidate proceed further.
      if (candidate) {
        // We are using return in order to stop our script if a user already exists.
        return res.status(400).json({ message: "Username already exists" });
      }

      // encrypting users password which we received on our front-end. 12 is the type of encrypting.
      const hashedPassword = await bcrypt.hash(password, 12);
      // It is important to pass hashedPassword to password instead of the received one.
      const user = new User({ email, password: hashedPassword });

      // register new user in the DB.
      await user.save();

      res.status(201).json({ message: "User has been successfully created" });
    } catch (e) {
      // 500 server error
      res.status(500).json({ message: "Something went wrong, try again" });
    }
  }
);

// /api/auth/login
router.post(
  "/login",
  [
    check("email", "Enter a valid email").normalizeEmail().isEmail(),
    check("password", "Enter a valid password").exists(),
  ],
  async (req, res) => {
    try {
      // validationResult is checking email and password for their validity.
      const errors = validationResult(req);
      // stop post method in case of an error.
      if (!errors.isEmpty()) {
        return res.status(400).json({
          // Provide user with an array of errors.
          errors: errors.array(),
          message: "Invalid email or password",
        });
      }
      // receiving email and password from user in our req
      // Basically checking whether we received email and password from the user or not.
      const { email, password } = req.body;
      // Checking whether received email on front end matches the one in the DB or not.
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      // compare received password on front-end, with the password we have in our DB.
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        // Data which is going to be encrypted in our json web token. We can add name/email and other
        // data about the user. However, in our case, user.id is enoguh.
        { userId: user.id },
        // taking secret code from ../config/default.json file
        config.get("jwtSecret"),
        { expiresIn: "1h" }
      );

      // provide user with token
      res.json({ token, userId: user.id });
    } catch (e) {
      // 500 server error
      res.status(500).json({ message: "Something went wrong, try again" });
    }
  }
);

module.exports = router;

