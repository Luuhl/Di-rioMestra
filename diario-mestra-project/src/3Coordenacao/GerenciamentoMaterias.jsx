import HeaderCoord from "./1Componentes/HeaderCoordenacao";
import SidebarMenu from "./1Componentes/SidebarMenu";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase';
import './Coordenacao.css';

function GerenciamentoMaterias() {
  const [materias, setMaterias] = useState([]);
  const [novaMateria, setNovaMateria] = useState({
    nome: '',
    codigo: '',
    descricao: '',
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    const buscarMaterias = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'materias'));
        const materiasData = querySnapshot.docs.map(doc => ({
          id: doc.id, 
          ...doc.data()
        }));
        setMaterias(materiasData);
      } catch (error) {
        console.error("Erro ao buscar matérias:", error);
      }
    };
    buscarMaterias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaMateria(prev => ({
      ...prev, 
      [name]: value
    }));
  };

  const adicionarMateria = async () => {
    if (!novaMateria.nome.trim()) return;

    try {
      if (editandoId) {
        await updateDoc(doc(db, 'materias', editandoId), novaMateria);
        setMaterias(materias.map(m => 
          m.id === editandoId ? { ...m, ...novaMateria } : m
        ));
      } else {
        const docRef = await addDoc(collection(db, 'materias'), novaMateria);
        setMaterias([...materias, { id: docRef.id, ...novaMateria }]);
      }

      setNovaMateria({
        nome: '',
        codigo: '',
        descricao: '',
      });
      setEditandoId(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Erro ao salvar matéria:", error);
      alert("Erro ao salvar matéria. Tente novamente.");
    }
  };

  const editarMateria = (materia) => {
    setNovaMateria({
      nome: materia.nome,
      codigo: materia.codigo,
      descricao: materia.descricao,
    });
    setEditandoId(materia.id);
    setMostrarFormulario(true);
  };

  const excluirMateria = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta matéria?")) return;
    
    try {
      await deleteDoc(doc(db, 'materias', id));
      setMaterias(materias.filter(m => m.id !== id));
    } catch (error) {
      console.error("Erro ao excluir matéria:", error);
      alert("Erro ao excluir matéria. Tente novamente.");
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
          <h2>Cadastro de Matérias</h2>
          
          <button 
            className="botaoPopup"
            onClick={() => {
              setMostrarFormulario(true);
              setEditandoId(null);
              setNovaMateria({
                nome: '',
                codigo: '',
                descricao: '',
              });
            }}
          >
            Nova Matéria
          </button>

          <div className="materias-grid">
            {materias.length > 0 ? (
              materias.map(materia => (
                <div key={materia.id} className="materia-card">
                  <div>
                    <h3>{materia.nome}</h3>
                    <span>{materia.codigo}</span>
                  </div>
                  <div >
                    <p>{materia.descricao}</p>
                  </div>
                  <div>
                    <button 
                      className="botao"
                      onClick={() => editarMateria(materia)}
                    >
                      Editar
                    </button>
                    <button 
                      className="botao-cancelar"
                      onClick={() => excluirMateria(materia.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhuma matéria cadastrada ainda.</p>
            )}
          </div>

          {mostrarFormulario && (
            <div className="popupOverlay">
              <div className="popup">
                <h3>{editandoId ? 'Editar Matéria' : 'Nova Matéria'}</h3>
                
                <div>
                  <label>Nome da Matéria:</label>
                  <input
                    type="text"
                    name="nome"
                    value={novaMateria.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label>Código:</label>
                  <input
                    type="text"
                    name="codigo"
                    value={novaMateria.codigo}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label>Descrição:</label>
                  <textarea
                    name="descricao"
                    value={novaMateria.descricao}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
                
                <div>
                  <button
                    className="botaoPopupCancelar"
                    onClick={() => {
                      setMostrarFormulario(false);
                      setEditandoId(null);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    className="botaoPopup"
                    onClick={adicionarMateria}
                  >
                    {editandoId ? 'Atualizar' : 'Salvar'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default GerenciamentoMaterias;