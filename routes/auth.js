import { Router } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";

const router = Router();

router.post("/register", async (req, res) => {
    const { userName, email, password } = req.body
    const newUser = new User({
        userName,
        email,
        password: CryptoJS.AES.encrypt(password, process.env.PASS_SECRET).toString()
    });
    try {
        const savedUser = await newUser.save()
        res.status(200).json({...savedUser})
    } catch (error) {
        res.status(500).json(error)
        console.error(error)
    }
});

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ userName: req.body.userName })
        !user && res.status(401).json("Wrong credentials!")
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SECRET) 
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
        originalPassword !== req.body.password && res.status(401).json("Wrong credentials!")
        console.log("youre good")

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_SEC, 
        {expiresIn: "3d"}
        )
        console.log("you have acces token")

        const { password, ...others } = user._doc
        console.log(user._doc)
        res.status(200).json({...others, accessToken})
    } catch (error) {
        res.status(400).json(error)
    }

})

//LOGOUT    
router.get("/logout", (req, res) => {
    req.headers.token = ""   

    res.status(200).json("You have logged out")
})




export default router