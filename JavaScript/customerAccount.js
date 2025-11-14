//get users list
const usersList = JSON.parse(localStorage.getItem('accounts')) || [];

//get current user info
const currentEmail = localStorage.getItem('currentEmail');
const currentFirstName = localStorage.getItem('currentFirstName');
const currentLastName = localStorage.getItem('currentLastName');


//Display order section
function DisplayCustomerOrders()
{
    document.getElementById("viewOrdersToggle").style.display = "block";
    document.getElementById("editInfoSection").style.display = "none";
   
    //cancel any unsaved changes
    CancelEdit();
}

//Display account section
function DisplayAccountDetails()
{
    document.getElementById("viewOrdersToggle").style.display = "none";
    document.getElementById("editInfoSection").style.display = "block";

}

//Fill account information
function FillAccountInfo()
{
    document.getElementById("editInfoSection").innerHTML = `
    <div id="custInfoContainer">
        <div>
            <p><strong>First Name:</strong> ${currentFirstName}</p>
            <p><strong>Last Name:</strong> ${currentLastName}</p>
            <p><strong>Email:</strong> ${currentEmail}</p>
            <p><strong>Password:</strong> ${GetPasswordWithEmail(currentEmail)}</p>
        </div>
    </div>
        
    <button id="editButton" onclick="EditInfo();">Edit Details</button>

    <p id="signupMessage"></p>
    `;
}

//retrieves current user's password
function GetPasswordWithEmail(email)
{
    for (let i = 0; i < usersList.length; i++)
    {
        if (usersList[i].email === email)
        {
            return usersList[i].password;
        }
    }
}

//Edit Account Details
function EditInfo()
{
    document.getElementById("editInfoSection").innerHTML = `
    <div id="custInfoContainer">
        <div id="custInfoTitles">
            <label for="First Name">First Name:</label>
            <label for="Last Name">Last Name:</label>
            <label for="Email">Email:</label>
            <label for="Password">Password:</label>
        </div>

        <div id="custInfoEditBoxes">
            <input type="text" value="${currentFirstName}" name="First Name" id="firstName" onchange="ShowSaveButton();">
            <input type="text" value="${currentLastName}" name="Last Name" id="lastName" onchange="ShowSaveButton();">
            <input type="text" value="${currentEmail}" name="Email" id="email" onchange="ShowSaveButton();">
            <input type="text" value="${GetPasswordWithEmail(currentEmail)}" name="Password" id="password" onchange="ShowSaveButton();">
        </div>
    </div>
        
    <button id="saveButton" onclick="SaveChanges();">Save Changes</button>

    <button id="cancelButton" onclick="FillAccountInfo(); CancelEdit();">Cancel</button>

    <p id="signupMessage"></p>
    `;

    
    //hide save button
    document.getElementById("saveButton").style.display = "none";
}

//Resets edited variables
function CancelEdit()
{
    const currentEmail = localStorage.getItem('currentEmail');
    const currentFirstName = localStorage.getItem('currentFirstName');
    const currentLastName = localStorage.getItem('currentLastName');
}

//Check if account details are legitimate
function CheckDetailsOk(email)
{
    //runs through all accounts and makes sure email isn't taken
    for (let i = 0; i < usersList.length; i++)
    {
        if (usersList[i].email === email) return false;
    }

    return true;
}

//Displays error message for 3 seconds
function DisplayError(message)
{
    document.getElementById('signupMessage').innerText = message;
    setTimeout(() => {
        document.getElementById('signupMessage').innerText = '';
    }, 2000);
}

//Only shows save button if changes are made
function ShowSaveButton()
{
    document.getElementById("saveButton").style.display = "inline-block";
}

//Save Account details - also go into every order with that old email and change it to the new email
function SaveChanges()
{
    const newFirstName = document.getElementById("firstName").value.trim();
    const newLastName  = document.getElementById("lastName").value.trim();
    const newEmail     = document.getElementById("email").value.trim();
    const newPassword  = document.getElementById("password").value;


    if (CheckDetailsOk(newEmail) === false)
    {
        DisplayError('That email is already taken!');
        return;
    }

    console.log(newFirstName, newLastName, newEmail, newPassword);
}

//Display only orders for that email

//Filter or sort emails


//at page load, display customer info
DisplayAccountDetails();

FillAccountInfo();