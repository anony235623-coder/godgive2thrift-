document.getElementById("today").innerHTML =
    new Date().toDateString();
function loadDashboard() {

    fetch("/api/dashboard", {

        credentials: "include"

    })

    .then(response => {

        if (!response.ok) {

            throw new Error("Unable to load dashboard.");

        }

        return response.json();

    })

    .then(data => {

        document.getElementById("totalProducts").innerHTML = data.products;

        document.getElementById("totalOrders").innerHTML = data.orders;

        document.getElementById("totalCustomers").innerHTML = data.customers;

        document.getElementById("pendingOrders").innerHTML = data.pending;

        document.getElementById("revenue").innerHTML =
            "₱" + Number(data.revenue).toLocaleString();

    })

    .catch(error => {

        console.error(error);

    });

}
let editing = false;
function saveProduct(){

    if(editing){

        updateProduct();

    }else{

        addProduct();

    }

}

function loadLowStock(){

    fetch("/api/products/low-stock")

    .then(r=>r.json())

    .then(products=>{

        let html="";

        if(products.length===0){

            html="<p style='color:green'>✅ No low stock products.</p>";

        }else{

            products.forEach(product=>{

                html+=`
                <div style="
                    background:#fff8e1;
                    padding:10px;
                    margin-bottom:10px;
                    border-left:5px solid orange;
                    border-radius:8px;">

                    <strong>${product.name}</strong><br>

                    Only
                    <span style="color:red;">
                        ${product.stock}
                    </span>
                    left

                </div>
                `;

            });

        }

        const list = document.getElementById("lowStockList");

        if(list){
            list.innerHTML = html;
        }

    });

}
function loadProducts(){

    fetch("/api/products")
    .then(response=>response.json())
    .then(products=>{

        let html="";
        let totalStock=0;

        products.forEach(product=>{

            totalStock += product.stock;

            html += `

            <tr>

                <td>

                    <img
                    src="/api/products/image/${product.id}"
                    width="80">

                </td>

                <td>${product.name}</td>

                <td>₱${product.price}</td>

                <td>${product.stock}</td>

                <td>

<button onclick="editProduct(${product.id})">

Edit

</button>

<button onclick="deleteProduct(${product.id})">

Delete

</button>

</td>

            </tr>

            `;

        });

        document.getElementById("productTable").innerHTML = html;

        document.getElementById("totalProducts").innerHTML = products.length;

        const totalStockElement = document.getElementById("totalStock");

if(totalStockElement){

    totalStockElement.innerHTML = totalStock;

}

    });

}


