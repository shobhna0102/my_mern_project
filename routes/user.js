const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const {validateUserDetail} = require("../validation/user-validation");
const userModel = require("../models/user-model");
const jwt = require("jsonwebtoken");
const config = require("config");

/* GET home page. */
router.post("/register", async (req, res) => {
  console.log("courseAdd called");
  try {
    const { error } = validateUserDetail(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    const { name, email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ error: [{ msg: "User already exists" }] });
    }
    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
    user = new userModel({ name, email, avatar, password });
    const pwd = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, pwd);
    await user.save();
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
