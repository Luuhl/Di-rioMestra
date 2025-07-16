import HeaderProf from "./1Componentes/Header";
import SidebarMenuProf from './1Componentes/SidebarMenu';
import Footer from "./1Componentes/Footer";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';

function ProfTelaInicial () {
  const [data, setData] = useState(new Date());

  // Dados simulados das aulas do dia
  const aulasHoje = [
    { materia: 'Matemática', turma: '1º série', horario: '08:00 - 11:00', marcada: true },
    { materia: 'Matemática', turma: '6º série', horario: '12:00 - 14:00', marcada: false },
    { materia: 'Matemática', turma: '8º série', horario: '15:00 - 17:00', marcada: false },
  ];

  return (
    <>
      <HeaderProf />
      <Footer />

      <div className="main-container">
        <SidebarMenuProf />

        <main className="content">
          <h2>Bem-vinda, Professora</h2>

          <section className="secao-aulas">
            <h3>Suas aulas de hoje:</h3>
            <div className="aulasProf">
              {aulasHoje.map((aula, index) => (
                <div className="card-aula" key={index}>
                  <h4>{aula.materia}</h4>
                  <p>{aula.turma}</p>
                  <p>{aula.horario}</p>
                  {aula.marcada ? (
                    <span className="icone-marcado">✅</span>
                  ) : (
                    <span className="icone-a-marca">📋</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="secao-eventos">
            <h3>Eventos</h3>
            <div className="cardEventos">
              <p>Nenhum evento marcado para hoje.</p>
            </div>
          </section>

          <section className="secao-calendario">
            <h3>Calendário</h3>
            <Calendar onChange={setData} value={data} />
          </section>
        </main>
      </div>
    </>
  );
}

export default ProfTelaInicial;
