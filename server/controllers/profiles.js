const Profile = require('../models/profile')


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
    })
}