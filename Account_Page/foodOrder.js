const token = localStorage.getItem("token");
const bookingId = localStorage.getItem("bookingId");

document.getElementById("bookingIdText").innerText = bookingId;

// axios
const api = axios.create({
    baseURL: `${API_BASE}/api`,
    headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// load default
loadFoods("APPETIZER");

/*  CATEGORY STYLE  */
document.querySelectorAll(".category-btn").forEach(btn => {
    btn.classList.add(
        "px-6","py-2","border","border-white/20",
        "rounded-full","hover:border-gold","hover:text-gold",
        "transition","duration-300"
    );
});

/*  LOAD FOODS  */
function loadFoods(category) {
    api.get(`/foods/category/${category}`)
        .then(res => renderFoods(res.data))
        .catch(err => console.error(err));
}
function getImage(id) {
    return `../images/foods/${id}.png`;
}

/*  RENDER  */
function renderFoods(foods) {
    const container = document.getElementById("foodList");
    container.innerHTML = "";

    foods.forEach(f => {
        container.innerHTML += `
        <div class="group cursor-pointer">

            <!-- IMAGE -->
            <div class="w-56 h-56 mx-auto mb-6 rounded-full overflow-hidden border border-gold p-2">
                <img src="${getImage(f.id)}"
                class="w-full h-full object-cover rounded-full group-hover:scale-125 transition duration-700">
            </div>

            <!-- CONTENT -->
            <div class="text-center space-y-3">
                <h3 class="text-2xl italic gold">${f.foodName}</h3>

                <p class="text-white/50">
                    ${f.price.toLocaleString()} VND
                </p>

                <!-- QTY -->
                <input type="number" min="1" value="1"
                    id="qty-${f.id}"
                    class="bg-transparent border border-white/20 px-4 py-2 text-center w-24">

                <!-- BUTTON -->
                <div>
                    <button onclick="orderFoodItem(${f.id})"
                        class="mt-3 px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-black transition duration-300">
                        Add to Booking
                    </button>
                </div>
            </div>
        </div>
        `;
    });
}

/*  ORDER  */
function orderFoodItem(foodId) {
    const qty = document.getElementById(`qty-${foodId}`).value;

    api.post(`/invoices/booking/${bookingId}/foods/${foodId}`, null, {
        params: { quantity: qty }
    })
    .then(() => {
        alert("✨ Added to your booking!");
    })
    .catch(err => {
        console.error(err);
        alert("Error ordering food");
    });
}

function openHistory() {
    document.getElementById("historyModal").classList.remove("hidden");
    loadHistory();
}

function closeHistory() {
    document.getElementById("historyModal").classList.add("hidden");
}

function loadHistory() {
    api.get(`/invoices/booking/${bookingId}/history`)
        .then(res => renderHistory(res.data))
        .catch(err => console.error(err));
}

function renderHistory(data) {
    const container = document.getElementById("historyList");
    container.innerHTML = "";

    if (!data || data.length === 0) {
        container.innerHTML = `
            <p class="text-white/50 text-center">No orders yet</p>
        `;
        return;
    }

    data.forEach(item => {
        container.innerHTML += `
        <div class="border border-white/10 p-6 flex justify-between items-center">

            <div>
                <h3 class="text-xl gold">${item.foodName}</h3>
                <p class="text-white/50 text-sm">
                    Quantity: ${item.quantity}
                </p>
            </div>

        </div>
        `;
    });
}