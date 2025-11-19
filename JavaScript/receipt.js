const receiptContainer = document.getElementById("receiptContainer");
const downloadPDFBtn = document.getElementById("downloadPDF");

// Load order from local storage
const order = JSON.parse(localStorage.getItem("currentOrder"));

if (!order){
    receiptContainer.innerHTML = "<p>No recent order found.</p>"
} else{
    let html = `
    <h2>Thank you for your purchase!</h2>
    <p><strong>Date: </strong>${order.placementDate || new Date().toLocaleString()}</p>
    <p><strong>Customer: </strong>${order.customerName} (${order.customerEmail})</p>
    <p><strong>Pickup or Delivery: </strong>${order.pickupOrDelivery}</p>
    `;

    if(order.pickupOrDelivery === "delivery" && order.customerAddress){
        html += `<p><strong>Delivery Address: </strong>${order.customerAddress}</p>`;
    }

    html += `
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

        //Border
        doc.setDrawColor("#e46f3b")
        doc.setLineWidth(2);
        doc.rect(5, 5, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10);
        
        doc.setDrawColor("#e46f3b");
        setLineWidth(0.3);
        for (let i = -doc.internal.pageSize.height; i < doc.internal.pageSize.width; i += 10){
            doc.line(i, 0, i + doc.internal.pageSize.height, doc.internal.pageSize.height);
        }

        //Logo
        const logo = new Image();
        logo.src="../../../images/Wacky_Burger_Character_Logo-transparent.png";
        
        logo.onload = function(){
            doc.addImage(logo, "PNG", 150, 10, 40, 40);

            //Title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.setTextColor("#190d08");
            doc.text("Wacky Burger Receipt", 10, 20);

            //Divider Line

            doc.setDrawColor("#9b3b23");
            doc.setLineWidth(0.5);
            doc.line(10, 25, 200, 25);

            let y = 35;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.setTextColor("#190d08");

            //Order Information
            doc.text(`Date: ${order.placementDate || new Date().toLocaleString()}`, 10, y); y += 10;
            doc.text(`Customer: ${order.customerName}`, 10, y); y += 10;
            doc.text(`Pickup or Delivery: ${order.pickupOrDelivery}`, 10, y); y += 10;
        
            if(order.pickupOrDelivery === "delivery" && order.customerAddress){
                doc.text(`Delivery Address: ${order.customerAddress}`, 10, y); y += 10;
            }
        
            //Items
            doc.setTextColor("#e46f3b");
            order.items.forEach(item =>{
                const itemTotal = item.itemPrice * item.itemQuantity;
                doc.text(`${item.itemName} x${item.itemQuantity} - $${itemTotal.toFixed(2)}`, 10, y);
                y += 8;
            });

            //Totals Section
            y += 5;
            doc.setDrawColor("#9b3b23");
            doc.line(10, y, 200, y);
            y += 5;
        
            doc.text(`Subtotal: $${order.subtotal.toFixed(2)}`, 10, y += 10);
            doc.text(`Delivery Fee: $${order.deliveryFee.toFixed(2)}`, 10, y += 10);
            doc.text(`Total: $${order.total.toFixed(2)}`, 10, y += 10);
            
            //Footer
            doc.setFont("helvetica", "italic");
            doc.setFontSize(10);
            doc.setTextColor("#88972d");
            doc.text("Thank you for choosing Wacky Burger! Come back soon!", 10, y + 10);

            //Save PDF
            doc.save("WackyBurger_Receipt.pdf");
        }
    });
}