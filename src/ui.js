import { MUSIC_LIST } from "./musics.js";
import { AudioPlayer } from "./player.js";

const audioController = new AudioPlayer()

const forYouListingContainerRef = document.querySelector('.for-you-listing')
const topSongsContainerRef = document.querySelector('.top-song-chart')
const playlistContainerRef = document.querySelector('.playlist-chart')

const playlistModalContainerRef = document.querySelector('.playlist-container')
const closePlaylistModalRef = document.querySelector('.close-controller-container')

const forYouDeligationRef = document.querySelector('.for-you-listing')

const musicPlayerContianerRef = document.querySelector('.player-control-container')

const playButton = document.getElementById('play-button')
const prevButton = document.getElementById('prev-button')
const nextButton = document.getElementById('next-button')

const timeRangeRef = document.querySelector('.player-duration > input');
const volumeRangeRef = document.querySelector('.volume-control-container > input');

const searchInputRef = document.querySelector('.search-container>input')

var playlists = [
    {
        title: "This is Drake",
        description: "This is Drake. The essential tracks, all in one playlist.",
        cover_image: "https://i.scdn.co/image/ab67706f0000000287bff188c40608c48b82068f",
        songs: MUSIC_LIST.filter(music =>
            music.artist.some(artist => artist.name === "Drake")
        )
    }
]

volumeRangeRef.value = audioController.player.volume * 100


audioController.on('play', (e) => {
    // change play icon to pause icon
    playButton.innerHTML = `<ion-icon name="pause"></ion-icon>`

})

audioController.on('timeupdate', (e) => {
    const playedTime = audioController.player.currentTime
    const musicLength = audioController.player.duration;

    const percent = (playedTime / musicLength) * 100;
    // console.log(percent,timeRangeRef)
    timeRangeRef.style.background = `linear-gradient(to right, red ${percent}%, #ddd ${percent}%)`;

    timeRangeRef.value = percent;
})

audioController.on('ended', (e) => {

    if (audioController.playlistObject) {

        audioController.playlistObject.next()

        audioController.load(audioController.playlistObject.getCurrentSong())

        audioController.player.oncanplay = () => {
            audioController.play();
        };
        updateMediaPlayer()
    }

})

audioController.on('pause', () => {
    playButton.innerHTML = `<ion-icon name="play"></ion-icon>`

});


volumeRangeRef.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    audioController.player.volume = volume;
});


closePlaylistModalRef.addEventListener('click', () => {
    playlistModalContainerRef.classList.add('hidden')
})


forYouDeligationRef.addEventListener('click', (e) => {
    const elementClicked = e.target.closest('.album');
    if (elementClicked) {
        const index = parseInt(elementClicked.dataset.musicIndex);
        audioController.load(MUSIC_LIST[index]);
    }
    audioController.player.oncanplay = () => {
        audioController.clearPlaylist()
        audioController.play();
    };

    updateMediaPlayer()
})

playButton.addEventListener('click', e => {

    if (audioController.player.paused || audioController.player.ended) {
        audioController.play()
    } else {
        audioController.player.pause()
    }
})

document.querySelector('.top-song-chart').addEventListener('click', (e) => {
    const songClickRef = e.target.closest('.chart-item')

    if (songClickRef) {
        const index = parseInt(songClickRef.dataset.musicIndex)
        audioController.load(MUSIC_LIST[index]);
    }

    audioController.player.oncanplay = () => {
        audioController.clearPlaylist()
        audioController.play()

    }
    updateMediaPlayer()
})

prevButton.addEventListener('click', (e) => {


    if (audioController.playlistObject) {
        audioController.playlistObject.prev()

        audioController.load(audioController.playlistObject.getCurrentSong())

    } else {

        const randomIndex = Math.floor(Math.random() * MUSIC_LIST.length);
        audioController.clearPlaylist()
        audioController.load(MUSIC_LIST[randomIndex])
    }

    audioController.player.oncanplay = () => {
        audioController.play();
    };

    updateMediaPlayer()


})

nextButton.addEventListener('click', (e) => {

    if (audioController.playlistObject) {
        audioController.playlistObject.next()

        audioController.load(audioController.playlistObject.getCurrentSong())
    } else {
        const randomIndex = Math.floor(Math.random() * MUSIC_LIST.length);
        audioController.clearPlaylist()
        audioController.load(MUSIC_LIST[randomIndex])

    }
    audioController.player.oncanplay = () => {
        audioController.play();
    };

    updateMediaPlayer()
})

