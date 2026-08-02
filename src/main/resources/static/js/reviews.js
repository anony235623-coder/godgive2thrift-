let selectedRating = 5;

// ==========================
// SELECT STAR
// ==========================

function selectRating(rating){

    selectedRating = rating;

    const stars = document.querySelectorAll(".star");

    stars.forEach((star,index)=>{

        star.style.color =
            index < rating ? "gold" : "#ccc";

    });

}

// ==========================
// LOAD REVIEWS
// ==========================

function loadReviews(productId){

    fetch("/api/reviews/product/" + productId)

    .then(response=>response.json())

    .then(reviews=>{

        let html = "";

        if(reviews.length === 0){

            html = "<p>No reviews yet.</p>";

        }

        reviews.forEach(review=>{

            html += `

            <div class="review-card">

                <h3>${"⭐".repeat(review.rating)}</h3>

                <p>${review.comment}</p>

                <small>

                    ${review.customerName}

                </small>

            </div>

            `;

        });

        document.getElementById("reviewList").innerHTML = html;

    });

}

// ==========================
// SUBMIT REVIEW
// ==========================

function submitReview(productId){

    const comment =
        document.getElementById("reviewComment").value;

    const customerName =
        document.getElementById("name").innerText;

    fetch("/api/reviews",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            productId:productId,

            customerName:customerName,

            rating:selectedRating,

            comment:comment

        })

    })

    .then(response=>response.json())

    .then(()=>{

        document.getElementById("reviewComment").value="";

        loadReviews(productId);

        alert("Review submitted!");

    });
async function exportPDF() {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    pdf.setFontSize(22);
    pdf.text("GodGive2Thrift", 20, 20);

    pdf.setFontSize(16);
    pdf.text("Sales Report", 20, 30);

    pdf.line(20,35,190,35);

    pdf.setFontSize(12);

    pdf.text(
        "Revenue: " +
        document.getElementById("revenue").innerText,
        20,
        50
    );

    pdf.text(
        "Orders: " +
        document.getElementById("orders").innerText,
        20,
        60
    );

    pdf.text(
        "Customers: " +
        document.getElementById("customers").innerText,
        20,
        70
    );

    pdf.text(
        "Products: " +
        document.getElementById("products").innerText,
        20,
        80
    );

    pdf.text(
        "Pending Orders: " +
        document.getElementById("pending").innerText,
        20,
        90
    );

    pdf.line(20,100,190,100);

    pdf.text("Recent Transactions",20,110);

    let y = 120;

    document.querySelectorAll("#reportTable tr").forEach(row=>{

        const cells = row.querySelectorAll("td");

        if(cells.length > 0){

            pdf.text(

                cells[0].innerText +
                " | " +
                cells[1].innerText +
                " | " +
                cells[2].innerText,

                20,

                y

            );

            y += 10;

        }

    });

    pdf.save("GodGive2Thrift-Sales-Report.pdf");

}
}