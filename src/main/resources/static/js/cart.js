// -------------------------
// CART
// -------------------------

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const SHIPPING = 100;

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {

    const cartItems = document.getElementById("cartItems");

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div style="text-align:center;padding:50px;">
                <i class="fa-solid fa-cart-shopping"
                   style="font-size:70px;color:#D4AF37;"></i>

                <h2>Your cart is empty</h2>

                <br>

                <a href="/shop"
                   style="
                   background:#111;
                   color:white;
                   padding:15px 30px;
                   text-decoration:none;
                   border-radius:8px;">
                    Continue Shopping
                </a>
            </div>
        `;

        updateTotals();
        return;
    }

    let html = "";

    cart.forEach((item,index)=>{

        html += `

        <div class="cart-item">

            <div class="product">

                <img src="/api/products/image/${item.id}">

                <div>

                    <h3>${item.name}</h3>

                    <p>₱${item.price}</p>

                </div>

            </div>

            <div class="qty">

                <button onclick="decreaseQty(${index})">-</button>

                <span style="margin:0 10px;">
                    ${item.quantity}
                </span>

                <button onclick="increaseQty(${index})">+</button>

            </div>

            <strong>

                ₱${(item.price * item.quantity).toLocaleString()}

            </strong>

            <button
                class="remove"
                onclick="removeItem(${index})">

                Remove

            </button>

        </div>

        `;

    });

    cartItems.innerHTML = html;

    updateTotals();

}

function updateTotals(){

    let subtotal = 0;

    cart.forEach(item=>{

        subtotal += item.price * item.quantity;

    });

    document.getElementById("subtotal").innerHTML =
        "₱" + subtotal.toLocaleString();

    document.getElementById("grandTotal").innerHTML =
        "₱" + (subtotal + SHIPPING).toLocaleString();

}

function increaseQty(index){

    cart[index].quantity++;

    saveCart();

    loadCart();

    loadSummary();

}

function decreaseQty(index){

    if(cart[index].quantity > 1){

        cart[index].quantity--;

    }else{

        cart.splice(index,1);

    }

    saveCart();

    loadCart();

    loadSummary();

}

function removeItem(index){

    if(confirm("Remove this item?")){

        cart.splice(index,1);

        saveCart();

        loadCart();

        loadSummary();

    }

}

// =========================
// CHECKOUT SUMMARY
// =========================

function loadSummary(){

    const summaryItems =
        document.getElementById("summaryItems");

    if(!summaryItems) return;

    let subtotal = 0;

    let html = "";

    cart.forEach(item=>{

        let total =
            item.price * item.quantity;

        subtotal += total;

        html += `

        <div class="summary-item">

            <span>

                ${item.name} × ${item.quantity}

            </span>

            <strong>

                ₱${total.toLocaleString()}

            </strong>

        </div>

        `;

    });

    summaryItems.innerHTML = html;

    document.getElementById("subtotal").innerHTML =
        "₱" + subtotal.toLocaleString();

    document.getElementById("grandTotal").innerHTML =
        "₱" + (subtotal + SHIPPING).toLocaleString();

}

if(document.getElementById("cartItems")){
    loadCart();
}

if(document.getElementById("summaryItems")){
    loadSummary();
}

if(document.getElementById("cartItems")){
    loadCart();
}

if(document.getElementById("summaryItems")){
    loadSummary();
}