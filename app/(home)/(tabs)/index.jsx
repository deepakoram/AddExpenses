import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  doc,
  setDoc,
  Timestamp,
  query,
  where,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import uuid from "react-native-uuid";
import { SafeAreaView } from "react-native-safe-area-context";

const Item = ({ editCall, callBack, item }) => {
  const deleteHandle = async () => {
    try {
      const expenseDoc = doc(db, "expenses", item?.id);

      await deleteDoc(expenseDoc);
      callBack();

      console.log("Document successfully deleted!");
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };
  const editHandle = async () => {
    editCall(item);
  };
  return (
    <View style={styles.itemWrapper}>
      <View style={styles.item}>
        <Text style={styles.title}>{`Category:- ${item?.category}`}</Text>
        <Text style={styles.title}>{`Description:- ${item?.description}`}</Text>
        <Text style={styles.title}>{`Rs:- ${item?.amount}`}</Text>
      </View>
      <View>
        <Button title="Delete" onPress={() => deleteHandle(item?.id)} />
      </View>
      <View>
        <Button title="Edit" onPress={() => editHandle(item?.id)} />
      </View>
    </View>
  );
};
const index = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [uid, setUid] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [editStatus, setEditStatus] = useState(false);
  const [editId, setEditId] = useState("");
  const [loading, setLoading] = useState(false);

  const clearField = () => {
    setAmount("");
    setCategory("");
    setDescription("");
  };
  const editCall = (e) => {
    console.log(e, "e");
    setEditStatus(true);
    setAmount(e?.amount);
    setCategory(e.category);
    setDescription(e.description);
    setEditId(e.id);
  };
  const fetchExpenses = async (uid) => {
    setLoading(true);
    try {
      const q = query(collection(db, "expenses"), where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      const expensesList = [];
      querySnapshot.forEach((doc) => {
        expensesList.push({ id: doc.id, ...doc.data() });
      });
      setExpenses(expensesList);
      setLoading(false);
    } catch (e) {
      console.error("Error fetching expenses: ", e);
      setLoading(false);
    }
  };
  const saveExpense = async () => {
    // Save expense logic here
    if (!amount || !category || !description) {
      alert("Give proper data");
      return;
    }
    setLoading(true);
    const id = uuid.v4();
    const timestamp = Timestamp.fromDate(new Date());
    const newExpense = {
      id,
      userId: uid,
      amount,
      category,
      description,
      timestamp,
    };
    await setDoc(doc(db, "expenses", id), newExpense);
    fetchExpenses(uid);
    setLoading(false);
    clearField();
  };
  const getData = async () => {
    setLoading(true);
    try {
      const value = await AsyncStorage.getItem("authToken");
      let user = JSON.parse(value).user;
      setUid(user.uid);
      fetchExpenses(user.uid);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  const saveEdit = async () => {
    const timestamp = Timestamp.fromDate(new Date());
    const updatedData = {
      amount,
      category,
      description,
      timestamp,
    };
    setLoading(true);
    try {
      const expenseDoc = doc(db, "expenses", editId);
      await updateDoc(expenseDoc, updatedData);
      fetchExpenses(uid);
      setLoading(false);
    } catch (e) {
      console.error("Error updating document: ", e);
      setLoading(false);
    }
    clearField();
    setEditStatus(false);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      {editStatus ? (
        <Button title="Save Edit" onPress={saveEdit} />
      ) : (
        <Button title="Save Expense" onPress={saveExpense} />
      )}
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>Lists</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) :expenses.length > 0 ? (
        <FlatList
          data={expenses}
          renderItem={({ item }) => (
            <Item
              item={item}
              callBack={() => fetchExpenses(uid)}
              editCall={(e) => editCall(e)}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.listHeader}>
          <Text>No data present</Text>
        </View>
      )}
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 16,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 15,
  },
  itemWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  itemContent: {
    flex: 1,
  },
  buttonContainer: {
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
  },
  listHeader: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  listHeaderText: {
    fontSize: 30,
  },
});
