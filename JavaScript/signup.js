const signupForm = document.getElementById('signupForm');

let usersList = JSON.parse(localStorage.getItem('accounts')) || [];

if (signupForm){
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const msg = document.getElementById('signupMessage');

        msg.textContent = '';
        msg.classList.remove('success', 'error');

        if (!firstName || !lastName || !email || !password || !confirmPassword){
            msg.textContent = 'Please fill in all fields.';
            triggerErrorAnimation(msg);
            return;
        }

        if (CheckIfDuplicateUser(email)){
            msg.textContent = 'Email is already taken';
            triggerErrorAnimation(msg);
            return;
        }

        if(password !== confirmPassword){
            msg.textContent = 'Passwords do not match.';
            triggerErrorAnimation(msg);
            return;
        }

        // Create proper user object
        const newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        };

        usersList.push(newUser);

        // Store correct JSON string
        localStorage.setItem('accounts', JSON.stringify(usersList));

        msg.textContent = 'Account Created - You may now log in.';
        msg.classList.add('success');

        signupForm.reset();
    });
}

// Checks if email is in the database
function CheckIfDuplicateUser(email){
    return usersList.some(user => user.email === email);
}

function triggerErrorAnimation(element){
    element.classList.add('error');
    element.style.animation = 'shake 0.3s';
    element.addEventListener('animationend', () =>{
        element.style.animation = '';
    }, {once: true});
}
