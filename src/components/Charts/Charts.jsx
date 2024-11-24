import { Line, Pie } from "@ant-design/charts";
import React from "react";

function Charts({ sortedTransactions }) {
  const data = sortedTransactions.map((item) => {
    return { date: item.date, amount: item.amount };
  });

  const spendingData = sortedTransactions.filter((item) => {
    if (item.type == "expense") {
      return { tag: item.tag, amount: item.amount };
    }
  });

  let newSpendings = [
    {
      tag: "food",
      amount: 0,
    },
    {
      tag: "education",
      amount: 0,
    },
    {
      tag: "office",
      amount: 0,
    },
  ];
  spendingData.forEach((item) => {
    if (item.tag == "food") {
      newSpendings[0].amount += item.amount;
    } else if (item.tag == "education") {
      newSpendings[1].amount += item.amount;
    } else if (item.tag == "office") {
      newSpendings[2].amount += item.amount;
    }
  });

  const config = {
    data: data,
    width: 400,
    autoFit: true,
    xField: "date",
    yField: "amount",
  };
  const spendingConfig = {
    data: newSpendings,
    width: 400,
    autoFit: true,
    angleField: "amount",
    colorField: "tag",
  };

  let chart;
  let pieChart;

  return (
    <div className="charts-wrapper">
      <div style={{ marginLeft: "1rem" }}>
        <h1 style={{ marginBottom: "2rem" }}>Analysis Chart</h1>
        <Line
          {...config}
          onReady={(chartInstance) => (chart = chartInstance)}
        />
      </div>
      <div style={{ marginRight: "1rem" }}>
        <h1 style={{ marginBottom: "2rem" }}>Your Spendings</h1>
        {newSpendings[0].amount > 0 ? (
          <Pie
            {...spendingConfig}
            onReady={(chartInstance) => (pieChart = chartInstance)}
          />
        ) : (
          ""
        )}
        {console.log(newSpendings[0].amount)}
      </div>
    </div>
  );
}

export default Charts;
