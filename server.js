require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const nguoiDungRoutes = require('./routes/nguoiDung.routes');
const danhMucRoutes = require ('./routes/danhMuc.routes');
const sanPhamRoutes = require ('./routes/sanPham.routes');
const gioHangRoutes = require('./routes/gioHang.routes');
const thanhToanRoutes = require('./routes/thanhToan.routes');
const voucherRoutes = require('./routes/voucher.routes');

const app = express();
const cors = require('cors');
// Kết nối database
connectDB();

// Middleware để đọc JSON
app.use(express.json());
app.use(cors());
app.use('/api/nguoidung', nguoiDungRoutes);
app.use('/api/danhmuc', danhMucRoutes);
app.use('/api/sanpham', sanPhamRoutes);

app.use('/api/giohang', gioHangRoutes);
app.use('/api/thanhtoan', thanhToanRoutes);
app.use('/api/voucher', voucherRoutes);

// Trong file App.js hoặc server.js
const cors = require('cors');
app.use(cors()); // Cho phép tất cả domain
// Hoặc cấu hình chi tiết:
app.use(cors({
  origin: 'http://localhost:3000', // Đổi thành IP/domain của React Native
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});