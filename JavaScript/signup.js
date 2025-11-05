const signupForm = document.getElementById('signupForm');

if (signupForm){
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const msg = document.getElementById('signupMessage');


        // Reset message
        msg.textContent = '';
        msg.classList.remove('success', 'error');


        // Check for missing fields
        if (!firstName || !lastName || !email || !password || !confirmPassword){
            msg.textContent = 'Please fill in all fields.';
            triggerErrorAnimation(msg);
            return;
        }
        

        // Validate passwords
        if(password !== confirmPassword){
            msg.textContent = 'Passwords do not match.'
            triggerErrorAnimation(msg);
            return;
        }

        localStorage.setItem('wb_firstName', firstName);
        localStorage.setItem('wb_lastName', lastName);
        localStorage.setItem('wb_email', email);
        localStorage.setItem('wb_password', password);

        msg.textContent = 'Accoubt Created - You may now log in.'
        msg.classList.add('success');
        
        signupForm.reset();
    });
};