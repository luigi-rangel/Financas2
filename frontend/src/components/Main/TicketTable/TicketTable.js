import Table from 'react-bootstrap/Table';
import { api } from '../../../services/api';
import { useState, useEffect, useRef } from 'react';

import './TicketTable.css';
import EditTicket from './EditTicket';

const formatter = Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const monthDiff = (d1, d2) => {
  let months = (d1.getFullYear() - d2.getFullYear()) * 12;
  months += d1.getMonth();
  months -= d2.getMonth();
  return months < 0 ? 0 : months;
}

const TicketTable = (props) => {
  const [date, setDate] = useState(
    new Date(
      new Date().getFullYear(), 
      new Date().getMonth(), 
      new Date().getDate()
    )
  );
  const [tags, setTags] = useState('');
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState(-1);
  const [repetitions, setRepetitions] = useState(1);
  
  const createButton = useRef();

  const changeDate = date => {
    setDate(date);
  };

  const getTickets = () => {
    const dateEnd = new Date(
      props.dateStart.getFullYear(), 
      props.dateStart.getMonth() + 1,
      0
    );

    api.get('/tickets?action=' 
      + props.action 
      + '&dateStart=' 
      + props.dateStart.toISOString()
      + '&dateEnd='
      + dateEnd.toISOString()
      ).then(res => {
        props.setTickets(res.data.data);
      });
  };

  const createTicket = (ticket) => {
    api.post('/ticket', ticket)
      .then(() => {
        getTickets();
      });
  };

  const create = () => {
    const tagsArr = tags
      .split(' ')
      .map(e => {
        return {name: e};
      });
    
    const ticket = {
      date: date.toISOString().substring(0, 10),
      tags: tags.split(' '),
      value,
      action: props.action,
      repetitions: repetitions
    };

    api.post('/tags', tagsArr)
      .then(() => {
        createTicket(ticket);
      });
  };

  const deleteTicket = id => {
    api.delete('/ticket/' + id)
      .then(() => {
        getTickets();
      });
  };

  const viewRow = item => {
    const itemDate = new Date(item.date);
    itemDate.setDate(itemDate.getDate() + 1);

    const repeatUntil = new Date(item.repeatUntil);
    repeatUntil.setDate(repeatUntil.getDate() + 1);

    return (
      <>
      <td>{itemDate.toLocaleDateString()}</td>
      <td>{formatter.format(item.value)}</td>
      <td>
        {
          item.ticketTags.map(tag => tag.tag.name)
          .reduce((acc, cur) => acc + ', ' + cur)
        }
      </td>
      <td>
        {itemDate.toString() === repeatUntil.toString() ? '-' : repeatUntil.toLocaleDateString()}
      </td>
      <td>
          <button
            onClick={() => {
              setEditId(item.id);
            }}
          >
            Editar
          </button>
          <button onClick={() => deleteTicket(item.id)}>Excluir</button>
        </td>
      </>
    );
  };

  const processRow = (item, type) => {
    return (
      <>
        {type ? (
          <EditTicket 
            item={item} 
            setEditId={setEditId}
            getTickets={getTickets}
            deleteTicket={deleteTicket}
          />
        ) : viewRow(item)}
      </>
    );
  };

  useEffect(() => {
    const newDate = new Date(date.toISOString().substring(0, 10) + 'T03:00:00.000Z');
    if(newDate.getDate() > 30 && [3, 5, 8, 10].includes(props.dateStart.getMonth())) {
        newDate.setDate(30);
    } else if (newDate.getDate() > 28 && (props.dateStart.getMonth()) === 1) {
        newDate.setDate(28);
    }
    newDate.setMonth(props.dateStart.getMonth());
    setDate(newDate);
  }, [props.dateStart]);

  useEffect(() => {
    getTickets();
  }, [props.action, props.dateStart]);

  useEffect(() => {
    if(!(tags && value)) {
      createButton.current.setAttribute("disabled", true);
    } else {
      createButton.current.removeAttribute("disabled");
    }
  }, [tags, value]);

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Valor</th>
            <th>Tags</th>
            <th>Repetir até</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {props.tickets.map((item, ind) => {
            const itemDate = new Date(item.date);
            itemDate.setDate(itemDate.getDate() + 1);

            return (
              <tr key={ind}>
                {processRow(item, item.id === editId)}
              </tr>
            )
          })}
          <tr>
            <td>
              <input 
                type="date" 
                value={date.toISOString().substring(0, 10)}
                onChange={event => {
                  setDate(new Date(event.target.value));
                  }
                }
              />
            </td>
            <td>
              <input 
                type="number"
                onChange={event => setValue(Number.parseFloat(event.target.value))}
                id='value'
              />
            </td>
            <td>
              <input 
                type="text"
                onChange={event => setTags(event.target.value)}
              />
            </td>
            <td>
              <input 
                type="month"
                onChange={
                  event => {
                    const end = new Date(
                      event.target.value.substring(0, 4),
                      Number.parseInt(event.target.value.substring(5, 7)) + 1,
                      -1
                    );

                    setRepetitions(monthDiff(end, date));
                  }
                }
              />
            </td>
            <td>
              <button onClick={create} ref={createButton}>Criar</button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
 
export default TicketTable;