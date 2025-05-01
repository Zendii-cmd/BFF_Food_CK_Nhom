const express = require('express');
const router = express.Router();
const { auth } = require('../middelwares/auth');
const { themVaoGioHang } = require('../controllers/gioHang.controller');

router.post('/', auth, themVaoGioHang);

module.exports = router;