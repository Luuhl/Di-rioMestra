import HeaderCoord from "./1Componentes/HeaderCoordenacao";
import SidebarMenu from "./1Componentes/SidebarMenu";
import { Link } from "react-router-dom";

function CoordGerenciamento() {
  const cards = [
    {
      titulo: "Matérias",
      descricao: "Cadastre as disciplinas oferecidas pela escola...",
      botao: "Gerenciar Matérias",
      rota: "/gerenciar-materias",
    },
    {
      titulo: "Turmas",
      descricao: "Crie e organize as turmas por série e período...",
      botao: "Gerenciar Turmas",
      rota: "/gerenciar-turmas",
    },
    {
      titulo: "Alunos",
      descricao: "Gerencie o cadastro de alunos...",
      botao: "Gerenciar Alunos",
      rota: "/gerenciar-alunos",
    },
    {
      titulo: "Professores",
      descricao: "Cadastre, edite ou remova professores...",
      botao: "Gerenciar Professores",
      rota: "/gerenciar-professores",
    },
  ];

  return (
    <>
      <HeaderCoord />

      <div className="main-container">
        <div className="sidebar">
          <SidebarMenu />
        </div>

        <main className="content">
          <h1>Gerenciamento</h1>

          <div className="cardsCoordGrid">
            {cards.map((card, index) => (
              <div className="cardCoord" key={index}>
                <h2>{card.titulo}</h2>
                <p>{card.descricao}</p>
                <Link to={card.rota}>
                  <button className="botao-gerenciar">{card.botao}</button>
                </Link>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default CoordGerenciamento;