function clearForm() {

    document.getElementById("productId").value = "";
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("description").value = "";
    document.getElementById("category").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("imageFile").value = "";

    document.getElementById("preview").style.display = "none";

    document.getElementById("formTitle").innerHTML = "Add Product";

    document.getElementById("saveButton").innerHTML =
        '<i class="fa-solid fa-plus"></i> Add Product';

    editing = false;

}
function addProduct() {

    const formData = new FormData();

    formData.append("name", document.getElementById("name").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("category", document.getElementById("category").value);
    formData.append("stock", document.getElementById("stock").value);

    const image = document.getElementById("imageFile").files[0];

    if (!image) {
        alert("Please choose an image.");
        return;
    }

    formData.append("image", image);

    fetch("/api/products", {
        method: "POST",
        body: formData
    })

    .then(async response => {

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;

})

    .then(data => {

        alert("✅ Product added successfully!");

        document.getElementById("name").value = "";
        document.getElementById("price").value = "";
        document.getElementById("description").value = "";
        document.getElementById("category").value = "";
        document.getElementById("stock").value = "";
        document.getElementById("imageFile").value = "";

        document.getElementById("preview").style.display = "none";

        loadProducts();
loadDashboard();
loadLowStock();

    })

    .catch(error => {

        console.error(error);
        alert(error.message);

    });

}

function editProduct(id){

    fetch("/api/products")

    .then(response => response.json())

    .then(products=>{

        const product = products.find(p => p.id === id);

        if(!product){

            alert("Product not found.");
            return;

        }

        editing = true;

        document.getElementById("productId").value = product.id;
        document.getElementById("name").value = product.name;
        document.getElementById("price").value = product.price;
        document.getElementById("description").value = product.description;
        document.getElementById("category").value = product.category;
        document.getElementById("stock").value = product.stock;

        document.getElementById("preview").src =
            "/api/products/image/" + product.id;

        document.getElementById("preview").style.display = "block";

        document.getElementById("formTitle").innerHTML =
            "Edit Product";

        document.getElementById("saveButton").innerHTML =
            '<i class="fa-solid fa-pen"></i> Update Product';

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });

    });

}
function updateProduct(){

    const id = document.getElementById("productId").value;

    const formData = new FormData();

    formData.append("name", document.getElementById("name").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("category", document.getElementById("category").value);
    formData.append("stock", document.getElementById("stock").value);

    const image = document.getElementById("imageFile").files[0];

    if(image){

        formData.append("image", image);

    }

    fetch("/api/products/" + id,{

        method:"PUT",
        body:formData

    })

    .then(response=>{

        if(!response.ok){

            throw new Error("Update failed.");

        }

        return response.json();

    })

    .then(()=>{

        alert("✅ Product updated!");

        clearForm();

        loadProducts();
loadDashboard();
loadLowStock();

    })

    .catch(error=>{

        alert(error.message);

    });

}
function deleteProduct(id){

    if(!confirm("Are you sure you want to delete this product?")){
        return;
    }

    fetch("/api/products/" + id,{
        method:"DELETE"
    })

    .then(response=>{

        if(!response.ok){
            throw new Error("Delete failed.");
        }

        loadProducts();
        loadDashboard();
        loadLowStock();

    })

    .catch(error=>{

        alert(error.message);

    });

}

function loadRecentOrders(){

    fetch("/api/orders",{

        credentials:"include"

    })

    .then(response=>response.json())

    .then(orders=>{

        let html="";

        if(orders.length===0){

            html = `
                <tr>
                    <td colspan="3">No orders found.</td>
                </tr>
            `;

        }else{

            orders
            .sort((a,b)=>b.id-a.id)
            .slice(0,5)
            .forEach(order=>{

                html += `
                <tr>

                    <td>${order.customerName}</td>

                    <td>₱${Number(order.total).toLocaleString()}</td>

                    <td>${order.status}</td>

                </tr>
                `;

            });

        }

        document.getElementById("recentOrders").innerHTML = html;

    });

}
// =========================
// ANALYTICS
// =========================

function loadAnalytics(){

    fetch("/api/orders",{

        credentials:"include"

    })

    .then(response => response.json())

    .then(orders => {

        if(orders.length === 0){

            document.getElementById("bestProduct").innerHTML = "-";
            document.getElementById("recentCustomer").innerHTML = "-";
            document.getElementById("averageOrder").innerHTML = "₱0";

            return;

        }

        let totalRevenue = 0;

        const productSales = {};

        orders.forEach(order => {

            totalRevenue += Number(order.total);

            if(productSales[order.productName]){

                productSales[order.productName]++;

            }else{

                productSales[order.productName] = 1;

            }

        });

        let bestProduct = "-";
        let highestSales = 0;

        for(const product in productSales){

            if(productSales[product] > highestSales){

                highestSales = productSales[product];
                bestProduct = product;

            }

        }

        document.getElementById("bestProduct").innerHTML =
            bestProduct;

        document.getElementById("recentCustomer").innerHTML =
            orders[orders.length - 1].customerName;

        document.getElementById("averageOrder").innerHTML =
            "₱" + (totalRevenue / orders.length).toFixed(2);

    })

    .catch(error => {

        console.error(error);

    });

}
// ============================
// MONTHLY REVENUE CHART
// ============================

let monthlyChart;

function loadMonthlyAnalytics() {

    fetch("/api/dashboard/analytics/monthly")

    .then(response => response.json())

    .then(data => {

        const labels = [];
        const revenue = [];

        data.forEach(item => {

            labels.push(item.label);
            revenue.push(item.revenue);

        });

        if(monthlyChart){

            monthlyChart.destroy();

        }

        monthlyChart = new Chart(

            document.getElementById("monthlyChart"),

            {

                type:"bar",

                data:{

                    labels:labels,

                    datasets:[{

                        label:"Monthly Revenue",

                        data:revenue

                    }]

                }

            }

        );

    });

}
// ============================
// DAILY REVENUE CHART
// ============================

let dailyChart;

function loadDailyAnalytics(){

    fetch("/api/dashboard/analytics/daily")

    .then(response=>response.json())

    .then(data=>{

        const labels=[];
        const revenue=[];

        data.forEach(item=>{

            labels.push(item.label);
            revenue.push(item.revenue);

        });

        if(dailyChart){

            dailyChart.destroy();

        }

        dailyChart=new Chart(

            document.getElementById("dailyChart"),

            {

                type:"line",

                data:{

                    labels:labels,

                    datasets:[{

                        label:"Daily Revenue",

                        data:revenue,

                        fill:false,

                        tension:.3

                    }]

                }

            }

        );

    });

}
fetch("/api/auth/me", {

    credentials: "include"

})


    // Initial Load
    loadDashboard();
    loadProducts();
    loadRecentOrders();
    loadLowStock();
    loadAnalytics();
    loadNotifications();
    loadMonthlyAnalytics();
    loadDailyAnalytics();

    // Auto Refresh every 30 seconds
    setInterval(function () {

        loadDashboard();
        loadProducts();
        loadRecentOrders();
        loadLowStock();
        loadAnalytics();
        loadNotifications();

    }, 30000);

;

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

        alert("Access denied.");
        window.location.href = "/";
        return;

    }

    loadDashboard();
    loadProducts();
    loadRecentOrders();
    loadLowStock();
    loadAnalytics();
    loadNotifications();
    loadMonthlyAnalytics();
    loadDailyAnalytics();

    setInterval(function () {

    }, 30000);

});
// ============================
// NOTIFICATIONS
// ============================

