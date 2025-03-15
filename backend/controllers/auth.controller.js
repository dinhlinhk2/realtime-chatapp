const User = require("../models/user.model");
const { generateAccessToken, generateRefreshToken } = require('../lib/utils')
const cloudinary = require('../lib/cloudinary')
const bcript = require("bcryptjs");

let arrRefreshToken = [];
const authController = {
    register: async (req, res) => {
        const { fullName, password, email } = req.body;
        try {
            if (!fullName || !password || !email) {
                return res.status(400).json({ message: "All fields are required" });
            }
            if (password.length < 4) {
                return res.status(404).json({ message: "Password must be at least 6" });
            }
            const userFind = await User.findOne({ email });
            if (userFind) {
                return res.status(404).json({ message: "Email already" });
            }
            const salt = await bcript.genSalt(10);
            const hashedPass = await bcript.hash(password, salt);
            const newUser = await new User({
                email: email,
                fullName: fullName,
                password: hashedPass,
            });
            const user = await newUser.save();
            const accessToken = generateAccessToken(user)
            const refreshToken = generateRefreshToken(user)
            arrRefreshToken.push(refreshToken)
            res.cookie('refreshToken', refreshToken, {
                httpOne: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV !== 'development'
            })
            res.status(200).json({ user, accessToken });
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    },
    login: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }
            const validPass = await bcript.compare(req.body.password, user.password)
            if (!validPass) {
                return res.status(404).json({ message: 'Password is invalid' })
            }

            if (user && validPass) {
                const accessToken = generateAccessToken(user)
                const refreshToken = generateRefreshToken(user)
                arrRefreshToken.push(refreshToken)
                res.cookie('refreshToken', refreshToken, {
                    httpOne: true,
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    secure: process.env.NODE_ENV !== 'development'
                })
                const userWithoutPassword = await User.findById(user._id).select('-password');
                const userObject = userWithoutPassword.toObject();
                // const { password, ...others } = user._doc
                res.status(200).json({ ...userObject, accessToken })
            }

        } catch (error) {
            return res.status(500).json(error)
        }
    },

    logout: async (req, res) => {
        try {
            res.cookie('refreshToken', '', { maxAge: 0 })
            arrRefreshToken = arrRefreshToken.filter((token) => { token !== req.cookies.refreshToken });
            res.status(200).json("Logout successful")
        } catch (error) {
            return res.status(500).json(err)
        }
    },
    uploadProfile: async (req, res) => {
        const { profilePic } = req.body
        const userId = req.user.id
        try {
            if (!profilePic) {
                return res.status(401).json({ message: "Profile is required" })
            }
            const uploadResponse = await cloudinary.uploader.upload(profilePic)
            const uploadUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })
            res.status(200).json(uploadUser)
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    checkUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)
            res.status(200).json(user)
        } catch (error) {
            return res.status(500).json(error)
        }
    }
};

module.exports = authController;
