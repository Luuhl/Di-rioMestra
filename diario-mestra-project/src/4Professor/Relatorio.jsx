import { useState } from "react";
import HeaderCoord from "./1Componentes/HeaderCoordenacao";
import SidebarMenu from "./1Componentes/SidebarMenu";

function Relatorios() {
  const [filtros, setFiltros] = useState({
    periodo: "",
    turma: "",
    materia: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const gerarRelatorio = () => {
    console.log("Filtros selecionados:", filtros);
    // Aqui você pode adicionar a lógica de fetch, geração de PDF, etc.
  };

  return (
    <>
      <HeaderCoord />

      <div className="main-container">
        <div className="sidebar">
          <SidebarMenu />
        </div>

        <main className="content">
          <h2>Relatórios</h2>
          <p>Gere relatórios de frequência personalizados</p>

          <section className="filtros-box">
            <h4>Filtros</h4>

            <div className="filtros">
              <div className="filtro">
                <label htmlFor="periodo">Período</label>
                <select
                  name="periodo"
                  id="periodo"
                  value={filtros.periodo}
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  {/* Adicione aqui suas opções de período */}
                </select>
              </div>

              <div className="filtro">
                <label htmlFor="turma">Turma</label>
                <select
                  name="turma"
                  id="turma"
                  value={filtros.turma}
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  {/* Adicione aqui suas opções de turma */}
                </select>
              </div>

              <div className="filtro">
                <label htmlFor="materia">Matéria</label>
                <select
                  name="materia"
                  id="materia"
                  value={filtros.materia}
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  {/* Adicione aqui suas opções de matéria */}
                </select>
              </div>
            </div>

            <button className="botao" onClick={gerarRelatorio}>
              Gerar relatório
            </button>
          </section>
        </main>
      </div>
    </>
  );
}

export default Relatorios;
