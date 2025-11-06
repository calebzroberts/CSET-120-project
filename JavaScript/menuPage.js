var cart = [];

//function added to the add to cart buttons
function AddToCart(button)
{
    //gets items to add to the cart
    let itemImg = "";
    let title = "";
    let price = "";
    let quantity = 0;

    //get parent of item
    const parentDiv = button.parentElement;

    //gets individual items
    const img = parentDiv.querySelector(".itemImage");
    const titleBox = parentDiv.querySelector(".foodName");
    const priceBox = parentDiv.querySelector(".itemPrice");
    const itemQuantity = parentDiv.querySelector(".cartQuantity");
    

    //assigns image for cart
    itemImg = img.src;
    title = titleBox.textContent;
    price = priceBox.textContent;
    quantity = itemQuantity.value;

    //turn price into a number
    price = Number(price.slice(1));

    const thisCartItem = {imageUrl: itemImg, itemName: title, itemPrice: price, itemQuantity: quantity};

    //first checks to make sure this will not add a duplicate
    if (CheckItemInCart(title) === true)
    {
        //give duplicate warning message
        UpdatePurchaseText("You already have this in your cart!");

        return;
    }
    

    cart.push(thisCartItem);
    UpdateVisibleCart();

    //resets purchase button back to normal
    UpdatePurchaseText("Click below to purchase.");
}

function PurchaseItems()
{
    if (cart.length === 0)
    {
        UpdatePurchaseText("You don't have anything in your cart!");
        return;
    }
    ResetCart();

    UpdatePurchaseText("We sent your order in. Thanks for ordering!");
}

function UpdatePurchaseText(text)
{
    let purchaseButton = document.getElementById("purchaseMsg");
    purchaseButton.innerText = text;
}

function UpdateItemQuantity(thisIndex, thisQuantity)
{
    cart[thisIndex].itemQuantity = thisQuantity;

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
    const cartSection = document.getElementById("cartSection");

    //reset cart section
    cartSection.innerHTML = ``;

    //for each item in the cart, make a new item in the cart area
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
                    <input class="cartItemQuantity" type="number" value="${cart[i].itemQuantity}" onchange="UpdateItemQuantity(0, this.value)" min="0">
                    <button onclick="RemoveItem(${i})">Remove</button>
                </div>
            </div>
        `;

        cartSection.append(newCartItem);
    }
    
    UpdateTotal();
    UpdateAddToCartButtons();
    ResetItemQuantities();

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
function CheckItemInCart(name)
{
    for (let i = 0; i < cart.length; i++)
    {
        if (cart[i].itemName === name)
        {
            
            return true;
            
        }
    }

    return false;
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
    //reset cart variable
    cart = [];
    
    const cartSection = document.getElementById("cartSection");

    //reset cart section
    cartSection.innerHTML = ``;

    UpdateTotal();
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

        }
        else
        {
            buttons[i].innerText = "Add to Cart";
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


//reset cart on load
ResetCart();

//reset purchase text on load
UpdatePurchaseText("Click below to purchase.");

UpdateAddToCartButtons();
