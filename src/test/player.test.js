import { AudioPlayer } from './../player';
import { Playlist } from './../playlist';

global.Audio = jest.fn(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    addEventListener: jest.fn(),
    volume: 1,
    currentTime: 0,
    src: ''
}));

describe('AudioPlayer', () => {

    let audioPlayer;
    let mockAudio;

    beforeEach(() => {
        audioPlayer = new AudioPlayer();
        mockAudio = audioPlayer.player;
    });


    test('initializes audio controller with null playlist & current', () => {
        expect(audioPlayer.playlist).toBeNull();
        expect(audioPlayer.current).toBeNull();
        expect(audioPlayer.playlistInfo).toBeNull();
        expect(audioPlayer.player).toBeDefined();
    });

    test('initializes playlist and playlistObject', () => {
        const fakePlaylist = {
            songs: [{ title: 'Jumai' }, { title: 'Space Cadet' }],
            playlist: { name: 'My Playlist' }
        };

        audioPlayer.setPlaylist(fakePlaylist);

        expect(audioPlayer.playlist).toEqual(fakePlaylist.songs);
        expect(audioPlayer.playlistInfo).toEqual(fakePlaylist.playlist);
        expect(audioPlayer.playlistObject).toBeInstanceOf(Playlist);
    });


    test('clearPlaylist function in audio controller', () => {

        const fakePlaylist = {
            songs: [{ title: 'Jumai' }, { title: 'Space Cadet' }],
            playlist: { name: 'My Playlist' }
        };
        audioPlayer.setPlaylist(fakePlaylist)

        audioPlayer.clearPlaylist();

        expect(audioPlayer.playlist).toBeNull();
        expect(audioPlayer.playlistInfo).toBeNull();
        expect(audioPlayer.playlistObject).toBeNull();
    });


    test('loading audio src and current song', () => {
        const song = { src: 'song.mp3' };
        audioPlayer.load(song);

        expect(mockAudio.src).toContain('song.mp3');
        expect(audioPlayer.current).toEqual(song);
    });

    test('play function in audio controller', () => {
        audioPlayer.play();
        expect(mockAudio.play).toHaveBeenCalled();
    });

    test('pause function in audio controller', () => {
        audioPlayer.pause();
        expect(mockAudio.pause).toHaveBeenCalled();
    });

    test('stop function in audio controller', () => {
        audioPlayer.stop();
        expect(mockAudio.pause).toHaveBeenCalled();
        expect(mockAudio.currentTime).toBe(0);
    });

    test('setVolume function in audio controller', () => {
        audioPlayer.setVolume(0.8);
        expect(mockAudio.volume).toBe(0.8);
    });

    

})