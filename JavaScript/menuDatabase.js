//change when menu updated
const menuVersion = 3;

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
    },
    {
        name: "PB Soda",
        price: 3.99,
        maxQuantity: 20,
        imageUrl: "../../images/pb-soda.webp"
    },
    {
        name: "BBQ Chicken Alert",
        price: 11.99,
        maxQuantity: 10,
        imageUrl: "../../images/bbq-chicken-alert.jpg"
    },
    {
        name: "Squash Burger",
        price: 9.99,
        maxQuantity: 10,
        imageUrl: "../../images/squash-burger.jpg"
    },
    {
        name: "Spicy Taco Burger Deluxe",
        price: 14.99,
        maxQuantity: 10,
        imageUrl: "../../images/taco-burger.png"
    },
    {
        name: "Pie Burger",
        price: 12.99,
        maxQuantity: 10,
        imageUrl: "../../images/pie-burger.jpg"
    },
    {
        name: "Mr. Ice Cream",
        price: 2.99,
        maxQuantity: 10,
        imageUrl: "../../images/mr-ice-cream.jpg"
    },
    {
        name: "Mr. Milkshake",
        price: 4.99,
        maxQuantity: 10,
        imageUrl: "../../images/mr-milkshake.jpg"
    },
    {
        name: "Cheese Block Burger",
        price: 10.99,
        maxQuantity: 10,
        imageUrl: "../../images/cheese-block-burger.png"
    },
    {
        name: "Pickley Burger Deluxe",
        price: 13.99,
        maxQuantity: 10,
        imageUrl: "../../images/pickley-burger-deluxe.png"
    },
    {
        name: "Jolly Burger Ho Ho Ho",
        price: 15.99,
        maxQuantity: 10,
        imageUrl: "../../images/jolly-burger.png"
    },
    {
        name: "8 Legged Burger",
        price: 12.99,
        maxQuantity: 10,
        imageUrl: "../../images/tarantula-burger.jpg"
    },
    {
        name: "Vector3 Burger",
        price: 12.99,
        maxQuantity: 10,
        imageUrl: "../../images/vector3-burger.png"
    },
    {
        name: "Harvey Burger",
        price: 12.99,
        maxQuantity: 10,
        imageUrl: "../../images/harvey-burger.jpeg"
    },
    {
        name: "Beanie Burger",
        price: 10.99,
        maxQuantity: 10,
        imageUrl: "../../images/beanie-burgers.jpg"
    },
    {
        name: "Ohio Nuggets",
        price: 10.99,
        maxQuantity: 10,
        imageUrl: "../../images/ohio-nugget.png"
    }
];


// Load stored menu
let stored = JSON.parse(localStorage.getItem("menuData"));


// Case 1: First load OR new version → overwrite with your updated menu
if (!stored || stored.version !== menuVersion) {
    stored = {
        version: menuVersion,
        items: menuItems
    };
    localStorage.setItem("menuData", JSON.stringify(stored));
}


// Final working menu used everywhere in the site
let menu = stored.items;