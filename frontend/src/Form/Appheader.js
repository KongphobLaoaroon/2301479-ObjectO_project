import './Appheader.css';
import { NavLink } from 'react-router-dom';
function Appheader(){
    function getNavClass(navLinkProps) {
        let navClass = 'app-header-item';
        if (navLinkProps.isActive) navClass += ' app-header-item-active';
        return navClass;}
    
    return(
        <header className="App-header">
            
            <img className='App-header-logo' src={require('./chula.png')} alt="Chula Logo" />
            <h4><font color= 'pink'>จุฬาลงกรณ์มหาวิทยาลัย</font></h4>
            <div className="App-headerright">
            <NavLink className={getNavClass} to="/" end>
        Find
      </NavLink>
      <NavLink className={getNavClass} to="about">
        Instructor
      </NavLink>
      </div>
        </header>
    )
}
export default Appheader;