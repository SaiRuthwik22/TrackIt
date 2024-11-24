import React, { useEffect, useState } from "react";
import { Input, Radio, Select, Table } from "antd";
import searchImg from "../../assets/search.svg";
import { parse, unparse } from "papaparse";
import { toast } from "react-toastify";

function TransactionTable({ transactions, addTransaction, fetchTransactions }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [passingArr, setPassingArr] = useState([]);
  const { Option } = Select;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  let filteredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLocaleLowerCase()) &&
      item.type.includes(typeFilter)
  );
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  useEffect(() => {
    setPassingArr(filteredTransactions);
  }, [typeFilter, search]);

  useEffect(() => {
    setPassingArr(sortedTransactions);
    console.log(sortKey);
  }, [sortKey]);

  function exportCSV() {
    var csv = unparse(transactions, {
      fields: ["name", "type", "tag", "date", "amount"],
    });
    let data = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    let csvURL = window.URL.createObjectURL(data);
    let tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", "transaction.csv");
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  }

  function importFromCSV(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          for (const transaction of results.data) {
            console.log("transactions", transaction);
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All Transaction Added");
      fetchTransactions();
      event.target.files = null;
    } catch (e) {
      console.log(e, event.target);
      toast.error(e.message);
    }
  }

  return (
    <div
      style={{
        width: "100%",
        padding: "0rem 2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div className="input-flex">
          <img src={searchImg} width="16" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search by name"
          />
        </div>

        <Select
          className="select-input"
          onChange={(value) => {
            setTypeFilter(value);
          }}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>
      <div className="my-table">
        <div className="mytransaction-wrapper">
          <div>
            <h2>My Transactions</h2>
          </div>
          <div className="MyTransaction-part">
            <Radio.Group
              style={{ display: "block" }}
              className="input-radio sorting-radio"
              onChange={(e) => setSortKey(e.target.value)}
              value={sortKey}
            >
              <Radio.Button value="">No Sort</Radio.Button>
              <Radio.Button value="date">Sort by Date</Radio.Button>
              <Radio.Button value="amount">Sort by Amount</Radio.Button>
            </Radio.Group>

            <Select
              style={{ display: "none" }}
              className="select-input sorting-dropdown"
              onChange={(value) => setSortKey(value)}
              value={sortKey}
              placeholder="No Sort"
              allowClear
            >
              <Option value="">No Sort</Option>
              <Option value="date">Sort By Date</Option>
              <Option value="amount">Sort By Amount</Option>
            </Select>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                width: "400px",
              }}
            >
              <button className="btn" onClick={exportCSV}>
                Export to CSV
              </button>
              <label for="file-csv" className="btn btn-blue">
                Import from CSV
              </label>
              <input
                id="file-csv"
                onChange={importFromCSV}
                type="file"
                accept=".csv"
                required
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
        <Table dataSource={passingArr} columns={columns} />
      </div>
    </div>
  );
}

export default TransactionTable;
