# 🎵 Music Player - React Native Intern Assignment

A full-featured music streaming app built with React Native (Expo) using the JioSaavn API.

## 📱 Features

### Core
- **Home Screen** — Browse trending songs, search with debounce, infinite pagination
- **Full Player** — Artwork, seek bar, play/pause/next/prev, shuffle, repeat modes, like/download
- **Mini Player** — Persistent bar synced with full player, tap to open full player
- **Queue** — View queue, play any song, remove individual songs, clear all
- **Library** — Liked songs & downloaded songs tabs

### Bonus
- ✅ Shuffle & Repeat modes (none / all / one)
- ✅ Download songs for offline listening
- ✅ Background audio playback (iOS & Android)
- ✅ Persisted queue & settings (MMKV)
- ✅ Recent searches
- ✅ Liked songs

## 🏗 Architecture

```
src/
├── components/       # Reusable UI components
│   ├── MiniPlayer.tsx
│   └── SongCard.tsx
├── navigation/       # React Navigation setup
│   └── AppNavigator.tsx
├── screens/          # Full screens
│   ├── HomeScreen.tsx
│   ├── PlayerScreen.tsx
│   ├── QueueScreen.tsx
│   ├── SearchScreen.tsx
│   └── LibraryScreen.tsx
├── services/         # Business logic
│   ├── api.ts        # JioSaavn API calls
│   ├── playerService.ts  # expo-av audio engine
│   ├── downloadService.ts # Offline downloads
│   └── storage.ts    # MMKV setup
├── store/            # Zustand state management
│   ├── playerStore.ts
│   ├── searchStore.ts
│   └── libraryStore.ts
├── theme/            # Design tokens
│   └── index.ts
└── types/            # TypeScript types
    └── index.ts
```

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo SDK 51) |
| Language | TypeScript |
| Navigation | React Navigation v6 (Stack + Bottom Tabs) |
| State | Zustand |
| Storage | MMKV |
| Audio | expo-av |
| Downloads | expo-file-system |

## 🚀 Setup

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli eas-cli`
- Android Studio / Xcode

### Install

```bash
npm install
```

### Run (Dev)

```bash
# Start Expo dev server
npx expo start

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios
```

### Build APK

```bash
# Configure EAS
eas login
eas build:configure

# Build preview APK
eas build --platform android --profile preview
```

## ⚖️ Trade-offs & Notes

1. **MMKV** requires a native build (`expo run:android`) — doesn't work with Expo Go. If you want Expo Go compatibility, swap to `AsyncStorage` in `src/services/storage.ts`.

2. **Background Audio** — On Android, a foreground service notification appears (required by OS). On iOS, `UIBackgroundModes: audio` is set in app.json.

3. **Emoji icons** — Used instead of icon libraries to keep dependencies minimal. Can be swapped for `@expo/vector-icons` in production.

4. **No mock data** — All data comes from `https://saavn.sumit.co`.

5. **API Rate limiting** — The public JioSaavn API has no auth but may have rate limits. Searches are debounced (500ms) to minimize requests.

## 📐 Key Design Decisions

- **Zustand over Redux** — Simpler boilerplate for this scope; stores are colocated with their concern
- **expo-av** — Built-in Expo audio with background playback support
- **Single audio instance** (PlayerService singleton) — Ensures only one sound plays at a time
- **Queue persistence** — Queue + current index saved to MMKV so state survives app restarts
