//***Selectors***
const selector = document.getElementById("file-selector");
const selectorContainer = document.getElementById("file-selector-container");
const container = document.querySelector(".play-container");
const sound = document.getElementById("sound");
const playlist = document.getElementById("playlist");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const playButton = document.getElementById("stop-play");
let currentPosition;
const progressBar = document.querySelector(".progress-bar");
const progressBarBelow = document.querySelector(".progress");
let mousedown = false;
const timer = document.querySelector(".timer");
const volumeSlider = document.querySelector(".player__slider");
const playlistContainer = document.querySelector("#playlist-container");


//****Functions***
function loadSongs(position){  
    sound.src = URL.createObjectURL(selector.files[position])
    sound.addEventListener("end", () => {
        URL.revokeObjectURL(sound.src);
    })
    currentPosition = position;
    playlistActive();
}

function playlistActive(){
    const playlistItems = Array.from(document.querySelectorAll("li"));
    playlistItems.forEach(song => song.classList.remove("active"));
    playlistItems[currentPosition].classList.add("active");
}

function createPlaylist(){
    let playlistTitles = "";
    for (let index = 0; index < selector.files.length; index++) {
        //remove file extension
        let cleanName = selector.files[index].name.replace(/\.[^/.]+$/, "");

        //template for every list item
        playlistTitles += `<li class="list-group-item" data-position="${index}">${cleanName}</li>`
    }
    playlist.innerHTML = playlistTitles;
    //add class to file selector
    container.classList.add("active");
    selector.style.display = "none";
    selectorContainer.style.display = "none";
    playlistContainer.classList.remove("d-none");
}

function songSelector(e){
    if(!e.target.matches("li")) return;
    loadSongs(e.target.dataset.position);
    sound.pause();
    setTimeout(() => {
        getTime();
      }, 5);
      playButton.innerHTML = sound.paused ? `<i class="bi bi-play-fill"></i>` : `<i class="bi bi-pause-fill"></i>` ;    
}

function playToggle(){
    playButton.innerHTML = !sound.paused ? `<i class="bi bi-play-fill"></i>` : `<i class="bi bi-pause-fill"></i>` ;
    method = sound.paused ? 'play' : 'pause';
    sound[method]();
}

function changeSong(e){
    console.log(e.target.dataset.order)
    currentPosition = parseInt(currentPosition) + parseInt(e.target.dataset.order);
    if(currentPosition > selector.files.length-1){
        currentPosition = "0";
    }
    if(currentPosition < "0"){
        currentPosition = selector.files.length-1;
    }
    loadSongs(currentPosition);
    sound.pause();
    setTimeout(() => {
        getTime();
      }, 10);
    playButton.innerHTML = sound.paused ? `<i class="bi bi-play-fill"></i>` : `<i class="bi bi-pause-fill"></i>` ;
}

//Player bar progress
function handleProgress(){
    const percentage = (sound.currentTime / sound.duration)*100;
    progressBar.style.flexBasis = `${percentage}%`;
    getTime();
}

function selectTime(e) {
    const newTime = (e.offsetX / progressBarBelow.offsetWidth) * sound.duration;
    sound.currentTime = newTime;
}

//Volume update
function handleRangeUpdate(){
    sound[this.name] = this.value
}

//timer function
function getTime(){
    const songMinutes = Math.floor(sound.duration/60);
    const songSeconds = Math.floor(sound.duration%60);

    if(sound.currentTime < 60){
        minutes = "0";
        seconds = Math.floor(sound.currentTime);
        if(seconds < 10){
            seconds = `0${seconds}`
        }
    }
    if(sound.currentTime > 60){
        minutes = Math.floor(sound.currentTime/60);
        seconds = Math.floor(sound.currentTime%60);
        if(seconds < 10){
            seconds = `0${seconds}`
        }
    }

    if(sound.currentTime == sound.duration){
        loadSongs(parseInt(currentPosition)+1);
        sound.play();
    }

    timer.innerHTML = `${minutes}:${seconds} / ${songMinutes}:${songSeconds}`;
}


//***Event Listeners***

//load playlist
selector.addEventListener("change", createPlaylist);
selector.addEventListener("change", () => loadSongs("0"));

//change songs
playlist.addEventListener("click", songSelector);
prevButton.addEventListener("click", changeSong);
nextButton.addEventListener("click", changeSong);
playButton.addEventListener("click", playToggle);

//time updates
sound.addEventListener("timeupdate", handleProgress);

progressBarBelow.addEventListener("click", selectTime);
progressBarBelow.addEventListener("mousedown", () => mousedown = true);
progressBarBelow.addEventListener("mouseup", () => mousedown = false);
progressBarBelow.addEventListener("mousemove", (e) => mousedown && selectTime(e));

//sound volume
volumeSlider.addEventListener("change", handleRangeUpdate);
volumeSlider.addEventListener("mousemove", handleRangeUpdate);