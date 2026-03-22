const api = axios.create({
    baseURL: `${API_BASE}/api`,
    headers: {
        "Content-Type": "application/json"
    }
});

// gắn token
api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/* ================= ROOM CACHE ================= */
const roomCache = {};

async function getRoomNumber(roomId) {
    if (roomCache[roomId]) return roomCache[roomId];

    try {
        const res = await api.get(`/rooms/${roomId}`);
        roomCache[roomId] = res.data.roomNumber;
        return roomCache[roomId];
    } catch (err) {
        console.error("Room error:", err);
        return "N/A";
    }
}

/* ================= FETCH BOOKINGS ================= */
async function fetchBookings() {
    try {
        const res = await api.get("/bookings");
        renderBookings(res.data);
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

/* ================= UPDATE STATUS ================= */
async function updateStatus(id, status) {
    try {
        await api.put(`/bookings/${id}/status`, null, {
            params: { status: status }
        });

        alert("Update thành công");
        fetchBookings();

    } catch (err) {
        console.error("Update error:", err);

        if (err.response) {
            alert("Lỗi: " + err.response.status);
        }
    }
}

/* ================= STATUS COLOR ================= */
function getStatusColor(status) {
    switch (status) {
        case "CONFIRMED": return "text-green-600";
        case "PAID": return "text-blue-600";
        case "CHECKED_IN": return "text-purple-600";
        case "CHECKED_OUT": return "text-gray-600";
        case "CANCELLED": return "text-red-600";
        default: return "text-yellow-600";
    }
}

/* ================= RENDER ================= */
async function renderBookings(bookings) {
    const tbody = document.getElementById("bookings-table-body");
    tbody.innerHTML = "";

    for (const b of bookings) {
        const roomNumber = await getRoomNumber(b.roomId);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="p-3 border">${b.id}</td>
            <td class="p-3 border">${b.guestName}</td>
            <td class="p-3 border">${b.roomId}</td>
            <td class="p-3 border">${b.checkInDate}</td>
            <td class="p-3 border">${b.checkOutDate}</td>
            <td class="p-3 border">${b.totalPrice}</td>
            <td class="p-3 border font-semibold ${getStatusColor(b.status)}">
                ${b.status}
            </td>
            <td class="p-3 border">
                <select class="status-select border p-1">
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PAID">PAID</option>
                    <option value="CHECKED_IN">CHECKED_IN</option>
                    <option value="CHECKED_OUT">CHECKED_OUT</option>
                    <option value="CANCELLED">CANCELLED</option>
                </select>
                <button class="update-btn bg-blue-500 text-white px-2 py-1 rounded ml-2">
                    Update
                </button>
            </td>
        `;

        // set status hiện tại
        row.querySelector(".status-select").value = b.status;

        // event update
        row.querySelector(".update-btn").addEventListener("click", () => {
            const newStatus = row.querySelector(".status-select").value;
            updateStatus(b.id, newStatus);
        });

        tbody.appendChild(row);
    }
}

/* ================= LOAD ================= */
document.addEventListener("DOMContentLoaded", fetchBookings);