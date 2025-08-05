//sidenav vars
const sidenavBtn            = document.getElementById('burgerMenu');
const burgerSVG             = document.getElementById('burger');
const sidenav               = document.getElementById('sidenav');

//tabwindow vars
const tabItem               = document.querySelectorAll('.tab-item');
const closeTab              = document.querySelectorAll('.close-tab');
const tabTrigger            = document.querySelectorAll('.tab-content');
const contentList           = document.querySelectorAll(".content-list");
const contentDetail         = document.querySelectorAll(".content-detail");

//account vars
const clientIdInput         = document.getElementById('clientId');
const clientSecretInput     = document.getElementById('clientSecret');
const connectButton         = document.getElementById('connectSpotify');





function initializeUI(){
    setupEventListeners();
}


function setupEventListeners(){
    
    sidenavBtn.addEventListener('click', () => sidenav.classList.toggle('active'));
    sidenavBtn.addEventListener('click', () => burgerSVG.classList.toggle('open'));

    //tab related functions
    createTabContent();
    closeTabItem();
    tabItemSelector();

    //account related functions
    spotifyConnect();
    
}

function createTabContent(){
    tabTrigger.forEach((trigger) =>{
        
        trigger.addEventListener('click', function(e){

            var target                      = e.currentTarget;
            var dataTrigger                 = target.dataset.trigger;
            var currentTab                  = document.querySelector(`.tab-item[data-tab="${dataTrigger}"]`); 
            var tabContentList              = document.querySelector(`.content-list[data-content="${dataTrigger}"]`);
            var tabContentDetail            = document.querySelector(`.content-detail[data-content="${dataTrigger}"]`)


            tabItem.forEach(t => t.classList.remove('selected'));


            //toggle visibility
            currentTab.classList.add('visible', 'selected');


            contentDetail.forEach(cd => cd.classList.remove('visible'));
            contentList.forEach(cl => cl.classList.remove('visible'));


            tabContentList.classList.add('visible');
            tabContentDetail.classList.add('visible');

            

            

            //lazyloadFragment(dataTrigger);
            
        })

    })
}

function lazyloadFragment(filename){
    const target = document.querySelector('.content-section');
    
    

    
}

function tabItemSelector(){
    tabItem.forEach((tab) =>{
        tab.addEventListener('click', function(e){
            var target                      = e.currentTarget;
            var dataTab                     = target.dataset.tab;
            var tabContentList              = document.querySelector(`.content-list[data-content="${dataTab}"]`);
            var tabContentDetail            = document.querySelector(`.content-detail[data-content="${dataTab}"]`)

            if(target.classList.contains('visible')){
                tabItem.forEach(t => t.classList.remove('selected'));
            }

            if(target.classList.contains('visible')){
                contentDetail.forEach(cd => cd.classList.remove('visible'));
                contentList.forEach(cl => cl.classList.remove('visible'));
            }
            target.classList.add('selected');

            console.log(tabContentList)

            tabContentList.classList.add('visible');
            if(tabContentDetail && contentDetail.dataset !== dataTab && contentList.dataset !== dataTab){
                 tabContentDetail.classList.add('visible');
            }
           

        })
    })
}

function closeTabItem(){
    closeTab.forEach((close) =>{
        close.addEventListener('click', function(e){
            var target = e.currentTarget;

            target.parentElement.classList.remove('selected', 'visible');

            tabItem.forEach(t => t.classList.remove('selected'));

            contentDetail.forEach(cd => cd.classList.remove('visible'));
            contentList.forEach(cl => cl.classList.remove('visible'));

            document.querySelector('[data-tab="queue"]').classList.add('selected');

            document.querySelector('[data-content="queue"]').classList.add('visible');
        })
    })
}



function spotifyConnect() {
  connectButton.addEventListener('click', async () => {
    const isConnected = await window.api.isConnected();

    if (isConnected) {
      await window.api.unlink();
      connectButton.textContent = 'Link';
      console.log('[Spotify] 🔌 Unlinked successfully.');
      return;
    }

    const clientId = clientIdInput.value.trim();
    const clientSecret = clientSecretInput.value.trim();

    if (!clientId || !clientSecret) {
      console.log('[Spotify] Missing credentials.');
      return;
    }

    await window.api.setSpotifyCredentials({ clientId, clientSecret });

    // Update button to Unlink
    connectButton.textContent = 'Unlink';
    console.log('[Spotify] 🔗 Linked successfully.');
  });
}

async function initializeUI() {
  setupEventListeners();

  const isConnected = await window.spotifyAPI.isConnected();
  connectButton.textContent = isConnected ? 'Unlink' : 'Link';
}


window.addEventListener('DOMContentLoaded', initializeUI);