const token = localStorage.getItem("token");

if (!token) {
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("notLogin").classList.remove("hidden");
} else {
    loadBookings();
}

function loadBookings() {
    axios.get(`${API_BASE}/api/bookings/my`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(res => {
        document.getElementById("loading").classList.add("hidden");
        renderBookings(res.data);
    })
    .catch(err => {
        document.getElementById("loading").classList.add("hidden");
        console.error(err);
        alert("Cannot load bookings");
    });
}

function renderBookings(bookings) {
    const container = document.getElementById("bookingList");

    if (!bookings || bookings.length === 0) {
        document.getElementById("empty").classList.remove("hidden");
        return;
    }

    bookings.forEach(b => {
        container.innerHTML += `
        <div class="bg-white shadow flex flex-col lg:flex-row overflow-hidden">

            <div class="lg:w-5/12 h-[400px]">
                <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200"
                     class="w-full h-full object-cover">
            </div>

            <div class="lg:w-7/12 p-16 space-y-10">

                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm text-stone-500">Check-in</p>
                        <p class="text-2xl font-bold">${formatDate(b.checkInDate)}</p>
                    </div>

                    <div>
                        <p class="text-sm text-stone-500">Check-out</p>
                        <p class="text-2xl font-bold">${formatDate(b.checkOutDate)}</p>
                    </div>

                    <span class="px-6 py-2 border rounded ${statusColor(b.status)}">
                        ${b.status}
                    </span>
                </div>

                <div>
                    <p class="text-sm text-stone-500">Guest</p>
                    <p class="text-xl font-bold">${b.guestName}</p>
                </div>

                <div>
                    <p class="text-sm text-stone-500">Booking ID</p>
                    <p class="text-xl font-bold">#${b.id}</p>
                </div>

                <div>
                    <p class="text-sm text-stone-500">Total Paid</p>
                    <p class="text-2xl font-bold text-yellow-600">
                        $${b.totalPrice.toLocaleString()}
                    </p>
                </div>

                ${b.note ? `
                <div>
                    <p class="text-sm text-stone-500">Note</p>
                    <p class="text-sm">${b.note}</p>
                </div>` : ""}

                <div class="flex gap-4">
            <button onclick="orderFood(${b.id})"
                class="bg-yellow-600 text-white px-6 py-3 rounded hover:bg-yellow-700">
                Order Food
            </button>
        </div>

        <button 
        onclick="viewInvoice(${b.id})"
        class="bg-yellow-600 text-white px-6 py-3 rounded hover:bg-yellow-700">
        View Invoice
    </button>

            </div>
        </div>
        `;
    });
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function statusColor(status) {
    switch(status) {
        case "CONFIRMED":
            return "bg-green-50 text-green-600 border-green-200";
        case "PENDING":
            return "bg-yellow-50 text-yellow-600 border-yellow-200";
        case "CANCELLED":
            return "bg-red-50 text-red-600 border-red-200";
        default:
            return "bg-gray-50 text-gray-600 border-gray-200";
    }
}

function orderFood(bookingId) {
    localStorage.setItem("bookingId", bookingId);
    window.location.href = "./foodOrderPage.html";
}
