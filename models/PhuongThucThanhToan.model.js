const mongoose = require('mongoose');

const PhuongThucThanhToanSchema = new mongoose.Schema({
  nguoiDung: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: true
  },
  loai: {
    type: String,
    enum: ['the', 'viDienTu', 'tienMat'],
    required: true
  },
  thongTinThe: {
    soThe: String,
    tenTrenThe: String,
    ngayHetHan: String,
    cvv: String
  },
  viDienTu: {
    loaiVi: {
      type: String,
      enum: ['Momo', 'ZaloPay', 'VNPay']
    },
    soDienThoai: String
  },
  macDinh: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('PhuongThucThanhToan', PhuongThucThanhToanSchema);