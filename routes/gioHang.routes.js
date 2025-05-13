const express = require('express');
const router = express.Router();
const { auth } = require('../middelwares/auth');
const { themVaoGioHang, xoaKhoiGioHang, layGioHang } = require('../controllers/gioHang.controller');

router.post('/', auth, themVaoGioHang);
router.delete('/:sanPhamId', auth, xoaKhoiGioHang);
router.get('/', auth, layGioHang);

module.exports = router;