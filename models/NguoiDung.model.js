const mongoose = require('mongoose');

const DiaChiSchema = new mongoose.Schema({
  tenNguoiNhan: { type: String, required: true },
  soDienThoai: { type: String, required: true },
  diaChiChiTiet: { type: String, required: true },
  phuongXa: String,
  quanHuyen: String,
  thanhPho: String,
  macDinh: { type: Boolean, default: false }
}, { timestamps: true });

const TaiKhoanSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
  },
  matKhau: { type: String, required: true },
  hoatDong: { type: Boolean, default: true }
}, { timestamps: true });

const NguoiDungSchema = new mongoose.Schema({
  hoTen: { type: String, required: true },
  ngaySinh: Date,
  vaiTro: String,
  taiKhoan: TaiKhoanSchema,
  danhSachDiaChi: [DiaChiSchema]
}, { timestamps: true });

module.exports = mongoose.model('NguoiDung', NguoiDungSchema);