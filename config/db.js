const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Kết nối MongoDB thành công');
  } catch (error) {
    console.error('Lỗi kết nối MongoDB:', error.message);
    process.exit(1);
  }
};

async function initSampleData() {
  try {
    // Đảm bảo đã kết nối
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const NguoiDung = require('../models/NguoiDung.model');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('123456', saltRounds);

    // Xóa dữ liệu cũ (cẩn thận!)
    await mongoose.connection.dropDatabase();
    console.log('Đã xóa toàn bộ dữ liệu cũ');

    // Tạo admin
    await NguoiDung.create({
      hoTen: 'Quản trị viên',
      taiKhoan: {
        email: 'admin@bfffood.com',
        matKhau: hashedPassword
      },
      danhSachDiaChi: [{
        tenNguoiNhan: 'Quản trị viên',
        soDienThoai: '0987654321',
        diaChiChiTiet: '123 Đường ABC, Quận 1',
        thanhPho: 'TP.HCM',
        macDinh: true
      }]
    });

    console.log('Đã tạo dữ liệu mẫu thành công');
    await mongoose.connection.close(); // Đóng kết nối nếu cần
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu mẫu:', error);
    process.exit(1);
  }
}

// Gọi hàm
(async () => {
  await connectDB();
  await initSampleData();
})();

module.exports = connectDB;