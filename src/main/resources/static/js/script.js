window.addEventListener("DOMContentLoaded", loadFeaturedProducts);

async function loadFeaturedProducts() {

    const container = document.getElementById("bestSellerProducts");

    if (!container) return;

    try {

        const response = await fetch("/api/products");

        const products = await response.json();

        container.innerHTML = "";

        products.slice(0,4).forEach(product=>{

            container.innerHTML += `

            <div class="home-card">

                <img
                    src="/api/products/image/${product.id}"
                    alt="${product.name}">

                <div class="home-info">

                    <h3>${product.name}</h3>

                    <p>${product.category}</p>

                    <div class="home-price">

                        ₱${Number(product.price).toLocaleString()}

                    </div>

                    <a
                        href="/product?id=${product.id}"
                        class="home-btn">

                        View Product

                    </a>

                </div>

            </div>

            `;

        });

    } catch (e) {

        console.error(e);

        container.innerHTML =
        "<p>Unable to load products.</p>";

    }

}