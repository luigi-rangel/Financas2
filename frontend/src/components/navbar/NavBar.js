import './NavBar.css';

const NavBar = (props) => {
  return (
    <div className='bar'>
      <h1>Finanças</h1>
      <p onClick={() => props.changeTab('PANEL')}>Painel</p>
      <p onClick={() => props.changeTab('EXPENSE')}>Gastos</p>
      <p onClick={() => props.changeTab('INCOME')}>Ganhos</p>
      <p onClick={() => props.changeTab('CALL')}>Salvos</p>
      <p onClick={() => props.changeTab('TAGS')}>Tags</p>
    </div>
  )
}
 
export default NavBar;