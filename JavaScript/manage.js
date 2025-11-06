// Get the current logged-in email
const currentEmail = localStorage.getItem('currentEmail');

// Only allow the manager email to access this page
if (currentEmail !== 'manager@wackyburger.com'){
    alert("You are not authorized to view this page.")
    SmartHref('Login');
}