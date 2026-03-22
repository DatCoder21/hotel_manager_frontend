// Danh sách enum
const categories = [
    "SINGLE_1P_STANDARD",
    "SINGLE_1P_DELUXE",
    "SINGLE_1P_SUITE",
    "DOUBLE_2P_STANDARD",
    "DOUBLE_2P_DELUXE",
    "DOUBLE_2P_SUITE",
    "TRIPLE_3P_STANDARD",
    "TRIPLE_3P_DELUXE",
    "TRIPLE_3P_SUITE",
    "FAMILY_4P_STANDARD",
    "FAMILY_4P_DELUXE",
    "FAMILY_4P_SUITE"
];

// map ảnh
function getImage(category) {
    return `../images/rooms/${category}.jpg`;
}

// gọi API
async function getRoomType(category) {
    try {
        const res = await axios.get(`${API_BASE}/api/room-types/${category}`);
        return res.data;
    } catch (err) {
        console.error(category, err);
        return [];
    }
}

// render
async function renderAllRooms() {
    const container = document.getElementById("roomList");
    container.innerHTML = "Loading...";

    let allRooms = [];

    for (let category of categories) {
        const data = await getRoomType(category);
        if (data && data.length > 0) {
            allRooms = allRooms.concat(data);
        }
    }

    if (allRooms.length === 0) {
        container.innerHTML = "<p>No Data</p>";
        return;
    }

    container.innerHTML = allRooms.map(room => `
        <div class="bg-white shadow-lg rounded overflow-hidden">

            <!-- IMAGE -->
            <div class="h-56 overflow-hidden">
                <img src="${getImage(room.category)}"
                     onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'"
                     class="w-full h-full object-cover">
            </div>

            <!-- CONTENT -->
            <div class="p-5">

                <h3 class="text-xl font-bold mb-2">
                    ${formatCategory(room.category)}
                </h3>

                <p class="text-gray-500 mb-4">
                    Giá: <span class="text-blue-900 font-bold">
                        VND${room.price}
                    </span>
                </p>

                <button 
                    onclick="openBookingModal('${room.category}')"
                    class="w-full text-white py-2 rounded"
                    style="background-color: #c5a059;">
                    Book Now
                </button>

            </div>
        </div>
    `).join("");
}

// format đẹp
function formatCategory(category) {
    return category
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
}

// booking
function bookRoom(id) {
    alert("Đặt phòng ID: " + id);
}

// load
renderAllRooms();



let selectedCategory = null;

// mở modal
function openBookingModal(category) {

    const token = localStorage.getItem("token");

    // Chưa login
    if (!token) {
        window.location.href = "/Login_Page/login.html";
        return;
    }

    selectedCategory = category;

    document.getElementById("bookingModal").classList.remove("hidden");
    document.getElementById("bookingModal").classList.add("flex");
}

// đóng modal
function closeModal() {
    document.getElementById("bookingModal").classList.add("hidden");
}

// submit booking
async function submitBooking() {

    const token = localStorage.getItem("token");

    const checkInDate = document.getElementById("checkIn").value;
    const checkOutDate = document.getElementById("checkOut").value;
    const note = document.getElementById("note").value;

    if (!checkInDate || !checkOutDate) {
        alert("Please select dates");
        return;
    }

    try {
        // 🔥 B1: tìm room available theo category + date
        const roomRes = await axios.get(
            `${API_BASE}/api/rooms/available`,
            {
                params: {
                    category: selectedCategory,
                    checkIn: checkInDate,
                    checkOut: checkOutDate
                }
            }
        );

        const availableRooms = roomRes.data;

        if (!availableRooms || availableRooms.length === 0) {
            alert("No available rooms!");
            return;
        }

        // lấy room đầu tiên
        const roomId = availableRooms[0].id;

        // 🔥 B2: tạo booking
        const bookingRes = await axios.post(
            `${API_BASE}/api/bookings`,
            {
                checkInDate,
                checkOutDate,
                note,
                roomId
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        alert("Booking success!");
        console.log(bookingRes.data);

        closeModal();

    } catch (err) {
        console.error(err);
        alert("Booking failed!");
    }
}

function mapRoomCategory(type, people) {
    return ``
        + (people === "1" ? "SINGLE_1P_" :
           people === "2" ? "DOUBLE_2P_" :
           people === "3" ? "TRIPLE_3P_" :
           "FAMILY_4P_")
        + type;
}

async function findRooms() {

    const checkIn = document.getElementById("checkInInput").value;
    const checkOut = document.getElementById("checkOutInput").value;
    const people = document.getElementById("peopleSelect").value;
    const type = document.getElementById("typeSelect").value;

    if (!checkIn || !checkOut) {
        alert("Please select dates");
        return;
    }

    const category = mapRoomCategory(type, people);

    try {
        const res = await axios.get(`${API_BASE}/api/rooms/available`, {
            params: {
                category,
                checkIn,
                checkOut
            }
        });

        renderRooms(res.data, category);

    } catch (err) {
        console.error(err);
        alert("Error loading rooms");
    }
}

function renderRooms(rooms, category) {

    const container = document.getElementById("searchRoomList");

    if (!rooms || rooms.length === 0) {
        container.innerHTML = "<p>No rooms available</p>";
        return;
    }

    container.innerHTML = rooms.map(room => `
        <div class="bg-white shadow-xl rounded overflow-hidden">

            <img src="${getImage(room.category || category)}"
                onerror="this.src='https://via.placeholder.com/400x300'"
                 class="w-full h-56 object-cover">

            <div class="p-4">

                <h3 class="text-lg font-bold mb-2">
                    ${formatCategory(category)}
                </h3>

                <p class="text-gray-500">
                    Room: ${room.roomNumber}
                </p>

                <p class="text-[#c5a059] font-bold text-xl mb-3">
                    $${room.price}
                </p>

                <button 
                    onclick="openBookingPopup(${room.id})"
                    class="w-full py-2 text-white"
                    style="background-color:#c5a059;">
                    Book Now
                </button>

            </div>
        </div>
    `).join("");
}

function formatCategory(category) {
    return category
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
}

let pendingRoomId = null;

// Mở popup
function openBookingPopup(roomId) {
    pendingRoomId = roomId;
    document.getElementById("popupNote").value = "";
    document.getElementById("bookingPopup").classList.remove("hidden");
}

// Đóng popup
function closePopup() {
    document.getElementById("bookingPopup").classList.add("hidden");
}

// Confirm đặt phòng
async function confirmBooking() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/Login_Page/login.html";
        return;
    }

    const checkIn = document.getElementById("checkInInput").value;
    const checkOut = document.getElementById("checkOutInput").value;
    const note = document.getElementById("popupNote").value;

    if (!checkIn || !checkOut) {
        alert("Please select check-in and check-out date");
        return;
    }

    try {
        await axios.post(`${API_BASE}/api/bookings`, {
            roomId: pendingRoomId,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            note
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        closePopup();
        showResultPopup("Success", "Booking success!");

    } catch (err) {
        console.error(err);
        showResultPopup("Error", "Booking failed!");
    }
}

function showResultPopup(title, message) {
    document.getElementById("resultTitle").innerText = title;
    document.getElementById("resultMessage").innerText = message;
    document.getElementById("resultPopup").classList.remove("hidden");
}

function closeResultPopup() {
    document.getElementById("resultPopup").classList.add("hidden");
}