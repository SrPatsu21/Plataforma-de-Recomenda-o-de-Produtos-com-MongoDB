const express = require('express');
const router = express.Router();
const { isAuthenticated } = require("./authentication")

const multer = require('multer');
const fs = require('fs');
const Image = require('../models/Images');

const upload = multer({ dest: '../uploads/' }); // folder to store uploads

// Route to handle image upload
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    // Save the image to MongoDB
    const newImage = new Image({
      name: file.originalname,
      img: {
        data: fs.readFileSync(file.path),
        contentType: file.mimetype,
      },
    });

    await newImage.save();

    // Clean up the temp file
    fs.unlinkSync(file.path);

    res.status(200).send('Image uploaded and saved successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while uploading the image.');
  }
});

module.exports = router;