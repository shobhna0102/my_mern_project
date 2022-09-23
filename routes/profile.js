const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const profiles = require("../models/profile-model");
const UserModel = require("../models/user-model");
const { validateUserProfileDetail } = require("../validation/user-validation");


// @route    GET api/myprofile
// @desc     Get current users profile
// @access   Private
router.get("/myprofile", auth, async (req, res) => {
  try {
    const profile = await profiles
      .findOne({ user: req.user.id })
      .populate("users", ["name"]);
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/createprofile
// @desc     Create or update user profile
// @access   Private
router.post("/createprofile", auth, async (req, res) => {
  console.log("call...");
  try {
    const { error } = validateUserProfileDetail(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    // destructure the request
    console.log("#########", req.body);
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
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }
    const socialFields = { youtube, twitter, instagram, linkedin, facebook };

    for (const [key, value] of Object.entries(socialFields)) {
        if (value && value.length > 0)
          socialFields[key] =value;
      }
      profileFields.social = socialFields;
    // profileFields.social = {};
    // if (youtube) profileFields.social.youtube = youtube;
    // if (twitter) profileFields.social.twitter = twitter;
    // if (facebook) profileFields.social.facebook = facebook;
    // if (linkedin) profileFields.social.linkedin = linkedin;
    // if (instagram) profileFields.social.instagram = instagram;
    
    // console.log("🚀 ~ file: profile.js ~ line 58 ~ router.post ~ profileFields.social", profileFields.social.twitter)

    try {
      //update
      let profile = await profiles.findOne({ user: req.user.id });
      if (profile) {
        profile = await profiles.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      //create
      profile = new profiles(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/getmyprofile
// @desc     Get all profiles
// @access   Public
router.get("/getmyprofile",async (req, res) => {
    try {
      const profile = await profiles.find().populate('user', ["name"]);
      res.json(profile);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  });

  // @route    GET api/getprofilebytid
// @desc     Get profiles
// @access   Public
router.get("/getprofilebyid/:user_id",async (req, res) => {
    try {
      const profile = await profiles.findOne({user:req.params.user_id}).populate('user', ["name"]);
      if(!profile)
      {
          return res.status(400).json({msg:"profile not found."})
      }
      res.json(profile);
    } catch (error) {
      console.error(error);
      if(error.kind==='ObjectId'){
        return res.status(400).json({msg:"profile not found."})
      }

      res.status(500).send("Server Error");
    }
  });

  // @route    GET api/getmyprofile
// @desc     Get all profiles
// @access   Private
router.delete("/deletemyprofile",auth,async (req, res) => {
    try {
        //Remove profile
     await profiles.findOneAndRemove({user:req.user.id});
        //Remove User
      await UserModel.findOneAndRemove({_id:req.user.id});
      res.json({msg:"User deleted..."});
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  });



// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put('/addexperience',
    auth,
    check('title', 'Title is required').notEmpty(),
    check('company', 'Company is required').notEmpty(),
    check('from', 'From date is required and needs to be from the past')
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
        res.status(500).send('Server Error');
      }
    }
  );


module.exports = router;
