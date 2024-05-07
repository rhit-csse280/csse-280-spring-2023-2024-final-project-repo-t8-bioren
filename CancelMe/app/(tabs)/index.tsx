import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import React from 'react';

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDWkGE0eb5OQks1x79ljowsT96INmbRs8c",
  authDomain: "cancelme-5a6d5.firebaseapp.com",
  projectId: "cancelme-5a6d5",
  storageBucket: "cancelme-5a6d5.appspot.com",
  messagingSenderId: "765407798354",
  appId: "1:765407798354:web:b25c9a7446db9d1684ab8b",
  measurementId: "G-45F9M6WZ9T"
};

const app = initializeApp(firebaseConfig);


export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
