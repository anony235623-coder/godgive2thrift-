// ===============================
// LOGIN
// ===============================

function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {

        alert("Please enter your email and password.");
        return;

    }

    fetch("/api/auth/login", {

        method: "POST",

        credentials: "include",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            email: email,
            password: password

        })

    })

    .then(response => response.json())

    .then(data => {

        if (data.status === "success") {

            alert("Welcome, " + data.name + "!");

            if (data.role === "ADMIN") {

                window.location.href = "/admin";

            } else {

                window.location.href = "/";

            }

        } else {

            alert(data.message);

        }

    })

    .catch(error => {

        console.error(error);

        alert("Login failed.");

    });

}



// ===============================
// REGISTER
// ===============================

function register() {

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (name === "" || email === "" || password === "") {

        alert("Please complete all fields.");
        return;

    }

    fetch("/api/auth/register", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            name: name,
            email: email,
            password: password

        })

    })

    .then(async response => {

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;

})

    .then(() => {

        alert("Account created successfully!");

        window.location.href = "/login";

    })

    .catch(error => {

        alert(error.message);

    });

}



// ===============================
// LOGOUT
// ===============================

function logout() {

    fetch("/api/auth/logout", {

        method: "POST",

        credentials: "include"

    })

    .then(() => {

        window.location.href = "/login";

    });

}



// ===============================
// LOAD CURRENT USER
// ===============================

function loadCurrentUser() {

    fetch("/api/auth/me", {

        credentials: "include"

    })

    .then(response => response.json())

    .then(user => {

        const menu = document.getElementById("accountMenu");

        if (!menu) return;

        if (!user.authenticated) {

            menu.innerHTML = `

                <a href="/login">Login</a>

                <a href="/register">Register</a>

            `;

            return;

        }

        let html = `

            <span>

                👤 ${user.name}

            </span>

            <a href="/account">

                My Account

            </a>

        `;

        if(user.role === "ADMIN"){

            html += `

                <a href="/admin">

                    Admin

                </a>

            `;

        }

        html += `

            <a href="#" onclick="logout(); return false;">

                Logout

            </a>

        `;

        menu.innerHTML = html;

    })

    .catch(error => {

        console.error(error);

    });

}

document.addEventListener("DOMContentLoaded", loadCurrentUser);



// ===============================
// AUTO LOAD
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    loadCurrentUser();

});