let currentInvoiceId = null;

/* VIEW INVOICE */
function viewInvoice(bookingId) {
    axios.get(`${API_BASE}/api/invoice-management/booking/${bookingId}`)
        .then(res => {
            const invoice = res.data?.data || res.data;
        
            if (!invoice) {
                alert("No invoice found!");
                return;
            }
        
            currentInvoiceId = invoice.invoiceId;
        
            // Render items
            const itemsHtml = invoice.items?.map(item => `
                <div class="flex justify-between">
                    <span>${item.foodName} x${item.quantity}</span>
                    <span>${formatMoney(item.subtotal)}</span>
                </div>
            `).join("") || "";

            document.getElementById("invoiceContent").innerHTML = `
                <div class="flex justify-between">
                    <span>Invoice ID:</span>
                    <span>#${invoice.invoiceId}</span>
                </div>

                <div class="flex justify-between">
                    <span>Date:</span>
                    <span>${new Date().toLocaleDateString("vi-VN")}</span>
                </div>

                <div class="border-t my-2"></div>

                ${itemsHtml}

                <div class="border-t my-2"></div>

                <div class="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>${formatMoney(invoice.totalAmount)}</span>
                </div>
            `;
    
        document.getElementById("invoiceModal").classList.remove("hidden");
    })
        .catch(err => {
            console.error(err);
            alert("Cannot load invoice");
        });
}

/* PAY INVOICE */
function payInvoice() {
    if (!currentInvoiceId) return;

    axios.post(`${API_BASE}/api/invoice-management/${currentInvoiceId}/pay`)
        .then(() => {
            // alert("Payment successful!");

            // hiện thông báo UI
            const status = document.getElementById("paymentStatus");
            status.classList.remove("hidden");

            // disable nút
            const payBtn = document.getElementById("payBtn");
            payBtn.disabled = true;
            payBtn.innerText = "Paid";

        
        })
        .catch(err => {
            console.error(err);
            alert("Payment failed!");
        });
}

/* CLOSE MODAL */
function closeInvoice() {
    document.getElementById("invoiceModal").classList.add("hidden");
}

/* INIT BUTTON */
document.addEventListener("DOMContentLoaded", () => {
    const payBtn = document.getElementById("payBtn");
    if (payBtn) {
        payBtn.onclick = payInvoice;
    }
});

/* HELPERS */
function formatMoney(amount) {
    if (!amount) return "0đ";
    return amount.toLocaleString("vi-VN") + "đ";
}