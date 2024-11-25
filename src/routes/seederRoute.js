const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Users } = require('../models/Users');

router.get('', async (req, res) =>{
    try {
        const result = await Users.deleteMany({});
        console.log(`${result.deletedCount} users have been deleted.`);
    } catch (error) {
        console.error('Error deleting users:', error);
    }
    try {
        let username = "admin"
        let email = "paciente0@gmail.com"
        let pass = "admin123"
        let isAdmin = true;
        let active = true;
        bcrypt.hash(pass, 10, async (err, hash) => {
            if (err) return res.status(500).json({ message: 'Error hashing password' });
            let password = hash;
            let user = new Users({
            username,
            email,
            password,
            isAdmin,
            active,
            lastSearched: {
                // words: lastWords ? lastWords.split(',').map(word => word.trim()) : [],
                // categories: lastCategories ? lastCategories.split(',').map(cat => cat.trim()) : [],
                // tags: lastTags ? lastTags.split(',').map(tag => tag.trim()) : [],
            },
            });

            await user.save();
        });
    } catch (error) {
    }
    try {
        let username = "Ze das Couve 2004"
        let email = "emailgrandedokrlsfd@gmail.com"
        let pass = "senha123"
        let isAdmin = false;
        let active = true;
        let lastWords = "queijo,couve,celular,pc";
        let lastCategories = "Eletronicos,tomate";
        let lastTags = "ssd,1T,ssd,HD,Brazil";
        bcrypt.hash(pass, 10, async (err, hash) => {
            if (err) return res.status(500).json({ message: 'Error hashing password' });
            let password = hash;
            let user = new Users({
            username,
            email,
            password,
            isAdmin,
            active,
            lastSearched: {
                words: lastWords ? lastWords.split(',').map(word => word.trim()) : [],
                categories: lastCategories ? lastCategories.split(',').map(cat => cat.trim()) : [],
                tags: lastTags ? lastTags.split(',').map(tag => tag.trim()) : [],
            },
            });

            await user.save();
        });
    } catch (err) {
    }
    res.redirect('/login');
})

module.exports = router;