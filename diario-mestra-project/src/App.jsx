import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './1Login-Page/ProtectRoute';

import LoginBox from './1Login-Page/LoginPage';
import CadastroPage from './2Cadastro-Page/CadastroPage';

import DashboardCoord from './3Coordenacao/CoordTelaInicial'; 
import CoordGerenciamento from './3Coordenacao/CoordGerenciamento';
import GerenciamentoMaterias from './3Coordenacao/GerenciamentoMaterias';
import GerenciamentoTurmas from './3Coordenacao/GerenciamentoTurmas';
import GerenciamentoProfessores from './3Coordenacao/GerenciamentoProfessores';
import GerenciamentoAlunos from './3Coordenacao/GereciamentoAlunos';

import Relatorio from './3Coordenacao/Relatorio';
import Mensagem from './3Coordenacao/Mensagem';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<LoginBox />} />
        <Route path="/cadastrocoord" element={<CadastroPage />} />
        
        {/* Rotas protegidas para coordenação */}
        <Route path="/coord" element={
          <ProtectedRoute allowedProfiles={['coordenacao']}>
            <DashboardCoord />
          </ProtectedRoute>
        } />
        
        <Route path="/gerenciamento" element={
          <ProtectedRoute allowedProfiles={['coordenacao']}>
            <CoordGerenciamento />
          </ProtectedRoute>
        } />
        
        <Route path="/gerenciar-materias" element={
          <ProtectedRoute allowedProfiles={['coordenacao']}>
            <GerenciamentoMaterias />
          </ProtectedRoute>
        } />
        
        <Route path="/gerenciar-turmas" element={
          <ProtectedRoute allowedProfiles={['coordenacao']}>
            <GerenciamentoTurmas />
          </ProtectedRoute>
        } />
        
        <Route path="/gerenciar-alunos" element={
          <ProtectedRoute allowedProfiles={['coordenacao']}>
            <GerenciamentoAlunos />
          </ProtectedRoute>
        } />
        
        <Route path="/gerenciar-professores" element={
          <ProtectedRoute allowedProfiles={['coordenacao']}>
            <GerenciamentoProfessores />
          </ProtectedRoute>
        } />
        
        <Route path="/relatorio" element={
          <ProtectedRoute allowedProfiles={['coordenacao']}>
            <Relatorio />
          </ProtectedRoute>
        } />
        
        <Route path="/mensagem" element={
          <ProtectedRoute allowedProfiles={['coordenacao']}>
            <Mensagem />
          </ProtectedRoute>
        } />

        {/* Redirecionamento para páginas não encontradas */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;