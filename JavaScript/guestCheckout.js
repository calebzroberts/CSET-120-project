let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartSummary = document.getElementById("cartSummary");
const downloadPDFBtn = document.getElementById("downloadPDF");
const guestCheckoutForm = document.getElementById("guestCheckoutForm");

// Display cart items
function displayCart(){
    if (cart.length === 0){
        cartSummary.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    let html = "<ul>";
    let total = 0;

    cart.forEach(item => {
        html += `<li>${item.itemName} - $${item.itemPrice} x ${item.itemQuantity}</li>`;
        total += item.itemPrice * item.itemQuantity;
    });
    html += `</ul><p><strong>Total: $${total.toFixed(2)}</strong></p>`;

    cartSummary.innerHTML = html;
}

// Handle form submission
guestCheckoutForm.addEventListener("submit", function(e){
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!firstName || !lastName || !email){
        alert("All fields are required!");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.itemPrice * item.itemQuantity, 0);

    const order = {
        customerEmail: email,
        customerFirstName: firstName,
        customerLastname: lastName,
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
});

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

        doc.save("WackyBurger_Receipt.pdf");
    });
}

displayCart();