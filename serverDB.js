const express = require('express');               // Import thư viện Express
const mongoose = require('mongoose');             // Import thư viện Mongoose để kết nối với MongoDB
const cors = require('cors');                     // Import thư viện CORS để xử lý yêu cầu từ nhiều nguồn khác
const bodyParser = require('body-parser');       // Import body-parser để phân tích dữ liệu từ yêu cầu HTTP
const bcrypt = require('bcryptjs');               // Thư viện để mã hóa mật khẩu
const jwt = require('jsonwebtoken');               // Thư viện để xác thực token
const app = express(); 
const port = 5000;                                // Cổng mà server sẽ lắng nghe

mongoose.connect('mongodb://localhost:27017/lab7', {});
app.use(cors());                                   // Sử dụng middleware CORS
app.use(bodyParser.json());                        // Phân tích dữ liệu JSON trong yêu cầu
app.use(bodyParser.urlencoded({ extended: true })); // Phân tích dữ liệu URL-encoded từ yêu cầu
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },       // Tên người dùng phải là duy nhất
    password: String,                                // Mật khẩu
  });
  
  const User = mongoose.model('users', userSchema); // Đổi tên collection thành 'users'
  const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];     // Lấy token từ header
    if (!token) return res.sendStatus(401);           // Nếu không có token, trả về 401 Unauthorized
    jwt.verify(token, 'your_secret_key', (err, user) => { // Xác thực token
      if (err) return res.sendStatus(403);            // Nếu token không hợp lệ, trả về 403 Forbidden
      req.user = user;                                // Thêm thông tin người dùng vào request
      next();                                         // Tiếp tục xử lý middleware tiếp theo
    });
  };
  app.post('/api/register', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10); // Mã hóa mật khẩu
      const newUser = new User({ username: req.body.username, password: hashedPassword }); // Tạo một người dùng mới
      await newUser.save();                            // Lưu người dùng vào MongoDB
      res.status(201).send('User registered');        // Trả về thông báo đăng ký thành công
    } catch (error) {
      res.status(400).send('Error registering user: ' + error.message); // Trả về lỗi nếu có
    }
  });

  app.post('/api/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username }); // Tìm người dùng theo tên
    if (!user) {
      return res.status(400).send('cannot find user'); // Nếu không tìm thấy người dùng, trả về lỗi
    }
  
    if (await bcrypt.compare(req.body.password, user.password)) { // So sánh mật khẩu đã nhập với mật khẩu đã mã hóa
      const token = jwt.sign({ username: user.username }, 'your_secret_key'); // Tạo token
      res.json({ token }); // Trả về token cho phía client
    } else {
      res.status(400).send('Not Allowed'); // Nếu mật khẩu không đúng, trả về thông báo không được phép
    }
  });

  app.get('/api/user', authenticateToken, async (req, res) => {
    const user = await User.findOne({ username: req.user.username }); // Tìm người dùng theo tên đã xác thực
    if (user) {
      res.json({ username: user.username }); // Nếu tìm thấy, trả về thông tin người dùng
    } else {
      res.status(404).send('User not found'); // Nếu không tìm thấy, trả về lỗi 404
    }
  });

  app.post('/api/forget', async (req, res) => {
    const { username, password } = req.body;
  
    try {// Tìm user
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).send('User not found');
      }
      const hashedPassword = await bcrypt.hash(password, 10);// Băm mật khẩu mới
      user.password = hashedPassword;
      await user.save();// Lưu lại vào DB
      return res.status(200).send('Password updated successfully');
    } catch (error) {
      console.error('Error in /api/forget:', error);
      return res.status(500).send('Error updating password: ' + error.message);
    }
  });
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`); // Thông báo server đang chạy
  });