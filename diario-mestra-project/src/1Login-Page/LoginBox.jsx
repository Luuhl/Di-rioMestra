// LoginBox.jsx — versão 100 % funcional
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref as dbRef, get } from 'firebase/database';

import { auth, database } from '../firebase';  // ↔ ajuste “../” se preciso

function LoginBox() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      // 1. Autentica no Firebase Auth
      const { user } = await signInWithEmailAndPassword(auth, email, senha);

      // 2. Busca o perfil no Realtime Database
      const snap = await get(dbRef(database, `usuarios/${user.uid}`));
      if (!snap.exists()) throw new Error('Usuário não cadastrado no sistema.');

      const { perfil } = snap.val();        // 'coordenacao' | 'professor' | 'responsavel'

      // 3. Redireciona pela tabela de rotas
      const rotas = {
        coordenacao: '/coord',
        professor:   '/professor',
        responsavel: '/responsavel',
      };
      navigate(rotas[perfil] ?? '/');
    } catch (error) {
      console.error('Erro de login:', error);
      const msg = {
        'auth/invalid-email':   'E‑mail inválido.',
        'auth/user-not-found':  'Usuário não encontrado.',
        'auth/wrong-password':  'Senha incorreta.',
        'auth/too-many-requests':'Muitas tentativas. Tente novamente mais tarde.',
      }[error.code] || error.message;
      setErro(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login-box" onSubmit={handleLogin}>
      <label>
        E‑mail
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
      </label>

      <label>
        Senha
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          disabled={loading}
          required
        />
      </label>

      {erro && <p className="erro">{erro}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Entrando…' : 'Entrar'}
      </button>

      <div className="links-ajuda">
        <Link to="/esquecisenha">Esqueci minha senha</Link><br />
        <Link to="/cadastrocoord">Primeiro acesso à coordenação</Link>
      </div>
    </form>
  );
}

export default LoginBox;
