const express = require('express');
const auth = require('../middleware/auth');
const router=express.Router();
const profiles=require('../models/profile-model')
const UserModel=require('../models/user-model')

router.get('/myprofile',auth,async(req,res)=>{
    console.log("call...");
    try {
        const profile=await profiles.findOne({user:req.user.id}).populate('users',['name']);
        if(!profile){
            return res.status(400).json({msg:'There is no profile for this user'})
            }
            res.json(profile)    
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
        
    }

})
module.exports=router;