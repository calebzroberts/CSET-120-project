let cart = JSON.parse(localStorage.getItem("cart")) || [];
const receiptContainer = document.getElementById("cartSummary");

// Get logged-in user info from the local storage
const currentUser = {
    email: localStorage.getItem("currentEmail") || "",
    firstName: localStorage.getItem("currentFirstName") || "",
    lastName: localStorage.getItem("currentLastName") || ""
};

const deliveryFee = 5.00;
const deliveryProgress = document.getElementById("deliveryProgress");
const deliveryProgressText = document.getElementById("deliveryProgressText");

function updateDeliveryProgress(subtotal){
    const value = Math.min(subtotal, deliveryFee);
    progressBar.value = value;
    deliveryProgressText.textContent = `$${value.toFixed(2)} / $${deliveryFee.toFixed(2)}`;
}

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
        subtotal += item.itemPrice * item.itemQuantity;
    });

    html += `</ul><p><strong>Subtotal: $${subtotal.toFixed(2)}</strong></p>`;
    html += `<p><strong>Delivery Fee: $${deliveryFee.toFixed(2)}</strong></p>`
    html += `<p><strong>Total: $${(subtotal + deliveryFee),toFixed(2)}</strong></p>`
    html += `<h3>Ordering as: ${currentUser.firstName} (${currentUser.email})</h3>`;
    html += `<button id="placeOrder">Place Order</button>`;
    receiptContainer.innerHTML = html;

    deliveryProgress.value = subtotal > deliveryFee ? deliveryFee : subtotal;
    deliveryProgressText.innerText = `$${Math.min(subtotal, deliveryFee).toFixed(2)} / $5.00`;

    document.getElementById("placeOrder").addEventListener("click", placeOrder);
}

// Handle form submission
function placeOrder(){
    if (!currentUser.email){
        alert("No logged-in user detected. Please log in.");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.itemPrice * item.itemQuantity, 0);
    const total = subtotal + deliveryFee
    const pickupOrDelivery = document.getElementById("pickupDelivery").value;
    const deliveryAddress = pickupOrDelivery === "delivery" ? document.getElementById("deliveryAddress").value.trim() : "";

    if(pickupOrDelivery === "delivery" && !deliveryAddress){
        alert("Please enter your delivery address!");
        return;
    }

    if(pickupOrDelivery === "delivery"){
        localStorage.setItem("currentAddress", deliveryAddress);
    }

    const order = {
        orderId:Date.now(),
        customerName: `${currentUser.firstName} ${currentUser.lastName}`,
        customerEmail: currentUser.email,
        items: cart.map(i => ({
            itemName: i.itemName,
            itemPrice: i.itemPrice,
            itemQuantity: i.itemQuantity
        })),
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        fulfilled: false,
        placementDate: new Date().toLocaleDateString(),
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