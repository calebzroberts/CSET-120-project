let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartSummary = document.getElementById("cartSummary");
const guestCheckoutForm = document.getElementById("guestCheckoutForm");
const currentEmail = localStorage.getItem('currentEmail');
const currentFirstName = localStorage.getItem('currentFirstName');
const currentLastName = localStorage.getItem('currentLastName');


var deliveryFee = 0.00;

//variables from on page items
const loginBlock = document.getElementById("loginBlock");
const pickupOrDeliverySelect = document.getElementById("pickupDelivery");
const deliveryContainer = document.getElementById("deliveryInfo")
const extraLoginText = document.getElementById('extraLoginText');


// Display cart items
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
    html += `<p><strong>Delivery Fee: $${deliveryFee.toFixed(2)}</strong></p>`;
    html += `<p><strong>Total: $${(subtotal + deliveryFee).toFixed(2)}</strong></p>`;
    cartSummary.innerHTML = html;

    
}

// Handle form submission
guestCheckoutForm.addEventListener("submit", function(e){
    e.preventDefault();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const pickupOrDelivery = document.getElementById("pickupDelivery").value;
    
    //delivery info items
    const deliveryAddress = document.getElementById("deliveryAddress").value;
    const zipcode = document.getElementById("zipcode").value;
    const state = document.getElementById("state").value;

    if (!firstName || !lastName || !email){
        alert("All fields are required!");
        return;
    }

    if(pickupOrDelivery === "delivery" && !deliveryAddress ||
        pickupOrDelivery === "delivery" && !zipcode ||
        pickupOrDelivery === "delivery" && !state
    ){
        alert("Please enter your full delivery address!")
        return;
    }

    if (cart.length === 0)
    {
        alert("Your cart is empty!")
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.itemPrice * item.itemQuantity, 0);
    const total = subtotal + deliveryFee;

    const order = {
        orderId:Date.now(),
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        customerAddress: {
            address: deliveryAddress,
            zipcode: zipcode,
            state: state
        },
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
    setTimeout(() => {window.location.href = "../receipt/index.html";}, 500);
});



// Toggle Delivery Address
function ToggleAddress() {
    if (pickupOrDeliverySelect.value === "delivery"){
        deliveryContainer.style.display = "block";
        
        //toggle required for the address fields
        deliveryAddress.required = true;
        zipcode.required = true;
        state.required = true;

        deliveryFee = 5.00;
        displayCart();
    } 
    else{
        deliveryContainer.style.display = "none";

        //delivery info items
        deliveryAddress.required = false;
        zipcode.required = false;
        state.required = false;

        deliveryFee = 0;
        displayCart();
    }
};

//hides the login buttons if user chooses to check out as a guest
function HideLoginButtons()
{
    loginBlock.style.display = "none";
    extraLoginText.style.display = "block";
}

//display login buttons if user not logged in
function CheckLoggedIn()
{
    if (currentEmail !== "" && currentEmail !== null)
    {
        loginBlock.style.display = "none";
        extraLoginText.style.display = "none";
        

        FillUserData();
    }
    else
    {
        loginBlock.style.display = "block";

    }
}

//fills user info in respective slots
function FillUserData()
{
    firstName.value = currentFirstName;
    lastName.value = currentLastName;
    email.value = currentEmail;
}

//Initial functions
CheckLoggedIn();
ToggleAddress();
displayCart();