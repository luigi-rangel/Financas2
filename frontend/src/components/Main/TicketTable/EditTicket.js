import { useState } from 'react';
import { api } from '../../../services/api';

const EditTicket = (props) => {
  const [editDate, setEditDate] = useState('');
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
        
    if(editDate || editTags || editValue){
      const ticket = {
      date: editDate ? new Date(editDate) : undefined,
      tags: editTags ? editTags.split(' ') : undefined,
      value: editValue ? editValue : undefined
      };
      
      if(editTags) {
      api.post('/tags', tagsArr)
          .then(() => {
          editTicket(id, ticket);
          });
      } else {
      editTicket(id, ticket);
      }

      setEditDate('');
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
            onChange={event => {setEditDate(event.target.value)}}
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
            <input type="month" />
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