import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

import NavBar from './components/navbar/NavBar';
import Main from './components/Main/Main';

function App() {
  const [action, setAction] = useState('EXPENSE');

  const changeAction = action => {
    setAction(action);
  };

  return (
    <div id='app'>
      <NavBar changeAction={changeAction} action={action}></NavBar>
      <Main action={action}></Main>
    </div>
  );
}

export default App;