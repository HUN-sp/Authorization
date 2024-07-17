const express = require("express");
const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authmiddleware');
const router = express.Router();

router.post("/register", async (req, res) => {
    try {

        const userExists = await User.findOne({ email: req.body.email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User Already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        const newUser = new User(req.body);
        await newUser.save();

        return res.status(201).json({
            success : true,
            message : 'You have successfully signed up,please log in'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Placeholder for login route
router.post("/login", async (req, res) => {
    const user = await User.findOne({email : req.body.email});

    if(!user){
         res.status(404).json({
            success : false,
            mesaage : 'User Already Exists',
        });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)

    if(!validPassword){
         res.status(400).json({
            success : false,
            message :'Invalid Password'
        })

    }

    const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET, {expiresIn : "1d"});

    res.send({
        success : true,
        message :'User logged in Successfully',
        token : token
    })

});

router.get('/get-current-user', authMiddleware, async (req, res) =>{
    const user = await  User.findById(req.body.userId).select('-password');
    try {
        res.send({
            success : true,
            message: 'You are Authorized',
            data : user 
        })

    } catch (error) {
        res.send({
            success : false,
            message : 'Not authorized'
        })
    }
});


module.exports = router;
