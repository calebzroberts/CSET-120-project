// Variable
if (currentEmail){} else {const currentEmail = localStorage.getItem('currentEmail')}
const ManageATag = document.getElementById("ManageLink")
const Profile = document.getElementById("Profile")

function CheckIfManagerThenShowATags(){
    if (currentEmail == 'YldGdVlXZGxja0IzWVdOcmVXSjFjbWRsY2k1amIyMD0='){
        ManageATag.style.display = "inline"
        Profile.style.backgroundImage = "url('../../images/manager-headshot.png')"
    } else if (currentEmail != "") {
        ManageATag.style.display = "none"
        Profile.style.backgroundImage = "url('../../images/user-headshot.png')"
    } else {
        ManageATag.style.display = "none"
        Profile.style.backgroundImage = "url('')"
    }
}

CheckIfManagerThenShowATags()

//manager headshot image name: "manager-headshot"