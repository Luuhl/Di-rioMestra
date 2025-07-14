import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { getDatabase, ref, get } from 'firebase/database';

function ProtectedRoute({ children, allowedProfiles }) {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let cancelado = false;

    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      if (allowedProfiles) {
        try {
          const db = getDatabase();
          const userRef = ref(db, `usuarios/${user.uid}`);
          const snapshot = await get(userRef);

          if (!snapshot.exists() || !allowedProfiles.includes(snapshot.val().perfil)) {
            navigate('/acesso-negado');
            return;
          }

        } catch (err) {
          console.error("Erro ao verificar perfil:", err);
          navigate('/erro');
          return;
        }
      }

      if (!cancelado) setCarregando(false);
    });

    return () => {
      cancelado = true;
      unsubscribe();
    };
  }, [navigate, allowedProfiles]);

  if (carregando) return <p>Verificando acesso...</p>;
  return children;
}

export default ProtectedRoute;
