// Chờ cho toàn bộ nội dung DOM được tải xong trước khi chạy script
document.addEventListener("DOMContentLoaded", function() {

    // --- 1. Xử lý Ẩn/Hiện Form Thêm Sản Phẩm ---

    // Lấy các phần tử
    const toggleBtn = document.getElementById("toggle-form-btn");
    const formSection = document.getElementById("add-product-form-section");

    if (toggleBtn && formSection) {
        // Gắn sự kiện click cho nút "Thêm sản phẩm"
        toggleBtn.addEventListener("click", function() {
            // Thêm/Xóa class "hidden" để ẩn/hiện form
            formSection.classList.toggle("hidden");

            // Cập nhật nội dung của nút
            if (formSection.classList.contains("hidden")) {
                toggleBtn.textContent = "Thêm sản phẩm";
            } else {
                toggleBtn.textContent = "Đóng Form";
            }
        });
    }

    // --- 2. Xử lý Lọc/Tìm Kiếm Sản Phẩm ---

    // Lấy các phần tử
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");
    
    // Hàm xử lý lọc
    function filterProducts() {
        // Lấy từ khóa tìm kiếm và chuyển sang chữ thường
        const searchTerm = searchInput.value.toLowerCase();
        
        // Lấy tất cả các phần tử sản phẩm
        const productItems = document.querySelectorAll(".product-item");

        // Duyệt qua từng sản phẩm
        productItems.forEach(function(item) {
            // Lấy tên sản phẩm (từ thẻ h3) và chuyển sang chữ thường
            const productName = item.querySelector("h3").textContent.toLowerCase();

            // Kiểm tra xem tên sản phẩm có chứa từ khóa không
            if (productName.includes(searchTerm)) {
                // Nếu có, hiển thị sản phẩm
                item.style.display = ""; // Quay về giá trị display mặc định (block, flex, etc.)
            } else {
                // Nếu không, ẩn sản phẩm đi
                item.style.display = "none";
            }
        });
    }

    // Gắn sự kiện click cho nút "Tìm"
    if (searchBtn) {
        searchBtn.addEventListener("click", filterProducts);
    }
    // Gắn sự kiện keyup cho ô input để bắt phím Enter
    if (searchInput) {
        searchInput.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                filterProducts();
            }
        });
    }

    // --- 3. Xử lý sự kiện Submit Form (chỉ ngăn hành động mặc định) ---
    const addProductForm = document.getElementById("add-product-form");
    if (addProductForm) {
        addProductForm.addEventListener("submit", function(event) {
            // Ngăn form gửi đi và tải lại trang
            event.preventDefault(); 
            
            console.log("Form đã được submit, nhưng đã bị chặn.");
            // Tạm thời, chúng ta có thể ẩn form sau khi submit
            // formSection.classList.add("hidden");
            // toggleBtn.textContent = "Thêm sản phẩm";
        });
    }

});
