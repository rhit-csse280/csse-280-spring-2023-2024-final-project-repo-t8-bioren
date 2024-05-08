import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/firebaseConfig";

export default function myRequestsScreen() {
  // States
  const [requests, setRequests] = useState([
    { id: "", to: "", from: "", date: "", complete: false },
  ]);
  const [selectedRequest, setSelectedRequest] = useState({
    id: "",
    to: "",
    from: "",
    date: "",
    complete: false,
  });
  const [modalVisible, setModalVisible] = useState(false);

  // Firebase stuff
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Get requests
  useEffect(() => {
    const fetchData = async () => {
      const reqRef = collection(db, "Requests");
      const docSnap = await getDocs(reqRef);
      // This is some funky stackoverflow code but it maps the document snapshot to an array of JSON objects with the right types
      const data = docSnap.docs.map(
        (doc) => ({
          id: doc.id,
          to: doc.data().to,
          from: doc.data().from,
          date: doc.data().date,
          complete: doc.data().complete,
        }) as {
          id: string;
          to: string;
          from: string;
          date: string;
          complete: boolean;
        }
      );
      setRequests(data);
      console.log('data :>> ', data);
    };
    fetchData();
  }, []);

  // Render the text for whether the request is complete
  function renderIsComplete(complete: boolean) {
    if (complete)
      return <Text style={styles.listDate}>Successfully Cancelled</Text>;
    else return <Text style={styles.listDate}>Pending</Text>;
  }

  // Render the appropriate icon
  function renderIcon(complete: boolean) {
    if (complete)
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
  }

  // Handle clicking on a request
  function clickedRequest(id: string) {
    const req = requests.find((request) => request.id == id) as {
      id: string;
      to: string;
      from: string;
      date: string;
      complete: boolean;
    };
    setSelectedRequest(req);
    setModalVisible(true);
    console.log('id :>> ', id);
  }

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
            initialDate={selectedRequest.date}
            markedDates={{
              [selectedRequest.date]: {
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
                <Text style={styles.listName}>{item.to}</Text>
                <Text style={styles.listDate}>{item.date}</Text>
                {renderIsComplete(item.complete)}
              </View>
              {renderIcon(item.complete)}
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