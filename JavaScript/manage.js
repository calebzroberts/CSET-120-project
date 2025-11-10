// Get the current logged-in email
const currentEmail = localStorage.getItem('currentEmail');

//get the current menu
const currentMenu = JSON.parse(localStorage.getItem('menu')) || [];

//onpage items
const menuSection = document.getElementById("editItemsContainer");

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
        newMenuItem.classList.add(`mgrMenuItem`);
        newMenuItem.innerHTML = `
            <img class="mgrItemImage" src="${currentMenu[i].imageUrl}">
            <h3 class="mgrFoodName">${currentMenu[i].name}</h3>
            <p class="mgrItemPrice">$${currentMenu[i].price}</p>
            <p class="mgrQuantityBlock">Max Quantity: ${currentMenu[i].maxQuantity}</p>
            <button class="editItemButton" onclick="EditMenuItem(${i})">Edit Details</button>
            <button class="removeItemButton" onclick="RemoveMenuItem(${i})">Remove Item</button>
        `;

        menuSection.append(newMenuItem);
    }
}

function EditMenuItem(value)
{
    alert(`Editing ${value}`);

    //reset save button to say it needs saved
    document.getElementById(`saveButton`).innerText = `Save Changes`;
}

function RemoveMenuItem(value)
{
    currentMenu.splice(value, 1);

    //reset save button to say it needs saved
    document.getElementById(`saveButton`).innerText = `Save Changes`;

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