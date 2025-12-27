const express = require('express');
const app = express();
const path = require('path');
const db = require('./config/db'); // Kết nối Database

// 1. Cấu hình View
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. MỞ CỔNG DỮ LIỆU (Phải nằm trên cùng)
// Hai dòng này giúp Server đọc được dữ liệu từ Form gửi lên
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. MỞ CỔNG ẢNH
app.use(express.static(path.join(__dirname, 'public')));

// 4. KHAI BÁO ĐƯỜNG DẪN (Routes)
// Phải đặt sau khi đã mở cổng dữ liệu
app.use('/', require('./routes/index'));
app.use('/admin', require('./routes/admin'));

// 5. CHẠY MÁY
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Web Tin Học Nguyễn Trinh đang chạy: http://localhost:${PORT}`);
});