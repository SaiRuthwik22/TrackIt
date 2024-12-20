import React from "react";
import "./style.css";
import { Card, Row } from "antd";
import Button from "../Button/Button";

function Cards({
  balance,
  income,
  expense,
  showExpenseModal,
  showIncomeModal,
}) {
  return (
    <div className="cards-container">
      <Row className="my-row">
        <Card className="my-card" bordered={true}>
          <h2>Current Balance</h2>
          <p>${balance}</p>
          <Button text="Reset Balance" blue={true} />
        </Card>
        <Card className="my-card" bordered={true}>
          <h2>Total Income</h2>
          <p>${income}</p>
          <Button text="Add income" blue={true} onClick={showIncomeModal} />
        </Card>
        <Card className="my-card" bordered={true}>
          <h2>Total Expenses</h2>
          <p>${expense}</p>
          <Button text="Add Expense" blue={true} onClick={showExpenseModal} />
        </Card>
      </Row>
    </div>
  );
}

export default Cards;
