require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Kết nối database
connectDB();

// Route kiểm tra
app.get('/', async (req, res) => {
  try {
    const NguoiDung = require('./models/NguoiDung.model');
    const users = await NguoiDung.find();
    res.json({ 
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});