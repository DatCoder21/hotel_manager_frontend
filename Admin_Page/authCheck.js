document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");

    // Không có token → về login
    if (!token) {
        window.location.href = "admin_loginPage.html";
        return;
    }

    try {
        const res = await axios.get(`${API_BASE}/api/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const user = res.data;

        console.log("User:", user);

        // Lấy role từ backend
        const role = user.role; // hoặc user.roles

        // Không phải admin/staff → cút
        if (!role || (!role.includes("ADMIN") && !role.includes("STAFF"))) {
            window.location.href = "admin_loginPage.html";
        }

    } catch (err) {
        console.error("Auth error:", err);

        // Token sai / hết hạn
        localStorage.removeItem("token");

        window.location.href = "admin_loginPage.html";
    }

});