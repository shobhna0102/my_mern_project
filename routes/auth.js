
const express = require('express');
const router=express.Router();
const auth=require('../middleware/auth')
const userModel =require('../models/user-model')
const {validateUserAuthDetail} = require("../validation/user-validation");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require('bcryptjs');


router.get('/auth',auth,async(req,res)=>{
    try {
        const user =await userModel.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error')
        
    }

})
router.post("/login", async (req, res) => {
    console.log("courseAdd called");
    try {
      const { error } = validateUserAuthDetail(req.body);
      if (error) {
        return res.status(400).json(error.details[0].message);
      }
      const {email, password } = req.body;
      let user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: [{ msg: "Invalid Credentials..." }] });
      }

      const isMatch =await bcrypt.compare(password,user.password);
      if(!isMatch){
        return res.status(400).json({ error: [{ msg: "Invalid Credentials..." }] });
      }
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


module.exports=router;
