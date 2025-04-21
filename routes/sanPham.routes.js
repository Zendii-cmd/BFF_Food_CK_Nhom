const express = require('express');
const router = express.Router();
// const { auth, adminAuth } = require('../middleware/auth');
const sanPhamController = require('../controllers/sanPham.controller');

// @route   POST /api/sanpham
// @desc    Tạo sản phẩm mới (Admin)
// @access  Private/Admin
router.post('/', auth, adminAuth, sanPhamController.createSanPham);

// @route   GET /api/sanpham
// @desc    Lấy tất cả sản phẩm (có phân trang, lọc, sắp xếp)
// @access  Public
router.get('/', sanPhamController.getAllSanPham);

// @route   GET /api/sanpham/:id
// @desc    Lấy chi tiết sản phẩm
// @access  Public
router.get('/:id', sanPhamController.getSanPhamById);

// @route   PUT /api/sanpham/:id
// @desc    Cập nhật sản phẩm (Admin)
// @access  Private/Admin
router.put('/:id', auth, adminAuth, sanPhamController.updateSanPham);

// @route   DELETE /api/sanpham/:id
// @desc    Xóa sản phẩm (Admin)
// @access  Private/Admin
router.delete('/:id', auth, adminAuth, sanPhamController.deleteSanPham);

module.exports = router;