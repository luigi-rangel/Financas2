import { useState, useEffect } from "react";
import TicketTable from "./TicketTable/TicketTable";

import './Main.css'

const actions = {
  EXPENSE: "gastos",
  INCOME: "ganhos",
  CALL: "salvos"
};

const today = new Date();

const Main = (props) => {
  const [title, setTitle] = useState('');
  const [dateStart, setDateStart] = useState(
    new Date(
      today.getFullYear(),
      today.getMonth()
    )
  );

  const changeDate = date => {
    setDateStart(new Date(date + '-01 03:0:00.000Z'));
  }

  useEffect(() => {
    setTitle('Seus ' 
      + actions[props.action] 
      + " em"
    );
  }, [props.action]);

  return (
    <div className="main">
      <div className="header">
        <p onClick={() => setDateStart(new Date(
          dateStart.getFullYear(),
          dateStart.getMonth() - 1
        ))}>
          {"<"}
        </p>
        <h2>{title}</h2>
        <input 
          type="month" 
          onChange={event => changeDate(event.target.value)}
          value={dateStart.toISOString().substring(0, 7)}
        />
        <p onClick={() => setDateStart(new Date(
          dateStart.getFullYear(),
          dateStart.getMonth() + 1
        ))}>
          {">"}
        </p>
      </div>
      <TicketTable 
        action={props.action} 
        dateStart={dateStart}
      />
    </div>
  );
}
 
export default Main;