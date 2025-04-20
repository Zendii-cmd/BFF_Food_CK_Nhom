require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const nguoiDungRoutes = require('./routes/nguoiDung.routes');

const app = express();

// Kết nối database
connectDB();

// Middleware để đọc JSON
app.use(express.json());

app.use('/api/nguoi-dung', nguoiDungRoutes);


// Route kiểm tra
// app.get('/', async (req, res) => {
//   try {
//     const NguoiDung = require('./models/NguoiDung.model');
//     const users = await NguoiDung.find();
//     res.json({ 
//       success: true,
//       data: users
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});