const User = require("../models/User");

const router = require("express").Router();


// Get User 
router.get("/find/:id", async(req, res) => {
    try{
        const user = await User.findById(req.params.id)
        const {password, ...others} = user._doc;
        res.status(200).json(others);
    }catch(err){
        res.status(500).json(err);
    }
})

//GET ALL USER

router.get("/", async (req,res) => {
    const { company } = req.query;
    try {
        let users;
        if(company) {
            users = await User.find({ company });
        }
        else {
            users = await User.find();
        }
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
})

// Get user profile by ID
router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
});

// Get user profile by enrollment number
router.get("/", async (req, res) => {
    const { enrollment } = req.query; // Retrieve enrollment number from query parameters
    try {
        const user = await User.findOne({ enrollmentNumber: enrollment });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Update user profile by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;