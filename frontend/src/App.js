import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

import NavBar from './components/Navbar/NavBar';
import Main from './components/Main/Main';
import Card from './components/Card/Card';

const today = new Date();

function App() {
  const [tab, setTab] = useState('PANEL');
  const [tickets, setTickets] = useState([]);
  const [dateStart, setDateStart] = useState(
    new Date(
      today.getFullYear(),
      today.getMonth()
    )
  );

  const changeTab = tab => {
    setTab(tab)
  };

  return (
    <div id='app'>
      <NavBar 
        changeTab={changeTab}
      />
      <Main 
        tab={tab} 
        dateStart={dateStart} 
        setDateStart={setDateStart} 
        tickets={tickets} 
        setTickets={setTickets}
      />
      <Card 
        dateStart={dateStart}
        tickets={tickets}
      />
    </div>
  );
}

export default App;