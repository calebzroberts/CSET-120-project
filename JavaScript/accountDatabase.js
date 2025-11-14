const accountsList = [
    {
        firstName,
        lastName,
        email,
        password
    }
];


localStorage.setItem("accounts", JSON.stringify(accountsList));
// Load the orders from localStorage
let accounts = JSON.parse(localStorage.getItem("accounts"));