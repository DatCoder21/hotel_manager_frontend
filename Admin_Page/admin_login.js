document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorBox = document.getElementById("loginError");

    errorBox.classList.add("hidden");

    if (!username || !password) {
        errorBox.innerText = "Please enter username and password.";
        errorBox.classList.remove("hidden");
        return;
    }

    try {
        const res = await axios.post(`${API_BASE}/api/users/login`, {
            username: username,
            password: password
        });

        // Lưu JWT
        localStorage.setItem("token", res.data.token);

        // Đánh dấu đã login
        localStorage.setItem("isLoggedIn", "true");

        // Quay về trang chủ
        window.location.href = "../Admin_Page/dashboard.html";


    } catch (err) {
        errorBox.innerText = "Login failed. Check username/password.";
        errorBox.classList.remove("hidden");
        console.error(err);
    }
});
