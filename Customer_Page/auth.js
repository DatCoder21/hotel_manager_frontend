document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const guestNav = document.getElementById("guestNav");
    const memberNav = document.getElementById("memberNav");

    if (token) {
        // Đã login
        guestNav.classList.add("hidden");
        memberNav.classList.remove("hidden");

        // Hiển thị chữ cái avatar
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.fullName) {
            const initials = user.fullName
                .split(" ")
                .map(w => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

            document.getElementById("avatarInitial").innerText = initials;
        }

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
    window.location.href = "../Customer_Page/TheArtisanHomePage.html";
}