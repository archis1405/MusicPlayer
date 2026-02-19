import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity , Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Types';

type Props = NativeStackScreenProps<RootStackParamList, 'Player'>;

const PlayScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        <Text style={styles.title}>Now Playing</Text>

        <View style={styles.playerBox}>
          <Text style={styles.song}>Song Title</Text>
          <Text style={styles.artist}>Artist Name</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}> Prev </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.playButton}>
            <Text style={styles.buttonText}> Play </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}> Next </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 30 }}>
            <Button title="Go to Home" onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })} />

            <Button title="Go to Search" onPress={() => navigation.navigate('MainTabs', { screen: 'Search' })} />
        </View>

      </View>
    </SafeAreaView>
  );
};

export default PlayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  playerBox: {
    alignItems: 'center',
    marginBottom: 40,
  },
  song: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  artist: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    padding: 16,
  },
  playButton: {
    padding: 20,
    backgroundColor: '#1DB954',
    borderRadius: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
