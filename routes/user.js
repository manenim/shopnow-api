import { Router } from "express";
import { verifyTokenAdmin, verifyTokenAuthorization } from "./verifyToken.js";
import CryptoJS from "crypto-js";
import User from "../models/User.js";

const router = Router();

router.put('/:id', verifyTokenAuthorization, async (req, res) => {

    console.log(req.body)
    if(req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString()
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
            
        }, { new: true })
        console.log(updatedUser)
        res.status(200).json(updatedUser)
    }
    catch (error) {
        res.status(500).json(error)
    }
});

router.delete('/:id', verifyTokenAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted...")
    }
    catch (error) {
        res.status(500).json(error)
    }
});

router.get('/find/:id', verifyTokenAuthorization, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc
        res.status(200).json(others)
    }
    catch (error) {
        res.status(500).json(error)
    }
});

// get all users
router.get('/', verifyTokenAdmin, async (req, res) => {
    const query = req.query.new
    if (query) {
        try {
            const users = await User.find().sort({ _id: -1 }).limit(5)
            res.status(200).json(users)
        }
        catch (error) {
            res.status(500).json(error)
        }
    } else {
        try {
            const users = await User.find()
            res.status(200).json(users)
        }
        catch (error) {
            res.status(500).json(error)
        }
    }
});

// GET USER STATS
router.get('/stats', verifyTokenAdmin, async (req, res) => {
    const today = new Date();
    const latYear = today.setFullYear(today.setFullYear() - 1);
    try{
        const data = await User.aggregate([
            { $project: { month: { $month: "$createdAt" } } },
            { $group: { _id: "$month", total: { $sum: 1 } } }
        ])
        res.status(200).json(data)
    }catch (error) {
        res.status(500).json(error)
    }
})

export default router;