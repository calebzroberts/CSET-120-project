

// Global variable, safely reused across all pages
window.currentEmail = window.currentEmail || localStorage.getItem('currentEmail') || "";
const ManageATag = document.getElementById("ManageLink")
const ManageATag2 = document.getElementById("ManageLink2")
const LoginATag = document.getElementById("logInOutButton");
const LoginATag2 = document.getElementById("logInOutButton2")
const ManageATagFooter = document.getElementById("ManageLink2")
const Profile = document.getElementById("Profile")
const Profile2 = document.getElementById("Profile2")

function CheckIfManagerThenShowATags(){
    if (currentEmail == 'YldGdVlXZGxja0IzWVdOcmVXSjFjbWRsY2k1amIyMD0='){
        ManageATag.style.display = "inline"
        ManageATag2.style.display = "inline"
        ManageATagFooter.style.display = "block"
        Profile.style.backgroundImage = "url('../../images/manager-headshot.png')"
        Profile.style.display = "inline"
        Profile.onclick = function() {
            SmartHref('Manage');
        };

        //change it to say logout
        LoginATag.innerText = "Log Out";
        LoginATag2.innerText = "Log Out";
    } else if (currentEmail != "") {
        ManageATag.style.display = "none"
        ManageATag2.style.display = "none"
        ManageATagFooter.style.display = "none"
        Profile.style.backgroundImage = "url('../../images/user-headshot.png')"
        Profile.style.display = "inline"
        Profile.onclick = function() {
            SmartHref('Account');
        };

        //change it to say logout
        LoginATag.innerText = "Log Out";
        LoginATag2.innerText = "Log Out";
    } else {
        ManageATag.style.display = "none"
        ManageATag2.style.display = "none"
        ManageATagFooter.style.display = "none"
        Profile.style.backgroundImage = "url('')"
        Profile.style.display = "none"
        Profile.onclick = '';
        
        //change it to say login
        LoginATag.innerText = "Log In";
        LoginATag2.innerText = "Log In";
    }
}

function CheckUserCheckout()
{
    // Variable
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0)
    {
        document.getElementById("CheckoutBtn").style.display = "none";
    }
    else
    {
        document.getElementById("CheckoutBtn").style.display = "inline";
    }
}

CheckIfManagerThenShowATags()
CheckUserCheckout();

//detect if user is logged in or out and do the appropriate action
function LogInOut() 
{
    //reset current email to log user out if user clicks logout
    if (currentEmail != "")
    {
        localStorage.setItem('currentEmail', "");
        window.currentEmail = window.currentEmail || localStorage.getItem('currentEmail') || "";
    }
}

//manager headshot image name: "manager-headshot"

// Decrypts Email //
function GetEmail(){
    var UncryptedEmail = btoa(currentEmail)
    return(UncryptedEmail)
}