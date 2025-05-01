const express = require('express');
const router = express.Router();
const { auth } = require('../middelwares/auth');
const { apDungVoucher } = require('../controllers/voucher.controller');

router.post('/apdung', auth, apDungVoucher);

module.exports = router;