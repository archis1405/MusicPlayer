import { create } from 'zustand';

interface SearchStore {
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  recentSearches: [],

  addRecentSearch: (query) => {
    const { recentSearches } = get();
    // Remove duplicate and add to front
    const updated = [query, ...recentSearches.filter((q) => q !== query)].slice(0, 10);
    set({ recentSearches: updated });
  },

  removeRecentSearch: (query) => {
    const { recentSearches } = get();
    set({ recentSearches: recentSearches.filter((q) => q !== query) });
  },

  clearRecentSearches: () => set({ recentSearches: [] }),
}));
