const express = require('express');
const router = express.Router();
const Login = require("../../controllers/login/login.controller");


//login
router.post('/',Login.login)
//get me เช็ค token
router.get('/getme/',Login.getme)

//logout
router.get('/logout/',Login.logout)


module.exports = router;