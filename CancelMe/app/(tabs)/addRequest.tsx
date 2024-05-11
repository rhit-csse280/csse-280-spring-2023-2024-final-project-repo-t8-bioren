import { Button, StyleSheet, TextInput } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View, Text } from '@/components/Themed';
import React, { useContext, useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebaseConfig';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { UserContext } from '@/app/_layout'

export default function addRequest() {
  const username = useContext(UserContext);
  // States
  const [toUsername, updateToUsername] = useState("");
  const [selectedDate, updateSelectedDate] = useState("");

  // Init Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  function createRequest() {
    const update = async () => {
      await addDoc(collection(db, "Requests"), {
        to: toUsername,
        from: username,
        date: selectedDate
      });
    }
    update();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Cancellation Request</Text>
      <TextInput
        style={styles.input}
        value={toUsername}
        onChangeText={updateToUsername}
        placeholder='Who are you cancelling with?'
        keyboardType='default'>
      </TextInput>
      <Calendar
            initialDate={Date()}
            markedDates={{
              [selectedDate]: {
                selected: true,
                marked: true,
              },
            }}
            onDayPress={(day) => {
              updateSelectedDate(day.dateString);
            }}
          ></Calendar>
          <Button
            title="Submit"
            onPress={() => {
              createRequest();
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
