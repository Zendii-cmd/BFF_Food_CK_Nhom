const mongoose = require('mongoose');

const MucGioHangSchema = new mongoose.Schema({
  sanPham: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SanPham',
    required: true
  },
  soLuong: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  ghiChu: String,
  gia: {
    type: Number,
    required: true
  },
  kichThuoc: {
    ten: String,
    giaThem: Number
  }
});

const GioHangSchema = new mongoose.Schema({
  nguoiDung: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: true,
    // unique: true
  },
  mucGioHang: [MucGioHangSchema],
  tongTien: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GioHang', GioHangSchema);
GioHangSchema.index({ nguoiDung: 1 }, { unique: true }); // Tạo index unique