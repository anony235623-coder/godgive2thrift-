// ====================================
// GodGive2Thrift Admin Dashboard V2
// ====================================

let currentUser = null;

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
function editProduct(id){

    fetch("/api/products")

    .then(response=>response.json())

    .then(products=>{

        const product=products.find(p=>p.id===id);

        if(!product){

            return;

        }

        document.getElementById("productId").value=product.id;

        document.getElementById("name").value=product.name;

        document.getElementById("price").value=product.price;

        document.getElementById("category").value=product.category;

        document.getElementById("stock").value=product.stock;

        document.getElementById("description").value=product.description;

        const preview=document.getElementById("preview");

        preview.src="/api/products/image/"+product.id;

        preview.style.display="block";

        document.getElementById("modalTitle").innerHTML="Edit Product";

        document.getElementById("saveButton").innerHTML="💾 Update Product";

        openProductModal();

    });

}