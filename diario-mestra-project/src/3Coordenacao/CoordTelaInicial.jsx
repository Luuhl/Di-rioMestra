import HeaderCoord from "./1Componentes/HeaderCoordenacao";
import SidebarMenu from "./1Componentes/SidebarMenu";
import Footer from "./1Componentes/Footer";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';

function CoordTelaInicial() {
  const [data, setData] = useState(new Date());

  return (
    <>
      <HeaderCoord />

      <Footer/>

      <div className="main-container">
        <SidebarMenu />

        <main className="content">
          <h2>Bem-Vinda Fulana</h2>

          <div className="cardsResumo">
            <div className="cardResumo">
              Alunos Matriculados <br />
              <strong>77</strong>
            </div>
            <div className="cardResumo">
              Turmas Cadastradas <br />
              <strong>13</strong>
            </div>
            <div className="cardResumo">
              Professores Cadastrados <br />
              <strong>12</strong>
            </div>
          </div>

          <section>
            <h3>Calendário</h3>
            <Calendar onChange={setData} value={data} />
          </section>
        </main>
      </div>
    </>
  );
}

export default CoordTelaInicial;
