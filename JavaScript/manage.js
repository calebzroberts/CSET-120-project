// Get the current logged-in email
const currentEmail = localStorage.getItem('currentEmail');

//get the current menu
const currentMenu = JSON.parse(localStorage.getItem('menu')) || [];

//get the current orders
const ordersList = JSON.parse(localStorage.getItem('orders')) || [];

//onpage items
const menuSection = document.getElementById("editItemsContainer");
const orderSection = document.getElementById("ordersContainer");

//array of items that are being edited - allows the menu to know if that item is being edited and display that accordingly
let editIndeces = [];

// Only allow the manager email to access this page
if (currentEmail !== 'YldGdVlXZGxja0IzWVdOcmVXSjFjbWRsY2k1amIyMD0='){
    alert("You are not authorized to view this page.")
    SmartHref('Login');
}

//fills items in the page from the saved menu and puts them in editing mode
function FillMenuItems()
{
    menuSection.innerHTML = ``;
    

    for (let i = 0; i < currentMenu.length; i++)
    {
        let newMenuItem = document.createElement("div");

        //if edit indeces contains this index, show edit menu
        if (editIndeces.includes(i))
        {
            newMenuItem.classList.add(`editingModeMenuItem`);

            newMenuItem.innerHTML = `
                <h4>Image URL:</h4>
                <textarea class="imageUrlEditBlock">${currentMenu[i].imageUrl}</textarea>

                <h4>Item Name:</h4>
                <input type="text" class="nameEditBlock" value="${currentMenu[i].name}">

                <h4>Item Price:</h4>
                <input type="number" class="priceEditBlock" value="${currentMenu[i].price}">

                <h4>Max Quantity:</h4>
                <input type="number" class="maxQuantityEditBlock" value="${currentMenu[i].maxQuantity}">

                <button class="cancelEditButton" onclick="CancelEdit(${i})">Cancel</button>

                <button class="editItemButton" onclick="ConfirmDetails(this, ${i});">Confirm Details</button>
            `;
        }

        //otherwise, show the normal menu
        else 
        {
            newMenuItem.classList.add(`mgrMenuItem`);
            newMenuItem.innerHTML = `
                <img class="mgrItemImage" src="${currentMenu[i].imageUrl}">
                <h3 class="mgrFoodName">${currentMenu[i].name}</h3>
                <p class="mgrItemPrice">$${currentMenu[i].price}</p>
                <p class="mgrQuantityBlock">Max Quantity: ${currentMenu[i].maxQuantity}</p>
                <button class="editItemButton" onclick="EditMenuItem(${i})">Edit Details</button>
                <button class="removeItemButton" onclick="RemoveMenuItem(${i})">Remove Item</button>
            `;
        }
        

        menuSection.append(newMenuItem);
    }
}

//Fills the orders dynamically from the orders database
function FillOrdersList()
{
    orderSection.innerHTML = "";

    for (let i = 0; i < ordersList.length; i++)
    {
        //only show unfulfilled orders
        if (ordersList[i].fulfilled === true) continue;

        let newOrderItem = document.createElement("div");

        newOrderItem.classList.add(`mgrOrderItem`);
        newOrderItem.onclick = () => ToggleOrderInfo(newOrderItem);

        newOrderItem.innerHTML = `
            <div class="primaryInfo">
                <h3 class="orderId">Order #${ordersList[i].orderId}</h3>
                <p class="orderCustName">Customer: ${ordersList[i].customerName}</p>
                <p class="orderCustEmail">Email: ${ordersList[i].customerEmail}</p>
                <p class="orderTotal">Total: $${ordersList[i].total}</p>
                <p class="orderDate">Placed on ${ordersList[i].fulfillmentDate}</p>
                <p class="pickupDelivery">${ordersList[i].pickupOrDelivery}</p>
            </div>

            <div class="secondaryInfo">
                <div class="orderFoodItem">
                    <h4 class="orderFoodItemName">1. Wacky Burger</h4>
                    <p class="orderFoodItemPrice">Price/each: $10.99</p>
                    <p class="orderFoodItemQuantity">Qty: 2</p>
                </div>
                <div class="orderFoodItem">
                    <h4 class="orderFoodItemName">2. Wacky Burger</h4>
                    <p class="orderFoodItemPrice">Price/each: $10.99</p>
                    <p class="orderFoodItemQuantity">Qty: 2</p>
                </div>
                <div class="orderFoodItem">
                    <h4 class="orderFoodItemName">3. Wacky Burger</h4>
                    <p class="orderFoodItemPrice">Price/each: $10.99</p>
                    <p class="orderFoodItemQuantity">Qty: 2</p>
                </div>
            </div>
        `;

        orderSection.append(newOrderItem);
    }

    
}

