const passValid = require('password-validator')

const schema = new passValid();

schema
    .is().min(8)
    .is().max(48)
    .has().uppercase()
    .has().lowercase()
    .has().digits()

module.exports = schema