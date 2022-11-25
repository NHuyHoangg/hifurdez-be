const express = require('express');
const router = express.Router();
const {pool} =  require('./database/dbinfo');

router.get('', async(req,res)=>{
    try {
        await pool.connect();
        let email = 'admin@hfd.com';
        let password = '1234@';
        const result = await pool.request().query(`SELECT * FROM hifurdez.res_users WHERE user_mail = '${email}' AND password ='${password}'`);
        const test = result.recordset;

        res.json(test);
        console.log(test);
      
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;