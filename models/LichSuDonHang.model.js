const mongoose = require('mongoose');

const ChiTietDonHangSchema = new mongoose.Schema({
  sanPham: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SanPham',
    required: true
  },
  soLuong: {
    type: Number,
    required: true,
    min: 1
  },
  gia: {
    type: Number,
    required: true
  },
  kichThuoc: {
    ten: String,
    giaThem: Number
  }
});

const LichSuDonHangSchema = new mongoose.Schema({
  nguoiDung: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: true
  },
  danhSachSanPham: [ChiTietDonHangSchema],
  diaChiGiaoHang: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung.danhSachDiaChi'
  },
  phuongThucThanhToan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhuongThucThanhToan'
  },
  tongTien: {
    type: Number,
    required: true
  },
  trangThai: {
    type: String,
    enum: ['choXacNhan', 'dangChuanBi', 'dangGiao', 'daGiao', 'daHuy'],
    default: 'choXacNhan'
  },
  ghiChu: String,
  thoiGianDatHang: {
    type: Date,
    default: Date.now
  },
  thoiGianCapNhat: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('LichSuDonHang', LichSuDonHangSchema);