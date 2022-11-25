const express = require('express');
const router = express.Router();
const User = require('../database/model/User')
// const {pool} =  require('./database/dbinfo');

router.post('/login', (req,res) => {
    try {
        // let user = new User();
        // if (!req.body.email || !req.body.password){
        //     throw { message: "Dont enough fields to login" };
        // }
        // let i = user.CheckLogin(!req.body.email, !req.body.password);
        // console.log(i);
        res.status(201).json({ status: 201, message: "Login successfully!"})
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;