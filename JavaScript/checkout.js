const order = JSON.parse(localStorage.getItem("currentOrder"));
const container = document.getElementById("receiptContainer");

if (!order){
    container.innerHTML = "<p>No order found!</p>";
} 
else{
    let html = "<h2>Order Receipt</h2>"
    html += `<p>Date: ${order.date}</p>;`
    html += `<p>Customer: ${order.customerFirstName || ''} ${order.customerLastName || ''} (${order.customerEmail})</p>`;
    
    html += `<table border = "1" cellspacing = "0" cellpadding = "5">
    <tr>
        <th>Item</th>
        <th>Quantity</th>
        <th>Price</th>
    </tr>`;

    order.items.forEach(item => {
        html += `<tr>
        <td>${item.itemName}</td>
        <td>${item.itemQuantity}</td>
        <td>$${(item.itemPrice * item.itemQuantity).toFixed(2)}</td>
        </tr>`;
    });

    html += `</table>`;
    html += `<h3>Total: $${order.total.toFixed(2)}</h3>`;

    container.innerHTML = html;
}

// PDF generation
document.getElementById("downloadPDF").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF;

    let y = 10;
    doc.setFontSize(16);
    doc.text("Wacky Burger Receipt", 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Date: ${order.date}`, 10, y);
    y += 10;
    doc.text(`Customer: ${order.customerFirstName || ''} ${order.customerLastName || ''} (${order.customerEmail})`, 10, y);
    y += 10;

    order.items.forEach(item => {
        order.items.forEach(item => {
            doc.text(`${item.itemName} x${item.itemQuantity} - $${(item.itemPrice * item.itemQuantity).toFixed(2)}`, 10, y);
            y += 8;
        });
        y += 5;
        doc.text(`Total: $${order.total.toFixed(2)}`, 10, y);
        
        doc.save("WackyBurger_Receipt.pdf");
});
});