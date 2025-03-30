const sidenavBtn    = document.getElementById('burgerMenu');
const sidenav       = document.getElementById('sidenav');
const sidenavClose  = document.getElementById('closebtn'); 






function initializeUI(){
    setupEventListeners();
}


function setupEventListeners(){
    sidenavBtn.addEventListener('click', () => sidenav.classList.toggle('active'));
    sidenavClose.addEventListener('click', () => sidenav.classList.toggle('active'));
}


window.addEventListener('DOMContentLoaded', initializeUI);