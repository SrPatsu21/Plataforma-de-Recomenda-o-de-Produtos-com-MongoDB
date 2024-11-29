const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const fs = require('fs')
const path = require('path');
const { Users } = require('../models/Users');
const { Products } = require('../models/Products');
const { Image } = require('../models/Images');
const { faker } = require('@faker-js/faker'); // Faker.js for random data

router.get('', async (req, res) =>{
    //* delete
    try {
        await Users.deleteMany({});
        await Products.deleteMany({});
        await Image.deleteMany({});
    } catch (error) {
        console.error('Error deleting users:', error);
    }
    //* image
    let img_id = "0"
    try {
        const imageFile = fs.readFileSync(path.join(__dirname,'../views/static/placeholder/image.png'))
        if (!imageFile) {
            return res.status(400).send({ error: "No file uploaded" });
        }

        // Save image in MongoDB
        const newImage = new Image({
            name: "placeholder",
            img: {
                data: imageFile,
                contentType: 'png',
            },
        });
        await newImage.save();
        img_id = newImage._id;
    } catch(err)
    {
        console.log(err)
        res.send(err);
    }
    //* generate data

    const products = Array.from({ length: 70 }, () =>{
        const tagCount = faker.number.int({ min: 1, max: 10 }); // Generate random number of tags
        return {
            name: faker.commerce.productName(),
            img_id: img_id, // Random unique image ID
            category: faker.commerce.department(),
            tags: Array.from({ length: tagCount }, () => faker.commerce.productAdjective()),
            price: faker.commerce.price(10, 500, 2), // Random price between $10 and $500
            timesPurchased: faker.number.int({ min: 0, max: 500 }),
            active: true,
        };
    }); // Generate random products

    //* send to db
    try {
        //* admin
        bcrypt.hash('admin123', 10, async (err, hash) => {
            if (err) return res.status(500).json({ message: 'Error hashing password' });
            let password = hash;
            let admin = new Users({
                username: "admin",
                email: "paciente0@gmail.com",
                password,
                isAdmin: true,
                active: true,
                lastSearched: {
                    // words: lastWords ? lastWords.split(',').map(word => word.trim()) : [],
                    // categories: lastCategories ? lastCategories.split(',').map(cat => cat.trim()) : [],
                    // tags: lastTags ? lastTags.split(',').map(tag => tag.trim()) : [],
                },
            });
            await admin.save();
        });
        //*user
        let lastWords = "queijo,couve,celular,pc";
        let lastCategories = "Eletronicos,tomate";
        let lastTags = "ssd,1T,ssd,HD,Brazil";
        bcrypt.hash("senha123", 10, async (err, hash) => {
            if (err) return res.status(500).json({ message: 'Error hashing password' });
            let password = hash;
            let user = new Users({
                username:  "Ze das Couve 2004",
                email: "emailgrandedokrlsfd@gmail.com",
                password,
                isAdmin: false,
                active: true,
                lastSearched: {
                    words: lastWords ? lastWords.split(',').map(word => word.trim()) : [],
                    categories: lastCategories ? lastCategories.split(',').map(cat => cat.trim()) : [],
                    tags: lastTags ? lastTags.split(',').map(tag => tag.trim()) : [],
                },
            })
            await user.save();
        });
        await Products.insertMany(products);
    } catch (error) {
        console.error("Error seeding data:", error);
    }
    res.send('seed ends');
})

module.exports = router;