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

const uploadImage = async (req, res, next) => {
    try {
        const { name } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).send({ error: "No file uploaded" });
        }

        // Save image in MongoDB
        const newImage = new Image({
            name,
            img: {
                data: imageFile.buffer,
                contentType: imageFile.mimetype,
            },
        });

        await newImage.save();
        req.img_id = newImage._id;
        next();
    } catch (error) {
        console.error("Error uploading image:", error);
        next(error);
    }
};

//* delete
const deleteImage = async (req, res, next) => {
    try{
        const image = await Image.findByIdAndDelete(req.params.delete_img_id);
        req.image = image;
        next()
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}// Export the model

//*update
const updateImage = async (req, res, next) => {
    if (req.file)
    {
        try {
            const { name } = req.body;
            const imageFile = req.file;

            if (!imageFile) {
                return res.status(400).send({ error: "No file uploaded" });
            }

            // Save image in MongoDB
            const newImage = new Image({
                name,
                img: {
                    data: imageFile.buffer,
                    contentType: imageFile.mimetype,
                },
            });

            await newImage.save();
            //* delete last
            try{
                await Image.findByIdAndDelete(req.body.img_id);
            } catch
            {

            }
            //* save id
            req.img_id = newImage._id;
            next();
        } catch (error) {
            console.error("Error uploading image:", error);
            next(error);
        }
    }
    else{
        next();
    }
};

module.exports = {
    Image: Image,
    uploadImage: uploadImage,
    deleteImage: deleteImage,
    updateImage: updateImage
}

