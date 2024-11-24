const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    _id: {
        type: "objectId",
        auto: true,
        // unique: true, // no need, MongoDB automatically ensures that
        description: "must be an ObjectId and is required",
    },
    name: {
        type: "string",
        required: true,
        trim: true,
        description: "must be a string and is required",
    },
    img: {
        data: Buffer,
        contentType: String
    }
});

const Image = mongoose.model('Image', imageSchema);

//* functions
const multer = require('multer');
// Set up multer storage (in-memory storage for simplicity)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadImage = async (req, res, next) => {
    try {
        console.log(req)
        // Ensure a file was uploaded
        if (!req.body.image) {

            return res.status(400).send('No file uploaded.');
        }

        // Create an image document and save to MongoDB
        const image = new Image({
            name: req.body.image.name || 'Untitled',  // optional name from request body
            img: {
                data: req.body.image.buffer,           // image data
                contentType: req.body.image.mimetype   // image content type (e.g. 'image/png')
            }
        });

        // console.log(req.body.image.buffer)
        // console.log(req.body.image.mimetype)

        // Save the image to MongoDB
        await image.save();

        // Send a success response
        req.img_id = image._id;
        next()
    } catch (err) {
        console.error(err);
        next(err)
    }
}
// Export the model
module.exports = {
    Image: Image,
    uploadImage: uploadImage
}