const express = require('express');
const router = express.Router();
const nguoiDungController = require('../controllers/nguoiDung.controller');
const authMiddleware = require('../middelwares/auth.middleware');

// Đăng ký và đăng nhập
router.post('/signup', nguoiDungController.dangKy);
router.post('/login', nguoiDungController.dangNhap);


// Lấy thông tin người dùng hiện tại
router.get('/me', nguoiDungController.getCurrentUser);

// Cập nhật thông tin cá nhân
router.put('/me', authMiddleware, nguoiDungController.updateUserInfo);

// Đổi mật khẩu
router.put('/me/change-password', authMiddleware, nguoiDungController.changePassword);

// Địa chỉ: thêm, cập nhật, xóa, đặt mặc định
router.post('/me/address', authMiddleware, nguoiDungController.addAddress);
router.put('/me/address/:id', authMiddleware, nguoiDungController.updateAddress);
router.delete('/me/address/:id', authMiddleware, nguoiDungController.deleteAddress);
router.put('/me/address/:id/default', authMiddleware, nguoiDungController.setDefaultAddress);

module.exports = router;
