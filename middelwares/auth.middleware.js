// const jwt = require('jsonwebtoken');
// const NguoiDung = require('../models/NguoiDung.model');

// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//       return res.status(401).json({ success: false, message: 'Chưa cung cấp token' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
//     const nguoiDung = await NguoiDung.findById(decoded.id);

//     if (!nguoiDung) {
//       return res.status(401).json({ success: false, message: 'Người dùng không tồn tại' });
//     }

//     req.user = decoded;
//     req.nguoiDung = nguoiDung;
//     next();
//   } catch (error) {
//     console.error('Lỗi xác thực:', error);
//     res.status(401).json({ success: false, message: 'Token không hợp lệ' });
//   }
// };

// module.exports = authMiddleware;

const jwt = require('jsonwebtoken');
const NguoiDung = require('../models/NguoiDung.model');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'Chưa cung cấp token' });
    }

    // Lấy JWT_SECRET từ biến môi trường
    const secret = process.env.JWT_SECRET || 'default_secret';

    // Kiểm tra xem có đọc được secret không
    if (!process.env.JWT_SECRET) {
      console.warn('⚠️ JWT_SECRET không được đặt trong file .env, đang dùng giá trị mặc định!');
    } else {
      console.log('✅ JWT_SECRET được load thành công');
    }

    const decoded = jwt.verify(token, secret);
    const nguoiDung = await NguoiDung.findById(decoded.id);

    if (!nguoiDung) {
      return res.status(401).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    req.user = decoded;
    req.nguoiDung = nguoiDung;
    next();
  } catch (error) {
    console.error('❌ Lỗi xác thực:', error.message);
    res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }
};

module.exports = authMiddleware;

