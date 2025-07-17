import { Link } from "react-router-dom";

function SidebarMenuProf() {
  return (
    <nav className="sidebar">
      <ul className="menu-principal">
        <li><Link to="/inicio">Início</Link></li>
        <li><Link to="/lista">Lista de Chamada</Link></li>
        <li><Link to="/diário">Diário de aula</Link></li>
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

export default SidebarMenuProf;
