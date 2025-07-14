import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, set } from 'firebase/database';
import { auth, storage, database } from "../firebase";

function CadastroBox() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    confirmar: '',
    foto: null,
  });

  const [previewFoto, setPreviewFoto] = useState(null);

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === 'foto') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, foto: file }));
      setPreviewFoto(URL.createObjectURL(file));
    } else if (name === 'cpf') {
      // Remove tudo que não é número (opcional, para garantir só números)
      const onlyNums = value.replace(/\D/g, '');
      setFormData((prev) => ({ ...prev, cpf: onlyNums }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleCadastro(e) {
    e.preventDefault();

    // Validação de senha
    if (formData.senha.length < 5) {
      alert('A senha precisa ter no mínimo 5 caracteres');
      return;
    }

    if (formData.senha !== formData.confirmar) {
      alert('As senhas devem ser iguais');
      return;
    }

    // Validação de CPF
    if (!/^\d{11}$/.test(formData.cpf)) {
      alert('O CPF deve conter exatamente 11 números.');
      return;
    }

    try {
      // Criação no Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.senha
      );

      let fotoURL = null;

      // Upload da imagem de perfil (se existir)
      if (formData.foto) {
        const refImagem = storageRef(storage, `fotosPerfis/${userCredential.user.uid}`);
        await uploadBytes(refImagem, formData.foto);
        fotoURL = await getDownloadURL(refImagem);
      }

      // Atualiza o nome e foto no Firebase Auth
      await updateProfile(userCredential.user, {
        displayName: formData.nome,
        photoURL: fotoURL,
      });

      // Salva no Realtime Database
      await set(dbRef(database, 'usuarios/' + userCredential.user.uid), {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        perfil: 'coordenacao',
        fotoURL: fotoURL || null
      });

      alert('Usuário cadastrado com sucesso!');
      console.log('Usuário:', userCredential.user);

      // Reset do formulário
      setFormData({
        nome: '',
        email: '',
        senha: '',
        cpf: '',
        confirmar: '',
        foto: null,
      });
      setPreviewFoto(null);

    } catch (error) {
      console.error('Erro no cadastro:', error.code, error.message);
      alert('Erro: ' + error.message);
    }
  }

  return (
    <form className="login-box" onSubmit={handleCadastro}>
      <label>
        Nome completo
        <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
      </label>

      <label>
        CPF (somente números)
        <input
          type="text"
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          maxLength={11}
          required
        />
      </label>

      <label>
        E-mail
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </label>

      <label>
        Senha
        <input type="password" name="senha" value={formData.senha} onChange={handleChange} required />
      </label>

      <label>
        Confirmar senha
        <input type="password" name="confirmar" value={formData.confirmar} onChange={handleChange} required />
      </label>

      <label>
        Foto de perfil
        <input type="file" name="foto" accept="image/*" onChange={handleChange} />
      </label>

      {previewFoto && (
        <img
          src={previewFoto}
          alt="Pré-visualização"
          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' }}
        />
      )}

      <p style={{ fontSize: '0.9rem', color: 'gray', marginTop: '10px' }}>
        Apenas membros da <strong>coordenação</strong> podem se cadastrar por aqui.
      </p>

      <button type="submit">Cadastrar</button>
    </form>
  );
}

export default CadastroBox;
