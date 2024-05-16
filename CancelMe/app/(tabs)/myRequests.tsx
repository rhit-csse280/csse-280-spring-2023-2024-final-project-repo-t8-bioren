import {
  Button,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
    setRequests(data);
    changed = !changed;
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
      return "";
    }
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        visible={modalVisible}
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.containerModal}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} adjustsFontSizeToFit={true}
              numberOfLines={1}>Event with {getName(selectedRequest.to)}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.separator} />
          <View style={styles.separator} />
          <Calendar
            style={styles.calendar}
            theme={{
              arrowColor: '#007AFF',
              todayTextColor: '#007AFF',
            }}
            initialDate={selectedRequest.date}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: '#007AFF'
              },
            }}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
            }}
          ></Calendar>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.button}
              onPress={() => {
                setModalVisible(!modalVisible)
              }}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                saveRequest();
                setModalVisible(!modalVisible)
              }}>
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
            <Pressable
              style={styles.red}
              onPress={() => {
                deleteRequest();
                setModalVisible(!modalVisible)
              }}>
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
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
          <Pressable onPress={() => clickedRequest(item.id)}>
            <View style={styles.listItem}>
              <View style={styles.listText}>
                <Text style={styles.listName}>{getName(item.to)}</Text>
                <Text style={styles.listDate}>{item.date}</Text>
                {renderIsComplete(item)}
              </View>
              {renderIcon(item)}
            </View>
          </Pressable>
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
    padding: '10%'
  },
  containerModal: {
    flex: 1,
    paddingLeft: '10%',
    paddingRight: '10%',
    alignContent: 'center'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  title: {
    marginTop: 100,
    verticalAlign: "top",
    textAlignVertical: "top",
    textAlign: "center",
    fontSize: 32,
    fontWeight: 'bold',
    width: "100%",
  },
  calendar: {
    width: '100%'
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
  modal: {
    color: '#EEEEEE'
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row"
  }
});