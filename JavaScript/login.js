// Manager account information
const managerAccount = {
    email: 'manager@wackyburger.com',
    password: 'WackyAdmin123',
    firstName: 'Manager',
    lastName: 'Account'
};


const loginForm = document.getElementById('loginForm');

if (loginForm){
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const msg = document.getElementById('loginMessage');

        msg.textContent = '';
        msg.classList.remove('success', 'error');

        // Retrieve stored data from signup
        const storedEmail = localStorage.getItem('wb_email');
        const storedPassword = localStorage.getItem('wb_password');
        const storedFirstName = localStorage.getItem('wb_firstName');
        const storedLastName = localStorage.getItem('wb_lastName');

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

            localStorage.setItem('currentEmail', managerAccount.email);

            setTimeout(() => {
                SmartHref('Manage');
            }, 1500);
            return;
        }

        // Check if the account exists
        if (!storedEmail || !storedPassword){
            msg.textContent = 'No account found. Please sign up first.';
            triggerErrorAnimation(msg);
            return;
        }

        // Validate login credentials
        if (email === storedEmail && password === storedPassword){
            msg.textContent = `Welcome back, ${storedFirstName || ''} ${storedLastName || ''}!`.trim();
            msg.classList.add('success');

            // Redirect after a short delay
            setTimeout(() => {
                SmartHref('Home');
            }, 1500);
        } else{
            msg.textContent = 'Invalid email or password.';
            triggerErrorAnimation(msg);
        }

        loginForm.reset();
    });
}


// Error animation
function triggerErrorAnimation(element){
    element.classList.add('error');
    element.style.animation = 'shake 0.3s';
    element.addEventListener('animationend', () =>{
        element.style.animation = '';
    }, {once: true});
}