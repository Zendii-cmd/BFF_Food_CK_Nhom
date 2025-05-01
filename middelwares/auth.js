const jwt = require('jsonwebtoken');
const NguoiDung = require('../models/NguoiDung.model');

/**
 * Middleware xác thực người dùng
 */
const auth = async (req, res, next) => {
  try {
    // Lấy token từ header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để truy cập'
      });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Tìm người dùng trong database
    const nguoiDung = await NguoiDung.findOne({
      _id: decoded.id,
      'taiKhoan.tokens': token
    });

    if (!nguoiDung) {
      throw new Error('Người dùng không tồn tại hoặc token không hợp lệ');
    }

    // Lưu thông tin người dùng và token vào request
    req.token = token;
    req.nguoiDung = nguoiDung;
    next();
  } catch (error) {
    console.error('Lỗi xác thực:', error);
    res.status(401).json({
      success: false,
      message: 'Xác thực thất bại. Vui lòng đăng nhập lại.'
    });
  }
};

/**
 * Middleware kiểm tra quyền admin
 */
const adminAuth = (req, res, next) => {
  try {
    if (req.nguoiDung.vaiTro !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập tài nguyên này'
      });
    }
    next();
  } catch (error) {
    console.error('Lỗi kiểm tra quyền admin:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi kiểm tra quyền'
    });
  }
};

module.exports = { auth, adminAuth };