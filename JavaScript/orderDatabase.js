const orderItems = [
    /*{
        orderId: 0,
        customerName: "Super Mario",
        customerEmail: "wacky@wacky.com",
        items: [
            { itemName: "Wacky Burger Jr.", itemPrice: 10.99, itemQuantity: 2 },
            { itemName: "Wacky Fries", itemPrice: 12.99, itemQuantity: 5 },
            { itemName: "Yummers", itemPrice: 12.99, itemQuantity: 2 },
            { itemName: "Tomater", itemPrice: 11.99, itemQuantity: 1 },
            { itemName: "BIG Burger", itemPrice: 15.99, itemQuantity: 1 }
        ],
        total: 21.00,
        fulfilled: false,
        placementDate: "11/9/2025",
        pickupOrDelivery: "pickup"
    }*/
];

if (!localStorage.getItem("orders"))
{
    localStorage.setItem("orders", JSON.stringify(orderItems));
}
// Load the orders from localStorage
let orders = JSON.parse(localStorage.getItem("orders"));
