import { Link } from "react-router-dom";

function SidebarMenu() {
  return (
    <nav className="sidebar">
      <ul className="menu-principal">
        <li><Link to="/coord">Início</Link></li>
        <li><Link to="/gerenciamento">Gerenciamento</Link></li>
        <li><Link to="/relatorio">Relatório</Link></li>
        <li><Link to="/mensagem">Mensagem</Link></li>
      </ul>

      <ul className="menu-inferior">
        <li><Link to="/configuracoes">Configurações</Link></li>
        <li><Link to="/sair">Sair</Link></li>
      </ul>

      <button className="botao-voltar">Voltar</button>
    </nav>
  );
}

export default SidebarMenu;