//puts menu item in edit mode with text boxes
function EditMenuItem(value)
{
    //add item to edit list and then reload the display menu to show the edit menu for it
    editIndeces.push(value);
    FillMenuItems();

    //reset save button to say it needs saved
    document.getElementById(`saveButton`).innerText = `Save Changes`;
}

//removes item from the menu
function RemoveMenuItem(value)
{
    currentMenu.splice(value, 1);

    //reset save button to say it needs saved
    document.getElementById(`saveButton`).innerText = `Save Changes`;

    FillMenuItems();
}

//cancels editing and puts item back into normal mode
function CancelEdit(value)
{
    //remove item from edit list and then reload the display menu to show the normal menu for it
    editIndeces = editIndeces.filter(index => index !== value);

    //if the name is blank (prolly new item) delete it entirely
    if (currentMenu[value].imageUrl === "" && 
        currentMenu[value].name === "" &&
        currentMenu[value].price === "" &&
        currentMenu[value].maxQuantity === ""
    )
    {
        currentMenu.splice(value, 1);
    }

    FillMenuItems();
}

//confirms edits for menu item
function ConfirmDetails(buttonObject, value)
{
    //get parent object
    const parent = buttonObject.closest('.editingModeMenuItem');

    //save other values in the parent object to temporary menu
    currentMenu[value].imageUrl = parent.querySelector('.imageUrlEditBlock').value;
    currentMenu[value].name = parent.querySelector('.nameEditBlock').value;
    currentMenu[value].price = parent.querySelector('.priceEditBlock').value;
    currentMenu[value].maxQuantity = parent.querySelector('.maxQuantityEditBlock').value;

    //remove item from edit list and reload visible menu
    editIndeces = editIndeces.filter(index => index !== value);

    //if the name is blank (prolly new item) delete it entirely
    if (currentMenu[value].imageUrl === "" && 
        currentMenu[value].name === "" &&
        currentMenu[value].price === "" &&
        currentMenu[value].maxQuantity === ""
    )
    {
        currentMenu.splice(value, 1);
    }

    FillMenuItems();
}

//add item to the list and puts it in edit mode
function AddNewItem()
{
    currentMenu.push({
        imageUrl:"",
        name:"",
        price:"",
        maxQuantity:""
    });
    editIndeces.push(currentMenu.length - 1);
    FillMenuItems();
}

function SaveChanges()
{
    //update menu in local storage
    localStorage.setItem('menu', JSON.stringify(currentMenu));
    document.getElementById(`saveButton`).innerText = `Saved`;
}

//Toggle the menu on and the orders off
function DisplayMenu()
{
    document.getElementById("viewOrdersToggle").style.display = "none";
    document.getElementById("editItemsToggle").style.display = "block";
}

//Toggle orders on and menu off
function ViewOrders()
{
    document.getElementById("viewOrdersToggle").style.display = "block";
    document.getElementById("editItemsToggle").style.display = "none";
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

//fill menu items on startup of page
FillMenuItems();

//display menu editing by default
DisplayMenu();

//fill order items on page load
FillOrdersList();