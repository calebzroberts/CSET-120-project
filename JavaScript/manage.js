// Get the current logged-in email
const currentEmail = localStorage.getItem('currentEmail');

// Only allow the manager email to access this page
if (currentEmail !== 'YldGdVlXZGxja0IzWVdOcmVXSjFjbWRsY2k1amIyMD0='){
    alert("You are not authorized to view this page.")
    SmartHref('Login');
}