const orderItems = [
    {
        orderId: 0,
        customerName: "Super Mario",
        customerEmail: "wacky@wacky.com",
        items: [
            { itemName: "Wacky Burger Jr.", itemPrice: 10.99, itemQuantity: 2 }
        ],
        total: 21.00,
        fulfilled: false,
        fulfillmentDate: "11/9/2025",
        pickupOrDelivery: "pickup"
    },
    {
        orderId: 1,
        customerName: "Super Mario",
        customerEmail: "wacky@wacky.com",
        items: [
            { itemName: "Wacky Burger Jr.", itemPrice: 10.99, itemQuantity: 2 }
        ],
        total: 21.00,
        fulfilled: false,
        fulfillmentDate: "11/10/2025",
        pickupOrDelivery: "pickup"
    },
    {
        orderId: 2,
        customerName: "Super Mario",
        customerEmail: "wacky@wacky.com",
        items: [
            { itemName: "Wacky Burger Jr.", itemPrice: 10.99, itemQuantity: 2 }
        ],
        total: 21.00,
        fulfilled: false,
        fulfillmentDate: "11/11/2025",
        pickupOrDelivery: "pickup"
    }
];


localStorage.setItem("orders", JSON.stringify(orderItems));
// Load the orders from localStorage
let orders = JSON.parse(localStorage.getItem("orders"));
