import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  TouchableHighlight,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";

import {
  collection,
  getDocs,
  getFirestore,
} from "firebase/firestore";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/firebaseConfig";

// States
export default function myRequestsScreen() {
  const [requests, setRequests] = useState([
    { id: "", To: "", Date: "", Complete: false },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState({
    id: "",
    To: "",
    Date: "",
    Complete: false,
  });

  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);

  // Fetch the data from the database
  useEffect(() => {
    const fetchData = async () => {
      const reqRef = collection(db, "Requests");
      const docSnap = await getDocs(reqRef);
      // TODO: Figure out what this does. I copied it from stack overflow and it works.
      const data = docSnap.docs.map((doc) => ({
        id: doc.id,
        To: doc.data().To,
        Date: doc.data().Date,
        Complete: doc.data().Complete,
      }));
      setRequests(data);
      console.log("data :>> ", data);
    };
    fetchData();
  }, []);

  // Render the icon for whether or not the request is complete
  const renderIcon = (isComplete: boolean) => {
    if (isComplete)
      return (
        <MaterialIcons
          name="free-cancellation"
          size={24}
          color="black"
          style={styles.icon}
        />
      );
    else
      return (
        <MaterialIcons
          name="incomplete-circle"
          size={24}
          color="black"
          style={styles.icon}
        />
      );
  };

  // Render the text for whether or not the request is complete
  const renderIsComplete = (isComplete: boolean) => {
    if (isComplete)
      return <Text style={styles.listDate}>Successfully Cancelled</Text>;
    else return <Text style={styles.listDate}>Pending</Text>;
  };

  // Set the request to the current request and open the modal
  const clickedRequest = (id: string) => {
    // Get the data from the request id
    const req = requests.find((request) => request.id === id) as {
      id: string;
      To: string;
      Date: string;
      Complete: boolean;
    };
    console.log('req :>> ', req);
    setSelectedRequest(req);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Edit this Cancellation Request</Text>
          <View style={styles.separator} />
          <Calendar
            initialDate={selectedRequest.Date}
            markedDates={{
              [selectedRequest.Date]: {
                selected: true,
                marked: true,
              },
            }}
          ></Calendar>
          <Button
            title="Close"
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          />
        </View>
      </Modal>
      <FlatList
        style={styles.list}
        data={requests}
        renderItem={({ item }) => (
          <TouchableHighlight onPress={() => clickedRequest(item.id)}>
            <View style={styles.listItem}>
              <View style={styles.listText}>
                <Text style={styles.listName}>{item.To}</Text>
                <Text style={styles.listDate}>{item.Date}</Text>
                {renderIsComplete(item.Complete)}
              </View>
              {renderIcon(item.Complete)}
            </View>
          </TouchableHighlight>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
