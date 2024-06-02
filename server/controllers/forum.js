const Post = require('../models/post')
const Profile = require('../models/profile')
const mongoose = require('mongoose');
const Comment = require('../models/comment')

exports.addPost = (req, res, next) => {
    let avatar;
    const userID = new mongoose.Types.ObjectId(req.userData.userID)

    Profile.find({userID: userID}).then(profile => {
        avatar = profile[0].avatarPath

        const post = new Post ({
            tytul: req.body.tytul,
            tresc: req.body.tresc,
            autor: req.userData.userID,
            data_publikacji: Date.now(),
            ocena: 0,
            avatar: avatar
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
                message: 'Creating post failed',
                error: error
            })
        })
    })

    
}

exports.getPosts = (req, res, next) => {
    Post.find()
    .populate('autor')
    .populate('komentarze')
    .populate({path: 'komentarze', 
        populate: {path: 'autor', select: 'nickname'}
    })
    .then(postsFetched => {
        res.status(200).json({
            message: 'Posts fetched successfully',
            posts: postsFetched
        })
    })
    .catch(error => [
        res.status(500).json({
            message: 'Fetching posts failed',
            error: error
        })
    ])
}

exports.addComment = (req, res, next) => {
    const comment = new Comment({
        tresc: req.body.tresc,
        autor: req.userData.userID,
        data: Date.now()
    })

    comment.save().then(commentAdded => {

        Post.findById(req.body.postID).then(post => {
            if (!post) {
                res.status(400).json({
                    message: 'Couldnt find a post'
                })
            } else {
                post.komentarze.push(commentAdded._id)
                post.save().then(result => {
                    console.log(result.komentarze)
                    res.status(200).json({
                        message: 'Comment added successfully',
                        comment: {
                            ...commentAdded,
                            id: commentAdded._id
                        }
                    })
                })
            }
        })

        
    })
}