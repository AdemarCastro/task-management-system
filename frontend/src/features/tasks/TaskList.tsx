import { Check, Edit2, RotateCcw, Send, Trash2 } from 'lucide-react';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { apiClient, Category, Task, TaskShare } from '../../services/apiClient';

type TaskFormState = {
  title: string;
  description: string;
  category: string;
  priority: string;
  due_at: string;
};

const emptyTaskForm: TaskFormState = {
  title: '',
  description: '',
  category: '',
  priority: 'medium',
  due_at: '',
};

function toInputDate(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function toApiDate(value: string) {
  return value ? new Date(value).toISOString() : null;
}

function formatDate(value: string | null) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function TaskList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [shares, setShares] = useState<TaskShare[]>([]);
  const [taskForm, setTaskForm] = useState<TaskFormState>(emptyTaskForm);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState('#2563EB');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');
  const [dueAfter, setDueAfter] = useState('');
  const [dueBefore, setDueBefore] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [shareTaskId, setShareTaskId] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [sharePermission, setSharePermission] = useState('viewer');
  const [message, setMessage] = useState('');

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );

  const loadCategories = useCallback(async () => {
    const response = await apiClient.categories();
    setCategories(response.items);
  }, []);

  const loadTasks = useCallback(async () => {
    const response = await apiClient.tasks({
      status,
      priority,
      search,
      category: categoryFilter,
      due_after: dueAfter ? toApiDate(dueAfter) ?? undefined : undefined,
      due_before: dueBefore ? toApiDate(dueBefore) ?? undefined : undefined,
      ordering,
      page,
    });
    setTasks(response.items);
    setCount(response.count);
  }, [categoryFilter, dueAfter, dueBefore, ordering, page, priority, search, status]);

  const loadShares = useCallback(async () => {
    const response = await apiClient.shares();
    setShares(response.items);
  }, []);

  useEffect(() => {
    Promise.all([apiClient.categories(), apiClient.shares()])
      .then(([categoryResponse, shareResponse]) => {
        setCategories(categoryResponse.items);
        setShares(shareResponse.items);
      })
      .catch((error: Error) => setMessage(error.message));
  }, []);

  useEffect(() => {
    apiClient
      .tasks({
        status,
        priority,
        search,
        category: categoryFilter,
        due_after: dueAfter ? toApiDate(dueAfter) ?? undefined : undefined,
        due_before: dueBefore ? toApiDate(dueBefore) ?? undefined : undefined,
        ordering,
        page,
      })
      .then((response) => {
        setTasks(response.items);
        setCount(response.count);
      })
      .catch((error: Error) => setMessage(error.message));
  }, [categoryFilter, dueAfter, dueBefore, ordering, page, priority, search, status]);

  async function handleCategorySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      if (editingCategoryId) {
        await apiClient.updateCategory(editingCategoryId, { name: categoryName, color: categoryColor });
      } else {
        await apiClient.createCategory({ name: categoryName, color: categoryColor });
      }
      setCategoryName('');
      setCategoryColor('#2563EB');
      setEditingCategoryId(null);
      await loadCategories();
      setMessage(editingCategoryId ? 'Categoria atualizada.' : 'Categoria criada.');
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  async function handleTaskSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      title: taskForm.title,
      description: taskForm.description,
      category: taskForm.category || null,
      priority: taskForm.priority,
      due_at: toApiDate(taskForm.due_at),
    };

    try {
      if (editingTaskId) {
        await apiClient.updateTask(editingTaskId, payload);
        setMessage('Tarefa atualizada.');
      } else {
        await apiClient.createTask(payload);
        setMessage('Tarefa criada.');
      }

      setTaskForm(emptyTaskForm);
      setEditingTaskId(null);
      await loadTasks();
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  async function handleShareSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await apiClient.createShare(shareTaskId, {
        recipient_email: recipientEmail,
        permission: sharePermission,
      });
      setRecipientEmail('');
      setMessage('Convite enviado.');
      await loadShares();
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  function startEditingCategory(category: Category) {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setCategoryColor(category.color);
  }

  function startEditing(task: Task) {
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title,
      description: task.description,
      category: task.category ?? '',
      priority: task.priority,
      due_at: toInputDate(task.due_at),
    });
  }

  async function completeTask(task: Task) {
    try {
      if (task.status === 'completed') {
        await apiClient.reopenTask(task.id);
      } else {
        await apiClient.completeTask(task.id);
      }
      await loadTasks();
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  async function deleteTask(taskId: string) {
    try {
      await apiClient.deleteTask(taskId);
      await loadTasks();
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  async function deleteCategory(categoryId: string) {
    try {
      await apiClient.deleteCategory(categoryId);
      await loadCategories();
      await loadTasks();
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  async function decideShare(shareId: string, decision: 'accepted' | 'rejected') {
    try {
      await apiClient.decideShare(shareId, decision);
      await loadShares();
      await loadTasks();
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  const totalPages = Math.max(1, Math.ceil(count / 20));

  return (
    <section className="workspace">
      <div className="workspace-header">
        <div>
          <h2>Tarefas</h2>
          <p className="muted">{count} registros</p>
        </div>
        {message ? <p className="status-message">{message}</p> : null}
      </div>

      <div className="workspace-grid">
        <form className="panel-form" onSubmit={handleTaskSubmit}>
          <h3>{editingTaskId ? 'Editar tarefa' : 'Nova tarefa'}</h3>
          <label>
            Titulo
            <input
              name="title"
              required
              value={taskForm.title}
              onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })}
            />
          </label>
          <label>
            Descricao
            <textarea
              name="description"
              value={taskForm.description}
              onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })}
            />
          </label>
          <div className="form-row">
            <label>
              Categoria
              <select
                name="category"
                value={taskForm.category}
                onChange={(event) => setTaskForm({ ...taskForm, category: event.target.value })}
              >
                <option value="">Sem categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Prioridade
              <select
                name="priority"
                value={taskForm.priority}
                onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value })}
              >
                <option value="low">Baixa</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </label>
          </div>
          <label>
            Prazo
            <input
              name="due_at"
              type="datetime-local"
              value={taskForm.due_at}
              onChange={(event) => setTaskForm({ ...taskForm, due_at: event.target.value })}
            />
          </label>
          <div className="button-row">
            <button className="primary-button" type="submit">
              {editingTaskId ? 'Atualizar' : 'Criar'}
            </button>
            {editingTaskId ? (
              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  setEditingTaskId(null);
                  setTaskForm(emptyTaskForm);
                }}
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </form>

        <div className="side-stack">
          <form className="panel-form" onSubmit={handleCategorySubmit}>
            <h3>{editingCategoryId ? 'Editar categoria' : 'Categorias'}</h3>
            <div className="form-row compact">
              <input
                aria-label="Nome da categoria"
                name="category_name"
                required
                placeholder="Nome"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
              />
              <input
                aria-label="Cor da categoria"
                name="category_color"
                type="color"
                value={categoryColor}
                onChange={(event) => setCategoryColor(event.target.value)}
              />
              <button className="secondary-button" type="submit">
                {editingCategoryId ? 'Atualizar' : 'Criar'}
              </button>
              {editingCategoryId ? (
                <button
                  className="link-button"
                  type="button"
                  onClick={() => {
                    setEditingCategoryId(null);
                    setCategoryName('');
                    setCategoryColor('#2563EB');
                  }}
                >
                  Cancelar
                </button>
              ) : null}
            </div>
            <div className="tag-list">
              {categories.map((category) => (
                <span key={category.id} className="category-tag">
                  <span style={{ background: category.color }} />
                  {category.name}
                  <button
                    aria-label={`Editar categoria ${category.name}`}
                    type="button"
                    onClick={() => startEditingCategory(category)}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button type="button" onClick={() => deleteCategory(category.id)}>
                    <Trash2 size={14} />
                  </button>
                </span>
              ))}
            </div>
          </form>

          <form className="panel-form" onSubmit={handleShareSubmit}>
            <h3>Compartilhar</h3>
            <label>
              Tarefa
              <select
                name="share_task"
                required
                value={shareTaskId}
                onChange={(event) => setShareTaskId(event.target.value)}
              >
                <option value="">Selecione</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-row">
              <label>
                Email
                <input
                  required
                  name="recipient_email"
                  type="email"
                  value={recipientEmail}
                  onChange={(event) => setRecipientEmail(event.target.value)}
                />
              </label>
              <label>
                Permissao
                <select
                  name="permission"
                  value={sharePermission}
                  onChange={(event) => setSharePermission(event.target.value)}
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>
              </label>
            </div>
            <button className="primary-button" type="submit">
              <Send size={16} />
              Enviar
            </button>
          </form>
        </div>
      </div>

      <div className="filter-bar">
        <input
          aria-label="Buscar tarefa"
          placeholder="Buscar"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <select
          aria-label="Status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
        >
          <option value="">Todos</option>
          <option value="pending">Pendentes</option>
          <option value="completed">Concluidas</option>
        </select>
        <select
          aria-label="Prioridade"
          value={priority}
          onChange={(event) => {
            setPriority(event.target.value);
            setPage(1);
          }}
        >
          <option value="">Todas as prioridades</option>
          <option value="high">Alta</option>
          <option value="medium">Media</option>
          <option value="low">Baixa</option>
        </select>
        <select
          aria-label="Filtrar categoria"
          value={categoryFilter}
          onChange={(event) => {
            setCategoryFilter(event.target.value);
            setPage(1);
          }}
        >
          <option value="">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Ordenacao"
          value={ordering}
          onChange={(event) => setOrdering(event.target.value)}
        >
          <option value="-created_at">Mais recentes</option>
          <option value="due_at">Prazo</option>
          <option value="priority">Prioridade</option>
        </select>
        <label className="filter-date">
          Prazo a partir de
          <input
            aria-label="Prazo a partir de"
            type="datetime-local"
            value={dueAfter}
            onChange={(event) => {
              setDueAfter(event.target.value);
              setPage(1);
            }}
          />
        </label>
        <label className="filter-date">
          Prazo ate
          <input
            aria-label="Prazo ate"
            type="datetime-local"
            value={dueBefore}
            onChange={(event) => {
              setDueBefore(event.target.value);
              setPage(1);
            }}
          />
        </label>
      </div>

      <div className="task-panel">
        <table className="task-table">
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Prazo</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <strong>{task.title}</strong>
                  {task.holiday_warning ? <small>{task.holiday_warning}</small> : null}
                </td>
                <td>{task.category ? categoryById.get(task.category)?.name ?? '-' : '-'}</td>
                <td>
                  <span className="pill">{task.status}</span>
                </td>
                <td>{task.priority}</td>
                <td>{formatDate(task.due_at)}</td>
                <td>
                  <div className="table-actions">
                    {task.access_role === 'owner' || task.access_role === 'editor' ? (
                      <>
                        <button
                          aria-label={`Editar tarefa ${task.title}`}
                          type="button"
                          onClick={() => startEditing(task)}
                        >
                          Editar
                        </button>
                        <button
                          aria-label={`${task.status === 'completed' ? 'Reabrir' : 'Concluir'} tarefa ${task.title}`}
                          type="button"
                          onClick={() => completeTask(task)}
                        >
                          {task.status === 'completed' ? <RotateCcw size={16} /> : <Check size={16} />}
                        </button>
                      </>
                    ) : null}
                    {task.access_role === 'owner' ? (
                      <button
                        aria-label={`Excluir tarefa ${task.title}`}
                        type="button"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : null}
                    {task.access_role === 'viewer' ? <span className="muted">Somente leitura</span> : null}
                  </div>
                </td>
              </tr>
            ))}
            {!tasks.length ? (
              <tr>
                <td colSpan={6}>Nenhuma tarefa encontrada.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button disabled={page <= 1} type="button" onClick={() => setPage((value) => value - 1)}>
          Anterior
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          type="button"
          onClick={() => setPage((value) => value + 1)}
        >
          Proxima
        </button>
      </div>

      <div className="share-list">
        <h3>Convites</h3>
        {shares.map((share) => (
          <article key={share.id}>
            <span>{share.task}</span>
            <strong>{share.permission}</strong>
            <em>{share.status}</em>
            {share.status === 'pending' ? (
              <div>
                <button type="button" onClick={() => decideShare(share.id, 'accepted')}>
                  Aceitar
                </button>
                <button type="button" onClick={() => decideShare(share.id, 'rejected')}>
                  Recusar
                </button>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
