const Message = require('../models/msg')

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('join', ({ userID, chatID }) => {
            socket.join(userID + chatID);
            console.log(`UserID ${ userID }, joined`)
        })

        socket.on('sendMessage', (data) => {

            const { sender, receiver, msg, chat } = data
            const message = new Message({
                sender: sender,
                receiver: receiver,
                date: Date.now(),
                chat: chat,
                msg: msg
            })

            message.save().then(messageSaved => {
                
                io.to(receiver + chat).emit('receiveMessage', messageSaved);
                io.to(sender + chat).emit('receiveMessage', messageSaved)
            });
            
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected')
        })
    })
}