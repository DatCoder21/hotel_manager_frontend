let allRooms = [];

// load tất cả phòng
async function loadRooms() {
    const container = document.getElementById("rooms-admin-grid");

    try {
        const res = await axios.get(`${API_BASE}/api/rooms`);
        allRooms = res.data;

        renderRooms(allRooms);

    } catch (err) {
        console.error(err);
        container.innerHTML = "<p class='text-red-500'>Cannot load rooms</p>";
    }
}

// render
function renderRooms(rooms) {
    const container = document.getElementById("rooms-admin-grid");

    if (!rooms || rooms.length === 0) {
        container.innerHTML = "<p>No rooms found</p>";
        return;
    }

    container.innerHTML = rooms.map(room => `
        <div class="bg-white rounded shadow overflow-hidden">

            <!-- CONTENT -->
            <div class="p-4">

                <h3 class="font-bold text-lg mb-2">
                    Room ${room.roomNumber}
                </h3>

                <p class="text-gray-500">
                    ${formatCategory(room.category)}
                </p>

                <p class="text-[#c5a059] font-bold text-xl my-2">
                    ${room.price} VND
                </p>

                <span class="
                    px-3 py-1 text-xs rounded
                    ${room.status === 'AVAILABLE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
                ">
                    ${room.status}
                </span>

                <!-- BUTTON -->
            <div class="mt-4 flex gap-2">
                <button onclick="updateRoomStatus(${room.id}, 'AVAILABLE')"
                    class="px-3 py-1 text-xs bg-green-500 text-white rounded">
                    Available
                </button>

                <button onclick="updateRoomStatus(${room.id}, 'BROKEN')"
                    class="px-3 py-1 text-xs bg-red-500 text-white rounded">
                    Broken
                </button>
            </div>

            </div>
        </div>
    `).join("");
}

// filter
function filterRooms(status) {

    if (status === "ALL") {
        renderRooms(allRooms);
        return;
    }

    const filtered = allRooms.filter(r => r.status === status);
    renderRooms(filtered);
}

// format category đẹp
function formatCategory(category) {
    return category
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
}

// chạy khi load
loadRooms();


async function updateRoomStatus(roomId, status) {
    const token = localStorage.getItem("token");

    try {
        await axios.put(
            `${API_BASE}/api/rooms/${roomId}/status?status=${status}`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        await loadRooms();

    } catch (err) {
        console.error("Server error:", err.response?.data);
        alert("Update failed!");
    }
}