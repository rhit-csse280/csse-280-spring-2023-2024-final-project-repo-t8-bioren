import { Button, StyleSheet, TextInput } from 'react-native';

import { Text, View } from '@/components/Themed';
import React, { useContext, useEffect, useState } from 'react';

import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebaseConfig';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPhoneNumber } from 'firebase/auth';
import { router } from 'expo-router'
import { UserContext } from './_layout';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

export default function RegisterScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const user = useContext(UserContext);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const db = getFirestore(app);

  function register() {
    createUserWithEmailAndPassword(auth, phoneNumber + "@rose-hulman.edu", password)
    .then((userCredential) => {
      const firebaseUser = userCredential.user;
      const update = async () => {
        await addDoc(collection(db, "Users"), {
          phoneNumber: phoneNumber,
          displayName: displayName
        });
      }
      update();
      user.phoneNumber = phoneNumber;
      router.replace('(tabs)');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder='Phone Number'
        keyboardType='default'>
      </TextInput>
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder='Display Name'
        keyboardType='default'>
      </TextInput>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder='Password'
        keyboardType='default'>
      </TextInput>
      <Button
            title="Register"
            onPress={() => {
              register();
            }}
          />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
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
