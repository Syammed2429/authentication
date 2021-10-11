const express = require('express');
const router = express.Router();
const {body,validationResult} = require("express-validator")
const jwt= require('jsonwebtoken');
require('dotenv').config();
const  User = require('../model/user.model')

const newToken = (user) => {
    return jwt.sign({user}, process.env.SECRET_KEY)
}


router.post("/signup", 
    body("name").notEmpty().withMessage("Enter your name"),
    body("email").isEmail().withMessage("Enter your email"),
    body("password").isLength({min : 8, max : 20}).withMessage("Please enter maximum of 8 characters"),
    
    async (req, res) => {
        // const user = await User.create(req.body);
        const errors = validationResult(req);
        // console.log('name:', req.body)
        if(!errors.isEmpty()) {
            return res.status(401).send(errors.array());
        } 
        let user;
        try {
            //check email is already exists
            user = await User.findOne({email : req.body.email});
            if(user) return res.status(401).send("Email is already in use");

            //if email is not exists
            user = await User.create(req.body);

            //Generate the token for the user
            const token = newToken(user)

            //send the data
            return res.status(201).send({user,token})
            
            
        } catch (err) {
            res.status(500).send(err.message)
        }


    
    });
router.get("", async (req,res) => {
    const users = await User.find().select("-password").lean().exec();

    return res.status(200).send({users})
});
router.post("/signin",
    body("email").isEmail().withMessage("Please enter your email"),
    body("password").isLength({min : 8, max : 20}).withMessage("Please enter your password"),

    async(req,res) => {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) return res.status(401).send(errors.array())

        } catch (err) {
            res.status(500).send(err.message)
        }

        let user ;

        try {
            user = await User.findOne({ email : req.body.email})
            if(!user) return res.status(401).send("Please check your email and password");

            let match = user.checkPassword(req.body.password);

            if(!match) return res.status(401).send("Please check your email and password");

            const token = newToken(user)

            return res.status(200).send({user, token})

        } catch (err) {
            res.status(500).send(err.message)
            
        }
    }




);

module.exports = router;