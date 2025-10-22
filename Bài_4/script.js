// Chờ cho toàn bộ nội dung DOM được tải xong trước khi chạy script
document.addEventListener("DOMContentLoaded", function() {

    // --- Lấy các phần tử DOM chính ---
    const toggleBtn = document.getElementById("toggle-form-btn");
    const formSection = document.getElementById("add-product-form-section");
    const addProductForm = document.getElementById("add-product-form");
    const cancelBtn = document.getElementById("cancel-add-btn");
    const productList = document.getElementById("product-list");
    const errorMsg = document.getElementById("form-error-msg");
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");


    // --- 1. Xử lý Ẩn/Hiện Form Thêm Sản Phẩm ---
    if (toggleBtn && formSection) {
        toggleBtn.addEventListener("click", function() {
            formSection.classList.toggle("hidden");
            // Cập nhật nội dung của nút
            if (formSection.classList.contains("hidden")) {
                toggleBtn.textContent = "Thêm sản phẩm";
                // Xóa lỗi và reset form khi đóng
                errorMsg.style.display = "none";
                addProductForm.reset();
            } else {
                toggleBtn.textContent = "Đóng Form";
            }
        });
    }

    // --- 2. Xử lý nút Hủy (Cancel) ---
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function() {
            formSection.classList.add("hidden");
            toggleBtn.textContent = "Thêm sản phẩm";
            errorMsg.style.display = "none";
            addProductForm.reset();
        });
    }

    // --- 3. Xử lý Submit Form (Thêm Sản Phẩm Mới) ---
    if (addProductForm) {
        addProductForm.addEventListener("submit", function(event) {
            // Ngăn form gửi đi và tải lại trang
            event.preventDefault(); 
            
            // Lấy giá trị từ các trường input
            const name = document.getElementById("product-name").value.trim();
            const desc = document.getElementById("product-desc").value.trim();
            const price = document.getElementById("product-price").value; // Lấy giá trị gốc (có thể là chuỗi)
            let imageUrl = document.getElementById("product-image").value.trim();

            // *** Validate dữ liệu ***
            const priceNum = parseFloat(price);

            if (!name || !price) {
                showError("Tên sản phẩm và Giá là bắt buộc.");
                return; // Dừng thực thi
            }

            if (isNaN(priceNum) || priceNum <= 0) {
                showError("Giá phải là một số dương hợp lệ.");
                return; // Dừng thực thi
            }

            // Nếu không nhập ảnh, dùng ảnh placeholder
            if (imageUrl === "") {
                imageUrl = `https://placehold.co/300x450/EFEFEF/333333?text=${name.replace(' ', '+')}`;
            }

            // *** Dữ liệu hợp lệ -> Tạo sản phẩm mới ***
            
            // Xóa thông báo lỗi (nếu có)
            hideError();

            // Tạo phần tử article mới
            const newProduct = document.createElement('article');
            newProduct.className = 'product-item';

            // Định dạng giá kiểu Việt Nam
            const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceNum);

            // Thêm nội dung HTML cho sản phẩm
            newProduct.innerHTML = `
                <img src="${imageUrl}" alt="Bìa phim ${name}" onerror="this.src='https://placehold.co/300x450/EFEFEF/333333?text=Image+Error'">
                <h3>${name}</h3>
                <p>${desc || 'Chưa có mô tả cho sản phẩm này.'}</p>
                <p class="price">Giá: ${formattedPrice}</p>
            `;

            // Thêm sản phẩm mới vào đầu danh sách
            productList.prepend(newProduct);

            // Reset form và ẩn đi
            addProductForm.reset();
            formSection.classList.add("hidden");
            toggleBtn.textContent = "Thêm sản phẩm";
        });
    }

    // Hàm hiển thị lỗi
    function showError(message) {
        if (errorMsg) {
            errorMsg.textContent = message;
            errorMsg.style.display = "block";
        }
    }

    // Hàm ẩn lỗi
    function hideError() {
        if (errorMsg) {
            errorMsg.textContent = "";
            errorMsg.style.display = "none";
        }
    }


    // --- 4. Xử lý Lọc/Tìm Kiếm Sản Phẩm ---
    
    // Hàm xử lý lọc
    function filterProducts() {
        // Lấy từ khóa tìm kiếm và chuyển sang chữ thường
        const searchTerm = searchInput.value.toLowerCase();
        
        // Lấy TẤT CẢ các phần tử sản phẩm (bao gồm cả sản phẩm mới)
        // QuerySelectorAll được gọi mỗi khi tìm kiếm, nên nó luôn cập nhật
        const productItems = document.querySelectorAll(".product-item");

        // Duyệt qua từng sản phẩm
        productItems.forEach(function(item) {
            // Lấy tên sản phẩm (từ thẻ h3) và chuyển sang chữ thường
            const productName = item.querySelector("h3").textContent.toLowerCase();

            // Kiểm tra xem tên sản phẩm có chứa từ khóa không
            if (productName.includes(searchTerm)) {
                item.style.display = ""; // Quay về giá trị display mặc định
            } else {
                item.style.display = "none"; // Ẩn sản phẩm đi
            }
        });
    }

    // Gắn sự kiện click cho nút "Tìm"
    if (searchBtn) {
        searchBtn.addEventListener("click", filterProducts);
    }

    // Gắn sự kiện "keyup" cho ô input để tìm kiếm khi nhấn Enter
    if (searchInput) {
        searchInput.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                filterProducts();
            }
        });
    }

});

