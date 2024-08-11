const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route   POST api/user
// @desc    User route
// @access  Public (no token needed)

// Doing the validation when there is a request to this route
/**
 * @route   POST api/users
 * @desc    Register user
 * @access  Public (no token needed)
 * @param   {string} name - User's name
 * @param   {string} email - User's email
 * @param   {string} password - User's password
 * @param   {string} avatar - User's avatar
 * @param   {date} date - User's date
 * @param   {string} user - User's id
 * @param   {string} payload - User's payload
 * @param   {string} salt - User's salt
 */
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    console.log(req.message);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // 400: Bad request
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      // Get user's gravatar
      const avatar = gravatar.url(email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm", // Default
      });

      // Create user
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtsecret", { expiresIn: 360000 }),
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      ); // Change the expiresIn to 3600 (1 hour) in production
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
