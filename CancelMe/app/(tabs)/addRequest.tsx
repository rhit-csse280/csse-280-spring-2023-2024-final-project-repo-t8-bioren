import { Alert, Button, Keyboard, Pressable, StyleSheet, TextInput, TouchableWithoutFeedback } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View, Text } from '@/components/Themed';
import React, { useContext, useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebaseConfig';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";
import { UserContext } from '@/app/_layout'
import { router } from 'expo-router'

export default function addRequest() {
  const user = useContext(UserContext);
  // States
  const [toUsername, updateToUsername] = useState("");
  const [selectedDate, updateSelectedDate] = useState("");

  // Init Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  function createRequest() {
    const update = async () => {
      if(await checkValid()) {
        await addDoc(collection(db, "Requests"), {
          to: toUsername,
          from: user.phoneNumber,
          date: selectedDate
        });
        router.navigate('myRequests');
      } else {
        Alert.alert("You must enter a valid phone number!");
      }
    }
    const checkValid = async () => {
      const q = query(collection(db, 'Users'), where("phoneNumber", "==", toUsername));
      const querySnapshot = await getDocs(q);
      return querySnapshot.size > 0;
    }
    update();
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
        <Text style={styles.title}>New Request</Text>
        <View style={styles.separator}></View>
        <TextInput
          style={styles.input}
          value={toUsername}
          onChangeText={updateToUsername}
          placeholder='their phone number'
          keyboardType='numeric'>
        </TextInput>
        <Calendar
          theme={{
            arrowColor: '#007AFF',
            todayTextColor: '#007AFF',
          }}
          initialDate={selectedDate}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: '#007AFF'
            },
          }}
          onDayPress={(day) => {
            updateSelectedDate(day.dateString);
          }}
        ></Calendar>
        <Pressable
          style={styles.button}
          onPress={() => {
            createRequest();
          }}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
        <View style={styles.separator}></View>
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
});