function loadNotifications(){

    fetch("/api/orders",{

        credentials:"include"

    })

    .then(response => response.json())

    .then(orders => {

        let html = "";

        const pending = orders.filter(order => order.status === "Pending");

        if(pending.length === 0){

            html = "<p style='color:green;'>✅ No new notifications.</p>";

        }else{

            pending.forEach(order => {

                html += `
                    <div style="
                        padding:12px;
                        margin-bottom:10px;
                        border-left:5px solid orange;
                        background:#fff8e1;
                        border-radius:8px;">

                        🔔 <strong>${order.customerName}</strong>
                        placed an order for
                        <strong>${order.productName}</strong>

                    </div>
                `;

            });

        }

        document.getElementById("notificationList").innerHTML = html;

    });

}
function loadMonthlyAnalytics() {

    fetch("/api/dashboard/analytics/monthly")

    .then(response => response.json())

    .then(data => {

        const labels = [];
        const revenue = [];

        data.forEach(item => {

            labels.push(item.label);
            revenue.push(item.revenue);

        });

        new Chart(
            document.getElementById("monthlyChart"),
            {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [{

                        label: "Revenue",

                        data: revenue

                    }]

                }

            }

        );

    });

}
// ============================
// DAILY ANALYTICS
// ============================

function loadDailyAnalytics() {

    fetch("/api/dashboard/analytics/daily")

    .then(response => response.json())

    .then(data => {

        const labels = [];
        const revenue = [];

        data.forEach(item => {

            labels.push(item.label);
            revenue.push(item.revenue);

        });

        const canvas = document.getElementById("dailyChart");
    
        if (!canvas) {
            return;
        }

        new Chart(canvas, {

            type: "line",

            data: {

                labels: labels,

                datasets: [{

                    label: "Daily Revenue",

                    data: revenue,

                    fill: false,

                    tension: 0.3

                }]

            }

        });

    });

}
document.getElementById("welcome").innerHTML =
    "Welcome, " + user.name + " 👋";
const now = new Date();

document.getElementById("lastLogin").innerHTML =
    "Last Login: " +
    now.toLocaleDateString() +
    " " +
    now.toLocaleTimeString();
;
function alert(message) {

    alert(message);

}