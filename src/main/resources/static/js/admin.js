// ====================================
// GodGive2Thrift Admin Dashboard V2
// ====================================

let currentUser = null;
let editingProductId = null;
// ===============================
// START
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    checkAdmin();
});

// ===============================
// ADMIN AUTH
// ===============================

function checkAdmin() {

    fetch("/api/auth/me", {
        credentials: "include"
    })

    .then(response => response.json())

    .then(user => {

        if (!user.authenticated) {
            window.location.href = "/login";
            return;
        }

        if (user.role !== "ADMIN") {
            alert("Access Denied");
            window.location.href = "/";
            return;
        }

        currentUser = user;

        document.getElementById("welcome").textContent =
            `Welcome, ${user.name} 👋`;

        loadDashboard();
        loadProducts();
        loadOrders();
        loadCustomers();
        loadAnalytics();
        loadBestSellers();
        loadLowStock();
        loadRecentActivity();
        loadSalesReport();

    })

    .catch(error => {

        console.error(error);

        alert("Unable to verify login.");

    });

}

// ===============================
// DASHBOARD
// ===============================

function loadDashboard() {

    fetch("/api/dashboard", {

        credentials: "include"

    })

    .then(response => response.json())

    .then(data => {

        document.getElementById("totalProducts").textContent =
            data.products;

        document.getElementById("totalOrders").textContent =
            data.orders;

        document.getElementById("totalCustomers").textContent =
            data.customers;

        document.getElementById("revenue").textContent =
            "₱" + Number(data.revenue).toLocaleString();

    })

    .catch(error => {

        console.error(error);

    });

}

// ===============================
// PRODUCTS
// ===============================

// ===============================
// LOAD PRODUCTS
// ===============================

function loadProducts() {

    fetch("/api/products")

    .then(response => response.json())

    .then(products => {

        let html = `

        <table class="product-table">

            <thead>

                <tr>

                    <th>Image</th>

                    <th>Name</th>

                    <th>Category</th>

                    <th>Price</th>

                    <th>Stock</th>

                    <th>Action</th>

                </tr>

            </thead>

            <tbody>

        `;
        if (products.length === 0) {

    document.getElementById("productTable").innerHTML = `

        <div class="loading">

            <h3>No products found.</h3>

            <p>Click "Add Product" to create your first product.</p>

        </div>

    `;

    return;

}
        products.forEach(product => {

            html += `

            <tr>

                <td>

                    <img
                        src="/api/products/image/${product.id}"
                        class="product-image">

                </td>

                <td>

                    ${product.name}

                </td>

                <td>

                    ${product.category}

                </td>

                <td>

                    ₱${Number(product.price).toLocaleString()}

                </td>

                <td>

                    ${product.stock}

                </td>

                <td>

                    <button class="edit-btn"
                        onclick="editProduct(${product.id})">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button class="delete-btn"
                        onclick="deleteProduct(${product.id})">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>

            </tr>

            `;

        });

        html += `

            </tbody>

        </table>

        `;

        document.getElementById("productTable").innerHTML = html;

    })

    .catch(error => {

        console.error(error);

    });

}
function editProduct(id) {

    editingProductId = id;

    fetch("/api/products/" + id)

    .then(response => response.json())

    .then(product => {

        document.getElementById("productId").value = product.id;
        document.getElementById("name").value = product.name;
        document.getElementById("price").value = product.price;
        document.getElementById("category").value = product.category;
        document.getElementById("stock").value = product.stock;
        document.getElementById("description").value = product.description;

        const preview = document.getElementById("preview");

        preview.src = "/api/products/image/" + product.id;
        preview.style.display = "block";

        document.getElementById("modalTitle").textContent = "Edit Product";

        document.getElementById("saveButton").textContent = "💾 Update Product";

        openProductModal();

    });

}
// ===============================
// SAVE PRODUCT
// ===============================

