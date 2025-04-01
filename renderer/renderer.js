const sidenavBtn    = document.getElementById('burgerMenu');
const burgerSVG     = document.getElementById('burger');
const sidenav       = document.getElementById('sidenav');
const tabItem       = document.querySelectorAll('.tab-item');






function initializeUI(){
    setupEventListeners();
}


function setupEventListeners(){
    
    sidenavBtn.addEventListener('click', () => sidenav.classList.toggle('active'));
    sidenavBtn.addEventListener('click', () => burgerSVG.classList.toggle('open'));

    tabItemSelector();
}

function tabItemSelector(){
    tabItem.forEach((tab) =>{
        tab.addEventListener('click', function(e){
            var target = e.currentTarget;

            tabItem.forEach(t => t.classList.remove('selected'));

            target.classList.add('selected');

        })
    })
}

window.addEventListener('DOMContentLoaded', initializeUI);