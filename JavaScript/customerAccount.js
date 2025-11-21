//get users list
var usersList = JSON.parse(localStorage.getItem('accounts')) || [];

//get orders list
var ordersList = JSON.parse(localStorage.getItem('orders')) || [];

//get current user info
var currentEmail = localStorage.getItem('currentEmail');
var currentFirstName = localStorage.getItem('currentFirstName');
var currentLastName = localStorage.getItem('currentLastName');

let orderSection = document.getElementById("ordersContainer");

//sorting and filtering variables
let orderDirection = `newToOld`; //newToOld or oldToNew
let orderShow = `allItems`; //allItems or fulfilled or notFulfilled


//Display order section
function DisplayCustomerOrders()
{
    document.getElementById("viewOrdersToggle").style.display = "block";
    document.getElementById("editInfoSection").style.display = "none";

    FillOrders();
   
    //cancel any unsaved changes
    CancelEdit();
}

//Display account section
function DisplayAccountDetails()
{
    document.getElementById("viewOrdersToggle").style.display = "none";
    document.getElementById("editInfoSection").style.display = "block";

}

//Fill account information
function FillAccountInfo()
{
    //refresh user information
    currentEmail = localStorage.getItem('currentEmail');
    currentFirstName = localStorage.getItem('currentFirstName');
    currentLastName = localStorage.getItem('currentLastName');

    document.getElementById("editInfoSection").innerHTML = `
    <p>Wacky Rewards points: ${GetPointsWithEmail(currentEmail)}</p>
    <div id="custInfoContainer">
        <div>
            <p><strong>First Name:</strong> ${currentFirstName}</p>
            <p><strong>Last Name:</strong> ${currentLastName}</p>
            <p><strong>Email:</strong> ${currentEmail}</p>
            <p><strong>Password:</strong> ${GetPasswordWithEmail(currentEmail)}</p>
        </div>
    </div>
        
    <button id="editButton" onclick="EditInfo();">Edit Details</button>

    <p id="signupMessage"></p>
    `;
}

//retrieves current user's password
function GetPasswordWithEmail(email)
{
    for (let i = 0; i < usersList.length; i++)
    {
        if (usersList[i].email === email)
        {
            return usersList[i].password;
        }
    }
}

//get points from email
function GetPointsWithEmail(email)
{
    for (let i = 0; i < usersList.length; i++)
    {
        if (usersList[i].email === email)
        {
            return usersList[i].rewardPoints;
        }
    }
}

//Edit Account Details
function EditInfo()
{
    document.getElementById("editInfoSection").innerHTML = `
    <div id="custInfoContainer">
        <div id="custInfoTitles">
            <label for="First Name">First Name:</label>
            <label for="Last Name">Last Name:</label>
            <label for="Email">Email:</label>
            <label for="Password">Password:</label>
        </div>

        <div id="custInfoEditBoxes">
            <input type="text" value="${currentFirstName}" name="First Name" id="firstName">
            <input type="text" value="${currentLastName}" name="Last Name" id="lastName">
            <input type="text" value="${currentEmail}" name="Email" id="email">
            <input type="text" value="${GetPasswordWithEmail(currentEmail)}" name="Password" id="password">
        </div>
    </div>
        
    <button id="saveButton" onclick="SaveChanges();">Save Changes</button>

    <button id="cancelButton" onclick="FillAccountInfo(); CancelEdit();">Cancel</button>

    <p id="signupMessage"></p>
    `;
}

//Resets edited variables
function CancelEdit()
{
    currentEmail = localStorage.getItem('currentEmail');
    currentFirstName = localStorage.getItem('currentFirstName');
    currentLastName = localStorage.getItem('currentLastName');
}

//Check if account details are legitimate
function CheckDetailsOk(email)
{
    //runs through all accounts and makes sure email isn't taken
    for (let i = 0; i < usersList.length; i++)
    {
        if (usersList[i].email === email) return false;
    }

    //make sure it isn't manager email either
    if (email === "manager@wackyburger.com")
        return false;

    return true;
}

//Displays error message for 3 seconds
function DisplayError(message)
{
    document.getElementById('signupMessage').innerText = message;
    setTimeout(() => {
        document.getElementById('signupMessage').innerText = '';
    }, 2000);
}

