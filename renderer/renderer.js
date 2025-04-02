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

            console.log(dataTrigger);



            const tabContainer = document.querySelector('.tabs-section');

            if (tabContainer.querySelector(`[data-tab="${dataTrigger}"]`)) {
                console.log(`Tab '${dataTrigger}' already deployed. Holding position.`);
                return;
              }

            //create new Tab

            const tabHtml = 
            `
            <div class="tab-item" data-tab="${dataTrigger}">
                <svg class="close-tab" data-target="closeSettings" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 24 24" fill="currentColor">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path d="M17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289Z" fill="#FFFAFA"/>
                </g>
                </svg>
                <span class="tab-item__text">Settings</span>
            </div>
            `;

            tabContainer.insertAdjacentHTML('beforeend', tabHtml);
            

        })

    })
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

function closeTabItem(){
    closeTab.forEach((close) =>{
        close.addEventListener('click', function(e){
            console.log(e.currentTarget);
        })
    })
}

window.addEventListener('DOMContentLoaded', initializeUI);