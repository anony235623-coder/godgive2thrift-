// =======================================
// GODGIVE2THRIFT SHOP
// Part 1 - Load & Display Products
// =======================================

let allProducts = [];
let filteredProducts = [];

// ==========================
// PAGE LOAD
// ==========================

window.onload = () => {
    loadProducts();
};

// ==========================
// LOAD PRODUCTS
// ==========================

async function loadProducts() {

    try {

        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error("Failed to load products.");
        }

        allProducts = await response.json();

        filteredProducts = [...allProducts];

        displayProducts(filteredProducts);

    } catch (err) {

        console.error(err);

        document.getElementById("productList").innerHTML = `
            <div style="text-align:center;padding:60px;">
                <h2>Unable to load products.</h2>
            </div>
        `;

    }

}

// ==========================
// DISPLAY PRODUCTS
// ==========================

function displayProducts(products) {

    const container = document.getElementById("productList");

    if (!products.length) {

        container.innerHTML = `
            <div style="text-align:center;padding:60px;">
                <h2>No products found.</h2>
            </div>
        `;

        return;

    }

    let html = "";

    products.forEach(product => {

        html += `

        <div class="product-card">

            ${product.stock <= 3 && product.stock > 0
                ? `<div class="badge">🔥 HOT</div>`
                : ""
            }

            <div class="favorite"
                 onclick="addToWishlist(${product.id})">

                <i class="fa-regular fa-heart"></i>

            </div>

            <div class="image-box">

                <img
                    src="/api/products/image/${product.id}"
                    alt="${product.name}"
                    loading="lazy">

                <div class="hover-buttons">

                    <button
                        class="quick-btn"
                        onclick="viewProduct(${product.id})">

                        <i class="fa-solid fa-eye"></i>

                        Quick View

                    </button>

                </div>

            </div>

            <div class="product-info">

                <small>

                    ${product.category}

                </small>

                <h3>

                    ${product.name}

                </h3>

                <div class="rating">

    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star-half-stroke"></i>

    <span>4.8 (127 Reviews)</span>

</div>

                <div class="price">

    <span class="old-price">
        ₱${Number(product.price * 1.25).toLocaleString()}
    </span>

    <span class="new-price">
        ₱${Number(product.price).toLocaleString()}
    </span>

</div>

                <div class="stock">

                    ${
                        product.stock > 5

                        ? "✅ In Stock"

                        : product.stock > 0

                        ? `⚠ Only ${product.stock} left`

                        : "❌ Out of Stock"

                    }

                </div>

                ${
                    product.stock > 0

                    ?

                    `

                    <button
                        class="cart-btn"
                        onclick="addToCart(

                            ${product.id},

                            '${product.name.replace(/'/g, "\\'")}',

                            ${product.price}

                        )">

                        <i class="fa-solid fa-cart-shopping"></i>

                        Add To Cart

                    </button>

                    `

                    :

                    `

                    <button
                        class="cart-btn"
                        disabled>

                        Out of Stock

                    </button>

                    `

                }

            </div>

        </div>

        `;

    });

    container.innerHTML = html;

}
// =======================================
// PART 2 - SEARCH, FILTER & SORT
// =======================================

// ==========================
// SEARCH + FILTER
// ==========================

function filterProducts() {

    const keyword = document
        .getElementById("search")
        .value
        .toLowerCase();

    const category = document
        .getElementById("categoryFilter")
        .value;

    const sort = document
        .getElementById("sortFilter")
        .value;

    filteredProducts = allProducts.filter(product => {

        const matchName =
            product.name.toLowerCase().includes(keyword);

        const matchCategory =
            category === "" ||
            product.category === category;

        return matchName && matchCategory;

    });

    sortProducts(sort);

}

// ==========================
// CATEGORY BUTTONS
// ==========================

function selectCategory(category) {

    document.getElementById("categoryFilter").value = category;

    filterProducts();

}

// ==========================
// SORT PRODUCTS
// ==========================

function sortProducts(type) {

    switch(type){

        case "low":

            filteredProducts.sort(
                (a,b)=>a.price-b.price
            );

            break;

        case "high":

            filteredProducts.sort(
                (a,b)=>b.price-a.price
            );

            break;

        case "az":

            filteredProducts.sort(
                (a,b)=>
                    a.name.localeCompare(b.name)
            );

            break;

        case "za":

            filteredProducts.sort(
                (a,b)=>
                    b.name.localeCompare(a.name)
            );

            break;

    }

    displayProducts(filteredProducts);

}

// ==========================
// VIEW PRODUCT
// ==========================

function viewProduct(id) {

    const product = allProducts.find(p => p.id === id);

    if (!product) {
        console.error("Product not found.");
        return;
    }

    const modal = document.getElementById("productModal");
    const image = document.getElementById("modalImage");
    const name = document.getElementById("modalName");
    const price = document.getElementById("modalPrice");
    const stock = document.getElementById("modalStock");
    const description = document.getElementById("modalDescription");
    const cartButton = document.getElementById("modalCartButton");

    if (
        !modal ||
        !image ||
        !name ||
        !price ||
        !stock ||
        !description ||
        !cartButton
    ) {
        console.error("Product modal elements were not found.");
        return;
    }

    image.src = "/api/products/image/" + product.id;
    image.alt = product.name;

    name.textContent = product.name;

    price.textContent =
        "₱" + Number(product.price).toLocaleString();

    stock.textContent =
        product.stock > 0
            ? product.stock + " item(s) available"
            : "Out of Stock";

    description.textContent =
        product.description || "No description available.";

    cartButton.onclick = function () {
        addToCart(
            product.id,
            product.name,
            product.price
        );
    };

    modal.style.display = "flex";
}
function closeModal(){

    document.getElementById("productModal").style.display="none";

}

window.onclick=function(e){

    const modal=document.getElementById("productModal");

    if(e.target===modal){

        closeModal();

    }

}
// =======================================
// PART 3 - CART & WISHLIST
// =======================================

// ==========================
// ADD TO CART
// ==========================

async function addToCart(id, name, price) {

    try {

        const response = await fetch("/api/cart", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                productId: id,
                productName: name,
                price: price,
                quantity: 1

            })

        });

        if (!response.ok) {

            throw new Error();

        }

        Swal.fire({

            icon: "success",

            title: "Added to Cart",

            text: name + " has been added.",

            timer: 1800,

            showConfirmButton: false

        });

    } catch (e) {

        console.error(e);

        Swal.fire({

            icon: "error",

            title: "Cart Error",

            text: "Unable to add this product."

        });

    }

}

// ==========================
// ADD TO WISHLIST
// ==========================

async function addToWishlist(id){

    try{

        const response = await fetch("/api/wishlist",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                productId:id

            })

        });

        if(!response.ok){

            throw new Error();

        }

        Swal.fire({

            icon:"success",

            title:"Added to Wishlist",

            timer:1500,

            showConfirmButton:false

        });

    }catch(e){

        console.error(e);

        Swal.fire({

            icon:"error",

            title:"Wishlist Error",

            text:"Unable to add product."

        });

    }

}

// ==========================
// REFRESH PRODUCTS
// ==========================

function refreshProducts(){

    displayProducts(filteredProducts);

}

// ==========================
// UTILITIES
// ==========================

function formatPrice(price){

    return "₱" + Number(price).toLocaleString();

}
function updateCartBadge(){

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    document.getElementById("cartBadge").textContent = cart.length;

}

updateCartBadge();