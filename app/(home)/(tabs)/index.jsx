import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ExpensesContext } from "../../../context/ExpensesContext"; 

const Item = ({ editCall, item }) => {
  const { deleteExpense } = useContext(ExpensesContext);

  const deleteHandle = async () => {
    await deleteExpense(item?.id);
  };

  return (
    <View style={styles.itemWrapper}>
      <View style={styles.item}>
        <Text style={styles.title}>{`Category:- ${item?.category}`}</Text>
        <Text style={styles.title}>{`Description:- ${item?.description}`}</Text>
        <Text style={styles.title}>{`Rs:- ${item?.amount}`}</Text>
      </View>
      <View style={styles.buttonWrapper}>
        <View>
          <Button title="Delete" onPress={() => deleteHandle(item?.id)} />
        </View>
        <View>
          <Button title="Edit" onPress={() => editCall(item?.id)} />
        </View>
      </View>
    </View>
  );
};

const Index = () => {
  const { expenses, loading, saveExpense, updateExpense } =
    useContext(ExpensesContext);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [editStatus, setEditStatus] = useState(false);
  const [editId, setEditId] = useState("");

  const clearField = () => {
    setAmount("");
    setCategory("");
    setDescription("");
  };

  const editCall = (e) => {
    const data = expenses.find((item) => item.id === e);
    setEditStatus(true);
    setAmount(data?.amount);
    setCategory(data.category);
    setDescription(data.description);
    setEditId(e);
  };

  const handleSave = async () => {
    if (editStatus) {
      await updateExpense(editId, amount, category, description);
      setEditStatus(false);
    } else {
      await saveExpense(amount, category, description);
    }
    clearField();
  };

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
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="Select Category" value="" />
          <Picker.Item label="Food" value="Food" />
          <Picker.Item label="Transport" value="Transport" />
          <Picker.Item label="Utilities" value="Utilities" />
          <Picker.Item label="Shopping" value="Shopping" />
          <Picker.Item label="Health" value="Health" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      <Button
        title={editStatus ? "Save Edit" : "Save Expense"}
        onPress={handleSave}
      />

      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>Expense Lists</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : expenses.length > 0 ? (
        <FlatList
          data={expenses}
          renderItem={({ item }) => (
            <Item item={item} editCall={(e) => editCall(e)} />
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

export default Index;

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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
  },
  item: {
    width: 300,
    backgroundColor: "#3293a8",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  title: {
    fontSize: 15,
  },
  itemWrapper: {
    flexDirection: "column",
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
  buttonWrapper: {
    flexDirection: "row",
    gap: 5,
    alignItems: "flex-end",
  },
});
