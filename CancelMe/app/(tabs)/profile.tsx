import { Pressable, StyleSheet, TextInput } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import React, { useEffect } from 'react';

import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebaseConfig';
import { Calendar } from 'react-native-calendars';

export default function ProfileScreen() {
  useEffect(() => {
    const app = initializeApp(firebaseConfig);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.separator}></View>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.separator}></View>
      <Text style={styles.subtitle}>Change Your Name</Text>
      <TextInput
        style={styles.input}
        value={""}
   
        placeholder='Password'
        keyboardType='default'>
      </TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '50%'
  },
  container: {
    flex: 1,
    paddingTop: '10%',
    alignContent: 'center',
  },
  separator: {
    marginVertical: '20%',
    height: 1,
    width: '80%',
  },
  title: {
    marginTop: 100,
    verticalAlign: "top",
    textAlignVertical: "top",
    textAlign: "center",
    fontSize: 32,
    fontWeight: 'bold'
  },
  button: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  },
  red: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'red',
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "row"
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  touchable: {
    width: '100%',
    height: '100%'
  }
});
