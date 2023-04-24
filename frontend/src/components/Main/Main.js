import { useState, useEffect } from "react";
import TicketTable from "./TicketTable/TicketTable";

import './Main.css'

const actions = {
  EXPENSE: "gastos",
  INCOME: "ganhos",
  CALL: "salvos"
};

const Main = (props) => {
  const [title, setTitle] = useState('');

  const changeDate = date => {
    props.setDateStart(new Date(date + '-01 00:00:00.000'));
  };

  useEffect(() => {
    setTitle('Seus ' 
      + actions[props.action] 
      + " em"
    );
  }, [props.action]);

  return (
    <div className="main">
      <div className="header">
        <p onClick={() => props.setDateStart(new Date(
          props.dateStart.getFullYear(),
          props.dateStart.getMonth() - 1
        ))}>
          {"<"}
        </p>
        <h2>{title}</h2>
        <input 
          type="month" 
          onChange={event => changeDate(event.target.value)}
          value={props.dateStart.toISOString().substring(0, 7)}
        />
        <p onClick={() => props.setDateStart(new Date(
          props.dateStart.getFullYear(),
          props.dateStart.getMonth() + 1
        ))}>
          {">"}
        </p>
      </div>
      <TicketTable 
        action={props.action} 
        dateStart={props.dateStart}
        tickets={props.tickets}
        setTickets={props.setTickets}
      />
    </div>
  );
}
 
export default Main;