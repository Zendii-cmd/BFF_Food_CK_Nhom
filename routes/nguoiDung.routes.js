const express = require('express');
const router = express.Router();
const { auth } = require('../middelwares/auth');
const nguoiDungController = require('../controllers/nguoiDung.controller');

// Đăng ký và đăng nhập (public)
router.post('/dangky', nguoiDungController.dangKy);
router.post('/dangnhap', nguoiDungController.dangNhap);

// Các route yêu cầu xác thực
router.use(auth);

// Lấy thông tin người dùng hiện tại
router.get('/me', nguoiDungController.getCurrentUser);

// Cập nhật thông tin cá nhân
router.put('/me', nguoiDungController.updateUserInfo);

// Đổi mật khẩu
router.put('/doimatkhau', nguoiDungController.changePassword);

// Địa chỉ: thêm, cập nhật, xóa, đặt mặc định
router.post('/diachi', nguoiDungController.addAddress);
router.put('/diachi/:id', nguoiDungController.updateAddress);
router.delete('/diachi/:id', nguoiDungController.deleteAddress);
router.put('/diachi/:id/macdinh', nguoiDungController.setDefaultAddress);

module.exports = router;