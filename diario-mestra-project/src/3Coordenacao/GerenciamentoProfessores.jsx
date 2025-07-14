import HeaderCoord from "./1Componentes/HeaderCoordenacao";
import SidebarMenu from "./1Componentes/SidebarMenu";
import { useState } from 'react';

function GerenciamentoProfessores() {
  const [professores, setProfessores] = useState([]);
  const [novoProfessor, setNovoProfessor] = useState({
    nome: "",
    CPF: "",
    DataDeNascimento: "",
    materia: "",
    foto: null,
  });

  const [mostrarPopup, setMostrarPopup] = useState(false);

  const adicionarProfessor = () => {
    const nomeTrimado = novoProfessor.nome.trim();
    if (
      nomeTrimado &&
      !professores.some((p) => p.nome === nomeTrimado && p.CPF === novoProfessor.CPF)
    ) {
      setProfessores([...professores, novoProfessor]);
      setNovoProfessor({
        nome: "",
        CPF: "",
        DataDeNascimento: "",
        materia: "",
        foto: null,
      });
      setMostrarPopup(false);
    }
  };

  const handleImagemChange = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      const url = URL.createObjectURL(arquivo);
      setNovoProfessor((prev) => ({
        ...prev,
        foto: url,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoProfessor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <HeaderCoord />

      <div className="main-container">
        <div className="sidebar">
          <SidebarMenu />
        </div>

        <main className="content">
          <h2>Gerenciamento de Professores</h2>

          <button className="botao" onClick={() => setMostrarPopup(true)}>
            Cadastrar Professor
          </button>

          <div className="cardscontainer">
            {professores.map((professor, index) => (
              <div key={index} className="cardProfessor">
                <div className="conteudoCardBranco">
                  {professor.foto && (
                    <img 
                    className="cardfoto"
                    src={professor.foto}
                    alt="Foto do professor" />
                  )}
                  <p>Professor: {professor.nome}</p>
                  <p>CPF: {professor.CPF}</p>
                  <p>Data de Nascimento: {professor.DataDeNascimento}</p>
                  <p>Matéria: {professor.materia}</p>
                </div>
              </div>
            ))}
          </div>

          {mostrarPopup && (
            <div className="popupOverlay">
              <div className="popup">
                <h3>Novo Professor</h3>

                <input
                  type="text"
                  name="nome"
                  placeholder="Nome completo"
                  value={novoProfessor.nome}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="CPF"
                  placeholder="CPF"
                  value={novoProfessor.CPF}
                  onChange={handleChange}
                />

                <input
                  type="date"
                  name="DataDeNascimento"
                  value={novoProfessor.DataDeNascimento}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="materia"
                  placeholder="Matéria"
                  value={novoProfessor.materia}
                  onChange={handleChange}
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagemChange}
                />

                {novoProfessor.foto && (
                  <img
                    className="cardfoto "
                    src={novoProfessor.foto}
                    alt="Foto do Aluno"
                  />
                )}


                <div className="botoesPopup">
                <button className="botaoPopupCancelar"
                onClick={() => setMostrarPopup(false)}>Cancelar</button>
                <button className="botaoPopup" onClick={adicionarProfessor}>Cadastrar</button>
                
              </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default GerenciamentoProfessores;
