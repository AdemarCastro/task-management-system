import { useEffect, useState } from 'react';

import { AuthPanel } from '../features/auth/AuthPanel';
import { TaskList } from '../features/tasks/TaskList';
import { apiClient } from '../services/apiClient';

export function App() {
  const [apiStatus, setApiStatus] = useState('verificando...');

  useEffect(() => {
    apiClient
      .readiness()
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('indisponivel'));
  }, []);

  return (
    <main className="shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Task Management System</p>
          <h1>Gerenciamento colaborativo de tarefas</h1>
        </div>
        <AuthPanel apiStatus={apiStatus} />
      </header>

      <TaskList />
    </main>
  );
}
