const express = require('express');
const router = express.Router();

const {Image} = require('../models/Images');

// Route to handle image upload
router.get('/:id', async (req, res) => {
  try {
    // Get the image by its ObjectId
    const image = await Image.findById(req.params.id);

    // Check if the image exists
    if (!image) {
        return res.status(404).send('Image not found.');
    }

    // Set the content type (e.g., 'image/jpeg') and send the image buffer
    res.setHeader('Content-Type', image.img.contentType || 'application/octet-stream');
    res.send(image.img.data);
  } catch (err) {
      // console.error(err);
      res.status(500).send('Error retrieving the image.');
  }
});

module.exports = router;