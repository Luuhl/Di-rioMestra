import HeaderCoord from "./1Componentes/HeaderCoordenacao";
import SidebarMenu from "./1Componentes/SidebarMenu";
import { useState } from "react";

function GerenciamentoTurmas() {
  const [turmas, setTurmas] = useState([]);
  const [mostrarPopup, setMostrarPopup] = useState(false);

  const [novaTurma, setNovaTurma] = useState({
    serie: "",
    periodo: "",
    materias: [],
  });

  const materiasDisponiveis = [
    "Português",
    "Matemática",
    "História",
    "Ciências",
    "Geografia",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaTurma({ ...novaTurma, [name]: value });
  };

  const handleMateriaChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setNovaTurma((prev) => ({
        ...prev,
        materias: [...prev.materias, value],
      }));
    } else {
      setNovaTurma((prev) => ({
        ...prev,
        materias: prev.materias.filter((m) => m !== value),
      }));
    }
  };

  const cadastrarTurma = () => {
    const { serie, periodo, materias } = novaTurma;
    if (serie && periodo && materias.length > 0) {
      const nomeTurma = `${serie} - ${periodo} - ${materias.join(", ")}`;
      if (!turmas.includes(nomeTurma)) {
        setTurmas([...turmas, nomeTurma]);
        setMostrarPopup(false);
        setNovaTurma({ serie: "", periodo: "", materias: [] });
      }
    }
  };

  return (
    <>
      <HeaderCoord />
      <div className="main-container">
        <div className="sidebar">
          <SidebarMenu />
        </div>

        <main className="content">
          <h2>Gerenciamento de Turmas</h2>

          <button className="botao" onClick={() => setMostrarPopup(true)}>
            Cadastrar Turma
          </button>

          <div className="cardsContainer">
            {turmas.map((turma, index) => (
              <div className="cardTurma" key={index}>
                {turma}
              </div>
            ))}
          </div>
        </main>

        {mostrarPopup && (
          <div className="popupOverlay">
            <div className="popup">
              <h3>Nova Turma</h3>

              <div className="formGrid">
                <div className="filtro">
                  <label htmlFor="serie">Série</label>
                  <input
                    type="text"
                    name="serie"
                    value={novaTurma.serie}
                    placeholder="Escreva qual turma deseja cadastrar"
                    onChange={handleChange}
                  />
                </div>

                <div className="filtro">
                  <label htmlFor="periodo">Período</label>
                  <select
                    name="periodo"
                    id="periodo"
                    value={novaTurma.periodo}
                    onChange={handleChange}
                  >
                    <option value="">Selecione</option>
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                  </select>
                </div>

                <div className="filtro">
                  <label>Matérias</label>
                  <div className="checkboxGroup">
                    {materiasDisponiveis.map((materia) => (
                      <div className="checkboxItem" key={materia}>
                        <input
                          type="checkbox"
                          value={materia}
                          checked={novaTurma.materias.includes(materia)}
                          onChange={handleMateriaChange}
                          id={`checkbox-${materia}`}
                        />
                        <label htmlFor={`checkbox-${materia}`}>{materia}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="botoesPopup">
                <button
                  className="botaoPopupCancelar"
                  onClick={() => setMostrarPopup(false)}
                >
                  Cancelar
                </button>
                <button className="botaoPopup" onClick={cadastrarTurma}>
                  Cadastrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default GerenciamentoTurmas;
