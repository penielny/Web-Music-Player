export class Playlist {
    constructor(songs = [], currentIndex = 0) {
        this.songs = [...songs];
        this.currentIndex = currentIndex;
    }

    getCurrentSong() {
        return this.songs[this.currentIndex];
    }

    next() {
        if (this.currentIndex < this.songs.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.songs.length - 1;
        }
    }
}
