// Variable
// Global variable, safely reused across all pages
window.currentEmail = window.currentEmail || localStorage.getItem('currentEmail') || "";
const ManageATag = document.getElementById("ManageLink")
const LoginATag = document.getElementById("logInOutButton");
const ManageATagFooter = document.getElementById("ManageLink2")
const Profile = document.getElementById("Profile")

function CheckIfManagerThenShowATags(){
    if (currentEmail == 'YldGdVlXZGxja0IzWVdOcmVXSjFjbWRsY2k1amIyMD0='){
        ManageATag.style.display = "inline"
        ManageATagFooter.style.display = "block"
        Profile.style.backgroundImage = "url('../../images/manager-headshot.png')"
        Profile.style.display = "inline"
        //change it to say logout
        LoginATag.innerText = "Log Out";
    } else if (currentEmail != "") {
        ManageATag.style.display = "none"
        ManageATagFooter.style.display = "none"
        Profile.style.backgroundImage = "url('../../images/user-headshot.png')"
        Profile.style.display = "inline"
        //change it to say logout
        LoginATag.innerText = "Log Out";
    } else {
        ManageATag.style.display = "none"
        ManageATagFooter.style.display = "none"
        Profile.style.backgroundImage = "url('')"
        Profile.style.display = "none"
        //change it to say login
        LoginATag.innerText = "Log In";
    }
}

CheckIfManagerThenShowATags()

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