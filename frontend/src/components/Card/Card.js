import { useState, useEffect } from "react";
import { api } from "../../services/api";

import './Card.css';

const today = new Date();
today.setDate(today.getDate() + 1);

const formatter = Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const Card = (props) => {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [monthBalance, setMonthBalance] = useState(0);
  const [expensesBalance, setExpensesBalance] = useState(0);
  const [incomesBalance, setIncomesBalance] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState(0);

  useEffect(() => {
    const dateEnd = new Date(
      props.dateStart.getFullYear(), 
      props.dateStart.getMonth() + 1,
      0
    );

    api.get('/balance?'
      + 'dateStart='
      + props.dateStart.toISOString()
      + '&dateEnd='
      + dateEnd.toISOString()
    ).then(res => {
      setMonthBalance(res.data.balance);
    });

    api.get('/balance?'
      + 'action=EXPENSE'
      + '&dateStart='
      + props.dateStart.toISOString()
      + '&dateEnd='
      + dateEnd.toISOString()
    ).then(res => {
      setExpensesBalance(res.data.balance);
    });

    api.get('/balance?'
      + 'action=INCOME'
      + '&dateStart='
      + props.dateStart.toISOString()
      + '&dateEnd='
      + dateEnd.toISOString()
    ).then(res => {
      setIncomesBalance(res.data.balance);
    });

    api.get('/balance?'
      + 'action=CALL'
      + '&dateStart='
      + props.dateStart.toISOString()
      + '&dateEnd='
      + today.toISOString()
    ).then(res => {
      setSavingsBalance(res.data.balance);
    });

    api.get('/balance?'
      + 'dateEnd='
      + today.toISOString()
    )
      .then(res => {
        setCurrentBalance(res.data.balance);
      });
  }, [props.tickets]);

  return ( 
    <div className="balance-card">
      <div className="currentBalance">
        <h3>Saldo Atual</h3>
        <p>{formatter.format(currentBalance)}</p>
      </div>
      <div className="monthBalance">
        <p><b>Saldo do mês:</b></p>
        <p> {formatter.format(monthBalance)}</p>
      </div>
      <div className="monthExpenses">
        <p><b>Gastos:</b></p>
        <p> {formatter.format(expensesBalance)}</p>
      </div>
      <div className="monthIncome">
        <p><b>Ganho:</b></p>
        <p> {formatter.format(incomesBalance)}</p>
      </div>
      <div className="monthSavings">
        <p><b>Salvo:</b></p>
        <p> {formatter.format(savingsBalance)}</p>
      </div>
    </div>
  );
}
 
export default Card;