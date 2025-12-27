const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Kết nối DB Nguyễn Trinh
const upload = require('../config/upload'); 

// TRANG CHỦ ADMIN: Hiển thị Form và hỗ trợ TÌM KIẾM
router.get('/', async (req, res) => {
    try {
        const query = req.query.q || ''; // Nhận từ khóa tìm kiếm
        let sql = 'SELECT * FROM products ORDER BY id DESC';
        let params = [];

        if (query) {
            // Lọc theo tên máy, hãng hoặc cấu hình
            sql = 'SELECT * FROM products WHERE name LIKE ? OR brand LIKE ? OR short_specs LIKE ? ORDER BY id DESC';
            params = [`%${query}%`, `%${query}%`, `%${query}%` ];
        }

        const [products] = await db.query(sql, params);
        res.render('admin', { products: products, query: query }); 
    } catch (err) {
        res.render('admin', { products: [], query: '' });
    }
});

// 2. Xử lý Đăng máy mới
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { name, brand, price, short_specs } = req.body;
        const image = req.file ? req.file.filename : 'no-image.png';

        // Kiểm tra xem dữ liệu có bị trống không
        if (!name || !price) {
            return res.status(400).send("Anh Trinh ơi, nhớ nhập tên máy và giá nhé!");
        }

        const sql = `INSERT INTO products (name, brand, price, short_specs, image) VALUES (?, ?, ?, ?, ?)`;
        await db.query(sql, [name, brand, price, short_specs, image]);
        
        console.log("Đã đăng thành công máy:", name);
        res.redirect('/admin'); // Đăng xong quay lại trang quản lý
    } catch (err) {
        console.error("Lỗi đăng máy:", err);
        res.status(500).send("Lỗi đăng máy: " + err.message);
    }
});

// 3. Xử lý Xóa máy (Chức năng anh đã chạy mượt)
router.get('/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.redirect('/admin');
    } catch (err) {
        res.status(500).send("Lỗi xóa: " + err.message);
    }
});
// A. LẤY DỮ LIỆU CŨ: Để hiện lên Form khi anh bấm nút Sửa
router.get('/edit/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (rows.length > 0) {
            res.render('edit-product', { product: rows[0] });
        } else {
            res.redirect('/admin');
        }
    } catch (err) {
        res.status(500).send("Lỗi lấy dữ liệu: " + err.message);
    }
});

// B. CẬP NHẬT DỮ LIỆU: Khi anh nhấn nút "Lưu Thay Đổi"
router.post('/edit/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, brand, price, short_specs } = req.body;
        const productId = req.params.id;

        // Mặc định: Giữ nguyên ảnh cũ nếu không chọn ảnh mới
        let sql = "UPDATE products SET name=?, brand=?, price=?, short_specs=? WHERE id=?";
        let values = [name, brand, price, short_specs, productId];

        if (req.file) {
            // Nếu anh chọn ảnh mới từ Downloads, cập nhật luôn đường dẫn ảnh
            sql = "UPDATE products SET name=?, brand=?, price=?, short_specs=?, image=? WHERE id=?";
            values = [name, brand, price, short_specs, req.file.filename, productId];
        }

        await db.query(sql, values);
        res.redirect('/admin');
    } catch (err) {
        res.status(500).send("Lỗi lưu dữ liệu: " + err.message);
    }
});
module.exports = router;
// 1. Mạch lấy dữ liệu cũ để hiện lên Form sửa
router.get('/edit/:id', async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (products.length > 0) {
            res.render('edit-product', { product: products[0] });
        } else {
            res.redirect('/admin');
        }
    } catch (err) {
        res.status(500).send("Lỗi lấy dữ liệu: " + err.message);
    }
});

// 2. Mạch xử lý cập nhật dữ liệu sau khi sửa xong
router.post('/edit/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, brand, price, short_specs } = req.body;
        const productId = req.params.id;
        
        // Nếu anh có chọn ảnh mới thì lấy ảnh mới, không thì giữ ảnh cũ
        let sql = "UPDATE products SET name=?, brand=?, price=?, short_specs=? WHERE id=?";
        let values = [name, brand, price, short_specs, productId];

        if (req.file) {
            sql = "UPDATE products SET name=?, brand=?, price=?, short_specs=?, image=? WHERE id=?";
            values = [name, brand, price, short_specs, req.file.filename, productId];
        }

        await db.query(sql, values);
        console.log("Đã cập nhật máy ID:", productId);
        res.redirect('/admin');
    } catch (err) {
        res.status(500).send("Lỗi cập nhật: " + err.message);
    }
});