/* =========================
   GROUND SELECTION
========================= */

function selectGround(name, location, price) {

    let ground = {
        name: name,
        location: location,
        price: price
    };

    localStorage.setItem(
        "selectedGround",
        JSON.stringify(ground)
    );

    window.location.href = "booking.html";
}


/* =========================
   LOAD GROUND
========================= */

function loadGround() {

    let ground =
        JSON.parse(
            localStorage.getItem("selectedGround")
        );

    if (!ground) {

        window.location.href = "grounds.html";

        return;
    }

    document.getElementById("groundName")
        .innerText = ground.name;

    document.getElementById("groundLocation")
        .innerText = "📍 " + ground.location;

    document.getElementById("groundPrice")
        .innerText = ground.price;
}


/* =========================
   REGISTER
========================= */

function register() {

    let name =
        document.getElementById("registerName").value;

    let email =
        document.getElementById("registerEmail").value;

    let phone =
        document.getElementById("registerPhone").value;

    let password =
        document.getElementById("registerPassword").value;


    if (
        name === "" ||
        email === "" ||
        phone === "" ||
        password === ""
    ) {

        alert("Please fill all details!");

        return;
    }


    let users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];


    let exists =
        users.find(
            user => user.email === email
        );


    if (exists) {

        alert("Email already registered!");

        return;
    }


    users.push({

        name: name,

        email: email,

        phone: phone,

        password: password

    });


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    alert("Registration Successful! 🎉");

    window.location.href = "login.html";
}


/* =========================
   LOGIN
========================= */

function login() {

    let email =
        document.getElementById("loginEmail").value;

    let password =
        document.getElementById("loginPassword").value;


    /* ADMIN LOGIN */

    if (
        email === "admin@gmail.com" &&
        password === "admin123"
    ) {

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify({
                name: "Admin",
                email: email,
                role: "admin"
            })
        );

        window.location.href = "admin.html";

        return;
    }


    let users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];


    let user =
        users.find(
            u =>
            u.email === email &&
            u.password === password
        );


    if (!user) {

        alert("Invalid email or password!");

        return;
    }


    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
    );


    alert("Login Successful! ✅");

    window.location.href = "grounds.html";
}


/* =========================
   GO TO PAYMENT
========================= */

function goToPayment() {

    let name =
        document.getElementById("name").value;

    let phone =
        document.getElementById("phone").value;

    let date =
        document.getElementById("date").value;

    let time =
        document.getElementById("time").value;


    if (
        name === "" ||
        phone === "" ||
        date === "" ||
        time === ""
    ) {

        alert("Please fill all details!");

        return;
    }


    if (phone.length !== 10) {

        alert("Enter valid phone number!");

        return;
    }


    let ground =
        JSON.parse(
            localStorage.getItem("selectedGround")
        );


    let booking = {

        name: name,

        phone: phone,

        date: date,

        time: time,

        ground: ground.name,

        location: ground.location,

        price: ground.price

    };


    localStorage.setItem(
        "pendingBooking",
        JSON.stringify(booking)
    );


    window.location.href =
        "payment.html";
}


/* =========================
   LOAD PAYMENT
========================= */

function loadPayment() {

    let booking =
        JSON.parse(
            localStorage.getItem("pendingBooking")
        );


    if (!booking) {

        window.location.href =
            "grounds.html";

        return;
    }


    document.getElementById("payGround")
        .innerText = booking.ground;

    document.getElementById("payDate")
        .innerText = booking.date;

    document.getElementById("payTime")
        .innerText = booking.time;

    document.getElementById("payPrice")
        .innerText = booking.price;
}


/* =========================
   PAYMENT
========================= */

