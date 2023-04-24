import { useState } from 'react';
import { api } from '../../../services/api';

const monthDiff = (d1, d2) => {
  console.log(d1.toISOString(), d2.toISOString());

  let months = (d1.getFullYear() - d2.getFullYear()) * 12;
  months += d1.getMonth();
  months -= d2.getMonth();
  return months < 0 ? 0 : months;
};

const EditTicket = (props) => {
  const [editDate, setEditDate] = useState(new Date(props.item.date));
  const [editEndDate, setEditEndDate] = useState(new Date(
    props.item.repeatUntil.substring(0, 4),
    Number.parseInt(props.item.repeatUntil.substring(5, 7)) + 1,
    -1
  ));
  const [editValue, setEditValue] = useState(0);
  const [editTags, setEditTags] = useState('');

  const editTicket = (id, ticket) => {
    api.put('ticket/' + id, ticket)
      .then(() => {
        props.getTickets();
      });
  };
  
  const edit = id => {
    const tagsArr = editTags?.split(' ')
      .map(e => {
      return {name: e};
      });
        
    if(editDate || editTags || editValue || editEndDate){
      const repetitions = monthDiff(
        editEndDate,
        editDate
      );

      const ticket = {
        date: editDate,
        tags: editTags ? editTags.split(' ') : undefined,
        value: editValue ? editValue : undefined,
        repetitions: repetitions > 0 ? repetitions : 1
      };
      
      if(editTags) {
      api.post('/tags', tagsArr)
          .then(() => {
          editTicket(id, ticket);
          });
      } else {
        editTicket(id, ticket);
      }

      setEditDate(new Date(0));
      setEditEndDate(new Date(
        props.item.repeatUntil.substring(0, 4),
        Number.parseInt(props.item.repeatUntil.substring(5, 7)) + 1,
        -1
      ));
      setEditValue(0);
      setEditTags('');
    }
  };

  const editRow = item => {
    return (
      <>
        <td>
          <input 
            type="date" 
            defaultValue={item.date.substring(0, 10)}
            onChange={event => setEditDate(new Date(event.target.value))}
          />
          </td>
          <td>
            <input 
              type="number"
              defaultValue={item.value}
              onChange={event => setEditValue(Number.parseFloat(event.target.value))}
              id='value'
            />
          </td>
          <td>
            <input 
              type="text"
              defaultValue={
                item.ticketTags.map(tag => tag.tag.name)
                  .reduce((acc, cur) => acc + ' ' + cur)
              }
              onChange={event => setEditTags(event.target.value)}
            />
          </td>
          <td>
            <input 
              type="month" 
              defaultValue={item.repeatUntil.substring(0, 7)}
              onChange={event => {
                const end = new Date(
                  event.target.value.substring(0, 4),
                  Number.parseInt(event.target.value.substring(5, 7)) + 1,
                  -1
                );

                setEditEndDate(end);
              }}
            />
          </td>
          <td>
          <button 
            onClick={() => {
              props.setEditId(-1);
              edit(item.id);
            }}
          >
            Salvar
          </button>
          <button onClick={() => props.deleteTicket(item.id)}>Excluir</button>
        </td>
      </>
    );
  };

  return (
    <>
      {editRow(props.item)}
    </>
  )
}
 
export default EditTicket;