const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../Login_Page/login.html";
}

const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
};

// Load profile
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await axios.get(`${API_BASE}/api/users/me`, authHeader);
        const user = res.data;

        // Lưu cache
        localStorage.setItem("user", JSON.stringify(user));

        // View mode
        document.getElementById("profileName").innerText = user.fullName;
        document.getElementById("profileRole").innerText = user.role;

        document.getElementById("v_fullName").innerText = user.fullName;
        document.getElementById("v_email").innerText = user.email;
        document.getElementById("v_phone").innerText = user.phone;
        document.getElementById("v_username").innerText = user.username;

        // Edit mode default value
        document.getElementById("e_fullName").value = user.fullName;
        document.getElementById("e_email").value = user.email;
        document.getElementById("e_phone").value = user.phone;

        // Avatar initials
        const initials = user.fullName
            .split(" ")
            .map(w => w[0])
            .join("")
            .toUpperCase()
            .slice(0,2);

        document.getElementById("avatarInitial").innerText = initials;

    } catch (err) {
        console.error(err);
    }
});

function toggleEdit(editing) {
    document.getElementById("viewMode").classList.toggle("hidden", editing);
    document.getElementById("editMode").classList.toggle("hidden", !editing);
}

async function updateProfile() {
    const msg = document.getElementById("profileMsg");

    try {
        await axios.put(`${API_BASE}/api/users/me`, {
            fullName: document.getElementById("e_fullName").value,
            email: document.getElementById("e_email").value,
            phone: document.getElementById("e_phone").value
        }, authHeader);

        msg.innerText = "Profile updated successfully!";
        msg.classList.remove("hidden");

        setTimeout(() => location.reload(), 1000);

    } catch (err) {
        console.error(err);
        msg.innerText = "Update failed.";
        msg.classList.remove("hidden");
    }
}