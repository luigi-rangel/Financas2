import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { api } from '../../../services/api';
import './Panel.css';

const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", 
  "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const formatter = Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const Panel = (props) => {
  const [panel, setPanel] = useState([]);

  useEffect(() => {
    api.get('/panel/' + props.dateStart.getFullYear())
      .then(res => setPanel(res.data.data));
  }, [props.dateStart]);

  return ( 
    <>
    <Table bordered>
      <thead>
        <tr>
          <th>Mês</th>
          <th>Ganhos</th>
          <th>Gastos</th>
          <th>Salvo Mensal</th>
          <th>Salvo Total</th>
          <th>Saldo Mensal</th>
          <th>Saldo Total</th>
        </tr>
      </thead>
      <tbody className='panel-body'>
        {
          panel.map((item, i) => {
            return (
              <tr key={i}>
                <td>{months[i]}</td>
                <td>{formatter.format(item.INCOME)}</td>
                <td>{formatter.format(item.EXPENSE)}</td>
                <td>{formatter.format(item.CALL)}</td>
                <td>{formatter.format(item.TOTALCALL)}</td>
                <td>{formatter.format(item.MONTHBALANCE)}</td>
                <td>{formatter.format(item.TOTALBALANCE)}</td>
              </tr>
            )
          })
        }
      </tbody>
    </Table>
    </>
  );
}
 
export default Panel;