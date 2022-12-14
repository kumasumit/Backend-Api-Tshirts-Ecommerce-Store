const express = require('express');
const router = express.Router();
const {signup, login, logout} = require('../controllers/usersController');
router.post('/signup', signup);
module.exports = router;