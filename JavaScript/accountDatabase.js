const accountsList = [
    {
        firstName,
        lastName,
        email,
        password,
        rewardPoints
    }
];

if (!localStorage.getItem("accounts"))
{
    localStorage.setItem("accounts", JSON.stringify(accountsList));
}
// Load the orders from localStorage
let accounts = JSON.parse(localStorage.getItem("accounts"));