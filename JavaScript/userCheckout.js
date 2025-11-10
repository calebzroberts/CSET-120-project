let cart = JSON.parse(localStorage.getItem("cart")) || [];
const receiptContainer = document.getElementById("receiptContainer");
const downloadPDFBtn = document.getElementById("downloadPDF");

// Get logged-in user info from the local storage
const currentUser = {
    email: localStorage.getItem("currentEmail") || "",
    firstName: localStorage.getItem("currentFirstName") || "",
    lastName: localStorage.getItem("currentLastName") || ""
};

// Display cart items and user information
function displayCart(){
    if (cart.length === 0){
        receiptContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    let html = "<ul>";
    let total = 0;

    cart.forEach(item => {
        html += `<li>${item.itemName} - $${item.itemPrice} x ${item.itemQuantity}</li>`;
        total += item.itemPrice * item.itemQuantity;
    });

    html += `</ul><p><strong>Total: $${total.toFixed(2)}</strong></p>`;
    html += `<h3>Ordering as: ${currentUser.firstName} (${currentUser.email})</h3>`;
    html += `<button id="placeOrder">Place Order</button>`;
    
    receiptContainer.innerHTML = html;

    document.getElementById("placeOrder").addEventListener("click", placeOrder);
}

// Handle form submission
function placeOrder(){
    if (!currentUser.email){
        alert("No logged-in user detected. Please log in.");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.itemPrice * item.itemQuantity, 0);

    const order = {
        customerEmail: currentUser.email,
        customerFirstName: currentUser.firstName,
        customerlastName: currentUser.lastName,
        date: new Date().toLocaleString(),
        items: cart,
        total: total
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    existingOrders.push(order);
    localStorage.setItem("orders", JSON.stringify(existingOrders));
    localStorage.setItem("currentOrder", JSON.stringify(order));

    alert("Order placed successfully!")
    localStorage.removeItem("cart");
    cart.length = 0;
    displayCart();
    setTimeout(() => {window.location.href = "../../Menu.html";}, 500);
}

// PDF download

if (downloadPDFBtn){
    downloadPDFBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Cart is empty, nothing to download.");
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Wacky Burger Receipt", 10, 10);

        let y = 20;
        let total = 0;

        cart.forEach(item => {
            const itemTotal = (item.itemPrice * item.itemQuantity).toFixed(2);
            total += Number(itemTotal);
            doc.text(`${item.itemName} x${item.itemQuantity} - $${itemTotal}`, 10, y);
            y += 10;
        });
        
        doc.text(`Total: $${total.toFixed(2)}`, 10, y + 10);

        doc.text(`Customer: ${currentUser.firstName} ${currentUser.lastName} (${currentUser.email})`, 10, y + 20);

        doc.save("WackyBurger_Receipt.pdf");
    });
}

displayCart();