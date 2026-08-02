let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(id,name,price){

    const item = cart.find(p=>p.id===id);

    if(item){

        item.quantity++;

    }else{

        cart.push({

            id:id,

            name:name,

            price:price,

            quantity:1

        });

    }

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

    alert("🛒 Added to cart!");

}

fetch("/api/auth/me", {
    credentials: "include"
})
.then(response => response.json())
.then(user => {

    const accountMenu = document.getElementById("accountMenu");

    if (!accountMenu) return;

    if (!user.authenticated) {

        accountMenu.innerHTML = `
            <a href="/login">Login</a>
            <a href="/register">Register</a>
        `;

        return;
    }

    let html = `
        <a href="/account">
            👤 ${user.name}
        </a>
    `;

    if (user.role === "ADMIN") {

        html += `
            <a href="/admin">Admin</a>
        `;
    }

    html += `
        <a href="#" onclick="logout();return false;">
            Logout
        </a>
    `;

    accountMenu.innerHTML = html;

})

.then(response => response.json())

.then(user => {

    const accountMenu = document.getElementById("accountMenu");

    if (!accountMenu) return;

    if (!user.authenticated) {

        accountMenu.innerHTML = `
            <a href="/login">Login</a>
            <a href="/register">Register</a>
        `;

        return;

    }

    let html = `
        <span style="color:#D4AF37;font-weight:bold;">
            👤 ${user.name}
        </span>

        <a href="/account">My Account</a>
    `;

    if (user.role === "ADMIN") {

        html += `
            <a href="/admin">Admin</a>
        `;

    }

    html += `
        <a href="#" onclick="logout();return false;">
            Logout
        </a>
    `;

    accountMenu.innerHTML = html;

}); // <-- THIS WAS MISSING
function loadBestSellers(){

    fetch("/api/products/best-sellers")

    .then(response=>response.json())

    .then(products=>{

        let html="";

        products.forEach(product=>{

            html += `
                <div class="card">

                    <img src="/api/products/image/${product.id}">

                    <div class="content">

                        <h3>${product.name}</h3>

                        <p>⭐ ${product.sold} Sold</p>

                        <div class="price">

                            ₱${product.price}

                        </div>

                    </div>

                </div>
            `;

        });

        document.getElementById("bestSellerProducts").innerHTML = html;

    });

}

loadBestSellers();