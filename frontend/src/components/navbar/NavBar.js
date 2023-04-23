import './NavBar.css';

const NavBar = (props) => {
  return (
    <div className='bar'>
      <h1>Finanças</h1>
      <p onClick={() => props.changeAction('EXPENSE')}>Gastos</p>
      <p onClick={() => props.changeAction('INCOME')}>Ganhos</p>
      <p onClick={() => props.changeAction('CALL')}>Salvos</p>
      <p onClick={() => props.changeAction('EXPENSE')}>Tags</p>
    </div>
  )
}
 
export default NavBar;