function saveProduct() {

    const name = document.getElementById("name").value.trim();
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value;
    const stock = document.getElementById("stock").value;
    const description = document.getElementById("description").value.trim();

    if (
        name === "" ||
        price === "" ||
        category === "" ||
        stock === "" ||
        description === ""
    ) {
        alert("Please complete all fields.");
        return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("stock", stock);
    formData.append("description", description);

    const image = document.getElementById("imageFile").files[0];

    if (image) {
        formData.append("image", image);
    }

    let url = "/api/products";
    let method = "POST";

    if (editingProductId != null) {

        url = "/api/products/" + editingProductId;
        method = "PUT";

    }

    fetch(url, {

        method: method,

        body: formData

    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to save product.");
        }

        return response.json();

    })

    .then(product => {

        Swal.fire({

    icon: "success",

    title: "Success",

    text: "Product saved successfully!",

    timer: 1800,

    showConfirmButton: false

});

        closeProductModal();

        loadProducts();

        loadDashboard();

    })

    .catch(error => {

    console.error(error);

    Swal.fire({

        icon:"error",

        title:"Oops!",

        text:error.message

    });

});

}
// ===============================
// DELETE PRODUCT
// ===============================

function deleteProduct(id) {

    Swal.fire({

    title: "Delete Product?",

    text: "This action cannot be undone.",

    icon: "warning",

    showCancelButton: true,

    confirmButtonColor: "#d33",

    cancelButtonColor: "#3085d6",

    confirmButtonText: "Delete"

}).then((result) => {

    if(result.isConfirmed){

        performDelete(id);

    }

});

    fetch("/api/products/" + id, {

        method: "DELETE"

    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to delete product.");
        }

        alert("🗑 Product deleted successfully!");

        loadProducts();

        loadDashboard();

    })

    .catch(error => {

        console.error(error);

        alert(error.message);

    });

}
// ===============================
// OPEN MODAL
// ===============================

function openProductModal() {

    document.getElementById("productModal").style.display = "block";

}

// ===============================
// CLOSE MODAL
// ===============================

function closeProductModal() {

    document.getElementById("productModal").style.display = "none";

    clearProductForm();

}

// ===============================
// CLEAR FORM
// ===============================

function clearProductForm() {

    editingProductId = null;

    document.getElementById("productId").value = "";
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("category").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("description").value = "";
    document.getElementById("imageFile").value = "";

    const preview = document.getElementById("preview");

    preview.src = "";
    preview.style.display = "none";

    document.getElementById("modalTitle").textContent = "Add Product";
    document.getElementById("saveButton").textContent = "💾 Save Product";

}
// ===============================
// SEARCH PRODUCTS
// ===============================

function searchProducts() {

    const keyword = document
        .getElementById("searchProduct")
        .value
        .toLowerCase();

    const rows = document.querySelectorAll(".product-table tbody tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(keyword)
            ? ""
            : "none";

    });

} 
// ===============================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ===============================
// ===============================
// LOAD ORDERS
// ===============================

function loadOrders() {

    fetch("/api/orders")

    .then(response => response.json())

    .then(orders => {

        if (orders.length === 0) {

            document.getElementById("ordersTable").innerHTML = `

                <div class="loading">

                    <h3>No orders yet.</h3>

                </div>

            `;

            return;

        }

        let html = `

        <table class="product-table">

            <thead>

                <tr>

                    <th>Order #</th>

                    <th>Customer</th>

                    <th>Product</th>

                    <th>Total</th>

                    <th>Status</th>

                    <th>Action</th>

                </tr>

            </thead>

            <tbody>

        `;

        orders.forEach(order => {

            html += `

            <tr>

                <td>

                    ${order.trackingNumber}

                </td>

                <td>

                    <strong>${order.customerName}</strong>

                    <br>

                    <small>${order.email}</small>

                </td>

                <td>

                    ${order.productName}

                    <br>

                    <small>Qty: ${order.quantity}</small>

                </td>

                <td>

                    ₱${Number(order.total).toLocaleString()}

                </td>

                <td>

                    <span class="order-status ${order.status.toLowerCase()}">

                        ${order.status}

                    </span>

                </td>

                <td>

                    <button

                        class="edit-btn"

                        onclick="viewOrder(${order.id})">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                </td>

            </tr>

            `;

        });

        html += `

            </tbody>

        </table>

        `;

        document.getElementById("ordersTable").innerHTML = html;

    })

    .catch(error => {

        console.error(error);

    });

}
window.addEventListener("click", function (event) {

    const modal = document.getElementById("productModal");

    if (event.target === modal) {

        closeProductModal();

    }

});
const imageInput = document.getElementById("imageFile");

