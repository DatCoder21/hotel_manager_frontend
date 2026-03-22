document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const errorBox = document.getElementById("signupError");
    const successBox = document.getElementById("signupSuccess");

    errorBox.classList.add("hidden");
    successBox.classList.add("hidden");

    const firstName = document.getElementById("firstName").value.trim();
    const lastName  = document.getElementById("lastName").value.trim();
    const username  = document.getElementById("username").value.trim();
    const password  = document.getElementById("password").value.trim();
    const email     = document.getElementById("email").value.trim();
    const phone     = document.getElementById("phone").value.trim();
    const agree     = document.getElementById("agree").checked;

    if (!agree) {
        errorBox.innerText = "You must agree to the terms.";
        errorBox.classList.remove("hidden");
        return;
    }

    const fullName = `${firstName} ${lastName}`;

    try {
        await axios.post(`${API_BASE}/api/users`, {
            fullName,
            username,
            password,
            email,
            phone
        });

        successBox.innerText = "Registration successful! Redirecting to login...";
        successBox.classList.remove("hidden");

        setTimeout(() => {
            window.location.href = "../Login_Page/login.html";
        }, 1500);

    } catch (err) {
        errorBox.innerText = "Registration failed. Username or email may exist.";
        errorBox.classList.remove("hidden");
        console.error(err);
    }
});