const receiptContainer = document.getElementById("receiptContainer");
const downloadPDFBtn = document.getElementById("downloadPDF");

// Load order from local storage
const order = JSON.parse(localStorage.getItem("currentOrder"));



if (!order){
    
    //hide buttons until order complete
    document.getElementById("buttons").style.display = "none";

    receiptContainer.innerHTML = "<p>No recent order found.</p>"
} else{
    //hide buttons until order complete
    document.getElementById("buttons").style.display = "none";

    let html = `
    <h2>Thank you for your purchase!</h2>
    <div id="deliveryProgressContainer">
        <label for="deliveryProgress"><strong>Food Prep Progress:</strong></label>
        <br>
        <progress id="deliveryProgress" value="0" max="100"></progress>
    </div>
    <p><strong>Date: </strong>${order.placementDate || new Date().toLocaleString()}</p>
    <p><strong>Customer: </strong>${order.customerName} (${order.customerEmail})</p>
    <p><strong>Pickup or Delivery: </strong>${order.pickupOrDelivery}</p>
    `;

    if(order.pickupOrDelivery === "delivery" && order.customerAddress){
        html += `<p><strong>Delivery Address: </strong><br>${order.customerAddress.address}, <br>${order.customerAddress.state} ${order.customerAddress.zipcode} USA</p>`;
    }

    html += `<p><strong>Ordered Items:</strong></p>
    <ul>
        ${order.items.map(i => `<li>${i.itemName} - $${i.itemPrice.toFixed(2)} x ${i.itemQuantity} = $${(i.itemPrice * i.itemQuantity).toFixed(2)}</li>`).join('')}
    </ul>
    <p><strong>Subtotal: $${order.subtotal.toFixed(2)}</strong></p>
    <p><strong>Delivery Fee: $${order.deliveryFee.toFixed(2)}</strong></p>
    <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
    `;
    receiptContainer.innerHTML = html;

    //food prep takes longer with more items
    AnimateProgressToFull((1/order.items.length) * 0.3);
}

// PDF download
if (downloadPDFBtn && order){
    downloadPDFBtn.addEventListener("click", () => {
        const {jsPDF} = window.jspdf;
        const doc = new jsPDF();

        //diagonal line background
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.3);
        for (let i = -doc.internal.pageSize.height; i < doc.internal.pageSize.width; i += 10){
            doc.line(i, 0, i + doc.internal.pageSize.height, doc.internal.pageSize.height);
        }

        //Border
        doc.setDrawColor("#e46f3b")
        doc.setLineWidth(2);
        doc.rect(5, 5, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10);
        

        //Logo
        const logo = new Image();
        logo.src="../../images/Wacky_Burger_Character_Logo-transparent.png";
        
        logo.onload = function(){

            //Title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.setTextColor("#190d08");
            doc.text("Wacky Burger Receipt", 10, 20);

            //Divider Line

            doc.setDrawColor("#9b3b23");
            doc.setLineWidth(0.5);
            doc.line(10, 25, 200, 25);

            
            doc.addImage(logo, "PNG", 150, 10, 40, 40);

            let y = 35;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.setTextColor("#190d08");

            //Order Information
            doc.text(`Date: ${order.placementDate || new Date().toLocaleString()}`, 10, y); y += 10;
            doc.text(`Customer: ${order.customerName}`, 10, y); y += 10;
            doc.text(`Pickup or Delivery: ${order.pickupOrDelivery}`, 10, y); y += 10;
        
            if(order.pickupOrDelivery === "delivery" && order.customerAddress){
                doc.text(`Delivery Address: ${order.customerAddress.address}, ${order.customerAddress.state} ${order.customerAddress.zipcode} USA`, 10, y); y += 10;
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


//slowly tick up the delivery progress
function AnimateProgressToFull(speed)
{
    const progress = document.getElementById("deliveryProgress");
    const max = Number(progress.max) || 100;
    let current = Number(progress.value) || 0;

    const step = 1 * speed;
    const intervalMs = 30;

    const timer = setInterval(() => {
        current += step;

        if (current >= max)
        {
            current = max;
            clearInterval(timer);

            // Buttons show once complete
            document.getElementById("buttons").style.display = "block";
        }

        progress.value = current;
    }, intervalMs);

}

document.getElementById("buttons").style.display = "none";