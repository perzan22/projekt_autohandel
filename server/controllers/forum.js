const Post = require('../models/post')

exports.addPost = (req, res, next) => {

    const post = new Post ({
        tytul: req.body.tytul,
        tresc: req.body.tresc,
        autor: req.userData.userID,
        data_publikacji: Date.now(),
        ocena: 0
    })

    post.save().then(postCreated => {
        res.status(200).json({
            message: 'Post created successfully',
            post: {
                ...postCreated,
                id: postCreated._id
            }
        })
    })
    .catch(error => {
        res.status(500).json({
            message: 'Creating post failed'
        })
    })
}