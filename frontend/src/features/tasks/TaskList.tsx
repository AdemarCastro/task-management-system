import { useEffect, useMemo, useState } from 'react';

import { apiClient, Task } from '../../services/apiClient';

export function TaskList() {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    apiClient
      .tasks({ status, search })
      .then(setTasks)
      .catch(() => setTasks([]));
  }, [status, search]);

  const rows = useMemo(
    () =>
      tasks.length
        ? tasks
        : [
            {
              id: 'demo',
              title: 'Configurar Cognito, migrations e primeiro CRUD',
              status: 'pending',
              priority: 'high',
              due_at: null,
            },
          ],
    [tasks],
  );

  return (
    <section className="task-panel">
      <div className="toolbar">
        <div>
          <h2>Tarefas</h2>
          <p className="muted">Lista preparada para consumir `/api/v1/tasks/`.</p>
        </div>
        <div>
          <input
            aria-label="Buscar tarefa"
            placeholder="Buscar"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select aria-label="Status" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Todos</option>
            <option value="pending">Pendentes</option>
            <option value="completed">Concluídas</option>
          </select>
        </div>
      </div>

      <table className="task-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Status</th>
            <th>Prioridade</th>
            <th>Prazo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>
                <span className="pill">{task.status}</span>
              </td>
              <td>{task.priority}</td>
              <td>{task.due_at ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
