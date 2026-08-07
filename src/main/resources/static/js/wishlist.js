loadWishlist();

function loadWishlist(){

    fetch("/api/wishlist",{

        credentials:"include"

    })

    .then(response=>response.json())

    .then(items=>{

        if(items.length===0){

            document.getElementById("wishlist").innerHTML =
                "<h3>No wishlist items.</h3>";

            return;

        }

        fetch("/api/products")

        .then(response=>response.json())

        .then(products=>{

            let html="";

            items.forEach(item=>{

                const product =
                    products.find(p=>p.id===item.productId);

                if(!product){
                    return;
                }

                html += `

<div class="wishlist-card">

    <div class="wishlist-image">

        <img
            src="/api/products/image/${product.id}"
            alt="${product.name}">

    </div>

    <div class="wishlist-info">

        <span class="wishlist-category">
            ${product.category}
        </span>

        <h2>
            ${product.name}
        </h2>

        <div class="wishlist-rating">
            ⭐⭐⭐⭐⭐
            <span>4.9</span>
        </div>

        <div class="wishlist-price">

            ₱${Number(product.price).toLocaleString()}

        </div>

        <div class="wishlist-stock">

            ${
                product.stock > 5
                ? "✅ In Stock"
                : product.stock > 0
                ? `⚠ Only ${product.stock} left`
                : "❌ Out of Stock"
            }

        </div>

        <div class="wishlist-buttons">

            <button
                class="cart-btn"
                onclick="addToCartWishlist(
                    ${product.id},
                    '${product.name.replace(/'/g,"\\'")}',
                    ${product.price}
                )">

                <i class="fa-solid fa-cart-shopping"></i>

                Move to Cart

            </button>

            <button
                class="remove-btn"
                onclick="removeWishlist(${product.id})">

                <i class="fa-solid fa-trash"></i>

                Remove

            </button>

        </div>

    </div>

</div>

`;

            });

            document.getElementById("wishlist").innerHTML = html;

        });

    });

}

function addToCartWishlist(id,name,price){

    addToCart(id,name,price);

    alert("Added to cart.");

}

function removeWishlist(productId){

    fetch("/api/wishlist/"+productId,{

        method:"DELETE",

        credentials:"include"

    })

    .then(response=>response.json())

    .then(data=>{

        alert(data.message);

        loadWishlist();

    });

}