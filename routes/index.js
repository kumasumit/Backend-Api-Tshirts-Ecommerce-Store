const express = require('express');
const router = express.Router();
const {home } = require('../controllers/homeController');
router.get('/', home)

// any routes with /api/v1 will be controlled by routes/users.js file
router.use('/',require('./users'));

module.exports = router;
