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

// Export the model
module.exports = Image;