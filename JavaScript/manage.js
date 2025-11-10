// Get the current logged-in email
const currentEmail = localStorage.getItem('currentEmail');

//get the current menu
const currentMenu = JSON.parse(localStorage.getItem('menu')) || [];

//onpage items
const menuSection = document.getElementById("editItemsContainer");

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
    FillMenuItems();
}

function SaveChanges()
{
    //update menu in local storage
    localStorage.setItem('menu', JSON.stringify(currentMenu));
    document.getElementById(`saveButton`).innerText = `Saved`;
}

//fill menu items on startup of page
FillMenuItems();