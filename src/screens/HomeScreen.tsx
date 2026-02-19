import React from 'react';
import { View, Text, StyleSheet , Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


import { RootStackParamList , BottomTabParamList } from '../Types';

type Props = CompositeScreenProps<BottomTabScreenProps<BottomTabParamList, 'Home'>,NativeStackScreenProps<RootStackParamList>>;

const HomeScreen = ( { navigation }: Props ) => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
     
        <View style={styles.content}>
     
            <Text style={styles.title}>Home Screen</Text>
     
            <Text style={styles.subtitle}>
     
                Welcome to MusicPlayer
            </Text>
            <View style={{ marginTop: 20 }}>
                <Button
                    title="Go to Search"
                    onPress={() => navigation.navigate('Search')}
                />
            <View style={{ height: 10 }} />
                <Button
                    title="Go to Player"
                    onPress={() => navigation.navigate('Player')}
                />
            </View>

        </View>

    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
