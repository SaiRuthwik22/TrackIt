import React, { useEffect, useState } from "react";
import "./style.css";
import Header from "../Header/Header";
import Cards from "../Cards/Cards";
import AddExpense from "../Modals/AddExpense";
import AddIncome from "../Modals/AddIncome";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../pages/firebase";
import moment from "moment";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { toast } from "react-toastify";
import TransactionTable from "../TrasactionsTable/TransactionTable";
import Charts from "../Charts/Charts";
import NoTransactions from "../NoTransaction";

function Dashboard() {
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, [user]);
  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };
  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };
  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };
  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
      fetchTransactions()
      console.log("Document written with ID: ", docRef.id);
      if (!many) toast.success("Transaction Added!");
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) toast.error("Couldn't Add Transaction");
    }
  }

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log(querySnapshot);
      console.log(transactions);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  function calculateBalance() {
    let incomeTotal = 0;
    let expensesTotal = 0;
    transactions.forEach((transaction) => {
      if (transaction.type == "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setBalance(incomeTotal - expensesTotal);
  }

  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div>
      <Header />
      {loading ? (
        "Loadingg..."
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            balance={balance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />
          {transactions && transactions.length !== 0 ? (
            <Charts sortedTransactions={sortedTransactions} />
          ) : (
            <NoTransactions />
          )}

          <AddIncome
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <AddExpense
            handleExpenseCancel={handleExpenseCancel}
            isExpenseModalVisible={isExpenseModalVisible}
            onFinish={onFinish}
          />
          <TransactionTable
            transactions={transactions}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
