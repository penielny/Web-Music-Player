import { Playlist } from "./playlist.js"

export class AudioPlayer {

    constructor(playlist = null) {
        this.player = new Audio()
        this.playlist = playlist
        this.current = null
        this.playlistInfo = null
    }

    setPlaylist(playlist, index = 0) {
        this.playlist = [...playlist?.songs]
        this.playlistInfo = playlist.playlist;
        this.playlistObject = new Playlist(playlist?.songs, index)
    }

    clearPlaylist(){
        this.playlist = null
        this.playlistObject= null
        this.playlistInfo = null
    }

    load(music) {
        this.player.src = `./assets/sounds/${music.src}`;
        this.current = music;
    }

    play() {
        this.player.play();
    }

    pause() {
        this.player.pause();
    }

    stop() {
        this.player.pause();
        this.player.currentTime = 0;
    }

    setVolume(level) {
        this.player.volume = level;
    }

    on(event, callback) {
        this.player.addEventListener(event, callback);
    }
}


