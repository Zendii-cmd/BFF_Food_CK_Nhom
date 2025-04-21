const express = require('express');
const router = express.Router();
// const { auth, adminAuth } = require('../middleware/auth');
const danhMucController = require('../controllers/danhMuc.controller');

// @route   POST /api/danhmuc
// @desc    Tạo danh mục mới (Admin)
// @access  Private/Admin
router.post('/', auth, adminAuth, danhMucController.createDanhMuc);

// @route   GET /api/danhmuc
// @desc    Lấy tất cả danh mục
// @access  Public
router.get('/', danhMucController.getAllDanhMuc);

// @route   PUT /api/danhmuc/:id
// @desc    Cập nhật danh mục (Admin)
// @access  Private/Admin
router.put('/:id', auth, adminAuth, danhMucController.updateDanhMuc);

// @route   DELETE /api/danhmuc/:id
// @desc    Xóa danh mục (Admin)
// @access  Private/Admin
router.delete('/:id', auth, adminAuth, danhMucController.deleteDanhMuc);

module.exports = router;