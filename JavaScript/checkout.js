let cart = JSON.parse(localStorage.getItem("cart")) || [];
var usersList = JSON.parse(localStorage.getItem('accounts')) || [];
const cartSummary = document.getElementById("cartSummary");
const guestCheckoutForm = document.getElementById("guestCheckoutForm");
const currentEmail = localStorage.getItem('currentEmail');
const currentFirstName = localStorage.getItem('currentFirstName');
const currentLastName = localStorage.getItem('currentLastName');


var deliveryFee = 0.00;


var rewardPoints = 0;
var totalPrice = 0;
var subtotal = 0;
var tip = 0;

var pointsToUse = 0;

var useWackyPoints = false;


//variables from on page items
const loginBlock = document.getElementById("loginBlock");
const pickupOrDeliverySelect = document.getElementById("pickupDelivery");
const deliveryContainer = document.getElementById("deliveryInfo")
const extraLoginText = document.getElementById('extraLoginText');
const paymentType = document.getElementById("paymentType");

// Display cart items
function displayCart(){
    if (cart.length === 0){
        cartSummary.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    let html = "<ul>";
    subtotal = 0;

    cart.forEach(item => {
        html += `<li>${item.itemName} - $${item.itemPrice} x ${item.itemQuantity}</li>`;
        subtotal += item.itemPrice * item.itemQuantity;
    });
    html += `</ul>`;
    //html += `<p><strong>Delivery Fee: $${deliveryFee.toFixed(2)}</strong></p>`;
    //html += `<p><strong>Total: $${(subtotal + deliveryFee).toFixed(2)}</strong></p>`;
    cartSummary.innerHTML = html;

    
    totalPrice = subtotal + deliveryFee;

    UpdateTotal();

    CheckLoggedIn();
    
}

//Update the total text
function UpdateTotal()
{
    //gets rid of old tip and adds new value
    totalPrice -= tip;
    if (document.getElementById("tip").value > 0)
        tip = Number(document.getElementById("tip").value);
    totalPrice += tip;

    totalSection = document.getElementById("totalSection");

    totalSection.innerHTML = `
        <div>   
            <p class="totalText">Subtotal:</p>
            <p>$${subtotal.toFixed(2)}</p>
        </div>
        <div>   
            <p class="totalText">Delivery Fee:</p>
            <p>$${deliveryFee.toFixed(2)}</p>
        </div>
        <div>   
            <p class="totalText">Tip:</p>
            <p>$${(tip.toFixed(2))}</p>
        </div>
        <div>   
            <p class="totalText">Wacky Point Discount:</p>
            <p>-$${(pointsToUse/100).toFixed(2)}</p>
        </div>
        <hr>
        <div>   
            <p class="totalText">Total:</p>
            <p>$${totalPrice.toFixed(2)}</p>
        </div>
    `;
}

//toggles on or off using customer's wacky points
function ToggleUsePoints()
{
    const user = usersList.find(u => u.email === currentEmail);
    if (useWackyPoints)
    {
        useWackyPoints = false;
        pointsToUse = 0;
        totalPrice = Number(subtotal) + Number(deliveryFee);
    }
    else
    {
        useWackyPoints = true;
        pointsToUse = user.rewardPoints;
        totalPrice = ((Number(subtotal) + Number(deliveryFee)) - Number((pointsToUse/100).toFixed(2))).toFixed(2);
    }

    UpdateTotal();
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
    const total = ((Number(subtotal) + Number(deliveryFee)) + Number(tip) - Number(pointsToUse/100)).toFixed(2);
    rewardPoints -= pointsToUse;

    //reset the order done so next page shows the animation
    localStorage.setItem('currentOrderDone', JSON.stringify(0))

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
        tip: tip,
        pointsUsed: pointsToUse,
        total: total,
        fulfilled: false,
        progressValue: 0,
        placementDate: new Date().toLocaleDateString(),
        pickupOrDelivery: pickupOrDelivery
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    existingOrders.push(order);
    localStorage.setItem("orders", JSON.stringify(existingOrders));
    localStorage.setItem("currentOrder", JSON.stringify(order));

    localStorage.removeItem("cart");
    cart.length = 0;
    displayCart();

    //update the customer's points if logged in
    if (currentEmail !== "")
        UpdateCustomerPoints();

    // Redirect to receipt page
    setTimeout(() => {window.location.href = "../Receipt/index.html";}, 500);
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
}

//payment toggle
function TogglePayment()
{
    
    if (pickupOrDeliverySelect.value === "delivery")
    {
        //only allow user to pay with card if they chose delivery
        paymentType.value = "card";
        paymentType.disabled = true;
    }
    else
    {
        //otherwise, unlock payment type
        paymentType.disabled = false;
    }

    //show payment details if type is card
    if (paymentType.value === "card")
    {
        document.getElementById("paymentInfo").style.display = "block";

        document.getElementById("cardName").required = true;
        document.getElementById("cardNumber").required = true;
        document.getElementById("expDate").required = true;
        document.getElementById("cvv").required = true;
    }
    else
    {
        document.getElementById("paymentInfo").style.display = "none";
        document.getElementById("cardName").required = false;
        document.getElementById("cardNumber").required = false;
        document.getElementById("expDate").required = false;
        document.getElementById("cvv").required = false;
    }
}

//Calculates the rewards points the customer will get from this transaction
function CalculateRewards()
{
    rewardPoints = totalPrice * .67;
    rewardPoints = rewardPoints.toFixed();
    return rewardPoints;
}

//hides the login buttons if user chooses to check out as a guest
function HideLoginButtons()
{
    loginBlock.style.display = "none";
    
    extraLoginText.innerHTML = 
        'Want to earn 200 extra points on your purchase? <a onclick="SmartHref(\'Login\')">Log In</a> or <a onclick="SmartHref(\'Signup\')">Sign Up</a> today!';

    //hide points checkbox if guest checkout
    document.getElementById("useWackyPointsLabel").style.display = "none";
}

//display login buttons if user not logged in
function CheckLoggedIn()
{
    const pointsBox = document.getElementById("useWackyPointsLabel");

    if (currentEmail !== "" && currentEmail !== null)
    {
        loginBlock.style.display = "none";
        
        extraLoginText.innerHTML = `Place your order today to get ${CalculateRewards()} Wacky Points!`;
        
        //show checkbox
        pointsBox.style.display = "flex";

        //update points balance
        const user = usersList.find(u => u.email === currentEmail);
        if (user) {
            document.getElementById("useWackyPointsLabel").innerHTML = `<input type="checkbox" id="useWackyPoints" onclick="ToggleUsePoints()"> Use my ${user.rewardPoints} Wacky Points.`;
        }

        FillUserData();
    }
    else
    {
        loginBlock.style.display = "block";

        //hide checkbox
        pointsBox.style.display = "none";
    }
}

//fills user info in respective slots
function FillUserData()
{
    firstName.value = currentFirstName;
    lastName.value = currentLastName;
    if (currentEmail === 'YldGdVlXZGxja0IzWVdOcmVXSjFjbWRsY2k1amIyMD0=')
    {
        email.value = 'manager@wackyburger.com'
    }
    else
        email.value = currentEmail;
}

//find user by email and add points to their total
function UpdateCustomerPoints()
{
    for (let i = 0; i < usersList.length; i++)
    {
        if (usersList[i].email === currentEmail)
        {
            //update user points
            usersList[i].rewardPoints = Number(usersList[i].rewardPoints) + Number(rewardPoints);
            // Store correct JSON string
            localStorage.setItem('accounts', JSON.stringify(usersList));
        }
    }

}

//Initial functions
CheckLoggedIn();
ToggleAddress();
TogglePayment();
displayCart();