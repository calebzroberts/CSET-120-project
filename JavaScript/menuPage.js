let cart = JSON.parse(localStorage.getItem("cart")) || [];
const isLoggedIn = !!localStorage.getItem("wb_email")

// Load the menu items from local storage
function LoadMenu() {
    const menuContainer = document.getElementById("menuContainer");
    menuContainer.innerHTML = "";

    for (let item of menu) {
        const div = document.createElement("div");
        div.classList.add("menuItem");

        div.innerHTML = `
            <img class="itemImage" src="${item.imageUrl}">
            <h3 class="foodName">${item.name}</h3>
            <p class="itemPrice">$${item.price.toFixed(2)}</p>
            <div class="quantityBlock">
                <p>Quantity:</p>
                <input class="cartQuantity" type="number" value="1" min="0">
            </div>
            <button class="addToCartButton" onclick="AddToCart(this)">Add to Cart</button>
        `;

        menuContainer.append(div);
    }
}


// Purchase Logic
function AddToCart(button){
    const parentDiv = button.parentElement;

    const img = parentDiv.querySelector(".itemImage");
    const titleBox = parentDiv.querySelector(".foodName");
    const priceBox = parentDiv.querySelector(".itemPrice");
    const itemQuantity = parentDiv.querySelector(".cartQuantity");

    // Gets items to add to the cart
    let itemImg = img.src;
    let title = titleBox.textContent;
    let price = Number(priceBox.textContent.slice(1));
    let quantity = parseInt(itemQuantity.value);

    const thisCartItem = { imageUrl: itemImg, itemName: title, itemPrice: price, itemQuantity: quantity };

    if (CheckItemInCart(title)){
        UpdatePurchaseText("You already have this in your cart!");
        return;
    }

    cart.push(thisCartItem);
    UpdateVisibleCart();
    UpdatePurchaseText("Click below to purchase.");
    ResetItemQuantities();
}

function PurchaseItems(){
    if (cart.length === 0){
        UpdatePurchaseText("You don't have anything in your cart!");
        return;
    }

    if (isLoggedIn) {
        window.location.href = "../../Wacky/Checkout/User/" // User Checkout
    } else{
        window.location.href = "../../Wacky/Checkout/Guest" // Guest Checkout
    }
    SaveCart();
}

// Cart Management Fuctions

function UpdatePurchaseText(text)
{
    const purchaseButton = document.getElementById("purchaseMsg");
    purchaseButton.innerText = text;
}

function UpdateItemQuantity(thisIndex, thisQuantity)
{
    cart[thisIndex].itemQuantity = Number(thisQuantity);

    //remove item if quantity becomes 0
    if (thisQuantity < 1)
    {
        
        RemoveItem(thisIndex);
        return;
    }

    UpdateVisibleCart();
}

function UpdateVisibleCart()
{
    SaveCart();

    const cartSection = document.getElementById("cartSection");
    cartSection.innerHTML = ``;

    for (let i = 0; i < cart.length; i++)
    {
        let newCartItem = document.createElement("div");
        newCartItem.innerHTML = `
            <div class="cartItem">
                <div class="cartItemNameBlock">
                    <img class="cartItemImage" src="${cart[i].imageUrl}">
                    <h3 class="cartItemName">${cart[i].itemName}</h3>
                </div>

                <p class="cartItemPrice">$${cart[i].itemPrice}</p>

                <div class="cartItemQuantityBlock">
                    <p>Quantity:</p>
                    <input class="cartItemQuantity" type="number" value="${cart[i].itemQuantity}" onchange="UpdateItemQuantity(${i}, this.value)" min="0">
                    <button onclick="RemoveItem(${i})">Remove</button>
                </div>
            </div>
        `;

        cartSection.append(newCartItem);
    }
    
    UpdateTotal();
    UpdateAddToCartButtons();
}


//updates total text at bottom of cart
function UpdateTotal()
{
    const totalPriceElement = document.getElementById("cartTotal");
    
    let totalPrice = 0;

    //adds all prices together
    for(let i = 0; i < cart.length; i++)
    {
        totalPrice += (cart[i].itemPrice * cart[i].itemQuantity);
    }

    totalPrice = totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    totalPriceElement.innerText = `$${totalPrice}`;
}

function RemoveItem(thisIndex)
{
    //remove item from the cart array
    cart.splice(thisIndex, 1);

    //update after change
    UpdateVisibleCart();
}

//used to see if there is an item in the cart
function CheckItemInCart(name){
    return cart.some(item => item.itemName === name);
}

//update the quantity if duplicate in cart
function GetDuplicateIndex(name)
{
    for (let i = 0; i < cart.length; i++)
    {
        
        if (cart[i].itemName === name)
        {
            
            return i;
            
        }
    }

    return false;
}

function ResetCart()
{
    const cartSection = document.getElementById("cartSection");

    //Reset cart section

    cartSection.innerHTML = ``;

    UpdateTotal();
    UpdateAddToCartButtons();
}

//used to go through and update buttons if item in cart to say so and gray it out
function UpdateAddToCartButtons()
{
    let buttons = document.getElementsByClassName("addToCartButton");
    for (let i = 0; i < buttons.length; i++)
    {
        let parent = buttons[i].parentElement;
        let title = parent.querySelector(".foodName").textContent;
        if (CheckItemInCart(title))
        {
            buttons[i].innerText = "In Cart";
            buttons[i].disabled = true;

        }
        else
        {
            buttons[i].innerText = "Add to Cart";
            buttons[i].disabled = false;
        }
    }
}

function ResetItemQuantities() {
    let quantities = document.getElementsByClassName("cartQuantity");
    for (let i = 0; i < quantities.length; i++)
    {
        quantities[i].value = 1;
    }
}

function SaveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


//Initialize the menu on load
LoadMenu();


//reset purchase text on load
UpdatePurchaseText("Click below to purchase.");


UpdateAddToCartButtons();

UpdateVisibleCart();