searchInputRef.addEventListener('input', (e) => {
    const searchTerm = e.target.value

    const filteredMusic = MUSIC_LIST.filter((track) =>
        track.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
    
    const filteredPlaylist = playlists.filter((playlist) =>
        playlist.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
    //    render play list and top song
    renderPlaylist(filteredPlaylist)
    renderTopSongs(filteredMusic)
})

renderForYou()
renderTopSongs()
renderPlaylist()

function updateMediaPlayer() {
    let isOpen = musicPlayerContianerRef.classList.contains('show-player')
    if (!isOpen) {
        musicPlayerContianerRef.classList.remove('hide-player')
        musicPlayerContianerRef.classList.add('show-player')
    }
    audioController.current
    // update media player info
    document.querySelector('.playing-music').innerHTML = `
        <div class="chart-item">
            <!-- album art -->
            <div class="album">
                <img src="${audioController.current.cover_image}"
                    alt="album art for ${audioController.current.title}" />
            </div>
            <!-- info container -->
            <div class="chart-info">
                <h4>${audioController.current.title}</h4>
                <p>${audioController.current.artist.map(({ name }) => name).join(", ")} ${audioController.current.album ? '- ' + audioController.current.album : "- Single"}</p>
            </div>
        </div>
     `

}


function updateSelectedPlaylistUi(playlist) {
    const playlistContainerRef = document.querySelector('.playlist-list-container')

    playlistContainerRef.innerHTML = `
        <div class="playlist-title">
            <!-- album art -->
            <div class="playlist-album">
                <img src="${playlist.cover_image}"
                    alt="playlist album art for ${playlist.title}" />
            </div>
            <!-- info container -->
            <div class="playlist-info">
                <h4>${playlist.title}</h4>
                <p>${playlist.description}</p>
                <p>${playlist.songs.length} Tracks</p>
            </div>
            <div class="spacer"></div>
        </div>
         <div class="playlist-action-container">
                        <button class="play-play-list">
                            ${audioController?.playlistInfo?.title !== playlist.title && audioController.player.paused ? 'Play' : "Pause"}
                        </button>
                        <button class="close-play-list">
                            Exit
                        </button>
                    </div>
        <h3>Tracks</h3>
        <!-- list tracks -->
        <div class="playlist-tracks">
            ${playlist.songs.map((track, index) =>
        `
                <div class="chart-item" data-playlist-track-index="${index}">
                        <!-- album art -->
                        <div class="album">
                            <img src="${track.cover_image}"
                                alt="album art for title" />
                        </div>
                        <!-- info container -->
                        <div class="chart-info">
                            <h4>${track.title}</h4>
                            <p>${track.artist.map(({ name }) => name).join(", ")} ${track.album ? '- ' + track.album : "- Single"}</p>
                        </div>
                        <div class="spacer"></div>
                        <p>${track.length}</p>
                </div>
                `
    ).join('')}
        </div>
    `;
    const playPlaylistButton = document.querySelector('.play-play-list')

    playPlaylistButton.addEventListener('click', (e) => {

        if (playPlaylistButton.textContent === "Pause") {

            audioController.pause();

            playPlaylistButton.textContent = "Play"

        }
        else {
            // now lets prep playlist to play
            audioController.setPlaylist(playlist)
            const starting_track = audioController.playlistObject.getCurrentSong()
            audioController.load(starting_track)

            audioController.player.oncanplay = () => {
                audioController.play();

                playPlaylistButton.textContent = "Pause"
            };
        }


        updateMediaPlayer()

    })

    document.querySelector('.playlist-tracks').addEventListener('click', (e) => {

        const clickedPlaylistTrack = e.target.closest('.chart-item')

        if (clickedPlaylistTrack) {

            const playlistTrackIndex = clickedPlaylistTrack.dataset.playlistTrackIndex

            audioController.setPlaylist(playlist, playlistTrackIndex)

            const starting_track = audioController.playlistObject.getCurrentSong()

            audioController.load(starting_track)

            audioController.player.oncanplay = () => {

                audioController.play();

                playPlaylistButton.textContent = "Pause"
            };

            updateMediaPlayer()
        }

    })

    document.querySelector('.close-play-list').addEventListener('click',()=>{
        playlistModalContainerRef.classList.add('hidden')
    })

}


function setSelectedPlaylist(playlist) {
    updateSelectedPlaylistUi(playlist)
    openPlaylistModal()
}


function openPlaylistModal(state = true) {
    const playlistContainer = document.querySelector('.playlist-container');
    if (state && playlistContainer.classList.contains('hidden')) {
        playlistContainer.classList.remove('hidden');
    } else if (!state && !playlistContainer.classList.contains('hidden')) {
        playlistContainer.classList.add('hidden');
    }
}

function renderPlaylist(playlists_ = playlists) {
    playlistContainerRef.innerHTML = "<h3>Playlist</h3>";
    playlists_.map((playlist, index) => {
        playlistContainerRef.innerHTML += `
         <div class="playlist chart-item" data-playlist=${index}>
            <!-- album art -->
            <div class="album">
                <img src="${playlist.cover_image}" alt="playlist art for ${playlist.title}" />
            </div>
            <!-- info container -->
            <div class="chart-info">
                <h4>${playlist.title}</h4>
                <p>${playlist.description}</p>
            </div>
            <div class="spacer"></div>
        </div>
        `
    })


    const playlistElements = document.querySelectorAll('.playlist.chart-item')
    playlistElements.forEach(el => {
        el.addEventListener('click', () => {
            setSelectedPlaylist(playlists[parseInt(el.dataset.playlist)])
        })
    })

}

function renderTopSongs(musicList =MUSIC_LIST ) {
    topSongsContainerRef.innerHTML = "<h3>Top Songs </h3>";
    musicList.map((music, index) => {
        topSongsContainerRef.innerHTML += `
         <div data-music-index="${index}" class="chart-item">
            <!-- album art -->
            <div class="album">
                <img src="${music.cover_image}" alt="album art for ${music.title}" />
            </div>
            <!-- info container -->
            <div class="chart-info">
                <h4>${music.title}</h4>
                <p>${music.artist.map(({ name }) => name).join(", ")} ${music.album ? '- ' + music.album : "- Single"}</p>
            </div>
            <div class="spacer"></div>
             <p>${music.length}</p>
        </div>
        `
    })
}

function renderForYou() {
    forYouListingContainerRef.innerHTML = "";
    MUSIC_LIST.slice(0, 10).map((music, index) => {
        forYouListingContainerRef.innerHTML += `
            <div data-music-index="${index}" class="album ${index === 0 && 'ml-1'} ${index === 9 && "mr-1"}">
                <img src="${music.cover_image}" />
            </div>`;
    });
}