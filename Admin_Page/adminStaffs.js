// tạo axios instance
const api = axios.create({
    baseURL: `${API_BASE}/api`,
    headers: {
        "Content-Type": "application/json"
    }
});

// interceptor gắn token
api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// GET list
async function fetchCustomers() {
    try {
        const res = await api.get("/users/staff");
        renderCustomers(res.data);
    } catch (err) {
        console.error(err);
    }
}

// DELETE user (axios)
async function deleteUser(id) {
    try {
        await api.delete(`/users/${id}`);
        alert("Xoá thành công");
        fetchCustomers();
    } catch (err) {
        console.error(err);
        alert("Xoá thất bại");
    }
}

// render table + gắn event bằng JS (KHÔNG onclick)
function renderCustomers(customers) {
    const tbody = document.getElementById("staffTableBody");
    tbody.innerHTML = "";

    customers.forEach(user => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="p-3 border">${user.id}</td>
            <td class="p-3 border">${user.fullName}</td>
            <td class="p-3 border">${user.username}</td>
            <td class="p-3 border">${user.email}</td>
            <td class="p-3 border">${user.phone}</td>
            <td class="p-3 border">
                ${typeof user.role === 'object' ? user.role.name : user.role}
            </td>
            <td class="p-3 border">
                <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                </button>
            </td>
        `;

        // gắn event bằng axios
        row.querySelector(".delete-btn").addEventListener("click", () => {
            if (confirm("Bạn chắc chắn xoá?")) {
                deleteUser(user.id);
            }
        });

        tbody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", fetchCustomers);