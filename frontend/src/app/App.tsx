import { useEffect, useState } from 'react';

import { AuthPanel } from '../features/auth/AuthPanel';
import { TaskList } from '../features/tasks/TaskList';
import { apiClient, User } from '../services/apiClient';

export function App() {
  const [apiStatus, setApiStatus] = useState('verificando...');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(() => Boolean(localStorage.getItem('access_token')));

  useEffect(() => {
    apiClient
      .readiness()
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('indisponivel'));
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      return;
    }

    apiClient
      .me()
      .then(setUser)
      .catch(() => localStorage.removeItem('access_token'))
      .finally(() => setAuthLoading(false));
  }, []);

  function handleLogout() {
    setUser(null);
  }

  return (
    <main className="shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Task Management System</p>
          <h1>Gerenciamento colaborativo de tarefas</h1>
        </div>
        {user ? (
          <AuthPanel
            apiStatus={apiStatus}
            onAuthenticated={setUser}
            onLogout={handleLogout}
            user={user}
          />
        ) : null}
      </header>

      {authLoading ? (
        <p className="status-message">Validando sessao...</p>
      ) : user ? (
        <TaskList />
      ) : (
        <section className="auth-layout">
          <div className="auth-intro">
            <p className="eyebrow">Workspace colaborativo</p>
            <h2>Suas tarefas, com contexto e controle.</h2>
            <p className="muted">
              Organize prioridades, acompanhe prazos e compartilhe cada tarefa com a permissao certa.
            </p>
          </div>
          <AuthPanel
            apiStatus={apiStatus}
            onAuthenticated={setUser}
            onLogout={handleLogout}
            user={null}
          />
        </section>
      )}
    </main>
  );
}
