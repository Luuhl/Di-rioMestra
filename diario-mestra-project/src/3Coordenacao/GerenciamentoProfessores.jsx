import HeaderCoord from "./1Componentes/HeaderCoordenacao";
import SidebarMenu from "./1Componentes/SidebarMenu";
import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

function GerenciamentoProfessores() {
  const [professores, setProfessores] = useState([]);
  const [novoProfessor, setNovoProfessor] = useState({
    nome: "",
    cpf: "",
    email: "",
    disciplina: "",
    dataDeNascimento: "",
    foto: ""
  });
  const [materias, setMaterias] = useState(['']);
  const [materiasSelecionadas, setMaterasSelecionas] = useState(['']);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  
  const [modoEdicao, setModoEdicao] = useState(false);
  const [professorEditandoId, setProfessorEditandoId] = useState(null);

  useEffect(() => {
    const buscarProfessores = async () => {
      try {
        const snapshot = await getDocs(collection(db, "professores"));
        const listaProfessores = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProfessores(listaProfessores);
      } catch (error) {
        console.error("Erro ao buscar professores:", error);
      }
    };
    buscarProfessores();
  }, []);

  const criarUsuarioProfessor = async (email, nome) => {
    try {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Email do professor inválido");
      }

      const senha = `${nome.toLowerCase().slice(0,3)}${novoProfessor.cpf.slice(-4)}!`;
      const userCredential = await createUserWithEmailAndPassword(
        auth, email, senha
      );

      return userCredential.user.uid;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw new Error(`Falha ao criar usuário: ${error.message}`);
    }
  };

  const criarRegistroUsuario = async (uid, email, professorId, nome) => {
    try {
      await addDoc(collection(db, "usuarios"), {
        uid,
        email,
        tipo: "professor",
        professorId,
        nome,
        criadoEm: new Date().toISOString(),
        permissoes: {
          acessoResponsavel: false,
          acessoCoordenacao: false,
          acessoProfessor: true
        }
      });
    } catch (error) {
      console.error("Erro ao criar registro de usuário:", error);
      throw error;
    }
  };

  const adicionarOuEditarProfessor = async () => {
    const nomeTrimado = novoProfessor.nome.trim();
    if (!nomeTrimado) return;

    try {
      if (modoEdicao && professorEditandoId) {
        const ref = doc(db, "professores", professorEditandoId);
        await updateDoc(ref, novoProfessor);

        setProfessores((prev) =>
          prev.map((p) =>
            p.id === professorEditandoId ? { ...p, ...novoProfessor } : p
          )
        );
      } else {
        const docRef = await addDoc(collection(db, "professores"), {
          ...novoProfessor,
          criadoEm: new Date().toISOString(),
        });

        const userId = await criarUsuarioProfessor(
          novoProfessor.email,
          novoProfessor.nome
        );

        await criarRegistroUsuario(
          userId,
          novoProfessor.email,
          docRef.id,
          novoProfessor.nome
        );

        setProfessores([...professores, { id: docRef.id, ...novoProfessor }]);
      }

      setNovoProfessor({
        nome: "",
        cpf: "",
        email: "",
        disciplina: "",
        dataDeNascimento: "",
        foto: ""
      });
      setMostrarPopup(false);
      setModoEdicao(false);
      setProfessorEditandoId(null);

      alert(`Professor cadastrado com sucesso!\n\nEmail: ${novoProfessor.email}\nSenha temporária: ${novoProfessor.nome.toLowerCase().slice(0, 3)}${novoProfessor.cpf.slice(-4)}!`);
    } catch (error) {
      console.error("Erro ao salvar professor", error);
      
      let mensagemErro = "Erro ao cadastrar: ";
      
      if (error.message.includes("auth/invalid-email")) {
        mensagemErro += "Email inválido.";
      } else if (error.message.includes("auth/email-already-in-use")) {
        mensagemErro += "Já existe um usuário com este email.";
      } else {
        mensagemErro += error.message;
      }
      
      alert(mensagemErro);
    }
  };

  const excluirProfessor = async (id) => {
    try {
      await deleteDoc(doc(db, "professores", id));
      setProfessores(professores.filter(professor => professor.id !== id));
    } catch (error) {
      console.error("Erro ao excluir professor:", error);
    }
  };

  const editarProfessor = (professor) => {
    setNovoProfessor({ ...professor });
    setModoEdicao(true);
    setProfessorEditandoId(professor.id);
    setMostrarPopup(true);
  };

  const handleImagemChange = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      const url = URL.createObjectURL(arquivo);
      setNovoProfessor({ ...novoProfessor, foto: url });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoProfessor(prev => ({
      ...prev,
      [name]: value
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

          <button className="botao" onClick={() => {
            setMostrarPopup(true);
            setModoEdicao(false);
            setNovoProfessor({
              nome: "",
              cpf: "",
              email: "",
              disciplina: "",
              dataDeNascimento: "",
              foto: "",
            });
          }}>
            Cadastrar Professor
          </button>

          <div className="cardsContainer">
            {professores.map((professor) => (
              <div key={professor.id} className="cardProfessor">
                <div className="conteudoCardBranco">
                  {professor.foto && (
                    <img className="cardfoto" src={professor.foto} alt="Foto" />
                  )}
                  <p>Professor: {professor.nome}</p>
                  <p>CPF: {professor.cpf}</p>
                  <p>Email: {professor.email}</p>
                  <p>Disciplina: {professor.disciplina}</p>
                  <p>Data de Nascimento: {professor.dataDeNascimento}</p>
                  <button className="botaoPopup" onClick={() => editarProfessor(professor)}>Editar</button>
                  <button className="botaoPopupCancelar" onClick={() => excluirProfessor(professor.id)}>Excluir</button>
                </div>
              </div>
            ))}
          </div>

          {mostrarPopup && (
            <div className="popupOverlay">
              <div className="popup">
                <h3>{modoEdicao ? "Editar Professor" : "Novo Professor"}</h3>

                <input
                  type="text"
                  name="nome"
                  placeholder="Nome completo"
                  value={novoProfessor.nome}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="cpf"
                  placeholder="CPF"
                  value={novoProfessor.cpf}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email pessoal"
                  value={novoProfessor.email}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="disciplina"
                  placeholder="Disciplina"
                  value={novoProfessor.disciplina}
                  onChange={handleChange}
                />
                <input
                  type="date"
                  name="dataDeNascimento"
                  value={novoProfessor.dataDeNascimento}
                  onChange={handleChange}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagemChange}
                />

                {novoProfessor.foto && (
                  <img
                    className="cardfoto"
                    src={novoProfessor.foto}
                    alt="Foto do Professor"
                  />
                )}

                <div className="botoesPopup">
                  <button
                    className="botaoPopupCancelar"
                    onClick={() => {
                      setMostrarPopup(false);
                      setModoEdicao(false);
                      setProfessorEditandoId(null);
                    }}
                  >
                    Cancelar
                  </button>

                  <button className="botaoPopup" onClick={adicionarOuEditarProfessor}>
                    {modoEdicao ? "Salvar Alterações" : "Cadastrar"}
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

export default GerenciamentoProfessores;