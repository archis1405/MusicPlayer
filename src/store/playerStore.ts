import { create } from 'zustand';
import { Song, RepeatMode } from '../Types';

interface PlayerStore {
  currentSong?: Song;
  queue: Song[];
  isPlaying: boolean;
  repeatMode: RepeatMode;
  shuffle: boolean;

  // Actions
  setCurrentSong: (song: Song) => void;
  setQueue: (songs: Song[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleShuffle: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: undefined,
  queue: [],
  isPlaying: false,
  repeatMode: 'none',
  shuffle: false,

  setCurrentSong: (song: Song) => set({ currentSong: song, isPlaying: true }),

  setQueue: (songs: Song[]) => set({ queue: songs }),

  togglePlay: () => set({ isPlaying: !get().isPlaying }),

  playNext: () => {
    const { queue, currentSong, repeatMode, shuffle } = get();
    if (!queue.length) return;

    let nextIndex = currentSong ? queue.findIndex(s => s.id === currentSong.id) + 1 : 0;

    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }

    if (nextIndex >= queue.length) {
      if (repeatMode === 'all'){
        nextIndex = 0;
      }
      else return; 
    }

    set({ currentSong: queue[nextIndex], isPlaying: true });
  },

  playPrev: () => {
    const { queue, currentSong, repeatMode, shuffle } = get();
    if (!queue.length) return;

    let prevIndex = currentSong ? queue.findIndex(s => s.id === currentSong.id) - 1 : 0;

    if (shuffle) {
      prevIndex = Math.floor(Math.random() * queue.length);
    }

    if (prevIndex < 0) {
      if (repeatMode === 'all'){
        prevIndex = queue.length - 1;
      } 
      else return; 
    }

    set({ currentSong: queue[prevIndex], isPlaying: true });
  },

  setRepeatMode: (mode: RepeatMode) => set({ repeatMode: mode }),

  toggleShuffle: () => set({ shuffle: !get().shuffle }),
}));
