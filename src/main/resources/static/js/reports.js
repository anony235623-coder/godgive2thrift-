let salesChart = null;
let inventoryChart = null;
loadReport();

function loadReport() {

    Promise.all([
    fetch("/api/reports/summary").then(res => res.json()),
    fetch("/api/orders").then(res => res.json()),
    fetch("/api/products").then(res => res.json())
])

    .then(([report, orders, products]) => {

        // Dashboard Cards

        document.getElementById("revenue").innerHTML =
            "₱" + Number(report.revenue).toLocaleString();

        document.getElementById("orders").innerHTML =
            "₱" + Number(report.orders).toLocaleString();

        document.getElementById("products").innerHTML =
            "₱" + Number(report.products).toLocaleString();

        document.getElementById("customers").innerHTML =
            "₱" + Number(report.customers).toLocaleString();

        document.getElementById("pending").innerHTML =
          "₱" + Number(report.pending).toLocaleString();

        // Inventory Value

        let inventoryValue = 0;

        products.forEach(product => {

            inventoryValue += product.price * product.stock;

        });

        document.getElementById("inventory").innerHTML =
            "₱" + inventoryValue.toLocaleString();

        // Sales Summary

        let today = 0;
        let week = 0;
        let month = 0;

        const now = new Date();

        orders.forEach(order => {

            if (!order.orderDate) return;

            const date = new Date(order.orderDate);

            if (date.toDateString() === now.toDateString()) {

                today += order.total;

            }

            const diffDays =
                (now - date) / (1000 * 60 * 60 * 24);

            if (diffDays <= 7) {

                week += order.total;

            }

            if (
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear()
            ) {

                month += order.total;

            }

        });

        document.getElementById("todaySales").innerHTML =
            "₱" + today.toLocaleString();

        document.getElementById("weekSales").innerHTML =
            "₱" + week.toLocaleString();

        document.getElementById("monthSales").innerHTML =
            "₱" + month.toLocaleString();

        // Recent Transactions

        let html = "";

        orders
            .sort((a, b) => b.id - a.id)
            .forEach(order => {

                html += `
                <tr>

                    <td>${order.customerName}</td>

                    <td>${order.productName}</td>

                    <td>₱${Number(order.total).toLocaleString()}</td>

                    <td>${order.status}</td>

                </tr>
                `;

            });

        document.getElementById("reportTable").innerHTML = html;

        loadCharts(products, orders);

    })

    .catch(error => {

        console.error(error);

        alert("Failed to load sales report.");

    });

}


// -------------------------
// CHARTS
// -------------------------

function loadCharts(products, orders) {

    // Inventory Chart

    const productNames = [];
    const stocks = [];

    products.forEach(product => {

        productNames.push(product.name);
        stocks.push(product.stock);

    });

    if (inventoryChart) {
    inventoryChart.destroy();
}

inventoryChart = new Chart(document.getElementById("inventoryChart"), {

        type: "bar",

        data: {

            labels: productNames,

            datasets: [{

                label: "Stock",

                data: stocks

            }]

        }

    });

    // Sales Chart

    const customerNames = [];
    const totals = [];

    orders.forEach(order => {

        customerNames.push(order.customerName);

        totals.push(order.total);

    });

    if (salesChart) {
    salesChart.destroy();
}

salesChart = new Chart(document.getElementById("salesChart"), {

        type: "line",

        data: {

            labels: customerNames,

            datasets: [{

                label: "Sales",

                data: totals

            }]

        }

    });

}


// -------------------------
// EXPORT CSV
// -------------------------

function exportCSV() {

    let table = document.getElementById("reportTable");

    let csv = [];

    for (let row of table.rows) {

        let cols = [];

        for (let cell of row.cells) {

            cols.push(cell.innerText);

        }

        csv.push(cols.join(","));

    }

    const blob = new Blob([csv.join("\n")], {

        type: "text/csv"

    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "sales-report.csv";

    link.click();

}