let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartSummary = document.getElementById("cartSummary");

// Get logged-in user info from the local storage
const currentUser = {
    email: localStorage.getItem("currentEmail") || "",
    firstName: localStorage.getItem("currentFirstName") || "",
    lastName: localStorage.getItem("currentLastName") || ""
};

const deliveryFee = 5.00;
const deliveryProgress = document.getElementById("deliveryProgress");
const deliveryProgressText = document.getElementById("deliveryProgressText");

// Delivery Address Toggle
function toggleAddressField(){
    const pickupDelivery = document.getElementById("pickupDelivery").value;
    let addressField = document.getElementById("deliveryAddress");

    if(pickupDelivery === "delivery"){
        if(!addressField){
            addressField = document.createElement("input");
            addressField.type = "text";
            addressField.id = "deliveryAddress"
            addressField.placeholder = "Delivery Address"
            addressField.required = true;
            addressField.value = localStorage.getItem("currentAddress") || "";
            cartSummary.insertAdjacentElement("afterend", addressField);
        }
    } else{
        if (addressField) addressField.remove();
    }
}

// Run when page loads
document.getElementById("pickupDelivery").addEventListener("change", toggleAddressField);

// Display cart items and user information
function displayCart(){
    if (cart.length === 0){
        cartSummary.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    let html = "<ul>";
    let subtotal = 0;

    cart.forEach(item => {
        html += `<li>${item.itemName} - $${item.itemPrice} x ${item.itemQuantity}</li>`;
        subtotal += item.itemPrice * item.itemQuantity;
    });

    html += `</ul><p><strong>Subtotal: $${subtotal.toFixed(2)}</strong></p>`;
    html += `<p><strong>Delivery Fee: $${deliveryFee.toFixed(2)}</strong></p>`
    html += `<p><strong>Total: $${(subtotal + deliveryFee).toFixed(2)}</strong></p>`
    html += `<h3>Ordering as: ${currentUser.firstName} (${currentUser.email})</h3>`;
    html += `<button id="placeOrder">Place Order</button>`;
    cartSummary.innerHTML = html;

    deliveryProgress.value = subtotal > deliveryFee ? deliveryFee : subtotal;
    deliveryProgressText.innerText = `$${Math.min(subtotal, deliveryFee).toFixed(2)} / $5.00`;

    document.getElementById("placeOrder").addEventListener("click", placeOrder);
    toggleAddressField();
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
        customerAddress: pickupOrDelivery === "delivery" ? document.getElementById("deliveryAddress").value.trim() : "",
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


// Delivery Address Auto-Show
document.addEventListener("DOMContentLoaded", () => {
    const pickupOrDeliverySelect = document.getElementById("pickupDelivery");
    const deliveryContainer = document.getElementById("deliveryAddressContainer")

    if(!pickupOrDeliverySelect || !deliveryContainer) return;

    const updateDeliveryVisibility = () => {
        if (pickupOrDeliverySelect.value === "delivery"){
            deliveryContainer.style.display = "block";
            deliveryContainer.style.maxHeight = "300px";
            deliveryContainer.style.opacity = "1";
        } else{
            deliveryContainer.style.maxHeight ="0";
            deliveryContainer.style.opacity = "0";
            setTimeout(() => {
                if (pickupOrDeliverySelect.value !== "delivery"){
                    deliveryContainer.style.display = "none";
                }
            }, 300);
        }
    };
    pickupOrDeliverySelect.addEventListener("change", updateDeliveryVisibility);
    updateDeliveryVisibility();
});