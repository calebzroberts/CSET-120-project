// Sidebar for mobile devices
var IsOpen = 0

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.getElementById('sidebar-menu');
    const closeBtn = sidebar.querySelector('.close-btn');

    hamburger.addEventListener('click', () => {
        if (IsOpen == 0){
            sidebar.classList.add('active');
            IsOpen = 1;
        } else if (IsOpen == 1){
            sidebar.classList.remove('active');
            IsOpen = 0;
        }
    });

    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
        IsOpen = 0;
    });
});