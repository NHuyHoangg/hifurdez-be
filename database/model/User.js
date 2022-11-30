const express = require('express');
const router = express.Router();
const {pool} =  require('../dbinfo');

pool.connect();

class User {
    constructor(){}
    async CheckLogin(email, password) {
        const user = await pool.request().query(`SELECT * FROM account WHERE login_email = '${email}' AND login_password ='${password}'`);
        if (user){
            return 1;
        }
        else {
            return 0;
        }

    }
};


module.exports = router;