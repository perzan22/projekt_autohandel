const multer = require('multer')

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let err = new Error("Invalid mime type")
        if (isValid) {
            err = null;
        }
        cb(err, 'server/images/cars');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];

        const max = 10
        const randomInteger = Math.floor(Math.random() * max).toString()

        cb(null, name + randomInteger + '-' + Date.now() + '.' + ext);
    }
});

module.exports = multer({storage: storage});