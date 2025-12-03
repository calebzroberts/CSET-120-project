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

function UpdateOrderProgress(orderId, newValue) {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const target = orders.find(o => o.orderId === orderId);
    if (!target) return;

    target.progressValue = Math.min(100, Math.max(0, newValue));

    if (target.progressValue >= 100) {
        target.fulfilled = true;
    }

    localStorage.setItem("orders", JSON.stringify(orders));
}