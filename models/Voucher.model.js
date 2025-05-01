const mongoose = require('mongoose');

const VoucherSchema = new mongoose.Schema({
  maVoucher: {
    type: String,
    required: true,
    unique: true
  },
  moTa: String,
  loaiGiamGia: {
    type: String,
    enum: ['phantram', 'tienmat'],
    required: true
  },
  giaTri: {
    type: Number,
    required: true
  },
  giaTriToiThieu: Number, // Đơn hàng tối thiểu để áp dụng
  ngayBatDau: {
    type: Date,
    required: true
  },
  ngayKetThuc: {
    type: Date,
    required: true
  },
  daSuDung: {
    type: Number,
    default: 0
  },
  gioiHanSuDung: Number // Số lần sử dụng tối đa
}, { timestamps: true });

module.exports = mongoose.model('Voucher', VoucherSchema);