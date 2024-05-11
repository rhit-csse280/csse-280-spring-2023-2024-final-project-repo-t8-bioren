import { Button, StyleSheet, TextInput } from 'react-native';

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
          router.replace('(tabs)');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder='Phone Number'
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
            title="Login"
            onPress={() => {
              signIn();
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
