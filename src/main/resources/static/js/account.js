// ============================
// LOAD ACCOUNT
// ============================
let allOrders = [];
function loadAccount() {

    fetch("/api/auth/me", {

        credentials: "include"

    })

    .then(response => response.json())

    .then(user => {

        if (!user.authenticated) {

            window.location.href = "/login";
            return;

        }

        document.getElementById("name").innerHTML = user.name;
        document.getElementById("email").innerHTML = user.email;
        document.getElementById("role").innerHTML = user.role;

        loadOrders(user.email);

    })

    .catch(error => {

        console.error(error);

    });

}


// ============================
// LOAD MY ORDERS
// ============================

// ============================
// LOAD MY ORDERS
// ============================

function loadOrders(email) {

    fetch("/api/orders/customer/" + encodeURIComponent(email), {

        credentials: "include"

    })

    .then(response => response.json())

    .then(orders => {
        allOrders = orders;

        let html = "";

        let totalOrders = orders.length;
let pending = 0;
let delivered = 0;
let totalSpent = 0;

        if (orders.length === 0) {

            html = `
                <tr>
                    <td colspan="5">
                        No orders yet.
                    </td>
                </tr>
            `;

            document.getElementById("trackingCard").style.display = "none";

        } else {

            orders.forEach(order => {
                totalSpent += order.total;
                

                if(order.status === "Pending"){
                    pending++;
                }

                if(order.status === "Delivered"){
                    delivered++;
                }

                let orderDate = "-";

                if(order.orderDate){

                    orderDate = new Date(order.orderDate)
                        .toLocaleDateString();

                }

                html += `
<tr>

    <td>${order.productName}</td>

    <td>${order.quantity}</td>

    <td>₱${Number(order.total).toLocaleString()}</td>

    <td>${order.status}</td>

    <td>${orderDate}</td>

    <td>

        <button onclick="viewOrder(${order.id})">

            <i class="fa-solid fa-eye"></i>

            View

        </button>

    </td>

</tr>
`;

            });

            // ------------------------
            // TRACK LATEST ORDER
            // ------------------------

            const latest = orders[orders.length - 1];

            document.getElementById("trackingCard").style.display = "block";

            document.getElementById("trackingNumber").innerHTML =
                latest.trackingNumber || "-";

            let timeline = "";

            function step(active, text){

                return `
                    <div style="
                        padding:12px;
                        margin:8px 0;
                        border-radius:8px;
                        background:${active ? "#d4edda" : "#eeeeee"};
                        font-weight:bold;">

                        ${active ? "🟢" : "⚪"} ${text}

                    </div>
                `;
            }

            timeline += step(true,"Order Placed");

            timeline += step(
                latest.status === "Payment Verified"||
                latest.status === "Shipped" ||
                latest.status === "Delivered",
                "Payment Verified"
            );

            timeline += step(
                latest.status === "Shipped" ||
                latest.status === "Delivered",
                "Shipped"
            );

            timeline += step(
                latest.status === "Delivered",
                "Delivered"
            );

            document.getElementById("trackingTimeline").innerHTML =
                timeline;

        }

        document.getElementById("orderTable").innerHTML = html;

        document.getElementById("totalOrders").innerHTML = totalOrders;

        document.getElementById("pendingOrders").innerHTML = pending;

        document.getElementById("completedOrders").innerHTML = delivered;
        document.getElementById("totalSpent").innerHTML =
    "₱" + totalSpent.toLocaleString();

    });

}


// ============================
// LOGOUT
// ============================

function logout() {

    fetch("/api/auth/logout", {

        method: "POST",

        credentials: "include"

    })

    .then(() => {

        window.location.href = "/login";

    });

}


// ============================
// EDIT PROFILE
// ============================

function showEdit(){

    document.getElementById("editBox").style.display = "block";

    document.getElementById("editName").value =
        document.getElementById("name").innerHTML;

    document.getElementById("editEmail").value =
        document.getElementById("email").innerHTML;

}

function saveProfile(){

    fetch("/api/auth/update",{

        method:"PUT",

        credentials:"include",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            name:document.getElementById("editName").value,

            email:document.getElementById("editEmail").value

        })

    })

    .then(r=>r.json())

    .then(data=>{

        alert(data.message);

        loadAccount();

        document.getElementById("editBox").style.display="none";

    });

}


// ============================
// CHANGE PASSWORD
// ============================

function changePassword(){

    const currentPassword =
        document.getElementById("currentPassword").value;

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if(currentPassword === "" ||
       newPassword === "" ||
       confirmPassword === ""){

        alert("Please complete all fields.");
        return;

    }

    if(newPassword !== confirmPassword){

        alert("Passwords do not match.");
        return;

    }

    fetch("/api/auth/change-password",{

        method:"PUT",

        credentials:"include",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            currentPassword:currentPassword,
            newPassword:newPassword

        })

    })

    .then(r=>r.json())

    .then(data=>{

        alert(data.message);

        if(data.status==="success"){

            document.getElementById("currentPassword").value="";
            document.getElementById("newPassword").value="";
            document.getElementById("confirmPassword").value="";

        }

    });

}
function viewOrder(id){

    const order = allOrders.find(o => o.id === id);

    if(!order) return;

    document.getElementById("orderDetails").innerHTML = `

        <p><b>Product:</b> ${order.productName}</p>

        <p><b>Quantity:</b> ${order.quantity}</p>

        <p><b>Total:</b> ₱${Number(order.total).toLocaleString()}</p>

        <p><b>Status:</b> ${order.status}</p>

        <p><b>Tracking Number:</b> ${order.trackingNumber ?? "-"}</p>

        <p><b>Payment Method:</b> ${order.paymentMethod}</p>

        <p><b>GCash Reference:</b> ${order.gcashReference}</p>

    `;

    document.getElementById("orderModal").style.display="block";

}

function closeOrderModal(){

    document.getElementById("orderModal").style.display="none";

}

// ============================
// START
// ============================

loadAccount();