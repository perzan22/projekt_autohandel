const Chat = require('../models/chat')
const Message = require('../models/msg')


exports.openChat = (req, res, next) => {
    const offerID = req.body.offer;
    const sellerID = req.body.seller;
    const buyerID = req.body.buyer;

    Chat.findOne({ offerID: offerID, sellerID: sellerID, buyerID: buyerID }).then(chatFetched => {
        if (!chatFetched) {
            console.log({ offerID: offerID, sellerID: sellerID, buyerID: buyerID })
            const chat = new Chat({
                offerID: offerID,
                sellerID: sellerID,
                buyerID: buyerID
            })

            chat.save().then(chatCreated => {
                res.status(200).json({
                    message: 'Chat created successfully!',
                    chat: {
                        ...chatCreated,
                        id: chatCreated._id
                    }
                })
            })
            .catch(error => {
                res.status(500).json({
                    message: 'Couldnt create new chat',
                    error: error
                })
            })
        } else {
            res.status(200).json({
                message: 'Chat created successfully!',
                chat: {
                    ...chatFetched,
                    id: chatFetched._id
                }
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            message: 'Couldnt fetch any chat',
            error: error
        })
       
    })
}

exports.getChat = (req, res, next) => {
    const chatID = req.params.id;
    Chat.findById(chatID).then(chat => {
        if (chat) {
            res.status(200).json(chat)
        } else {
            res.status(404).json('Chat not found!')
        }
    })
}

exports.getMessages = (req, res, next) => {
    const senderID = req.query.senderID;
    const receiverID = req.query.receiverID;

    if (!senderID || !receiverID) {
        res.status(400).json({
            message: 'SenderID or receiverID not fetched'
        })
    } else {
        Message.find({ $or: [{ sender: senderID, receiver: receiverID }, { sender: receiverID, receiver: senderID }] }).sort({ date: 'asc' }).exec().then(messages => {
            res.status(200).json({
                info: 'Messages fetched successfully',
                messages: messages
            })
        })
    }

}