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

    // --- Biến toàn cục để lưu trữ danh sách sản phẩm ---
    let products = [];

    // --- Mảng sản phẩm mẫu (dùng khi localStorage trống) ---
    const sampleProducts = [
        {
            id: 1,
            name: "Inception (2010)",
            desc: "Một tên trộm chuyên nghiệp đánh cắp thông tin bằng cách xâm nhập vào tiềm thức của mục tiêu.",
            price: 270000,
            imageUrl: "../img/MV5BMjExMjkwNTQ0Nl5BMl5BanBnXkFtZTcwNTY0OTk1Mw@@._V1_.jpg"
        },
        {
            id: 2,
            name: "Interstellar (2014)",
            desc: "Hố đen tử thần là một bộ phim khoa học viễn tưởng năm 2014 của đạo diễn Christopher Nolan. Với dàn diễn viên gồm Matthew McConaughey, Timothee Chalamet, Anne Hathaway, Jessica Chastain, Bill Irwin, Ellen Burstyn và Michael Caine, bộ phim kể về một nhóm nhà du hành vũ trụ đi xuyên qua hố đen",
            price: 300000,
            imageUrl: "../img/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
        },
        {
            id: 3,
            name: "Oppenheimer (2023)",
            desc: "Tác phẩm xoay quanh Robert Oppenheimer, một nhà vật lý lý thuyết người Mỹ gốc Do Thái, người đã hợp tác phát triển ra bom nguyên tử trong dự án Manhattan.",
            price: 250000,
            imageUrl: "../img/Oppenheimer-PosterSpy-4.jpg"
        }
    ];

    // --- 5. Hàm lưu sản phẩm vào LocalStorage ---
    function saveProducts() {
        localStorage.setItem('products', JSON.stringify(products));
    }

    // --- 6. Hàm hiển thị (Render) sản phẩm ra màn hình ---
    function renderProducts() {
        // Xóa sạch danh sách sản phẩm hiện tại trên HTML
        productList.innerHTML = '';

        // Lặp qua mảng 'products' và tạo HTML cho từng sản phẩm
        products.forEach(function(product) {
            // Tạo phần tử article mới
            const newProduct = document.createElement('article');
            newProduct.className = 'product-item';

            // Định dạng giá kiểu Việt Nam
            const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);

            // Gán ảnh placeholder nếu không có ảnh
            const imageUrl = product.imageUrl || `https://placehold.co/300x450/EFEFEF/333333?text=${product.name.replace(' ', '+')}`;
            
            // Thêm nội dung HTML cho sản phẩm
            newProduct.innerHTML = `
                <img src="${imageUrl}" alt="Bìa phim ${product.name}" onerror="this.src='https://placehold.co/300x450/EFEFEF/333333?text=Image+Error'">
                <h3>${product.name}</h3>
                <p>${product.desc || 'Chưa có mô tả cho sản phẩm này.'}</p>
                <p class="price">Giá: ${formattedPrice}</p>
            `;
            
            // Thêm sản phẩm vào danh sách trên HTML
            // (Dùng appendChild để giữ đúng thứ tự mảng)
            productList.appendChild(newProduct);
        });
    }

    // --- 7. Hàm tải sản phẩm từ LocalStorage khi trang mở ---
    function loadProducts() {
        const storedProducts = localStorage.getItem('products');
        
        if (storedProducts) {
            // Nếu có, parse JSON và gán vào mảng products
            products = JSON.parse(storedProducts);
        } else {
            // Nếu không có, dùng sản phẩm mẫu và lưu vào localStorage
            products = sampleProducts;
            saveProducts();
        }
        
        // Hiển thị sản phẩm ra màn hình
        renderProducts();
    }


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
            const price = document.getElementById("product-price").value;
            let imageUrl = document.getElementById("product-image").value.trim();

            // *** Validate dữ liệu ***
            const priceNum = parseFloat(price);

            if (!name || !price) {
                showError("Tên sản phẩm và Giá là bắt buộc.");
                return;
            }

            if (isNaN(priceNum) || priceNum <= 0) {
                showError("Giá phải là một số dương hợp lệ.");
                return;
            }

            // *** Dữ liệu hợp lệ -> Tạo đối tượng sản phẩm mới ***
            hideError();

            const newProductObject = {
                id: Date.now(), // Tạo ID duy nhất bằng timestamp
                name: name,
                desc: desc,
                price: priceNum,
                imageUrl: imageUrl
            };

            // Thêm sản phẩm mới vào ĐẦU mảng 'products'
            products.unshift(newProductObject);

            // Lưu mảng mới vào LocalStorage
            saveProducts();

            // Vẽ lại toàn bộ danh sách sản phẩm lên màn hình
            renderProducts();

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
    
    // Hàm xử lý lọc (Không thay đổi, vẫn hoạt động trên DOM đã render)
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        
        // QuerySelectorAll được gọi mỗi khi tìm kiếm, 
        // nó sẽ lấy các phần tử DOM được tạo bởi renderProducts()
        const productItems = document.querySelectorAll(".product-item");

        productItems.forEach(function(item) {
            const productName = item.querySelector("h3").textContent.toLowerCase();
            if (productName.includes(searchTerm)) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        });
    }

    // Gắn sự kiện click cho nút "Tìm"
    if (searchBtn) {
        searchBtn.addEventListener("click", filterProducts);
    }

    // Gắn sự kiện "keyup" cho ô input
    if (searchInput) {
        searchInput.addEventListener("keyup", function(event) {
            // Lọc luôn khi gõ (hoặc có thể dùng event.key === "Enter")
            filterProducts();
        });
    }

    // --- KHỞI CHẠY ỨNG DỤNG ---
    // Tải sản phẩm từ LocalStorage (hoặc sản phẩm mẫu) khi trang được tải
    loadProducts();

});

