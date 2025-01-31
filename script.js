console.log('Hello, world!');
let currentSong= new Audio();

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
async function getSongs(){
    let a = await fetch ("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as=div.getElementsByTagName("a")
    let songs = [];
    for(let i=0;i<as.length;i++){
        const element = as[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1]);
        }
       
    }
    return songs;
}
const playMusic = (track, pause= false)=>{
    currentSong.src = "/songs/"+track;
    if(!pause){
        currentSong.play();
        play.src = "images/pause.svg";
    }
    document.querySelector('.songInfo').innerHTML = decodeURI(track);
    document.querySelector('.songTime').innerHTML = "00:00 / 00.00";}
async function main(){
    

    let songs = await getSongs()
    playMusic(songs[0], true);
    // show all the songs in the playlist
    let songUL=document.querySelector('.songList').getElementsByTagName('ul')[0];
    for(const song of songs){
        songUL.innerHTML+=` <li>
                            <img class="invert" src="images/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>song artist</div>
                            </div>
                            <div class="playNow">

                                <span>Play Now</span>
                                <img class="invert" src="images/play.svg" alt="">
                            </div>
                        </li>`
    }

    //attach an event listener to each song
    Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach(e=>{
        e.addEventListener('click', element =>{
            console.log(e.querySelector('.info').firstElementChild.innerHTML)
            playMusic(e.querySelector('.info').firstElementChild.innerHTML.trim());
        })
    })
    
  //attach an event listener to the play, next and previous buttons
  play.addEventListener('click',()=>{
    if (currentSong.paused) {
        currentSong.play();
        play.src = "images/pause.svg";
    }
    else {
        currentSong.pause();
        play.src = "images/play.svg";
    }
  }) 

  //listen to the timeupdate event to update the time
   currentSong.addEventListener('timeupdate',()=>{
    let time = formatTime(currentSong.currentTime);
    let duration = formatTime(currentSong.duration);
    document.querySelector('.songTime').innerHTML = `${time} / ${duration}`;
    document.querySelector('.circle').style.left = `${currentSong.currentTime/currentSong.duration*100}%`;
  })
  //add an event listener to the seekbar
    document.querySelector('.seekbar').addEventListener('click',e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left=percent+"%";
        currentSong.currentTime= ((currentSong.duration)*percent)/100;
    })
} 
main()



