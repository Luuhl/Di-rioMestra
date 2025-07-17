import HeaderCoord from "./1Componentes/HeaderCoordenacao";
import SidebarMenu from "./1Componentes/SidebarMenu";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase';
import './Coordenacao.css';

function GerenciamentoTurmas() {
  const [turmas, setTurmas] = useState([]);
  const [novaTurma, setNovaTurma] = useState({
    serie: '',
    periodo: '',
    materias: [],
  });
  const [materiasDisponiveis, setMateriasDisponiveis] = useState([]);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    const buscarTurmas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'turmas'));
      const turmasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTurmas(turmasData);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
    }
  };

  const buscarMaterias = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'materias'));
      const listaMaterias = querySnapshot.docs.map(doc => doc.data().nome);
      setMateriasDisponiveis(listaMaterias);
    } catch (error) {
      console.error("Erro ao buscar matérias disponíveis:", error);
    }
  };

  buscarTurmas();
  buscarMaterias();
}, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaTurma(prev => ({ ...prev, [name]: value }));
  };

  const handleMateriaChange = (e) => {
    const { value, checked } = e.target;
    setNovaTurma(prev => ({
      ...prev,
      materias: checked
        ? [...prev.materias, value]
        : prev.materias.filter(m => m !== value)
    }));
  };

  const adicionarTurma = async () => {
    if (!novaTurma.serie.trim()) return;

    try {
      if (editandoId) {
        await updateDoc(doc(db, 'turmas', editandoId), novaTurma);
        setTurmas(turmas.map(t =>
          t.id === editandoId ? { ...t, ...novaTurma } : t
        ));
      } else {
        const docRef = await addDoc(collection(db, 'turmas'), novaTurma);
        setTurmas([...turmas, { id: docRef.id, ...novaTurma }]);
      }

      setNovaTurma({
        serie: '',
        periodo: '',
        materias: [],
      });
      setEditandoId(null);
      setMostrarPopup(false);
    } catch (error) {
      console.error("Erro ao salvar turma:", error);
      alert("Erro ao salvar turma. Tente novamente.");
    }
  };

  const editarTurma = (turma) => {
    setNovaTurma({
      serie: turma.serie,
      periodo: turma.periodo,
      materias: turma.materias || [],
    });
    setEditandoId(turma.id);
    setMostrarPopup(true);
  };

  const excluirTurma = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta turma?")) return;

    try {
      await deleteDoc(doc(db, 'turmas', id));
      setTurmas(turmas.filter(t => t.id !== id));
    } catch (error) {
      console.error("Erro ao excluir turma:", error);
      alert("Erro ao excluir turma. Tente novamente.");
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

          <button className="botao" onClick={() => {
            setMostrarPopup(true);
            setNovaTurma({ serie: '', periodo: '', materias: [] });
            setEditandoId(null);
          }}>
            {editandoId ? "Editar Turma" : "Cadastrar Turma"}
          </button>

          <div className="materias-grid">
            {turmas.map((turma) => (
              <div className="materia-card" key={turma.id}>
                <h3>{turma.serie} - {turma.periodo}</h3>
                <p><strong>Matérias:</strong> {turma.materias?.join(', ')}</p>
                <button className="botao" onClick={() => editarTurma(turma)}>Editar</button>
                <button className="botao-cancelar" onClick={() => excluirTurma(turma.id)}>Excluir</button>
              </div>
            ))}
          </div>
        </main>

        {mostrarPopup && (
          <div className="popupOverlay">
            <div className="popup">
              <h3>{editandoId ? 'Editar Turma' : 'Nova Turma'}</h3>

              <div className="formGrid">
                <div className="filtro">
                  <label htmlFor="serie">Série</label>
                  <input
                    type="text"
                    name="serie"
                    value={novaTurma.serie}
                    placeholder="Ex: 1º Ano A"
                    onChange={handleChange}
                  />
                </div>

                <div className="filtro">
                  <label htmlFor="periodo">Período</label>
                  <select
                    name="periodo"
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
                <button className="botaoPopupCancelar" onClick={() => setMostrarPopup(false)}>
                  Cancelar
                </button>
                <button className="botaoPopup" onClick={adicionarTurma}>
                  {editandoId ? 'Atualizar' : 'Cadastrar'}
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
