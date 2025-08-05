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
let currentTrack            = null;
let progressTimer           = null;





async function initializeUI(){
    setupEventListeners();

    const isConnected = await window.api.isConnected();
    connectButton.textContent = isConnected ? 'Unlink' : 'Link';

    fetchTrackFromSpotify();
    setInterval(fetchTrackFromSpotify, 10000);
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

                        
        })

    })
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

            //console.log(tabContentList)

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
      //console.log('[Spotify] 🔌 Unlinked successfully.');
      return;
    }

    const clientId = clientIdInput.value.trim();
    const clientSecret = clientSecretInput.value.trim();

    if (!clientId || !clientSecret) {
      //console.log('[Spotify] Missing credentials.');
      return;
    }

    await window.api.setSpotifyCredentials({ clientId, clientSecret });

    // Update button to Unlink
    connectButton.textContent = 'Unlink';
    //console.log('[Spotify] 🔗 Linked successfully.');
  });
}




async function fetchTrackFromSpotify() {
  const data = await window.api.getCurrentTrack();

  if (!data) {
    clearInterval(progressTimer);
    currentTrack = null;
    updateNowPlayingUI(null);
    return;
  }

  currentTrack = {
    ...data,
    fetched_at: Date.now()
  };

  updateNowPlayingUI(currentTrack);
}

function updateNowPlayingUI(track) {

    console.log(track);
    
  const titleSpan = document.querySelector('.player-title__name');
  const artistSpan = document.querySelector('.player-title__artist');
  const thumbnailImg = document.querySelector('.thumbnail');
  const progressBar = document.querySelector('.progress-bar');

  if (!track) {
    titleSpan.textContent = 'Nothing Playing';
    artistSpan.textContent = '';
    thumbnailImg.src = 'assets/img/thumbnail_placeholder.jpg';
    progressBar.innerHTML = 'No Progress';
    return;
  }

  titleSpan.textContent = track.name;
  artistSpan.textContent = track.artists;
  if (track.thumbnail) thumbnailImg.src = track.thumbnail;

  clearInterval(progressTimer);

  progressTimer = setInterval(() => {
    const now = Date.now();
    const elapsed = now - track.fetched_at;
    let simulatedProgress = track.progress_ms + elapsed;

    if (simulatedProgress > track.duration_ms) {
      simulatedProgress = track.duration_ms;
      clearInterval(progressTimer); // stop ticking at end of song
    }

    const currentSec = Math.floor(simulatedProgress / 1000);
    const totalSec = Math.floor(track.duration_ms / 1000);
    const percent = (simulatedProgress / track.duration_ms) * 100;

    progressBar.innerHTML = `
      <div style="width: 100%; height: 5px; background: #333;">
        <div style="width: ${percent}%; height: 100%; background: #8C6EF2;"></div>
      </div>
      <span style="font-size: 12px; color: #ccc;">
        ${formatTime(currentSec)} / ${formatTime(totalSec)}
      </span>
    `;
  }, 1000);
}


function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}



window.addEventListener('DOMContentLoaded', initializeUI);