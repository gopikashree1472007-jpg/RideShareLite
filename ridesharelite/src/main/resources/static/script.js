const API = "http://localhost:8080/api";


// -----------------------------
// NAVIGATION
// -----------------------------

function showSection(sectionName) {

    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById(sectionName)
        .classList.add("active");
}


// -----------------------------
// CREATE USER
// -----------------------------

document.getElementById("userForm")
    .addEventListener("submit", async function(event) {

    event.preventDefault();

    const user = {
        name: document.getElementById("userName").value,
        email: document.getElementById("userEmail").value,
        phone: document.getElementById("userPhone").value
    };

    try {

        const response = await fetch(`${API}/users`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)

        });

        if (!response.ok) {
            throw new Error("Unable to create user");
        }

        const data = await response.json();

        alert("User created successfully! ID: " + data.id);

        document.getElementById("userForm").reset();

        loadUsers();

    } catch (error) {

        alert(error.message);

    }

});


// -----------------------------
// LOAD USERS
// -----------------------------

async function loadUsers() {

    try {

        const response = await fetch(`${API}/users`);

        const users = await response.json();

        const userList = document.getElementById("userList");

        userList.innerHTML = "";

        users.forEach(user => {

            userList.innerHTML += `
                <div class="item">

                    <h3>${user.name}</h3>

                    <p><strong>ID:</strong> ${user.id}</p>

                    <p><strong>Email:</strong> ${user.email}</p>

                    <p><strong>Phone:</strong> ${user.phone}</p>

                </div>
            `;

        });

    } catch (error) {

        alert("Unable to load users");

    }
}


// -----------------------------
// CREATE RIDE
// -----------------------------

document.getElementById("rideForm")
    .addEventListener("submit", async function(event) {

    event.preventDefault();

    const ride = {

        source: document.getElementById("source").value,

        destination: document.getElementById("destination").value,

        rideDate: document.getElementById("rideDate").value,

        rideTime: document.getElementById("rideTime").value,

        availableSeats:
            parseInt(document.getElementById("availableSeats").value),

        price:
            parseFloat(document.getElementById("price").value)
    };

    try {

        const response = await fetch(`${API}/rides`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(ride)

        });

        if (!response.ok) {
            throw new Error("Unable to create ride");
        }

        const data = await response.json();

        alert("Ride created successfully! ID: " + data.id);

        document.getElementById("rideForm").reset();

        loadRides();

    } catch (error) {

        alert(error.message);

    }

});


// -----------------------------
// LOAD RIDES
// -----------------------------

async function loadRides() {

    try {

        const response = await fetch(`${API}/rides`);

        const rides = await response.json();

        const rideList = document.getElementById("rideList");

        rideList.innerHTML = "";

        rides.forEach(ride => {

            rideList.innerHTML += `
                <div class="item">

                    <h3>
                        ${ride.source} → ${ride.destination}
                    </h3>

                    <p><strong>Ride ID:</strong> ${ride.id}</p>

                    <p><strong>Date:</strong> ${ride.rideDate}</p>

                    <p><strong>Time:</strong> ${ride.rideTime}</p>

                    <p>
                        <strong>Available Seats:</strong>
                        ${ride.availableSeats}
                    </p>

                    <p>
                        <strong>Price:</strong>
                        ₹${ride.price}
                    </p>

                </div>
            `;

        });

    } catch (error) {

        alert("Unable to load rides");

    }
}


// -----------------------------
// CREATE BOOKING
// -----------------------------

document.getElementById("bookingForm")
    .addEventListener("submit", async function(event) {

    event.preventDefault();

    const booking = {

        userId:
            parseInt(document.getElementById("userId").value),

        rideId:
            parseInt(document.getElementById("rideId").value),

        seatsBooked:
            parseInt(document.getElementById("seatsBooked").value)
    };

    try {

        const response = await fetch(`${API}/bookings`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(booking)

        });

        const text = await response.text();

if (!response.ok) {
    throw new Error(text);
}

const data = JSON.parse(text);

alert(
    "Booking confirmed! Booking ID: " + data.id
);

        alert(
            "Booking confirmed! Booking ID: " + data.id
        );

        document.getElementById("bookingForm").reset();

        loadBookings();

    } catch (error) {

        alert(error.message);

    }

});


// -----------------------------
// LOAD BOOKINGS
// -----------------------------

async function loadBookings() {

    try {

        const response = await fetch(`${API}/bookings`);

        const bookings = await response.json();

        const bookingList =
            document.getElementById("bookingList");

        bookingList.innerHTML = "";

        bookings.forEach(booking => {

            bookingList.innerHTML += `
                <div class="item">

                    <h3>
                        Booking #${booking.id}
                    </h3>

                    <p>
                        <strong>User ID:</strong>
                        ${booking.userId}
                    </p>

                    <p>
                        <strong>Ride ID:</strong>
                        ${booking.rideId}
                    </p>

                    <p>
                        <strong>Seats:</strong>
                        ${booking.seatsBooked}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${booking.status}
                    </p>

                    ${
                        booking.status !== "CANCELLED"
                        ?
                        `<button
                            onclick="cancelBooking(${booking.id})">
                            Cancel Booking
                        </button>`
                        :
                        ""
                    }

                </div>
            `;

        });

    } catch (error) {

        alert("Unable to load bookings");

    }
}


// -----------------------------
// CANCEL BOOKING
// -----------------------------

async function cancelBooking(id) {

    if (!confirm("Cancel this booking?")) {
        return;
    }

    try {

        const response =
            await fetch(`${API}/bookings/${id}/cancel`, {

                method: "PUT"

            });

        if (!response.ok) {

            const message = await response.text();

            throw new Error(message);

        }

        alert("Booking cancelled successfully!");

        loadBookings();

    } catch (error) {

        alert(error.message);

    }
}