const Profile = require('../models/profile')
const User = require('../models/user')


exports.createProfile = (req, res, next) => {

    const profile = new Profile({
        imie: req.body.imie,
        nazwisko: req.body.nazwisko,
        adres: req.body.adres,
        miasto: req.body.miasto,
        nrTelefonu: req.body.nrTelefonu,
        userID: req.userData.userID,
        email: req.userData.email,
        nickname: req.userData.nickname
    })

    console.log(profile)
    profile.save().then(result => {
        res.status(201).json({
            message: 'Profile added successfully!',
            profile: {
                ...result,
                id: result._id
            }
        });

        User.updateOne({ _id: req.userData.userID }, { $set: {profileID: result._id} }).then(user => {

            if (user.matchedCount > 0) {
                console.log({ message: 'Offer updated successfully!' })
            } else {
                console.log({ message: 'Not authorized' })
            }
        })
        .catch(error => {
            console.log({
                message: `Couldn't edit an offer`
            })
            
        }
    )}
)}