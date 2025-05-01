const express = require('express');
const router = express.Router();
const { auth } = require('../middelwares/auth');
const { themPhuongThucThanhToan } = require('../controllers/thanhToan.controller');

router.post('/', auth, themPhuongThucThanhToan);

module.exports = router;