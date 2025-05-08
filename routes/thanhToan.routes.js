const express = require('express');
const router = express.Router();
const { auth } = require('../middelwares/auth');
const { themPhuongThucThanhToan, suaPhuongThucThanhToan, xoaPhuongThucThanhToan, chonMacDinhPhuongThucThanhToan } = require('../controllers/thanhToan.controller');

router.post('/themphuongthucthanhtoan', auth, themPhuongThucThanhToan);
router.put('/:phuongThucId', auth, suaPhuongThucThanhToan);
router.delete('/:phuongThucId', auth, xoaPhuongThucThanhToan);
router.patch('/:phuongThucId/macdinh', auth, chonMacDinhPhuongThucThanhToan);

module.exports = router;