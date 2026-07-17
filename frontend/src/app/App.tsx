import { CheckCircle2, Filter, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { AuthPanel } from '../features/auth/AuthPanel';
import { TaskList } from '../features/tasks/TaskList';
import { apiClient } from '../services/apiClient';

export function App() {
  const [apiStatus, setApiStatus] = useState('verificando...');

  useEffect(() => {
    apiClient
      .health()
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('indisponível'));
  }, []);

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Teste prático Python Back-end</p>
          <h1>Task Management System</h1>
          <p className="subtitle">
            Monorepo pronto para evoluir CRUD, categorias, compartilhamento, filtros,
            Cognito, BrasilAPI e automações AWS.
          </p>
        </div>
        <AuthPanel apiStatus={apiStatus} />
      </section>

      <section className="feature-grid" aria-label="Principais capacidades">
        <article>
          <CheckCircle2 aria-hidden="true" />
          <strong>Tarefas</strong>
          <span>Criação, conclusão, reabertura, prioridade e prazo.</span>
        </article>
        <article>
          <Filter aria-hidden="true" />
          <strong>Filtros</strong>
          <span>Status, categoria, busca, ordenação e paginação.</span>
        </article>
        <article>
          <Share2 aria-hidden="true" />
          <strong>Compartilhamento</strong>
          <span>Convites com permissões viewer/editor e notificação assíncrona.</span>
        </article>
      </section>

      <TaskList />
    </main>
  );
}
