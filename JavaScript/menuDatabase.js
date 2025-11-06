const menuItems = [
    {
        name: "Wacky Burger Jr.",
        price: 10.99,
        maxQuantity: 10,
        imageUrl: "../../images/monster-burger.jpg"
    },
    {
        name: "Freaky French Fries",
        price: 8.99,
        maxQuantity: 10,
        imageUrl: "../../images/funky-french-fries.jpg"
    },
    {
        name: "Yummers Lettuce Burger",
        price: 12.99,
        maxQuantity: 10,
        imageUrl: "../../images/lettuce-burger.jpg"
    },
    {
        name: "Titanic Burger",
        price: 11.99,
        maxQuantity: 10,
        imageUrl: "../../images/lettuce-wrap-burger.jpg"
    },
    {
        name: "Pickley Burger",
        price: 9.99,
        maxQuantity: 10,
        imageUrl: "../../images/pickle-burger.jpg"
    },
    {
        name: "Tomater Hater Burger",
        price: 13.99,
        maxQuantity: 10,
        imageUrl: "../../images/tomato-burger.jpg"
    }
];


// Load or initialize menu
let menu = JSON.parse(localStorage.getItem("menu")) || menuItems;

// Save back in case localStorage was empty
localStorage.setItem("menu", JSON.stringify(menu));