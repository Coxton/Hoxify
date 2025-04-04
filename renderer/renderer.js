const sidenavBtn        = document.getElementById('burgerMenu');
const burgerSVG         = document.getElementById('burger');
const sidenav           = document.getElementById('sidenav');
const tabItem           = document.querySelectorAll('.tab-item');
const closeTab          = document.querySelectorAll('.close-tab');
const tabTrigger        = document.querySelectorAll('.tab-content');






function initializeUI(){
    setupEventListeners();
}


function setupEventListeners(){
    
    sidenavBtn.addEventListener('click', () => sidenav.classList.toggle('active'));
    sidenavBtn.addEventListener('click', () => burgerSVG.classList.toggle('open'));

    createTabContent();
    
    closeTabItem();

    tabItemSelector();
    
}

function createTabContent(){
    tabTrigger.forEach((trigger) =>{
        
        trigger.addEventListener('click', function(e){

            var target      = e.currentTarget;
            var dataTrigger = target.dataset.trigger;
            var currentTab  = document.querySelector(`.tab-item[data-tab="${dataTrigger}"]`);

            tabItem.forEach(t => t.classList.remove('selected'));


            //toggle visibility
            currentTab.classList.add('visible', 'selected');
            
        })

    })
}

function tabItemSelector(){
    tabItem.forEach((tab) =>{
        tab.addEventListener('click', function(e){
            var target = e.currentTarget;

            if(target.classList.contains('visible')){
                tabItem.forEach(t => t.classList.remove('selected'));
            }

            target.classList.add('selected');

        })
    })
}

function closeTabItem(){
    closeTab.forEach((close) =>{
        close.addEventListener('click', function(e){
            var target = e.currentTarget;

            target.parentElement.classList.remove('selected', 'visible');

            tabItem.forEach(t => t.classList.remove('selected'));

            document.querySelector('[data-tab="queue"]').classList.add('selected');
        })
    })
}

window.addEventListener('DOMContentLoaded', initializeUI);