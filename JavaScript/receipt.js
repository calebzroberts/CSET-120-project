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
    <div class="totals">
        <p>Subtotal: $${order.subtotal.toFixed(2)}</p>
        <p>Delivery Fee: $${order.deliveryFee.toFixed(2)}</p>
        <p>Tip: $${order.tip.toFixed(2)}</p>
        <p>Wacky Points Discount: $${(order.pointsUsed/100).toFixed(2)}</p>
        <p>Total: $${order.total}</p>
    </div>
    `;
    receiptContainer.innerHTML = html;

    let orderItemsQuantity = 0;
    //calculate total items (including quantities) to detect food prep time
    for (let i = 0; i < order.items.length; i++)
    {
        orderItemsQuantity += order.items[i].itemQuantity;
    }

    //food prep takes longer with more items
    const perItemSpeed = 0.7; // tweak this
    const speed = perItemSpeed / orderItemsQuantity;
    AnimateProgressToFull(speed, order.progressValue);

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
            doc.text(`Tip: $${order.tip.toFixed(2)}`, 10, y += 10);
            doc.text(`Wacky Points Used: ${order.pointsUsed}`, 10, y += 10);
            doc.text(`Total: $${Number(order.total).toFixed(2)}`, 10, y += 10);
            
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
function AnimateProgressToFull(speed, startingValue)
{
    const progress = document.getElementById("deliveryProgress");
    const max = Number(progress.max) || 100;
    let current = Number(progress.value) || startingValue;

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
            window.location.href = "/Wacky/Receipt/index.html#buttons"
        }

        progress.value = current;

        // Update this order's stored progress instead of a single global value
        let orders = JSON.parse(localStorage.getItem("orders")) || [];
        let stored = orders.find(o => o.orderId === order.orderId);

        if (stored) {
            stored.progressValue = current;
            localStorage.setItem("orders", JSON.stringify(orders));
        }

        order.progressValue = current;
        localStorage.setItem("currentOrder", JSON.stringify(order));

    }, intervalMs);

}