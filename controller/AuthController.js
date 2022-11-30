const express = require('express');
const router = express.Router();
const User = require('../database/model/User')

router.post('/login', (req,res) => {
    try {
        res.status(201).json({ status: 201, message: "Login successfully!"})
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;