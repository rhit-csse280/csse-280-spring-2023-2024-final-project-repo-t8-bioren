import { Alert, Keyboard, Pressable, StyleSheet, TextInput, TouchableWithoutFeedback } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import React, { useContext, useEffect, useState } from 'react';

import * as admin from "firebase-admin";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebaseConfig';
import { Calendar } from 'react-native-calendars';
import { collection, deleteDoc, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { UserContext } from '../_layout';
import { deleteUser, getAuth, signOut } from 'firebase/auth';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const user = useContext(UserContext);
  const [displayName, setDisplayName] = useState("");
  const [users, setUsers] = useState([
    { phoneNumber: "", displayName: "", id: "" }
  ]);

  // Init Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  function changeDisplayName() {
    const selectedUser = users.filter((item) => {
      return item.phoneNumber == user.phoneNumber;
    })[0];
    const update = async () => {
      const docRef = doc(db, "Users", selectedUser.id);
      await updateDoc(docRef, {
        displayName: displayName
      }).then(() => {
        Alert.alert("Update Successful!")
      });
    }
    update();
  }

  // Get requests
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    // Get users
    const userRef = collection(db, "Users");
    const userSnap = await (getDocs(userRef));

    const userData = userSnap.docs.map(
      (doc) => ({
        id: doc.id,
        phoneNumber: doc.data().phoneNumber,
        displayName: doc.data().displayName
      }) as {
        id: string,
        phoneNumber: string;
        displayName: string;
      }
    );
    setUsers(userData);
  }

  function logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      router.replace("/");
    })
  }

  function deleteAccount() {
    const del = async () => {
      const auth = getAuth();
      const fbUser = auth.currentUser;
      if(fbUser) {
        deleteUser(fbUser).then(async () => {
          const selectedUser = users.filter((item) => {
            return item.phoneNumber == user.phoneNumber;
          })[0];
          const docRef = doc(db, "Users", selectedUser.id);
          await deleteDoc(docRef).then(() => {
            router.replace("/");
          });
        });
      }
    }
    del();
  }


  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.separator}></View>
          <Text style={styles.caption}>Change Your Name</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder='Your display name'
            keyboardType='default'>
          </TextInput>
          <Pressable
            style={styles.button}
            onPress={() => {
              changeDisplayName();
            }}>
            <Text style={styles.buttonText}>Change</Text>
          </Pressable>
          <View style={styles.separator}></View>
          <Pressable
            style={styles.button}
            onPress={() => {
              logout();
            }}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </Pressable>
          <View style={styles.separator}></View>
          <Text style={styles.caption}>Delete Your Account</Text>
          <Pressable
            style={styles.red}
            onPress={() => {
              deleteAccount();
            }}>
            <Text style={styles.buttonText}>Delete Your Account</Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
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
    padding: '10%',
  },
  separator: {
    marginVertical: '10%',
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
  caption: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  touchable: {
    width: '100%',
    height: '100%'
  }
});
