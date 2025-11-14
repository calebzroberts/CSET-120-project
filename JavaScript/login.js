// Manager account information
const managerAccount = {
    email: 'manager@wackyburger.com',
    password: 'WackyAdmin123',
    firstName: 'Manager',
    lastName: 'Account',
    EncyptedEmail: 'YldGdVlXZGxja0IzWVdOcmVXSjFjbWRsY2k1amIyMD0='
};

const usersList = JSON.parse(localStorage.getItem('accounts')) || [];

let thisUserFirstName;
let thisUserLastName;
let thisUserEmail;

const loginForm = document.getElementById('loginForm');

if (loginForm){
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const msg = document.getElementById('loginMessage');

        msg.textContent = '';
        msg.classList.remove('success', 'error');

        // Validate fields
        if (!email || !password){
            msg.textContent = 'Please fill in all fields.';
            triggerErrorAnimation(msg);
            return;
        }

        // Check if the user is a manger
        if (email === managerAccount.email && password === managerAccount.password){
            msg.textContent = `Welcome back, ${managerAccount.firstName}!`;
            msg.classList.add('success');

            const encodedEmail = btoa(managerAccount.email);
            const trueEncodedEmail = btoa(encodedEmail);
            localStorage.setItem('currentEmail', trueEncodedEmail);

            setTimeout(() => {
                SmartHref('Manage');
            }, 1500);
            return;
        }

        // Check if the account exists
        if (CheckEmailExists(email) === false){
            msg.textContent = 'No account found. Please sign up first.';
            triggerErrorAnimation(msg);
            return;
        }

        // Validate login credentials
        if (CheckPasswordMatches(email, password) === true){
            msg.textContent = `Welcome back, ${thisUserFirstName || ''} ${thisUserLastName || ''}!`.trim();
            msg.classList.add('success');

            localStorage.setItem("currentEmail", thisUserEmail);
            localStorage.setItem("currentFirstName", thisUserFirstName);
            localStorage.setItem("currentLastName", thisUserLastName);

            // Redirect after a short delay
            setTimeout(() => {
                SmartHref('Account');
            }, 500);
        } else{
            msg.textContent = 'Invalid email or password.';
            triggerErrorAnimation(msg);
        }

        loginForm.reset();
    });
}

//Makes sure email exists in database
function CheckEmailExists(email)
{
    for (let i = 0; i < usersList.length; i++)
    {
        if (usersList[i].email === email)
            return true;
    }
    
    return false;
}

//Makes sure password matches that email
function CheckPasswordMatches(email, password)
{
    for (let i = 0; i < usersList.length; i++)
    {
        if (usersList[i].email === email && usersList[i].password === password)
        {
            thisUserFirstName = usersList[i].firstName;
            thisUserLastName = usersList[i].lastName;
            thisUserEmail = usersList[i].email;
            return true;
        }
    }
    
    return false;
}


// Error animation
function triggerErrorAnimation(element){
    element.classList.add('error');
    element.style.animation = 'shake 0.3s';
    element.addEventListener('animationend', () =>{
        element.style.animation = '';
    }, {once: true});
}