imageInput.addEventListener("change", function () {

    if (this.files.length === 0) {

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        const preview = document.getElementById("preview");

        preview.src = e.target.result;

        preview.style.display = "block";

    };

    reader.readAsDataURL(this.files[0]);

});
// ===============================
// VIEW ORDER
// ===============================

let selectedOrderId = null;

function viewOrder(id){

    selectedOrderId = id;

    fetch("/api/orders/" + id)

    .then(response => response.json())

    .then(order => {

        document.getElementById("trackingNumber").value =
            order.trackingNumber;

        document.getElementById("viewCustomer").textContent =
            order.customerName;

        document.getElementById("viewEmail").textContent =
            order.email;

        document.getElementById("viewPhone").textContent =
            order.phone;

        document.getElementById("viewAddress").textContent =
            order.address;

        document.getElementById("viewProduct").textContent =
            order.productName;

        document.getElementById("viewQuantity").textContent =
            order.quantity;

        document.getElementById("viewTotal").textContent =
            Number(order.total).toLocaleString();

        document.getElementById("viewPayment").textContent =
            order.paymentMethod;

        document.getElementById("viewReference").textContent =
            order.gcashReference;

        document.getElementById("orderStatus").value =
            order.status;

        if(order.paymentProof){

            document.getElementById("paymentProofPreview").src =
                "/api/orders/payment-proof/" + order.id;

            document.getElementById("paymentProofPreview").style.display =
                "block";

        }else{

            document.getElementById("paymentProofPreview").style.display =
                "none";

        }

        document.getElementById("orderModal").style.display =
            "block";

    })

    .catch(error=>{

        console.error(error);

        Swal.fire({

            icon:"error",

            title:"Error",

            text:"Unable to load order."

        });

    });

}
function closeOrderModal(){

    document.getElementById("orderModal").style.display = "none";

}

function updateOrderStatus(){

    const status =
        document.getElementById("orderStatus").value;

    const tracking =
        document.getElementById("trackingNumber").value;

    fetch(

        "/api/orders/" +

        selectedOrderId +

        "/tracking?trackingNumber=" +

        encodeURIComponent(tracking),

        {

            method:"PUT"

        }

    )

    .then(()=>{

        return fetch(

            "/api/orders/" +

            selectedOrderId +

            "/status?status=" +

            encodeURIComponent(status),

            {

                method:"PUT"

            }

        );

    })

    .then(response=>response.json())

    .then(()=>{

        Swal.fire({

            icon:"success",

            title:"Updated",

            text:"Order updated successfully."

        });

        closeOrderModal();

        loadOrders();

    })

    .catch(error=>{

        console.error(error);

        Swal.fire({

            icon:"error",

            title:"Error",

            text:"Unable to update order."

        });

    });

}
// ===============================
// APPROVE PAYMENT
// ===============================

function approvePayment(){

    document.getElementById("orderStatus").value = "SHIPPED";

    Swal.fire({

        icon:"success",

        title:"Payment Approved",

        text:"Remember to click 'Save Changes' to update the order."

    });

}

// ===============================
// REJECT PAYMENT
// ===============================

function rejectPayment(){

    document.getElementById("orderStatus").value = "CANCELLED";

    Swal.fire({

        icon:"warning",

        title:"Payment Rejected",

        text:"Remember to click 'Save Changes' to update the order."

    });

}
// ===============================
// LOAD CUSTOMERS
// ===============================

// ====================================
// LOAD CUSTOMERS
// ====================================

function loadCustomers() {

    fetch("/api/users", {
        credentials: "include"
    })

    .then(response => response.json())

    .then(users => {

        let html = `

        <table class="product-table">

            <thead>

                <tr>

                    <th>Name</th>

                    <th>Email</th>

                    <th>Role</th>

                    <th>Action</th>

                </tr>

            </thead>

            <tbody>

        `;

        users.forEach(user => {

            html += `

            <tr>

                <td>${user.name}</td>

                <td>${user.email}</td>

                <td>${user.role}</td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="viewCustomerOrders('${user.email}')">

                        <i class="fa-solid fa-eye"></i>
                        View Orders

                    </button>

                </td>

            </tr>

            `;

        });

        html += `

            </tbody>

        </table>

        `;

        document.getElementById("customerTable").innerHTML = html;

    })

    .catch(error => {

        console.error(error);

    });

}
// ===============================
// SEARCH CUSTOMERS
// ===============================

