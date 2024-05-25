const Message = require('../models/msg')

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('join', ({ userID }) => {
            socket.join(userID);
            console.log(`UserID ${ userID }, joined`)
        })

        socket.on('sendMessage', (data) => {

            const { sender, receiver, msg } = data
            const message = new Message({
                sender: sender,
                receiver: receiver,
                date: Date.now(),
                msg: msg
            })

            message.save().then(messageSaved => {
                
                io.to(receiver).emit('receiveMessage', messageSaved);
                io.to(sender).emit('receiveMessage', messageSaved)
            });
            
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected')
        })
    })
}