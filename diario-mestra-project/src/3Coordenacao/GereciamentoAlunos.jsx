import HeaderCoord from "./1Componentes/HeaderCoordenacao";
import SidebarMenu from "./1Componentes/SidebarMenu";
import { useState, useEffect } from "react";
import {collection, addDoc,getDocs,deleteDoc,updateDoc,doc,} from "firebase/firestore";
import { db, auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

function GerenciamentoAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [novoAluno, setNovoAluno] = useState({
    nome: "",
    cpf: "",
    responsavel: "",
    cpfResponsavel: "",
    dataDeNascimento: "",
    foto: "",
  });
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [alunoEditandoId, setAlunoEditandoId] = useState(null);

  useEffect(() => {
    const buscarAlunos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "alunos"));
        const listaAlunos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAlunos(listaAlunos);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    };

    buscarAlunos();
  }, []);

  const criarUsuarioResponsavel = async (cpfResponsavel, responsavelNome) => {
    try {
      if (!cpfResponsavel || cpfResponsavel.replace(/\D/g, '').length < 11) {
        throw new Error("CPF do responsável inválido");
      }

      const cpfLimpo = cpfResponsavel.replace(/\D/g, '').slice(-11);
      const emailEscola = `responsavel.${cpfLimpo}@escolamestra.com`;
      const senha = `${cpfLimpo.slice(-6)}`;

      if (!/^[^@]+@[^@]+\.[^@]+$/.test(emailEscola)) {
        throw new Error("Email gerado é inválido");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailEscola,
        senha
      );

      return userCredential.user.uid;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw new Error(`Falha ao criar usuário: ${error.message}`);
    }
  };

  const criarRegistroUsuario = async (uid, cpfResponsavel, alunoId, responsavelNome) => {
    try {
      await addDoc(collection(db, "usuarios"), {
        uid,
        cpfResponsavel,
        tipo: "responsavel",
        alunoId,
        nome: responsavelNome,
        criadoEm: new Date().toISOString(),
        permissoes: {
          acessoResponsavel: true,
          acessoCoordenacao: false,
          acessoProfessor: false,
        },
      });
    } catch (error) {
      console.error("Erro ao criar registro de usuário:", error);
      throw error;
    }
  };

  const adicionarOuEditarAluno = async () => {
    const nomeTrimado = novoAluno.nome.trim();
    if (!nomeTrimado) return;

    try {
      if (modoEdicao && alunoEditandoId) {
        const ref = doc(db, "alunos", alunoEditandoId);
        await updateDoc(ref, novoAluno);

        setAlunos((prev) =>
          prev.map((a) =>
            a.id === alunoEditandoId ? { ...a, ...novoAluno } : a
          )
        );
      } else {
        const docRef = await addDoc(collection(db, "alunos"), {
          ...novoAluno,
          criadoEm: new Date().toISOString(),
        });

        const userId = await criarUsuarioResponsavel(
          novoAluno.cpfResponsavel,
          novoAluno.responsavel
        );

        await criarRegistroUsuario(
          userId,
          novoAluno.cpfResponsavel,
          docRef.id,
          novoAluno.responsavel
        );

        setAlunos([...alunos, { id: docRef.id, ...novoAluno }]);
      }

      setNovoAluno({
        nome: "",
        cpf: "",
        responsavel: "",
        cpfResponsavel: "",
        dataDeNascimento: "",
        foto: "",
      });
      setMostrarPopup(false);
      setModoEdicao(false);
      setAlunoEditandoId(null);

      alert(
        `Usuário criado com sucesso!\n\nLogin: ${novoAluno.cpfResponsavel}\nSenha: ${novoAluno.cpfResponsavel.slice(-6)}`
      );
    } catch (error) {
      console.error("Erro ao salvar aluno", error);

      let mensagemErro = "Erro ao cadastrar: ";

      if (error.message.includes("auth/invalid-email")) {
        mensagemErro += "Email inválido gerado para o responsável.";
      } else if (error.message.includes("auth/email-already-in-use")) {
        mensagemErro += "Já existe um usuário com este CPF (email).";
      } else {
        mensagemErro += error.message;
      }

      alert(mensagemErro);
    }
  };

  const excluirAluno = async (id) => {
    try {
      await deleteDoc(doc(db, "alunos", id));
      setAlunos((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
    }
  };

  const editarAluno = (aluno) => {
    setNovoAluno({ ...aluno });
    setModoEdicao(true);
    setAlunoEditandoId(aluno.id);
    setMostrarPopup(true);
  };

  const handleImagemChange = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      const url = URL.createObjectURL(arquivo);
      setNovoAluno({ ...novoAluno, foto: url });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoAluno((prev) => ({
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
          <h2>Gerenciamento de Alunos</h2>

          <button
            className="botao"
            onClick={() => {
              setMostrarPopup(true);
              setModoEdicao(false);
              setNovoAluno({
                nome: "",
                cpf: "",
                responsavel: "",
                cpfResponsavel: "",
                dataDeNascimento: "",
                foto: "",
              });
            }}
          >
            Cadastrar Aluno
          </button>

          <div className="cardsContainer">
            {alunos.map((aluno) => (
              <div key={aluno.id} className="cardAluno">
                <div className="conteudoCardBranco">
                  {aluno.foto && (
                    <img className="cardfoto" src={aluno.foto} alt="Foto" />
                  )}
                  <p>Aluno: {aluno.nome}</p>
                  <p>CPF: {aluno.cpf}</p>
                  <p>Responsável: {aluno.responsavel}</p>
                  <p>CPF Responsável: {aluno.cpfResponsavel}</p>
                  <p>Data de Nascimento: {aluno.dataDeNascimento}</p>
                  <button className="botaoPopup" onClick={() => editarAluno(aluno)}>
                    Editar
                  </button>
                  <button
                    className="botaoPopupCancelar"
                    onClick={() => excluirAluno(aluno.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {mostrarPopup && (
            <div className="popupOverlay">
              <div className="popup">
                <h3>{modoEdicao ? "Editar Aluno" : "Novo Aluno"}</h3>

                <input
                  type="text"
                  name="nome"
                  placeholder="Nome completo do aluno"
                  value={novoAluno.nome}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="cpf"
                  placeholder="CPF do aluno"
                  value={novoAluno.cpf}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="responsavel"
                  placeholder="Nome do responsável"
                  value={novoAluno.responsavel}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="cpfResponsavel"
                  placeholder="CPF do responsável (será usado para login)"
                  value={novoAluno.cpfResponsavel}
                  onChange={handleChange}
                />
                <input
                  type="date"
                  name="dataDeNascimento"
                  value={novoAluno.dataDeNascimento}
                  onChange={handleChange}
                />
                <input type="file" accept="image/*" onChange={handleImagemChange} />

                {novoAluno.foto && (
                  <img className="cardfoto" src={novoAluno.foto} alt="Foto do Aluno" />
                )}

                <div className="botoesPopup">
                  <button
                    className="botaoPopupCancelar"
                    onClick={() => {
                      setMostrarPopup(false);
                      setModoEdicao(false);
                      setAlunoEditandoId(null);
                    }}
                  >
                    Cancelar
                  </button>

                  <button className="botaoPopup" onClick={adicionarOuEditarAluno}>
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

export default GerenciamentoAlunos;
