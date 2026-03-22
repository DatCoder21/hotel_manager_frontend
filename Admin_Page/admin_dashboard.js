const axiosInstance = axios.create({
    baseURL: `${API_BASE}/api`,
    headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
    }
});

function processMonthlyData(bookings) {
    const monthlyBookings = Array(12).fill(0);
    const monthlyRevenue = Array(12).fill(0);

    bookings.forEach(b => {
        if (!b.checkInDate) return;

        const d = new Date(b.checkInDate);
        const month = d.getMonth();

        monthlyBookings[month] += 1;
        monthlyRevenue[month] += b.totalPrice || 0;
    });

    return { monthlyBookings, monthlyRevenue };
}

async function loadDashboard() {
    try {
        const [
            bookingsRes,
            roomsRes,
            customersRes,
            staffRes
        ] = await Promise.all([
            axiosInstance.get("/bookings"),
            axiosInstance.get("/rooms"),
            axiosInstance.get("/users/customer"),
            axiosInstance.get("/users/staff")
        ]);

        const bookings = bookingsRes.data;
        const rooms = roomsRes.data;
        const customers = customersRes.data;
        const staff = staffRes.data;

        // ===== FILTER THÁNG =====
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyBookings = bookings.filter(b => {
            if (!b.checkInDate) return false;
            const d = new Date(b.checkInDate);
            return d.getMonth() === currentMonth &&
                   d.getFullYear() === currentYear;
        });

        // ===== STATS =====
        document.getElementById("totalRooms").innerText = rooms.length;
        document.getElementById("totalBookings").innerText = monthlyBookings.length;

        const revenue = monthlyBookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
        document.getElementById("totalRevenue").innerText = "$" + revenue;

        // khách unique
        const uniqueCustomers = new Set(
            monthlyBookings.map(b => b.guestName)
        );
        document.getElementById("totalCustomers").innerText = uniqueCustomers.size;

        document.getElementById("totalStaff").innerText = staff.length;

        // foods
        let totalFoods = 0;
        const categories = ["FOOD", "DRINK"];

        for (let c of categories) {
            try {
                const res = await axiosInstance.get(`/foods/category/${c}`);
                totalFoods += res.data.length;
            } catch (e) {}
        }

        document.getElementById("totalFoods").innerText = totalFoods;

        // rooms not available
        const notAvailableRooms = rooms.filter(r =>
            r.status !== "AVAILABLE"
        ).length;

        document.getElementById("notAvailableRooms").innerText = notAvailableRooms;

        // ===== CHART =====
        const { monthlyBookings: chartBookings, monthlyRevenue } =
            processMonthlyData(bookings);

        renderChart(chartBookings, monthlyRevenue);

    } catch (err) {
        console.error("Dashboard error:", err);
    }
}

function renderChart(bookings, revenue) {
    const ctx = document.getElementById("bookingChart");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "Jan","Feb","Mar","Apr","May","Jun",
                "Jul","Aug","Sep","Oct","Nov","Dec"
            ],
            datasets: [
                {
                    label: "Bookings",
                    data: bookings
                },
                {
                    label: "Revenue",
                    data: revenue,
                    type: "line"
                }
            ]
        }
    });
}

// chỉ gọi 1 lần
loadDashboard();