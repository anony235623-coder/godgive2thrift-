let allProducts = [];

window.onload = function () {
    loadProducts();
};

// ==========================
// LOAD PRODUCTS
// ==========================

function loadProducts() {

    fetch("/api/products")

        .then(response => response.json())

        .then(products => {

            allProducts = products;

            displayProducts(products);

        })

        .catch(error => {

            console.error(error);

            alert("Failed to load products.");

        });
// ==========================
// DISPLAY PRODUCTS
// ==========================

function displayProducts(products) {

    let html = "";

    products.forEach(product => {

        html += `

        <div class="card product-card">

            ${product.stock <= 3 && product.stock > 0 ? `
                <div class="sale-badge">
                    🔥 HOT
                </div>
            ` : ""}

            <div class="badge">

                ${product.category}

            </div>

            <div class="favorite"
                 onclick="addToWishlist(${product.id})">

                <i class="fa-regular fa-heart"></i>

            </div>

            <a href="/product?id=${product.id}">

                <img
                    class="product-image"
                    src="/api/products/image/${product.id}"
                    alt="${product.name}"
                    loading="lazy">

            </a>

            <div class="content">

                <h3>

                    <a href="/product?id=${product.id}"
                       style="text-decoration:none;color:black;">

                        ${product.name}

                    </a>

                </h3>

                <div class="price">

                    ₱${Number(product.price).toLocaleString()}

                </div>

                <div class="old-price">

                    ₱${Number(product.price * 1.35).toLocaleString()}

                </div>

                <div class="rating">

                    ⭐⭐⭐⭐⭐

                    <span>

                        4.9 (120 Reviews)

                    </span>

                </div>

                <div class="stock">

                    ${
                        product.stock > 5
                        ? "✅ In Stock (" + product.stock + ")"

                        : product.stock > 0
                        ? "⚠ Only " + product.stock + " left"

                        : "❌ Out of Stock"
                    }

                </div>

                <button
                    onclick="viewProduct(${product.id})">

                    👁 View Details

                </button>

                ${
                    product.stock > 0

                    ? `

                    <button

                        onclick="addToCart(

                            ${product.id},

                            '${product.name.replace(/'/g, "\\'")}',

                            ${product.price}

                        )">

                        🛒 Add to Cart

                    </button>

                    `

                    :

                    `

                    <button disabled
                            style="background:gray;cursor:not-allowed;">

                        Out of Stock

                    </button>

                    `
                }

            </div>

        </div>

        `;

    });

    document.getElementById("productList").innerHTML = html;

}
}