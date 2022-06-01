
const fs = require('fs');
const path = require('path');
const jsmediatags = require('jsmediatags');

window.addEventListener('DOMContentLoaded', ()=> {
    // LET'S GET LIST OF SONGS INSIDE MUSIC FOLDER
    // Get the path of the folder
    const road = path.join(__dirname, 'music');

    // Let's create an async function that will wait until all the songs inside
    //the music directory are loaded inside the array
    async function checkSongs() {
        const songsList = []; 
        // Accessing files
        const files = await fs.promises.readdir(road);

        // Loop through all songs and check if it's a mp3
        for (const file of files) {
            // Let get the access to the file
            const singleFile = path.join(__dirname, file);
            if (path.extname(singleFile) === ".mp3") {
                songsList.push(file)
            } else {
                console.log(`could not add ${file}, because it is not a mp3`);
            }
        }

        // Now let's dipslay/render our songs
        //Selecting the hmlt container
        const contentContainer = document.querySelector(".content-container");
        //Display the list of songs
        const addSongs = (container, list) => {
            for (let i = 0; i < list.length; i++) {
                // Create an element that will contain our song titles
                const element = document.createElement('li');
                element.id = i;
                const name = path.parse(path.join(__dirname, `${list[i]}`)).name;
                const elementContent = document.createTextNode(`${name}`);
                element.appendChild(elementContent);
                container.appendChild(element);
            }
        }
        addSongs(contentContainer, songsList)

        // ADDING FONCTINONNALITIES
        // Get neccessary elements
        const audio = document.querySelector('#audio');
        const songCover = document.querySelector('#cover');
        const songTitle = document.querySelector('.song-title-box');
        const artistName = document.querySelector('.artist-box');
        const albumName = document.querySelector('.album-box');
        const playBtn = document.querySelector('#play');
        const nextBtn = document.querySelector('#next');
        const prevBtn = document.querySelector('#prev');
        const navContainer = document.querySelector('.navigation-container');
        const allp = document.querySelectorAll('li');
        const progress = document.querySelector('.progress');
        const progressContainer = document.querySelector('.progress-container');
        const actualTime = document.querySelector('.actual-time');
        const contentsBox = document.querySelector('.contents-box');
        const commandBox = document.querySelector('.command-box');
        const maximizeAll = document.querySelector('.maximize');
        const minimizeAll = document.querySelector(".minimize");
        const opt = document.querySelector("#alb-songs");

        let selectValue = opt.options[opt.selectedIndex].text;
        console.log(selectValue);

        opt.addEventListener('change', () => {
            selectValue = opt.options[opt.selectedIndex].text;
            console.log(selectValue);
        })


        
        // Keep track of the songs and song meta data
        let sdata = {};

        let songIndex = 0;
        loadSong(songsList[songIndex]);

        // load Song and song meta data
        function loadSong(song) {
            songTitle.innerText = song;
            audio.src = `music/${song}`;
            jsmediatags.read(`music/${song}`, {
                onSuccess: (tag) => {
                    artistName.innerText = tag.tags.artist;
                    albumName.innerText = tag.tags.album;
                    songTitle.innerText = tag.tags.title;

                    // Get the art
                    const b64 = Buffer.from(tag.tags.picture.data).toString('base64');
                    const mimeType = tag.tags.format;
                    songCover.src = `data:${mimeType};base64,${b64}`;

                },
                onError:(error) => console.log(`${error.type}, ${error.info}`)
            });
            audio.addEventListener('timeupdate', updateProgress);
        }

        // Play Song
        function playSong() {
            navContainer.classList.add('play');
            playBtn.querySelector('.play-icon-tag').classList.add('hidden');
            playBtn.querySelector('.pause-icon-tag').classList.remove('hidden');
            audio.play()


        }

        // Pause Song
        function pauseSong() {
            navContainer.classList.remove('play');
            playBtn.querySelector('.pause-icon-tag').classList.add('hidden');
            playBtn.querySelector('.play-icon-tag').classList.remove('hidden');
            audio.pause()
        }

        // Prev
        function prevSong () {
            songIndex --

            if(songIndex < 0) {
                songIndex = songsList.length - 1;
            }

            loadSong(songsList[songIndex]);
            playSong()
        }

        // Next 
        function nextSong () {
            songIndex ++

            if (songIndex > songsList.length -1) {
                songIndex = 0;
            }
            loadSong(songsList[songIndex]);
            playSong();
        }

        // Create a song progress bar
        function updateProgress(e) {
            const {currentTime, duration} = e.srcElement
            const progressPercent = (currentTime / duration) * 100;
            progress.style.width = `${progressPercent}%`;

            //Get total duration in minutes and seconds
            let minutes = Math.floor(currentTime/60);
            let seconds = Math.floor(currentTime - minutes * 60);

            if (seconds < 10) {
                actualTime.innerText = `${minutes}:0${seconds}`
            } else {
                actualTime.innerText = `${minutes}:${seconds}`;
            }
        }

        function setProgress(e) {
            const width = this.clientWidth;
            const clickX = e.offsetX;
            const duration = audio.duration;

            audio.currentTime = (clickX/width) * duration;
        }
        // Get the id of a p element
        for (const oneP of allp) {
            oneP.addEventListener('click', () => {
                loadSong(songsList[oneP.id]);
                playSong();
            })
        }

        // Adding event
        playBtn.addEventListener('click', () => {
            if (navContainer.classList.contains('play')) {
                pauseSong();
            } else {
                playSong();
            }
        });

        minimizeAll.addEventListener('click', () => {
            maximizeAll.classList.remove('hidden');
            minimizeAll.classList.add('hidden');
            commandBox.classList.add('command-container-bis');
            commandBox.classList.remove('command-container');
            contentsBox.classList.add('hidden');
        });

        maximizeAll.addEventListener('click', () => {
            minimizeAll.classList.remove('hidden');
            maximizeAll.classList.add('hidden');
            commandBox.classList.add('command-container');
            commandBox.classList.remove('command-container-bis');
            contentsBox.classList.remove('hidden');

        })

        
        prevBtn.addEventListener('click', prevSong);
        nextBtn.addEventListener('click', nextSong);
        
        // Playing next song automatically
        audio.addEventListener('ended', nextSong);
        progressContainer.addEventListener('click', setProgress);

    }
    checkSongs();

})