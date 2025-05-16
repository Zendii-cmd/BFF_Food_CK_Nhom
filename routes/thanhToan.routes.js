const express = require('express');
const router = express.Router();
const { auth } = require('../middelwares/auth');
const { themPhuongThucThanhToan, suaPhuongThucThanhToan, xoaPhuongThucThanhToan, chonMacDinhPhuongThucThanhToan, thanhToanGioHang, layDanhSachPhuongThucThanhToan } = require('../controllers/thanhToan.controller');

router.post('/themphuongthucthanhtoan', auth, themPhuongThucThanhToan);
router.get('/', auth, layDanhSachPhuongThucThanhToan);
router.put('/:phuongThucId', auth, suaPhuongThucThanhToan);
router.delete('/:phuongThucId', auth, xoaPhuongThucThanhToan);
router.patch('/:phuongThucId/macdinh', auth, chonMacDinhPhuongThucThanhToan);
router.post('/thanhtoan', auth, thanhToanGioHang);

module.exports = router;