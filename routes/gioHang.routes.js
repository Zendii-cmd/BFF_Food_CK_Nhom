const express = require('express');
const router = express.Router();
const { auth } = require('../middelwares/auth');
const { themVaoGioHang, xoaKhoiGioHang } = require('../controllers/gioHang.controller');

router.post('/', auth, themVaoGioHang);
router.delete('/:sanPhamId', auth, xoaKhoiGioHang);

module.exports = router;