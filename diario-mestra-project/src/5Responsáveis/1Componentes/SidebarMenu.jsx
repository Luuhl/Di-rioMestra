import { Link } from "react-router-dom";

function SidebarMenuProf() {
  return (
    <nav className="sidebar">
      <ul className="menu-principal">
        <li><Link to="/inicio">Início</Link></li>
        <li><Link to="/justificar">Justificar Falta</Link></li>
        <li><Link to="/mensagem">Mensagem</Link></li>
      </ul>

      <ul className="menu-inferior">
        <li><Link to="/sair">Sair</Link></li>
      </ul>

      <button className="botao-voltar">Voltar</button>
    </nav>
  );
}

export default SidebarMenuProf;
