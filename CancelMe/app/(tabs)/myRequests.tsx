import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState, useContext, useCallback } from "react";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/firebaseConfig";
import { UserContext } from '@/app/_layout';
import { useFocusEffect } from "expo-router";

export default function myRequestsScreen() {
  let changed = false;
  const user = useContext(UserContext);
  // States
  const [requests, setRequests] = useState([
    { id: "", to: "", from: "", date: "" },
  ]);
  const [users, setUsers] = useState([
    { phoneNumber: "", displayName: "" }
  ]);
  const [selectedRequest, setSelectedRequest] = useState({
    id: "",
    to: "",
    from: "",
    date: ""
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  // Firebase stuff
  let app = initializeApp(firebaseConfig);
  let db = getFirestore(app);

  async function fetchUsers() {
    // Get users
    const userRef = collection(db, "Users");
    const userSnap = await (getDocs(userRef));

    const userData = userSnap.docs.map(
      (doc) => ({
        phoneNumber: doc.data().phoneNumber,
        displayName: doc.data().displayName
      }) as {
        phoneNumber: string;
        displayName: string;
      }
    );
    setUsers(userData);
  }

  async function fetchRequests() {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    const reqRef = collection(db, "Requests");
    const docSnap = await getDocs(reqRef);
    // This is some funky stackoverflow code but it maps the document snapshot to an array of JSON objects with the right types
    const data = docSnap.docs.map(
      (doc) => ({
        id: doc.id,
        to: doc.data().to,
        from: doc.data().from,
        date: doc.data().date
      }) as {
        id: string;
        to: string;
        from: string;
        date: string;
      }
    );
    console.log('data :>> ', data);
    setRequests(data);
    console.log('requests :>> ', requests);
  };

  // Get requests
  useEffect(() => {
    fetchUsers();
    fetchRequests();
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log("Fetching data...");
      fetchUsers();
      fetchRequests();
      // console.log('requests :>> ', requests);
    }, [])
  );

  // Render the text for whether the request is complete
  function renderIsComplete(item: { id: string, to: string, from: string, date: string }) {
    if (requests.find((req) => {
      return (req.to == item.from && req.from == item.to && req.date == item.date); // I'm not using cloud functions so this is how I need to find the cancelled ones.
    })) return <Text style={styles.listDate}>Successfully Cancelled</Text>;
    else return <Text style={styles.listDate}>Pending</Text>;
  }

  // Render the appropriate icon
  function renderIcon(item: { id: string, to: string, from: string, date: string }) {
    if (requests.find((req) => {
      return (req.to == item.from && req.from == item.to && req.date == item.date); // I'm not using cloud functions so this is how I need to find the cancelled ones.
    })) return (
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
    setSelectedDate(req.date);
    setModalVisible(true);
    // console.log('id :>> ', id);
  }

  // Save the request
  function saveRequest() {
    // Update Firestore document
    // This is directly from stackoverflow but I understand what's going on.
    const update = async () => {
      const docRef = doc(db, "Requests", selectedRequest.id);
      await updateDoc(docRef, {
        date: selectedDate,
      });
    }
    update();
    fetchRequests();  // There's probably a better way to do this.
    setModalVisible(!modalVisible);
    setSelectedRequest({
      id: "",
      to: "",
      from: "",
      date: ""
    });
    setSelectedDate("");
  }

  function deleteRequest() {
    // TODO: Delete the current request
    const del = async () => {
      await deleteDoc(doc(db, "Requests", selectedRequest.id));
    }
    del();
    fetchRequests();  // There's probably a better way to do this.
    setModalVisible(!modalVisible);
    setSelectedRequest({
      id: "",
      to: "",
      from: "",
      date: ""
    });
    setSelectedDate("");
  }

  function getName(phone: string): string {
    // console.log('users :>> ', users);
    try {
      return users.filter((item) => {
        return item.phoneNumber == phone
      })[0].displayName;
    } catch {
      return "Loading...";
    }
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
            style = {styles.calendar}
            initialDate={selectedRequest.date}
            markedDates={{
              [selectedDate]: {
                selected: true,
                marked: true,
              },
            }}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
            }}
          ></Calendar>
          <Button
            title="Close"
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          />
          <Button
            title="Save"
            onPress={() => {
              saveRequest();
            }}
          />
          <Button
            title="Delete"
            onPress={() => {
              deleteRequest();
            }}
          />
        </View>
      </Modal>
      <Text style={styles.title}>My Requests</Text>
      <View style={styles.separator}></View>
      <FlatList
        style={styles.list}
        data={requests.filter((doc) => {
          return doc.from == user.phoneNumber
        })}
        extraData={requests && changed}
        renderItem={({ item }) => (
          <TouchableHighlight onPress={() => clickedRequest(item.id)}>
            <View style={styles.listItem}>
              <View style={styles.listText}>
                <Text style={styles.listName}>{getName(item.to)}</Text>
                <Text style={styles.listDate}>{item.date}</Text>
                {renderIsComplete(item)}
              </View>
              {renderIcon(item)}
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  title: {
    marginTop: 10,
    verticalAlign: "top",
    textAlignVertical: "top",
    textAlign: "center",
    fontSize: 32,
    fontWeight: 'bold'
  },
  calendar: {
    width: 200
  }
});