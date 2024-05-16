import { Button, Keyboard, Pressable, StyleSheet, TextInput, Touchable, TouchableWithoutFeedback } from 'react-native';

import { Text, View } from '@/components/Themed';
import React, { useContext, useEffect, useState } from 'react';

import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebaseConfig';
import { getAuth, signInWithEmailAndPassword, signInWithPhoneNumber } from 'firebase/auth';
import { router } from 'expo-router'
import { UserContext } from './_layout';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const app = initializeApp(firebaseConfig);
  const auth = getAuth();

  const user = useContext(UserContext);

  function signIn() {
    signInWithEmailAndPassword(auth, phoneNumber + "@rose-hulman.edu", password)
      .then((userCredential) => {
        // Signed in 
        const firebaseUser = userCredential.user;
        user.phoneNumber = phoneNumber;
        console.log('user.phoneNumber :>> ', user.phoneNumber);
        router.replace('(tabs)/myRequests');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.separator}></View>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder='Phone Number'
        keyboardType='numeric'>
      </TextInput>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder='Password'
        keyboardType='default'
        secureTextEntry={true}>
      </TextInput>
      <Pressable
        style={styles.button}
        onPress={() => {
          signIn();
        }}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      <Text style={styles.subtitle}>Don't have an account?</Text>
      <Pressable
        style={styles.button}
        onPress={() => {
          router.push('register');
        }}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
      <View style={styles.separator}></View>
      <View style={styles.separator}></View>
    </View>
    </TouchableWithoutFeedback>
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
  listText: {
    width: "90%",
  },
  icon: {
    width: "10%",
  },
  listItem: {
    margin: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  list: {
    width: "100%",
  },
  listDate: {
    fontSize: 16,
    fontWeight: "normal",
  },
  listName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  title: {
    marginTop: 64,
    verticalAlign: "top",
    textAlignVertical: "top",
    textAlign: "center",
    fontSize: 32,
    fontWeight: 'bold'
  },
  calendar: {
    width: 200
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
