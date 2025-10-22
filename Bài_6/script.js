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
    
    const sortSelect = document.getElementById("sort-products");
    // --- CẬP NHẬT : Lấy thêm phần tử lọc giá ---
    const priceFilter = document.getElementById("filter-price-range");

    // --- Biến toàn cục để lưu trữ danh sách sản phẩm ---
    let products = [];


    // --- 5. Hàm lưu sản phẩm vào LocalStorage ---
    function saveProducts() {
        localStorage.setItem('products', JSON.stringify(products));
    }

    // --- 6. Hàm hiển thị (Render) sản phẩm ra màn hình ---
    function renderProducts() {
        productList.innerHTML = '';
        
        const sortedProducts = getSortedProducts();

        sortedProducts.forEach(function(product) { 
            const newProduct = document.createElement('article');
            newProduct.className = 'product-item';

            // Lưu giá trị số thực vào data attribute để lọc
            newProduct.dataset.id = product.id;
            newProduct.dataset.price = product.price;

            const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);
            const imageUrl = product.imageUrl || `https://placehold.co/300x450/EFEFEF/333333?text=${product.name.replace(' ', '+')}`;
            
            newProduct.innerHTML = `
                <img src="${imageUrl}" alt="Bìa phim ${product.name}" onerror="this.src='https://placehold.co/300x450/EFEFEF/333333?text=Image+Error'">
                <h3>${product.name}</h3>
                <p>${product.desc || 'Chưa có mô tả cho sản phẩm này.'}</p>
                <div class="product-footer">
                    <p class="price">Giá: ${formattedPrice}</p>
                    <button class="btn-delete">Xóa</button>
                </div>
            `;
            
            productList.appendChild(newProduct);
        });
    }

    // --- 7. Hàm tải sản phẩm từ LocalStorage khi trang mở ---
    async function loadProducts() {
        const storedProducts = localStorage.getItem('products');
        
        if (storedProducts && storedProducts !== '[]') {
            console.log("Loading products from LocalStorage...");
            products = JSON.parse(storedProducts);
        } else {
            console.log("LocalStorage empty. Fetching from './products.json'...");
            try {
                const response = await fetch('./products.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const fetchedProducts = await response.json();
                products = fetchedProducts;
                saveProducts();
            } catch (error) {
                console.error("Failed to fetch products:", error);
                productList.innerHTML = `<p style="color: #dc3545; text-align: center;">Không thể tải được danh sách sản phẩm.</p>`;
                products = []; 
            }
        }
        updateDisplay();
    }


    // --- 1. Xử lý Ẩn/Hiện Form Thêm Sản Phẩm ---
    if (toggleBtn && formSection) {
        toggleBtn.addEventListener("click", function() {
            if (formSection.style.maxHeight && formSection.style.maxHeight !== "0px") {
                closeForm();
            } else {
                openForm();
            }
        });
    }

    // --- 2. Xử lý nút Hủy (Cancel) ---
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function() {
            closeForm();
        });
    }
    
    function openForm() {
        formSection.classList.remove("hidden"); 
        formSection.classList.add("form-visible");
        formSection.style.maxHeight = formSection.scrollHeight + "px";
        toggleBtn.textContent = "Đóng Form";
    }

    function closeForm() {
        formSection.style.maxHeight = "0";
        toggleBtn.textContent = "Thêm sản phẩm";
        
        setTimeout(() => {
            if (formSection.style.maxHeight === "0px") {
                formSection.classList.remove("form-visible");
                addProductForm.reset();
                hideError();
            }
        }, 500);
    }
    
    function showError(message) {
        if (errorMsg) {
            errorMsg.textContent = message;
            errorMsg.style.display = "block";
            if (formSection.classList.contains("form-visible")) {
                formSection.style.maxHeight = formSection.scrollHeight + "px";
            }
        }
    }

    function hideError() {
        if (errorMsg) {
            errorMsg.textContent = "";
            errorMsg.style.display = "none";
            if (formSection.classList.contains("form-visible")) {
                formSection.style.maxHeight = formSection.scrollHeight + "px";
            }
        }
    }


    // --- 3. Xử lý Submit Form (Thêm Sản Phẩm Mới) ---
    if (addProductForm) {
        addProductForm.addEventListener("submit", function(event) {
            event.preventDefault(); 
            
            const name = document.getElementById("product-name").value.trim();
            const desc = document.getElementById("product-desc").value.trim();
            const price = document.getElementById("product-price").value;
            let imageUrl = document.getElementById("product-image").value.trim();

            const priceNum = parseFloat(price);

            if (!name || !price) {
                showError("Tên sản phẩm và Giá là bắt buộc.");
                return;
            }

            if (isNaN(priceNum) || priceNum <= 0) {
                showError("Giá phải là một số dương hợp lệ.");
                return;
            }

            hideError();

            const newProductObject = {
                id: Date.now(),
                name: name,
                desc: desc,
                price: priceNum,
                imageUrl: imageUrl
            };

            products.unshift(newProductObject);
            saveProducts();
            
            // Render lại toàn bộ sản phẩm (để sản phẩm mới có data-price)
            updateDisplay();
            
            // Đóng form
            closeForm(); // Dùng hàm closeForm để có hiệu ứng mượt
        });
    }
    function getSortedProducts() {
        const sortBy = sortSelect.value;
        
        // Tạo bản sao của mảng products để sắp xếp
        // (Trừ khi là 'default' thì dùng luôn mảng gốc vì 'unshift' đã xử lý)
        if (sortBy === 'default') {
            return products; // Trả về mảng gốc (mới nhất lên đầu)
        }

        // Tạo bản sao để không thay đổi thứ tự gốc khi sort
        const sortedArray = [...products]; 
        
        switch (sortBy) {
            case 'price-asc':
                sortedArray.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sortedArray.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                // localeCompare tốt cho việc sắp xếp chuỗi (hỗ trợ Tiếng Việt)
                sortedArray.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sortedArray.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }
        return sortedArray;
    }
    // --- 4. Xử lý Lọc/Tìm Kiếm Sản Phẩm ---
    
    // Hàm xử lý lọc đã được cập nhật
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const priceRange = priceFilter.value;
        
        const productItems = document.querySelectorAll(".product-item");

        productItems.forEach(function(item) {
            const productName = item.querySelector("h3").textContent.toLowerCase();
            const productPrice = parseFloat(item.dataset.price); 

            let nameMatch = productName.includes(searchTerm);
            let priceMatch = true;

            if (priceRange === 'low') {
                priceMatch = (productPrice < 260000);
            } else if (priceRange === 'mid') {
                priceMatch = (productPrice >= 260000 && productPrice <= 290000);
            } else if (priceRange === 'high') {
                priceMatch = (productPrice > 290000);
            }

            if (nameMatch && priceMatch) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        });
    }
    function updateDisplay() {
        // 1. Render lại danh sách dựa trên lựa chọn Sắp xếp
        renderProducts();
        
        // 2. Áp dụng lại bộ lọc (ẩn/hiện) trên danh sách vừa render
        filterProducts();
    }
    function handleDeleteClick(event) {
        // Chỉ hoạt động nếu click đúng vào nút có class 'btn-delete'
        if (event.target.classList.contains('btn-delete')) {
            
            // Lấy ra 'article.product-item' cha gần nhất
            const productItem = event.target.closest('.product-item');
            const productId = Number(productItem.dataset.id);

            // Xác nhận trước khi xóa
            if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
                // Lọc mảng 'products', giữ lại tất cả trừ cái có id này
                products = products.filter(product => product.id !== productId);
                
                // Lưu lại mảng mới vào localStorage
                saveProducts();
                
                // Cập nhật lại giao diện
                updateDisplay(); 
            }
        }
    }
    // Gắn sự kiện click cho nút "Tìm"
    if (searchBtn) {
        searchBtn.addEventListener("click", filterProducts);
    }

    // Gắn sự kiện "keyup" cho ô input (lọc khi gõ)
    if (searchInput) {
        searchInput.addEventListener("keyup", filterProducts);
    }

    // --- CẬP NHẬT (Bài Nâng Cao): Gắn sự kiện "change" cho ô lọc giá ---
    if (priceFilter) {
        priceFilter.addEventListener("change", filterProducts);
    }
    // --- CẬP NHẬT: Gắn sự kiện cho Sắp xếp ---
    if (sortSelect) {
        // Khi thay đổi sắp xếp, ta cần render lại toàn bộ
        sortSelect.addEventListener("change", updateDisplay);
    }
    
    // --- CẬP NHẬT: Gắn sự kiện cho Xóa (Event Delegation) ---
    if (productList) {
        // Thêm 1 listener duy nhất vào list cha
        productList.addEventListener('click', handleDeleteClick);
    }
    // --- KHỞI CHẠY ỨNG DỤNG ---
    loadProducts();

});