function searchCustomers(){

    const keyword=document

        .getElementById("searchCustomer")

        .value

        .toLowerCase();

    const rows=document.querySelectorAll(

        "#customerTable tbody tr"

    );

    rows.forEach(row=>{

        row.style.display=

        row.innerText.toLowerCase().includes(keyword)

        ? ""

        : "none";

    });

}
// ====================================
// VIEW CUSTOMER DETAILS
// ====================================

function viewCustomerOrders(email) {

    fetch("/api/orders/user/" + encodeURIComponent(email))

    .then(response => response.json())

    .then(orders => {

        document.getElementById("customerModal").style.display = "block";

        document.getElementById("customerEmail").textContent = email;

        if (orders.length > 0) {

            document.getElementById("customerName").textContent =
                orders[0].customerName;

        } else {

            document.getElementById("customerName").textContent = "Unknown";

        }

        let html = `

        <table class="product-table">

            <thead>

                <tr>

                    <th>Product</th>

                    <th>Qty</th>

                    <th>Total</th>

                    <th>Status</th>

                    <th>Date</th>

                </tr>

            </thead>

            <tbody>

        `;

        let totalSpent = 0;

        orders.forEach(order => {

            totalSpent += order.total;

            html += `

                <tr>

                    <td>${order.productName}</td>

                    <td>${order.quantity}</td>

                    <td>₱${Number(order.total).toLocaleString()}</td>

                    <td>${order.status}</td>

                    <td>${order.orderDate.replace("T"," ")}</td>

                </tr>

            `;

        });

        html += `

            </tbody>

        </table>

        <br>

        <h3>

            Total Orders: ${orders.length}

        </h3>

        <h3>

            Total Spent: ₱${Number(totalSpent).toLocaleString()}

        </h3>

        `;

        document.getElementById("customerOrders").innerHTML = html;

    })

    .catch(error => {

        console.error(error);

    });

}
// ====================================
// CLOSE CUSTOMER MODAL
// ====================================

function closeCustomerModal() {

    document.getElementById("customerModal").style.display = "none";

}
// ===============================
// ANALYTICS
// ===============================

function loadAnalytics() {

    fetch("/api/orders")

    .then(res => res.json())

    .then(orders => {

        let pending = 0;
        let delivered = 0;
        let cancelled = 0;

        let totalRevenue = 0;

        orders.forEach(order => {

            totalRevenue += order.total;

            switch(order.status){

                case "PENDING":

                    pending++;

                    break;

                case "DELIVERED":

                    delivered++;

                    break;

                case "CANCELLED":

                    cancelled++;

                    break;

            }

        });

        document.getElementById("pendingOrders").textContent = pending;

        document.getElementById("deliveredOrders").textContent = delivered;

        document.getElementById("cancelledOrders").textContent = cancelled;

        let average = orders.length == 0
            ? 0
            : totalRevenue / orders.length;

        document.getElementById("averageOrder").textContent =
            "₱" + average.toLocaleString(undefined,{
                maximumFractionDigits:2
            });

        createStatusChart(
            pending,
            delivered,
            cancelled
        );

    });

}
// ===============================
// STATUS CHART
// ===============================

let statusChart;

function createStatusChart(
    pending,
    delivered,
    cancelled
){

    const ctx = document
        .getElementById("statusChart");

    if(statusChart){

        statusChart.destroy();

    }

    statusChart = new Chart(ctx,{

        type:"pie",

        data:{

            labels:[

                "Pending",

                "Delivered",

                "Cancelled"

            ],

            datasets:[{

                data:[

                    pending,

                    delivered,

                    cancelled

                ]

            }]

        }

    });

}
// ===============================
// TOP SELLING PRODUCTS
// ===============================

function loadBestSellers(){

    fetch("/api/products")

    .then(res=>res.json())

    .then(products=>{

        products.sort((a,b)=>b.sold-a.sold);

        let html=`

        <table class="product-table">

        <thead>

        <tr>

        <th>Rank</th>

        <th>Product</th>

        <th>Sold</th>

        <th>Stock Left</th>

        </tr>

        </thead>

        <tbody>

        `;

        products.slice(0,5).forEach((product,index)=>{

            html+=`

            <tr>

            <td>#${index+1}</td>

            <td>${product.name}</td>

            <td>${product.sold}</td>

            <td>${product.stock}</td>

            </tr>

            `;

        });

        html+=`

        </tbody>

        </table>

        `;

        document.getElementById("bestSellerTable").innerHTML=html;

    });

}
// ===============================
// LOW STOCK PRODUCTS
// ===============================

