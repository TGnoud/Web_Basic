# Dự án Web Cơ bản (Rổ Phim)

Đây là một dự án nhỏ thực hành các kiến thức cơ bản về phát triển web (HTML, CSS, JavaScript), được xây dựng qua 6 bài tập.

Sản phẩm cuối cùng là một trang web "Rổ Phim" đơn giản, cho phép quản lý một danh sách các sản phẩm (phim) với đầy đủ các chức năng CRUD (Thêm, Đọc, Xóa) cũng như lọc và sắp xếp.

## Các tính năng chính 

* **Hiển thị sản phẩm:** Tải và hiển thị danh sách phim từ file `products.json` bằng `fetch` API.
* **Thêm sản phẩm:** Một form động cho phép thêm sản phẩm mới vào danh sách.
* **Xóa sản phẩm:** Nút "Xóa" trên mỗi sản phẩm để loại bỏ sản phẩm khỏi danh sách.
* **Lọc và Tìm kiếm:**
    * Tìm kiếm (lọc) theo tên phim.
    * Lọc theo khoảng giá (thấp, trung bình, cao).
* **Sắp xếp:** Sắp xếp danh sách theo tên (A-Z, Z-A) hoặc giá (tăng dần, giảm dần).
* **Lưu trữ:** Sử dụng `localStorage` để lưu lại các thay đổi (thêm/xóa) của người dùng, ưu tiên tải dữ liệu từ đây trước khi `fetch`.

## Công nghệ sử dụng

* **HTML5:** Cấu trúc trang web.
* **CSS3:** Tạo kiểu (sử dụng Flexbox, CSS Variables, và thiết kế responsive).
* **JavaScript (ES6+):**
    * Thao tác DOM (thêm, xóa, ẩn/hiện phần tử).
    * Xử lý sự kiện (click, submit, change).
    * Sử dụng `fetch` API (với `async/await`) để tải dữ liệu.
    * Sử dụng `localStorage` để lưu trữ dữ liệu phía client.

## Cách chạy

Do phiên bản cuối cùng sử dụng `fetch` API để tải tệp `products.json`, bạn cần chạy dự án này trên một máy chủ cục bộ.

**Cách đơn giản nhất:**
1.  Mở thư mục dự án bằng **Visual Studio Code**.
2.  Cài đặt extension **Live Server**.
3.  Nhấp chuột phải vào file `index.html` và chọn "Open with Live Server".
