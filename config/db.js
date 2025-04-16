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
    const DanhMuc = require('../models/DanhMuc.model');
    const SanPham = require('../models/SanPham.model');

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('123456', saltRounds);

    // Xóa dữ liệu cũ (cẩn thận!)
    await mongoose.connection.dropDatabase();
    console.log('Đã xóa toàn bộ dữ liệu cũ');

     // Tạo danh mục
     const danhMuc1 = await DanhMuc.create({
      tenDanhMuc: 'Đồ ăn nhanh',
      moTa: 'Các món ăn nhanh phổ biến'
    });
    
    const danhMuc2 = await DanhMuc.create({
      tenDanhMuc: 'Đồ uống',
      moTa: 'Các loại đồ uống'
    });
    
    // Tạo sản phẩm
    await SanPham.create({
      tenSanPham: 'Veggie tomato',
      moTa: 'Bánh kẹp rau củ tươi ngon',
      danhMuc: danhMuc1._id,
      gia: 9.22,
      calo: 150,
      thoiGianChuanBi: 15,
      kichThuoc: [
        { tenKichThuoc: 'Nhỏ', giaThem: 0 },
        { tenKichThuoc: 'Vừa', giaThem: 1.5 }
      ]
    });

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