//Save Account details - also go into every order with that old email and change it to the new email
function SaveChanges()
{
    const newFirstName = document.getElementById("firstName").value.trim();
    const newLastName  = document.getElementById("lastName").value.trim();
    const newEmail     = document.getElementById("email").value.trim();
    const newPassword  = document.getElementById("password").value;

    // Find the user by current email
    const idx = usersList.findIndex(u => u.email === currentEmail);

    if (newFirstName === currentFirstName && newLastName === currentLastName && 
        newEmail === currentEmail && newPassword === GetPasswordWithEmail(currentEmail)
    )
    {
        DisplayError('No new info to save!');
        return;
    }


    if (newEmail !== currentEmail && CheckDetailsOk(newEmail) === false)
    {
        DisplayError('That email is already taken!');
        return;
    }

    //go through each order with old email and set it to new email (if email was changed)
    if (newEmail !== currentEmail)
    {
        UpdateOrderEmails(currentEmail, newEmail);
    }


    // Update the user object
    usersList[idx].firstName = newFirstName;
    usersList[idx].lastName  = newLastName;
    usersList[idx].email     = newEmail;
    usersList[idx].password  = newPassword;

    // Save accounts list to storage
    localStorage.setItem("accounts", JSON.stringify(usersList));

    // Update current user info
    localStorage.setItem("currentEmail", newEmail);
    localStorage.setItem("currentFirstName", newFirstName);
    localStorage.setItem("currentLastName", newLastName);

    // Refresh screen
    FillAccountInfo();
    
}

//Display only orders for that email
function FillOrders()
{
    orderSection.innerHTML = '';

    //make sure variables are up to date
    currentEmail = localStorage.getItem('currentEmail');
    currentFirstName = localStorage.getItem('currentFirstName');
    currentLastName = localStorage.getItem('currentLastName');
    ordersList = JSON.parse(localStorage.getItem('orders')) || [];

    if (orderDirection === "oldToNew")
    {
        for (let i = 0; i < ordersList.length; i++)
        {
            //only show unfulfilled orders if filter applies
            if (orderShow === `fulfilled` && ordersList[i].fulfilled === false) continue;
            else if (orderShow === `notFulfilled` && ordersList[i].fulfilled === true) continue;
            
            if (ordersList[i].customerEmail === currentEmail)
            {
                CreateOrder(i);
            }
        }
    }
    else if (orderDirection === "newToOld")
    {
        for (let i = (ordersList.length-1); i >= 0; i--)
        {
            //only show unfulfilled orders if filter applies
            if (orderShow === `fulfilled` && ordersList[i].fulfilled === false) continue;
            else if (orderShow === `notFulfilled` && ordersList[i].fulfilled === true) continue;

            if (ordersList[i].customerEmail === currentEmail)
            {
                CreateOrder(i);
            }
        }
    }
}

function CreateOrder(orderListId)
{
    let newOrderItem = document.createElement('div');
    newOrderItem.classList.add("custOrderItem");
    newOrderItem.onclick = () => ToggleOrderInfo(newOrderItem);

    let newOrderHtml = `
        <div class="primaryInfo">
            <h3 class="orderId">Order #${ordersList[orderListId].orderId}</h3>
            <p class="orderCustName">Customer: ${ordersList[orderListId].customerName}</p>
            <p class="orderCustEmail">Email: ${ordersList[orderListId].customerEmail}</p>
            <p class="orderTotal">Total: $${ordersList[orderListId].total}</p>
            <p class="pickupDelivery">${ordersList[orderListId].pickupOrDelivery}</p>
        </div>

        <div class="secondaryInfo">
    `;

    //add food items individually and dynamically
    for (let j = 0; j < ordersList[orderListId].items.length; j++)
    {
        newOrderHtml += `
        <div class="orderFoodItem">
            <h4 class="orderFoodItemName">${j+1}. ${ordersList[orderListId].items[j].itemName}</h4>
            <p class="orderFoodItemPrice">Price/each: $${ordersList[orderListId].items[j].itemPrice}</p>
            <p class="orderFoodItemQuantity">Qty: ${ordersList[orderListId].items[j].itemQuantity}</p>
        </div>
        `;
    }

    newOrderHtml += `
        </div>
    `;

    newOrderItem.innerHTML = newOrderHtml;

    orderSection.append(newOrderItem);
}

//Toggle the secondary info for the order (items, primarily)
function ToggleOrderInfo(thisObject) {
    const secondary = thisObject.querySelector('.secondaryInfo');

    // Get the computed display (actual visible state)
    const currentDisplay = window.getComputedStyle(secondary).display;

    if (currentDisplay !== "none") {
        secondary.style.display = "none";
    } else {
        secondary.style.display = "flex";
    }
}

//go through each order with old email and set it to new email
function UpdateOrderEmails(oldEmail, newEmail)
{
    for (let i = 0; i < ordersList.length; i++)
    {
        if (ordersList[i].customerEmail === oldEmail)
        {
            ordersList[i].customerEmail = newEmail;

        }
    }
    //update local storage
    localStorage.setItem("orders", JSON.stringify(ordersList));
}

//Filter or sort emails
//Orders list sorting and filtering functions
function ChangeOrderSorting(value)
{
    orderDirection = value;
    FillOrders();
}
function ChangeOrderFiltering(value)
{
    orderShow = value;
    FillOrders();
}

//at page load, display customer info
DisplayAccountDetails();

FillAccountInfo();