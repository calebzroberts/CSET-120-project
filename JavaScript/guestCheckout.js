const cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartSummary = document.getElementById("cartSummary");

// Display cart items
function displayCart(){
    if (cart.length === 0){
        cartSummary.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    let html = "<ul>";
    let total = 0;

    for (let item of cart){
        html += `<li>${item.itemName} - $${item.itemPrice} x ${item.itemQuantity}</li>`;
        total += item.itemPrice * itemQuantity;
    }
    html += `<ul><p><strong>Total: $${total.toFixed(2)}</strong></p>`;

    cartSummary.innerHTML = html;
}

// Handle form submission
document.getElementById("guestCheckoutForm").addEventListener("submit", function(e){
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
}