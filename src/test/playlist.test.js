import { Playlist } from './../playlist'
import { MUSIC_LIST } from '../musics';

describe('Playlist', () => {

    let playlist;
    
    const playlist_list = {
        title: "This is Drake",
        description: "This is Drake. The essential tracks, all in one playlist.",
        cover_image: "https://i.scdn.co/image/ab67706f0000000287bff188c40608c48b82068f",
        songs: MUSIC_LIST.filter(music =>
            music.artist.some(artist => artist.name === "Drake")
        )
    }

    beforeEach(() => {

        playlist = new Playlist(playlist_list.songs);
    });

    test('initializes with provided songs and index', () => {
        expect(playlist.songs).toEqual(playlist_list.songs);
        expect(playlist.currentIndex).toBe(0);
    });

    test('getCurrentSong returns current song', () => {
        expect(playlist.getCurrentSong()).toEqual(playlist_list.songs[0]);
    });

    test('next increments index', () => {
        playlist.next();
        expect(playlist.currentIndex).toBe(1);
        expect(playlist.getCurrentSong()).toEqual(playlist_list.songs[1]);
    });

    test('next wraps to 0 after last song', () => {
        playlist.currentIndex = playlist_list.songs.length - 1;
        playlist.next();
        expect(playlist.currentIndex).toBe(0);
        expect(playlist.getCurrentSong()).toEqual(playlist_list.songs[0]);
    });

    test('prev decrements index', () => {
        playlist.currentIndex = 1;
        playlist.prev();
        expect(playlist.currentIndex).toBe(0);
        expect(playlist.getCurrentSong()).toEqual(playlist_list.songs[0]);
    });

    test('prev wraps to last index when at 0', () => {
        playlist.currentIndex = 0;
        playlist.prev();
        expect(playlist.currentIndex).toBe(playlist_list.songs.length - 1);
        expect(playlist.getCurrentSong()).toEqual(playlist_list.songs[playlist_list.songs.length - 1]);
    });
});