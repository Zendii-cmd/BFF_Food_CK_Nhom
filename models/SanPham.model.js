const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const KichThuocSchema = new mongoose.Schema({
  tenKichThuoc: { type: String, required: true },
  giaThem: { type: Number, default: 0 }
});

const SanPhamSchema = new mongoose.Schema({
  tenSanPham: { type: String, required: true },
  moTa: String,
  thanhPhan: [String],
  danhMuc: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'DanhMuc',
    required: true
  },
  gia: { type: Number, required: true },
  calo: Number,
  thoiGianChuanBi: Number,
  hinhAnh: String,
  kichThuoc: [KichThuocSchema],
  hoatDong: { type: Boolean, default: true }
}, { timestamps: true });

SanPhamSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('SanPham', SanPhamSchema);