const cloudinary = require('../lib/cloudinary')
const Message = require('../models/message.model')
const User = require('../models/user.model')
const { getReceiverSocketId, io } = require('../lib/socket')

const messageController = {
    getUsersSibar: async (req, res) => {
        try {
            // lọc ra các user khác 
            const users = await User.find({ _id: { $ne: req.user.id } }).select('-password')
            res.status(200).json(users)
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    getMessage: async (req, res) => {
        const { id: userToChatId } = req.params
        const idSender = req.user.id
        try {
            // lấy tin nhắn 
            const message = await Message.find({
                $or: [{ senderId: idSender, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: idSender }
                ]
            })
            res.status(200).json(message)
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    sendMessage: async (req, res) => {
        const { id: receiverId } = req.params
        const senderId = req.user.id
        const { text, image } = req.body
        try {
            let urlImg
            if (image) {
                const uploadResponse = await cloudinary.uploader.upload(image)
                urlImg = uploadResponse.secure_url
            }
            const newMess = await new Message({
                receiverId,
                senderId,
                text,
                image: urlImg
            })
            await newMess.save()

            const receiverSocketId = getReceiverSocketId(receiverId)
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('newMessage', newMess)
            }

            res.status(201).json(newMess)
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

module.exports = messageController