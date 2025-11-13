const receiptContainer = document.getElementById("receiptContainer");
const downloadPDFBtn = document.getElementById("downloadPDF");

// Load order from local storage
const order = JSON.parse(localStorage.getItem("currentOrder"));

if (!order){
    receiptContainer.innerHTML = "<p>No recent order found.</p>"
} else{
    let html = `
    <h2>Thank you for your purchase!</h2>
    <p><strong>Date: </strong>${order.date || new Date().toLocaleString()}</p>
    <p><strong>Customer: </strong>${order.customerName} (${order.customerEmail})</p>
    <p><strong>Pickup or Delivery: </strong>${order.pickupOrDelivery}</p>
    <ul>
        ${order.items.map(i => `<li>${i.itemName} - $${i.itemPrice.toFixed(2)} x ${i.itemQuantity} = $${(i.itemPrice * i.itemQuantity).toFixed(2)}</li>`).join('')}
    </ul>
    <p><strong>Subtotal: $${order.subtotal.toFixed(2)}</strong></p>
    <p><strong>Delivery Fee: $${order.deliveryFee.toFixed(2)}</strong></p>
    <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
    `;
    receiptContainer.innerHTML = html;
}

// PDF download
if (downloadPDFBtn && order){
    downloadPDFBtn.addEventListener("click", () => {
        const {jsPDF} = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Wacky Burger Receipt", 10, 10);

        let y = 20;
        doc.setFontSize(12);
        doc.text(`Date: ${order.date || new Date().toLocaleString()}`, 10, y); y += 10;
        doc.text(`Customer: ${order.customerName}`, 10, y); y += 10;
        doc.text(`Pickup or Delivery: ${order.pickupOrDelivery}`, 10, y); y += 10;
        
        if(order.pickupOrDelivery === "delivery" && order.customerAddresss){
            doc.text(`Delivery Address: ${order.customerAddress}`, 10, y); y += 10;
        }
        
        order.items.forEach(item =>{
            const itemTotal = item.itemPrice * item.itemQuantity;
            doc.text(`${item.itemName} x${item.itemQuantity} - $${itemTotal.toFixed(2)}`, 10, y);
            y += 10;
        });
        
        doc.text(`Subtotal: $${order.subtotal.toFixed(2)}`, 10, y += 10);
        doc.text(`Delivery Fee: $${order.deliveryFee.toFixed(2)}`, 10, y += 10);
        doc.text(`Total: $${order.total.toFixed(2)}`, 10, y += 10);
        
        doc.save("WackyBurger_Receipt.pdf");
    });
}