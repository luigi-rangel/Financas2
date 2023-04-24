import { useState, useEffect } from "react";
import { api } from "../../services/api";

import './Card.css';

const formatter = Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const Card = (props) => {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    api.get('/summary/' + props.dateStart.toISOString().substring(0, 7))
      .then(res => {
        setSummary(res.data.data);
      })
  }, [props.tickets]);

  return ( 
    <div className="balance-card">
      <div className="currentBalance">
        <h3>Saldo Atual</h3>
        <p>{formatter.format(summary?.currentBalance || 0)}</p>
      </div>
      <div className="monthBalance">
        <p><b>Saldo do mês:</b></p>
        <p> {formatter.format(summary?.monthBalance || 0)}</p>
      </div>
      <div className="monthExpenses">
        <p><b>Gastos:</b></p>
        <p> {formatter.format(summary?.monthExpenses || 0)}</p>
      </div>
      <div className="monthIncome">
        <p><b>Ganho:</b></p>
        <p> {formatter.format(summary?.monthIncome || 0)}</p>
      </div>
      <div className="monthSavings">
        <p><b>Salvo:</b></p>
        <p> {formatter.format(summary?.monthSavings || 0)}</p>
      </div>
    </div>
  );
}
 
export default Card;