import { FlatList, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";

import {
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/firebaseConfig";

export default function myRequestsScreen() {
  const [requests, setRequests] = useState([
    { To: "", Date: "", Complete: false },
  ]);

  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);
  useEffect(() => {
    const fetchData = async () => {
      const reqRef = collection(db, "Requests");
      const docSnap = await getDocs(reqRef);
      const data = docSnap.docs.map(
        (doc) => doc.data() as { To: string; Date: string; Complete: boolean }
      );
      setRequests(data);
    };
    fetchData();
  }, []);

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

  const renderIsComplete = (isComplete: boolean) => {
    if (isComplete)
      return <Text style={styles.listDate}>Successfully Cancelled</Text>;
    else return <Text style={styles.listDate}>Pending</Text>;
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={requests}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.listText}>
              <Text style={styles.listName}>{item.To}</Text>
              <Text style={styles.listDate}>{item.Date}</Text>
              {renderIsComplete(item.Complete)}
            </View>
            {renderIcon(item.Complete)}
          </View>
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
