let allOrders = [];

loadOrders();

// ===========================
// LOAD ORDERS
// ===========================

function loadOrders(){

    fetch("/api/orders",{

        credentials:"include"

    })

    .then(response=>response.json())

    .then(orders=>{

        allOrders = orders;

        displayOrders(allOrders);

    });

}


// ===========================
// DISPLAY ORDERS
// ===========================

function displayOrders(orders){

    let html = "";

    orders.forEach(order => {

        html += `
<tr>

    <td>${order.id}</td>

    <td>${order.customerName}</td>

    <td>${order.productName}</td>

    <td>${order.quantity}</td>

    <td>₱${Number(order.total).toLocaleString()}</td>

    <td>${statusBadge(order.status)}</td>

    <td>${order.trackingNumber ?? "-"}</td>

    <td>

        <button class="view"
        onclick="viewOrder(${order.id})">

            <i class="fa-solid fa-eye"></i>
            View

        </button>

        <br><br>

        <select onchange="updateStatus(${order.id},this.value)">

            <option value="Pending"
            ${order.status=="Pending"?"selected":""}>
            Pending
            </option>

            <option value="Payment Verified"
            ${order.status=="Payment Verified"?"selected":""}>
            Payment Verified
            </option>

            <option value="Rejected"
            ${order.status=="Rejected"?"selected":""}>
            Rejected
            </option>

            <option value="Shipped"
            ${order.status=="Shipped"?"selected":""}>
            Shipped
            </option>

            <option value="Delivered"
            ${order.status=="Delivered"?"selected":""}>
            Delivered
            </option>

        </select>

        <br><br>

        <button onclick="approveOrder(${order.id})">
            ✅ Approve
        </button>

        <button onclick="rejectOrder(${order.id})">
            ❌ Reject
        </button>

        <br><br>

        <button class="print"
        onclick="printOrder(${order.id})">

            <i class="fa-solid fa-print"></i>
            Print

        </button>

        <button class="cancel"
        onclick="deleteOrder(${order.id})">

            <i class="fa-solid fa-trash"></i>
            Delete

        </button>

    </td>

</tr>
`;

    });

    document.getElementById("orderTable").innerHTML = html;

}

// ===========================
// STATUS BADGE
// ===========================

function statusBadge(status){

    switch(status){

        case "Pending":
            return `<span class="pending">Pending</span>`;

        case "Payment Verified":
            return `<span class="verified">Payment Verified</span>`;

        case "Rejected":
            return `<span style="color:red;font-weight:bold;">Rejected</span>`;

        case "Shipped":
            return `<span class="shipped">Shipped</span>`;

        case "Delivered":
            return `<span class="delivered">Delivered</span>`;

        default:
            return status;

    }

}

// ===========================
// SEARCH
// ===========================

function filterOrders(){

    let keyword =
        document.getElementById("searchOrder").value.toLowerCase();

    let status =
        document.getElementById("statusFilter").value;

    let filtered = allOrders.filter(order => {

        let matchText =

            order.customerName.toLowerCase().includes(keyword) ||

            order.productName.toLowerCase().includes(keyword);

        let matchStatus =

            status === "" ||

            order.status === status;

        return matchText && matchStatus;

    });

    displayOrders(filtered);

}

// ===========================
// UPDATE STATUS
// ===========================

function updateStatus(id, status) {

    if (status === "Shipped") {

        const tracking = prompt("Enter Tracking Number:");

        if (tracking == null || tracking.trim() === "") {

            alert("Tracking number is required.");
            loadOrders();
            return;

        }

        fetch(
            `/api/orders/${id}/tracking?trackingNumber=${encodeURIComponent(tracking)}`,
            {
                method: "PUT",
                credentials: "include"
            }
        )
        .then(() => {
            loadOrders();
        });

        return;

    }

    fetch(
        `/api/orders/${id}/status?status=${encodeURIComponent(status)}`,
        {
            method: "PUT",
            credentials: "include"
        }
    )
    .then(() => {
        loadOrders();
    });

}

function approveOrder(id){

    updateStatus(id,"Payment Verified");

}

function rejectOrder(id){

    updateStatus(id,"Rejected");

}

// ===========================
// DELETE
// ===========================

function deleteOrder(id){

    if(!confirm("Delete this order?")) return;

    fetch("/api/orders/"+id,{

        method:"DELETE"

    })

    .then(()=>{

        loadOrders();

    });

}

// ===========================
// VIEW ORDER
// ===========================

function viewOrder(id){

    let order = allOrders.find(o=>o.id===id);

    if(!order) return;

    document.getElementById("modalBody").innerHTML = `

        <p><b>Customer:</b> ${order.customerName}</p>

        <p><b>Email:</b> ${order.email}</p>

        <p><b>Phone:</b> ${order.phone}</p>

        <p><b>Address:</b> ${order.address}</p>

        <hr>

        <p><b>Products:</b> ${order.productName}</p>

        <p><b>Quantity:</b> ${order.quantity}</p>

        <p><b>Total:</b> ₱${Number(order.total).toLocaleString()}</p>

        <p><b>GCash Reference:</b> ${order.gcashReference}</p>

        <p><b>Status:</b> ${order.status}</p>

        <p>

            <b>Payment Proof:</b><br><br>

            ${
                order.paymentProof
                ?
                `<img
                    src="/uploads/payment-proofs/${order.paymentProof}"
                    style="width:300px;border-radius:10px;">`
                :
                "No payment proof uploaded."
            }

        </p>

    `;

    document.getElementById("orderModal").style.display = "block";

}

// ===========================
// CLOSE MODAL
// ===========================

function closeModal(){

    document.getElementById("orderModal").style.display = "none";

}

// ===========================
// PRINT
// ===========================

function printOrder(id){

    let order = allOrders.find(o=>o.id===id);

    if(!order) return;

    let w = window.open("", "_blank");

    w.document.write(`

        <html>

        <head>

            <title>Invoice</title>

        </head>

        <body style="font-family:Arial;padding:40px;">

        <h1>GodGive2Thrift</h1>

        <hr>

        <h2>Invoice</h2>

        <p><b>Customer:</b> ${order.customerName}</p>

        <p><b>Email:</b> ${order.email}</p>

        <p><b>Phone:</b> ${order.phone}</p>

        <p><b>Address:</b> ${order.address}</p>

        <hr>

        <p><b>Products:</b> ${order.productName}</p>

        <p><b>Quantity:</b> ${order.quantity}</p>

        <p><b>Total:</b> ₱${Number(order.total).toLocaleString()}</p>

        <p><b>Status:</b> ${order.status}</p>

        <hr>

        <h3>Thank you for shopping with GodGive2Thrift!</h3>

        </body>

        </html>

    `);

    w.print();

}