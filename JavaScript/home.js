//FOR HOME PAGE USE ONLY
const visibleItems = 3;
let currentIndex = 0;

//dynamically loads menu from the database onto the home page
function LoadMenu() {
    const fullMenu = JSON.parse(localStorage.getItem('menu')) || [];

    const menuContainer = document.getElementById("menuPreviewWindow");
    menuContainer.innerHTML = "";

    for (let j = 0; j < fullMenu.length; j++) {
        const div = document.createElement("div");
        div.classList.add("homeMenuItem");


        div.innerHTML = `
            <img class="homeItemImage" src="${fullMenu[j].imageUrl}">
            <h3 class="homeFoodName">${fullMenu[j].name}</h3>
            <p class="homeItemPrice">$${fullMenu[j].price.toFixed(2)}</p>
        `;
        menuContainer.append(div);
    }
}


//functions for moving the short menu section carousel on the home page
function slideMenu(direction) {
    const menuContainer = document.getElementById("menuPreviewWindow");
    const items = menuContainer.querySelectorAll(".homeMenuItem");
    const totalItems = items.length;

    currentIndex += direction;

    // Infinite loop behavior
    if (currentIndex < 0) {
        currentIndex = totalItems - visibleItems;
    } else if (currentIndex > totalItems - visibleItems) {
        currentIndex = 0;
    }

    const slideWidth = items[0].offsetWidth + 15; // margin spacing
    menuContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

LoadMenu();

// Auto-scroll every 4 seconds
setInterval(() => {
    slideMenu(1);
}, 4000);

//Behavior for submitting form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', (event) => {
        // Prevent the default form submission
        event.preventDefault();

        const submitButton = document.getElementById("submit");

        submitButton.innerText = "Sent! Thanks!";
        submitButton.style.cursor = "wait";
        submitButton.disabled = true;
        
        setTimeout(() => {
            form.reset();
            submitButton.innerText = "Send Message";
            submitButton.disabled = false;
            submitButton.style.cursor = "pointer";
        }, 2000);

    });
  });