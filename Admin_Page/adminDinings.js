const api = axios.create({
    baseURL: `${API_BASE}/api`,
    headers: {
        "Content-Type": "application/json"
    }
});
let currentFoodId = null;

api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/*  LOAD FOODS  */
function loadFoods(category) {
    api.get(`/foods/category/${category}`)
        .then(res => renderFoods(res.data))
        .catch(err => console.error(err));
}

/*  RENDER  */
function renderFoods(foods) {
    const tbody = document.getElementById("foodTable");
    tbody.innerHTML = "";

    foods.forEach(f => {
        tbody.innerHTML += `
        <tr>
            <td class="p-3 border">${f.id}</td>
            <td class="p-3 border">${f.foodName}</td>
            <td class="p-3 border">${f.price}</td>
            <td class="p-3 border">${f.number}</td>
            <td class="p-3 border">${f.category}</td>
            <td class="p-3 border space-x-2">

                <button onclick="openStockModal(${f.id})"
                class="bg-blue-500 text-white px-2 py-1 rounded">
                + Stock
            </button>
            
            <button onclick="editPrice(${f.id})"
                class="bg-yellow-500 text-white px-2 py-1 rounded">
                Edit Price
            </button>
            
            <button onclick="openDeleteModal(${f.id})"
                class="bg-red-500 text-white px-2 py-1 rounded">
                Delete
            </button>

            </td>
        </tr>
        `;
    });
}

/*  ADD  */
function addFood() {
    const data = {
        foodName: document.getElementById("name").value,
        price: document.getElementById("price").value,
        number: document.getElementById("number").value,
        foodTypeId: document.getElementById("type").value
    };

    api.post("/foods", data)
        .then(() => {
            alert("Added!");
            loadFoods("APPETIZER");
        })
        .catch(err => {
            console.error(err);
            alert("Error adding");
        });
}

/*  INCREASE  */
function increase(id) {
    const amount = prompt("Enter amount:");

    if (!amount) return;

    api.put(`/foods/${id}/increase`, null, {
        params: { amount: amount }
    })
    .then(() => {
        alert("Updated!");
        loadFoods("APPETIZER");
    })
    .catch(err => console.error(err));
}

/*  DELETE  */
function deleteFood(id) {
    if (!confirm("Delete this food?")) return;

    api.delete(`/foods/${id}`)
        .then(() => {
            alert("Deleted!");
            loadFoods("APPETIZER");
        })
        .catch(err => console.error(err));
}

/*  INIT  */
document.addEventListener("DOMContentLoaded", () => {
    loadFoods("APPETIZER");
});

function editPrice(id) {
    currentFoodId = id;

    document.getElementById("priceModal").classList.remove("hidden");

    // reset input
    document.getElementById("newPriceInput").value = "";
}

function submitPrice() {
    const price = document.getElementById("newPriceInput").value;

    if (!price) return;

    api.put(`/foods/${currentFoodId}/price`, null, {
        params: { price: price }
    })
    .then(() => {
        closeModal();
        loadFoods("APPETIZER");
    })
    .catch(err => {
        console.error(err);
        alert("Error updating price");
    });
}

function closeModal() {
    document.getElementById("priceModal").classList.add("hidden");
    window.addEventListener("click", (e) => {
        const modal = document.getElementById("priceModal");
    
        if (e.target === modal) {
            closeModal();
        }
    });
}

function openStockModal(id) {
    currentFoodId = id;
    document.getElementById("stockModal").classList.remove("hidden");
}

function closeStockModal() {
    document.getElementById("stockModal").classList.add("hidden");
}

function submitStock() {
    const amount = document.getElementById("stockInput").value;

    if (!amount) return;

    api.put(`/foods/${currentFoodId}/increase`, null, {
        params: { amount: amount }
    })
    .then(() => {
        closeStockModal();
        loadFoods("APPETIZER");
    })
    .catch(err => console.error(err));
}

function openDeleteModal(id) {
    currentFoodId = id;
    document.getElementById("deleteModal").classList.remove("hidden");
}

function closeDeleteModal() {
    document.getElementById("deleteModal").classList.add("hidden");
}

function confirmDelete() {
    api.delete(`/foods/${currentFoodId}`)
        .then(() => {
            closeDeleteModal();
            loadFoods("APPETIZER");
        })
        .catch(err => console.error(err));
}