let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartSummary = document.getElementById("cartSummary");
const guestCheckoutForm = document.getElementById("guestCheckoutForm");


const deliveryFee = 5.00;
const deliveryProgress = document.getElementById("deliveryProgress");
const deliveryProgressText = document.getElementById("deliveryProgressText");

function updateDeliveryProgress(subtotal){
    const value = Math.min(subtotal, deliveryFee);
    progressBar.value = value;
    deliveryProgressText.textContent = `$${value.toFixed(2)} / $${deliveryFee.toFixed(2)}`;
}

// Display cart items
function displayCart(){
    if (cart.length === 0){
        cartSummary.innerHTML = "<p>Your cart is empty.</p>";
        deliveryProgress.value = 0;
        deliveryProgress.value = 0;
        return;
    }

    let html = "<ul>";
    let total = 0;

    cart.forEach(item => {
        html += `<li>${item.itemName} - $${item.itemPrice} x ${item.itemQuantity}</li>`;
        total += item.itemPrice * item.itemQuantity;
    });
    html += `</ul><p><strong>Subtotal: $${subtotal.toFixed(2)}</strong></p>`;
    html += `<p><strong>Delivery Fee: $${deliveryFee.toFixed(2)}</strong></p>`;
    html += `<p><strong>Total: $${(subtotal + deliveryFee).toFixed(2)}</strong></p>`;
    cartSummary.innerHTML = html;

    deliveryProgress.value = subtotal > deliveryFee ? deliveryFee : subtotal;
    deliveryProgressText.innerText = `$${Math.min(subtotal, deliveryFee).toFixed(2)} / $5.00`;
}

// Handle form submission
guestCheckoutForm.addEventListener("submit", function(e){
    e.preventDefault();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const pickupOrDelivery = document.getElementById("pickupDelivery").value;
    const deliveryAddress = pickupOrDelivery === "delivery" ? document.getElementById("deliveryAddress").value.trim() : "";

    if (!firstName || !lastName || !email){
        alert("All fields are required!");
        return;
    }

    if(pickupOrDelivery === "delivery" && !deliveryAddress){
        alert("Please enter your delivery address!")
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.itemPrice * item.itemQuantity, 0);
    const total = subtotal + deliveryFee;

    const order = {
        orderId:Date.now(),
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
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
});

displayCart();