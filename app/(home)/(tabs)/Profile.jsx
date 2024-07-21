import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  graphStyle,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BarChart } from "react-native-chart-kit";
import { useRouter } from "expo-router";
import {
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const Profile = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");

  const router = useRouter();
  let categoryArray = [
    "Food",
    "Transport",
    "Utilities",
    "Shopping",
    "Health",
    "Other",
  ];
  const totalAmount = expenses.reduce((total, expense) => {
    return total + parseFloat(expense.amount);
  }, 0);
  const totals = expenses.reduce((acc, expense) => {
    const category = expense.category;
    const amount = parseFloat(expense.amount) || 0;

    if (acc[category]) {
      acc[category] += amount;
    } else {
      acc[category] = amount;
    }

    return acc;
  }, {});
  const result = categoryArray.map((category) => ({
    category,
    amount: totals[category] || 0,
  }));

  const data = {
    labels: result?.map((data) => data?.category),
    datasets: [
      {
        data: result?.map((data) => data?.amount),
      },
    ],
  };
  const fetchUser = async () => {
    const value = await AsyncStorage.getItem("authToken");
    let user = JSON.parse(value).user;
    let uid = user.uid;
    const q = query(collection(db, "users"), where("id", "==", uid));
    const querySnapshot = await getDocs(q);
    const expensesList = [];
    querySnapshot.forEach((doc) => {
      expensesList.push({ id: doc.id, ...doc.data() });
    });
    setUserName(expensesList[0].userName);
  };
  const fetchExpenses = async () => {
    setLoading(true);
    const value = await AsyncStorage.getItem("authToken");
    let user = JSON.parse(value).user;
    let uid = user.uid;
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
  useEffect(() => {
    fetchExpenses();
    fetchUser();
  }, []);
  return (
    <>
      <View style={{flexDirection:"row", alignItems:"center",marginTop:10}}>
        <Text style={{fontSize:20}}>User Name - </Text>
        <Text style={{fontSize:15}}>{userName}</Text>
      </View>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Expense Chat</Text>
            <BarChart
              style={graphStyle}
              data={data}
              width={Dimensions.get("window").width}
              height={220}
              yAxisLabel="₹"
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              verticalLabelRotation={0}
            />
            <View style={styles.listHeader}>
              <Text
                style={styles.listHeaderText}
              >{`Total Spent - ₹${totalAmount}`}</Text>
            </View>
          </>
        )}
      </View>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
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
