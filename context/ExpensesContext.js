
import React, { createContext, useState, useEffect } from "react";
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
import { db } from "../firebaseConfig";
import uuid from "react-native-uuid";

export const ExpensesContext = createContext();

export const ExpensesProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);

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

  const saveExpense = async (amount, category, description) => {
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
  };

  const updateExpense = async (id, amount, category, description) => {
    const timestamp = Timestamp.fromDate(new Date());
    const updatedData = {
      amount,
      category,
      description,
      timestamp,
    };
    setLoading(true);
    try {
      const expenseDoc = doc(db, "expenses", id);
      await updateDoc(expenseDoc, updatedData);
      fetchExpenses(uid);
      setLoading(false);
    } catch (e) {
      console.error("Error updating document: ", e);
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const expenseDoc = doc(db, "expenses", id);
      await deleteDoc(expenseDoc);
      fetchExpenses(uid);
    } catch (e) {
      console.error("Error removing document: ", e);
    }
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
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <ExpensesContext.Provider
      value={{ expenses, loading, saveExpense, updateExpense, deleteExpense }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};
