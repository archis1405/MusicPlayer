import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePlayerStore } from '../store/playerStore';
import { useLibraryStore } from '../store/libraryStore';
import {
  getBestImageUrl,
  getArtistNames,
  formatDuration,
} from '../services/baseAPI';
import { downloadSong, isDownloaded, deleteSong } from '../services/downloadService';
import { colors, spacing, borderRadius, typography } from '../theme';
import { RootStackParamList } from '../Types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ARTWORK_SIZE = SCREEN_WIDTH - spacing.xl * 2;
const SEEK_BAR_WIDTH = SCREEN_WIDTH - spacing.xl * 2;

interface SeekBarProps {
  position: number;
  duration: number;
  onSeek: (value: number) => void;
}

const SeekBar: React.FC<SeekBarProps> = ({ position, duration, onSeek }) => {
  const [barWidth, setBarWidth] = React.useState(SEEK_BAR_WIDTH);
  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;
  const thumbLeft = progress * barWidth;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const x = evt.nativeEvent.locationX;
        const ratio = Math.max(0, Math.min(1, x / barWidth));
        onSeek(ratio * duration);
      },
      onPanResponderMove: (evt) => {
        const x = evt.nativeEvent.locationX;
        const ratio = Math.max(0, Math.min(1, x / barWidth));
        onSeek(ratio * duration);
      },
    })
  ).current;

  return (
    <View style={seekStyles.container} {...panResponder.panHandlers}>
      <View
        style={seekStyles.track}
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
      >
        <View style={[seekStyles.fill, { width: progress * barWidth }]} />
        <View style={[seekStyles.thumb, { left: thumbLeft - 7 }]} />
      </View>
    </View>
  );
};

const seekStyles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  track: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    position: 'relative',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    top: -5,
  },
});

export const PlayerScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    currentSong,
    isPlaying,
    isLoading,
    position,
    duration,
    repeatMode,
    isShuffle,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    setRepeatMode,
    toggleShuffle,
    queue,
  } = usePlayerStore();

  const { toggleLike, isLiked } = useLibraryStore();
  const [downloading, setDownloading] = useState(false);

  if (!currentSong) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.noSongText}>No song playing</Text>
        </View>
      </SafeAreaView>
    );
  }

  const imageUrl = getBestImageUrl(currentSong.image);
  const artistName = getArtistNames(currentSong);
  const liked = isLiked(currentSong.id);
  const downloaded = isDownloaded(currentSong.id);

  const cycleRepeat = () => {
    const modes = ['none', 'all', 'one'] as const;
    const current = modes.indexOf(repeatMode);
    setRepeatMode(modes[(current + 1) % modes.length]);
  };

  const repeatIcon = {
    none: '🔁',
    all: '🔁',
    one: '🔂',
  }[repeatMode];

  const repeatOpacity = repeatMode === 'none' ? 0.4 : 1;

  const handleDownload = async () => {
    if (downloaded) {
      Alert.alert('Remove Download', 'Delete this song from offline storage?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteSong(currentSong.id);
          },
        },
      ]);
      return;
    }

    setDownloading(true);
    try {
      await downloadSong(currentSong, (p) => {
        // Could show progress
      });
      Alert.alert('Downloaded!', `${currentSong.name} saved for offline listening.`);
    } catch (err) {
      Alert.alert('Error', 'Failed to download song.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>⌄</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>NOW PLAYING</Text>
          <Text style={styles.headerAlbum} numberOfLines={1}>
            {currentSong.album?.name || ''}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Queue')}
          style={styles.headerBtn}
        >
          <Text style={styles.headerBtnText}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Artwork */}
      <View style={styles.artworkContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.artwork}
          resizeMode="cover"
        />
      </View>

      {/* Song Info */}
      <View style={styles.songInfo}>
        <View style={styles.songInfoText}>
          <Text style={styles.songName} numberOfLines={1}>
            {currentSong.name}
          </Text>
          <Text style={styles.artistName} numberOfLines={1}>
            {artistName}
          </Text>
        </View>
        <TouchableOpacity onPress={() => currentSong && toggleLike(currentSong)}>
          <Text style={[styles.likeBtn, liked && styles.liked]}>
            {liked ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Seek Bar */}
      <View style={styles.seekContainer}>
        <SeekBar
          position={position}
          duration={duration || 1}
          onSeek={(val) => seekTo(val)}
        />
        <View style={styles.timeRow}>
          <Text style={styles.time}>{formatDuration(position / 1000)}</Text>
          <Text style={styles.time}>{formatDuration((duration || 0) / 1000)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Shuffle */}
        <TouchableOpacity onPress={toggleShuffle} style={styles.sideControl}>
          <Text style={[styles.sideIcon, !isShuffle && styles.inactive]}>🔀</Text>
        </TouchableOpacity>

        {/* Previous */}
        <TouchableOpacity onPress={playPrevious} style={styles.control}>
          <Text style={styles.controlIcon}>⏮</Text>
        </TouchableOpacity>

        {/* Play/Pause */}
        <TouchableOpacity
          onPress={togglePlay}
          style={styles.playButton}
          disabled={isLoading}
        >
          <Text style={styles.playIcon}>
            {isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}
          </Text>
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity onPress={playNext} style={styles.control}>
          <Text style={styles.controlIcon}>⏭</Text>
        </TouchableOpacity>

        {/* Repeat */}
        <TouchableOpacity onPress={cycleRepeat} style={styles.sideControl}>
          <Text style={[styles.sideIcon, { opacity: repeatOpacity }]}>
            {repeatIcon}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Extra Actions */}
      <View style={styles.extraActions}>
        <TouchableOpacity onPress={handleDownload} style={styles.extraBtn}>
          <Text style={[styles.extraIcon, downloaded && styles.activeAction]}>
            {downloading ? '⏳' : downloaded ? '✓ Downloaded' : '⬇ Download'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noSongText: {
    ...typography.body,
    color: colors.textMuted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnText: {
    color: colors.text,
    fontSize: 22,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerLabel: {
    ...typography.caption,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  headerAlbum: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  artworkContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceElevated,
  },
  songInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  songInfoText: {
    flex: 1,
  },
  songName: {
    ...typography.h3,
    color: colors.text,
  },
  artistName: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  },
  likeBtn: {
    fontSize: 28,
    color: colors.textSecondary,
  },
  liked: {
    color: colors.primary,
  },
  seekContainer: {
    paddingHorizontal: 0,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    marginTop: -spacing.sm,
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  sideControl: {
    padding: spacing.sm,
  },
  sideIcon: {
    fontSize: 20,
    color: colors.text,
  },
  inactive: {
    opacity: 0.4,
  },
  control: {
    padding: spacing.sm,
  },
  controlIcon: {
    fontSize: 32,
    color: colors.text,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 28,
    color: colors.background,
  },
  extraActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: spacing.lg,
  },
  extraBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  extraIcon: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  activeAction: {
    color: colors.primary,
  },
});