function loadLowStock(){

    fetch("/api/products")

    .then(res=>res.json())

    .then(products=>{

        const lowStock = products.filter(product=>product.stock<=5);

        let html=`

        <table class="product-table">

        <thead>

        <tr>

        <th>Product</th>

        <th>Category</th>

        <th>Stock Left</th>

        </tr>

        </thead>

        <tbody>

        `;

        if(lowStock.length===0){

            html+=`

            <tr>

            <td colspan="3">

            ✅ All products have sufficient stock.

            </td>

            </tr>

            `;

        }else{

            lowStock.forEach(product=>{

                html+=`

                <tr>

                <td>${product.name}</td>

                <td>${product.category}</td>

                <td style="color:red;font-weight:bold;">

                    ${product.stock}

                </td>

                </tr>

                `;

            });

        }

        html+=`

        </tbody>

        </table>

        `;

        document.getElementById("lowStockTable").innerHTML=html;

    });

}
// ===============================
// RECENT ACTIVITY
// ===============================

function loadRecentActivity(){

    fetch("/api/orders")

    .then(res=>res.json())

    .then(orders=>{

        orders.sort((a,b)=>
            new Date(b.orderDate)-new Date(a.orderDate)
        );

        let html=`

        <div class="activity-list">

        `;

        orders.slice(0,10).forEach(order=>{

            let icon="📦";

            if(order.status==="PENDING")
                icon="🕒";

            if(order.status==="SHIPPED")
                icon="🚚";

            if(order.status==="DELIVERED")
                icon="✅";

            if(order.status==="CANCELLED")
                icon="❌";

            html+=`

            <div class="activity-item">

                <div>

                    <strong>${icon} ${order.customerName}</strong>

                    ordered

                    <strong>${order.productName}</strong>

                </div>

                <small>

                    ${order.orderDate.replace("T"," ")}

                </small>

            </div>

            `;

        });

        html+=`

        </div>

        `;

        document.getElementById("activityList").innerHTML=html;

    });

}
// ===============================
// SALES REPORT
// ===============================

function loadSalesReport(){

    fetch("/api/orders")

    .then(res=>res.json())

    .then(orders=>{

        let html=`

        <table class="product-table">

        <thead>

        <tr>

        <th>Date</th>

        <th>Customer</th>

        <th>Product</th>

        <th>Total</th>

        <th>Status</th>

        </tr>

        </thead>

        <tbody>

        `;

        orders.forEach(order=>{

            html+=`

            <tr>

            <td>${order.orderDate.replace("T"," ")}</td>

            <td>${order.customerName}</td>

            <td>${order.productName}</td>

            <td>₱${Number(order.total).toLocaleString()}</td>

            <td>${order.status}</td>

            </tr>

            `;

        });

        html+=`

        </tbody>

        </table>

        `;

        document.getElementById("salesReportTable").innerHTML=html;

    });

}
// ===============================
// EXPORT CSV
// ===============================

function exportSalesCSV(){

    fetch("/api/orders")

    .then(res=>res.json())

    .then(orders=>{

        let csv="Date,Customer,Product,Total,Status\n";

        orders.forEach(order=>{

            csv+=`${order.orderDate},${order.customerName},${order.productName},${order.total},${order.status}\n`;

        });

        const blob=new Blob([csv],{type:"text/csv"});

        const url=window.URL.createObjectURL(blob);

        const a=document.createElement("a");

        a.href=url;

        a.download="sales-report.csv";

        a.click();

        window.URL.revokeObjectURL(url);

    });

}
function toggleNotifications(){

    const panel =
    document.getElementById("notificationPanel");

    panel.style.display =
        panel.style.display==="block"
        ? "none"
        : "block";

}

function loadNotifications(){

    document.getElementById("notificationList").innerHTML=`

        <div class="notification-item">
            🛒 New order received
        </div>

        <div class="notification-item">
            ⚠ Low stock: Carhartt Jacket
        </div>

        <div class="notification-item">
            💰 Revenue updated
        </div>

    `;

    document.getElementById("notificationCount")
    .innerText=3;

}

loadNotifications();