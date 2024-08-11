const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  PRIVATE (no token needed)
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post(
  "/",
  auth,
  check("status", "Status is required").notEmpty(),
  check("skills", "Skill is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // 400: Bad request
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profileFields = {};

    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    profileFields.social = {};
    if (youtube) profileField.social.youtube = youtube;
    if (facebook) profileField.social.facebook = facebook;
    if (twitter) profileField.social.twitter = twitter;
    if (instagram) profileField.social.instagram = instagram;

    // Convert skills to array
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      //   console.log(profile);
      if (profile) {
        // Update

        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        console.log(profile);
        return res.json(profile);
      }
      // Create
      profile = new Profile(profileFields);
      await profile.save();
      console.log(profile);
      res.json(profile);
    } catch (err) {
      console.error(500).send("Server error");
    }
  }
);

// @route   GET api/profiles
// @desc    Get all
// @access  PUBLIC (no token needed)

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile of user_id
// @access  PUBLIC (no token needed)

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: "There is no profile" });
    res.json(profile);
  } catch (err) {
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "There is no profile" });
    } else {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
});

// @route   DELETE api/profiles
// @desc    Delete profiles/users/posts
// @access  PRIVATE

router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/profiles/experience
// @desc    Add profile experience for user
// @access  PRIVATE

router.put(
  "/experience",
  auth,
  check("title", "Title is required").notEmpty(),
  check("company", "Company is required").notEmpty(),
  check("from", "From date is required and needs to be from the past")
    .notEmpty()
    .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(req.body);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/profiles/experience/:exp_id
// @desc    Delete experience base on exp_id
// @access  PRIVATE

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    // Get profile of user
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience = profile.experience.filter(
      (item) => item.id !== req.params.exp_id
    );
    console.log(profile.experience);
    await profile.save();

    return res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/profiles/experience
// @desc    Add profile experience for user
// @access  PRIVATE

router.put(
  "/education",
  auth,
  check("school", "Title is required").notEmpty(),
  check("degree", "Company is required").notEmpty(),
  check("fieldofstudy", "Field is required").notEmpty(),
  check("from", "From date is required and needs to be from the past")
    .notEmpty()
    .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(req.body);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/profiles/experience/:exp_id
// @desc    Delete experience base on exp_id
// @access  PRIVATE

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    // Get profile of user
    const profile = await Profile.findOne({ user: req.user.id });
    profile.education = profile.education.filter(
      (item) => item.id !== req.params.edu_id
    );
    console.log(profile.education);
    await profile.save();

    return res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/profiles/github/:username
// @desc    Get user repos from Github
// @access  PUBLIC

router.get("/github/:username", async (req, res) => {
  try {
    // Get user repos from Github
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    // console.log(options);
    request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200) {
        // 404: Not found
        return res.status(404).json({ msg: "No Github profile found" });
      }
      // console.log(body);
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.err(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
