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

                <div class="card">

                    <h2>${product.name}</h2>

                    <p>₱${product.price}</p>

                    <img
                    src="/api/products/image/${product.id}"
                    width="180">

                    <br><br>

                    <button onclick="addToCartWishlist(
                        ${product.id},
                        '${product.name}',
                        ${product.price}
                    )">

                        🛒 Add to Cart

                    </button>

                    <button onclick="removeWishlist(${product.id})">

                        ❌ Remove

                    </button>

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