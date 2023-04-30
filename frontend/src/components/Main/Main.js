import { useState, useEffect } from "react";
import TicketTable from "./TicketTable/TicketTable";

import './Main.css'
import Panel from "./Panel/Panel";

const actionsToText = {
  EXPENSE: "gastos",
  INCOME: "ganhos",
  CALL: "salvos"
};

const Main = (props) => {
  const [action, setAction] = useState('EXPENSE');
  const [title, setTitle] = useState('');

  const actions = ["INCOME", "EXPENSE", "CALL"];

  const changeDate = date => {
    props.setDateStart(new Date(date + '-01 00:00:00.000'));
  };

  const header = () => {
    if(props.tab == "PANEL") return (
      <>
        <h2>{title}</h2>
        <input 
          className="panel"
          type={"number"} 
          onChange={event => changeDate(event.target.value + '-01')}
          value={props.dateStart.toISOString().substring(0, 4)}
        />
      </>
    );
    else if(props.tab == "TAGS") return (
      <>
        <h2>{title}</h2>
      </>
    );
    else return (
      <>
        <p onClick={() => props.setDateStart(new Date(
          props.dateStart.getFullYear(),
          props.dateStart.getMonth() - 1
        ))}>
          {"<"}
        </p>
        <h2>{title}</h2>
        <input 
          className="action"
          type={"month"} 
          onChange={event => changeDate(event.target.value)}
          value={props.dateStart.toISOString().substring(0, 7)}
        />
        <p onClick={() => props.setDateStart(new Date(
          props.dateStart.getFullYear(),
          props.dateStart.getMonth() + 1
        ))}>
          {">"}
        </p>
      </>
    )
  };

  useEffect(() => {
    if(actions.includes(props.tab)) {
      setAction(props.tab);
      setTitle('Seus ' 
        + actionsToText[props.tab]
        + " em"
      );
    } else if(props.tab === "PANEL") {
      setAction('');
      setTitle("Seu painel em");
    } else {
      setAction('');
      setTitle("Suas tags");
    }

    
  }, [props.tab]);

  return (
    <div className="main">
      <div className="header">
        {header()}
      </div>
      {
        actions.includes(props.tab) ?
          (
            <TicketTable 
              action={action} 
              dateStart={props.dateStart}
              tickets={props.tickets}
              setTickets={props.setTickets}
            />
          )
          : (
            <Panel
              dateStart={props.dateStart}
            />
          )
      }
    </div>
  );
}
 
export default Main;