function completePayment() {

    let booking =
        JSON.parse(
            localStorage.getItem("pendingBooking")
        );


    let method =
        document.querySelector(
            'input[name="payment"]:checked'
        ).value;


    let bookingId =
        "FB" +
        Math.floor(
            10000 +
            Math.random() * 90000
        );


    booking.id = bookingId;

    booking.payment = method;

    booking.status = "Confirmed";


    let bookings =
        JSON.parse(
            localStorage.getItem("bookings")
        ) || [];


    bookings.push(booking);


    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings)
    );


    localStorage.removeItem(
        "pendingBooking"
    );


    alert(
        "Payment Successful! 🎉\n" +
        "Booking ID: " +
        bookingId
    );


    window.location.href =
        "my-bookings.html";
}


/* =========================
   MY BOOKINGS
========================= */

function showBookings() {

    let container =
        document.getElementById(
            "bookingList"
        );


    let bookings =
        JSON.parse(
            localStorage.getItem("bookings")
        ) || [];


    if (bookings.length === 0) {

        container.innerHTML =
            "<h2>No bookings yet.</h2>";

        return;
    }


    container.innerHTML = "";


    bookings.forEach(function(booking) {

        let div =
            document.createElement("div");


        div.className =
            "booking-item";


        div.innerHTML = `

            <h2>
                ⚽ ${booking.ground}
            </h2>

            <p>
                <b>Booking ID:</b>
                ${booking.id}
            </p>

            <p>
                <b>Name:</b>
                ${booking.name}
            </p>

            <p>
                <b>Phone:</b>
                ${booking.phone}
            </p>

            <p>
                <b>Date:</b>
                ${booking.date}
            </p>

            <p>
                <b>Time:</b>
                ${booking.time}
            </p>

            <p>
                <b>Price:</b>
                ₹${booking.price}
            </p>

            <p>
                <b>Payment:</b>
                ${booking.payment}
            </p>

            <p>
                <span class="confirmed">
                    ${booking.status}
                </span>
            </p>

            <button
                onclick="cancelBooking('${booking.id}')"
            >
                Cancel Booking
            </button>

        `;


        container.appendChild(div);

    });
}


/* =========================
   CANCEL BOOKING
========================= */

function cancelBooking(id) {

    let confirmCancel =
        confirm(
            "Cancel this booking?"
        );


    if (!confirmCancel) {

        return;
    }


    let bookings =
        JSON.parse(
            localStorage.getItem("bookings")
        ) || [];


    bookings =
        bookings.filter(
            booking =>
            booking.id !== id
        );


    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings)
    );


    alert("Booking Cancelled!");


    showBookings();
}


/* =========================
   ADMIN
========================= */

function loadAdmin() {

    let user =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    if (
        !user ||
        user.role !== "admin"
    ) {

        alert("Admin login required!");

        window.location.href =
            "login.html";

        return;
    }


    let users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];


    let bookings =
        JSON.parse(
            localStorage.getItem("bookings")
        ) || [];


    document.getElementById(
        "userCount"
    ).innerText = users.length;


    document.getElementById(
        "bookingCount"
    ).innerText = bookings.length;


    let total = 0;


    bookings.forEach(function(booking) {

        total += Number(booking.price);

    });


    document.getElementById(
        "revenue"
    ).innerText = "₹" + total;


    let container =
        document.getElementById(
            "adminBookings"
        );


    container.innerHTML = "";


    bookings.forEach(function(booking) {

        let div =
            document.createElement("div");


        div.className =
            "booking-item";


        div.innerHTML = `

            <h2>
                ⚽ ${booking.ground}
            </h2>

            <p>
                <b>Booking ID:</b>
                ${booking.id}
            </p>

            <p>
                <b>Customer:</b>
                ${booking.name}
            </p>

            <p>
                <b>Phone:</b>
                ${booking.phone}
            </p>

            <p>
                <b>Date:</b>
                ${booking.date}
            </p>

            <p>
                <b>Time:</b>
                ${booking.time}
            </p>

            <p>
                <b>Amount:</b>
                ₹${booking.price}
            </p>

            <p>
                <b>Payment:</b>
                ${booking.payment}
            </p>

            <p>
                <span class="confirmed">
                    ${booking.status}
                </span>
            </p>

        `;


        container.appendChild(div);

    });
}
