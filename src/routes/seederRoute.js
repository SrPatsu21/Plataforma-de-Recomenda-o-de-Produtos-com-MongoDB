const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Users = require('../models/Users');

router.get('', async (req, res) =>{
    try {
        const username = "admin"
        const email = "paciente0@gmail.com"
        const pass = "admin123"
        const isAdmin = true;
        const active = true;
        bcrypt.hash(pass, 10, async (err, hash) => {
            if (err) return res.status(500).json({ message: 'Error hashing password' });
            const password = hash;
            const user = new Users({
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
            res.redirect('/login');
        });
    } catch (err) {
    res.status(400).send(err.message);
    }
})

module.exports = router;