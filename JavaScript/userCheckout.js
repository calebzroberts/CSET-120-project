let cart = JSON.parse(localStorage.getItem("cart")) || [];
const receiptContainer = document.getElementById("receiptContainer");

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
    const pickupOrDelivery = document.getElementById("pickupOrDelivery").value;

    const order = {
        orderId:Date.now(),
        customerName: `${currentUser.firstName} ${currentUser.lastName}`,
        customerEmail: currentUser.email,
        items: cart.map(i => ({
            itemName: i.itemName,
            itemPrice: i.itemPrice,
            itemQuantity: i.itemQuantity
        })),
        total: total,
        fulfilled: false,
        fulfilled: null,
        pickupOrDelivery: pickupOrDelivery
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    existingOrders.push(order);
    localStorage.setItem("orders", JSON.stringify(existingOrders));
    localStorage.setItem("currentOrder", JSON.stringify(order));

    alert("Order placed successfully!")
    localStorage.removeItem("cart");
    cart.length = 0;
    displayCart();

    // Redirect to receipt page
    setTimeout(() => {window.location.href = "../../receipt/index.html";}, 500);
}

displayCart();