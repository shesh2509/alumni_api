const express = require("express");
const router = express.Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")


router.use(express.json());

router.post("/register", async (req, res) => {

    const newUser = new User({
            fullName : req.body.fullName,
            email : req.body.email,
            college: req.body.college,
            branch: req.body.branch,
            enrollmentNumber: req.body.enrollmentNumber,
            passingYear: req.body.passingYear,
            company: req.body.company,
            package: req.body.package,
            password: CryptoJS.AES.encrypt(
                req.body.password,
                process.env.PASS_SEC
            ).toString(),
            linkedIn: req.body.linkedIn,
            instagram: req.body.instagram,
            twitter: req.body.twitter,
            interview: req.body.interview,
            profilePic: req.body.profilePic
    });

    // check for existing enrollement no
    const existingEnrollment = await User.findOne({ enrollmentNumber: req.body.enrollmentNumber });
    if (existingEnrollment) {
        return res.status(400).json({ error: "This enrollment number is already registered." });
    }


    // check for existing email
    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
        return res.status(400).json({ error: "This email is already registered." });
    }

    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    }catch(err){
        res.status(500).json(err);
    }
})



router.post("/login", async (req, res) => {
    try {
        const { enrollmentNumber, password } = req.body;

        // Find user by enrollment number
        const user = await User.findOne({ enrollmentNumber });

        // Check if user exists
        if (!user) {
            return res.status(401).json({ error: "Enrollment Number not Found" });
        }

        // Decrypt stored password and compare with provided password
        const bytes = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        if (originalPassword !== password) {
            return res.status(401).json({ error: "Wrong Password" });
        }

        // Passwords match, generate JWT token
        const accessToken = jwt.sign({
            id: user._id,
            enrollmentNumber: user.enrollmentNumber
        }, process.env.JWT_SEC, { expiresIn: "3d" });

        // Remove password from user object before sending in response
        const { password: userPassword, ...userData } = user._doc;

        // Send response with user data and access token
        res.status(200).json({ user: userData, accessToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;
