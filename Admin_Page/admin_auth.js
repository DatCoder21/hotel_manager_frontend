document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const guestNav = document.getElementById("guestNav");
    const memberNav = document.getElementById("memberNav");

    if (token) {
        // Đã login
        guestNav.classList.add("hidden");
        memberNav.classList.remove("hidden");


    } else {
        // Chưa login
        guestNav.classList.remove("hidden");
        memberNav.classList.add("hidden");
    }
});

function logout() {
    // Xoá trạng thái đăng nhập
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    // Quay về trang chủ
    window.location.href = "../Admin_Page/dashboard.html";
}

