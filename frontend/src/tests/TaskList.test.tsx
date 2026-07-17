import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TaskList } from '../features/tasks/TaskList';
import { apiClient } from '../services/apiClient';

vi.mock('../services/apiClient', () => ({
  apiClient: {
    categories: vi.fn(),
    tasks: vi.fn(),
    shares: vi.fn(),
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    completeTask: vi.fn(),
    reopenTask: vi.fn(),
    deleteTask: vi.fn(),
    createShare: vi.fn(),
    decideShare: vi.fn(),
    deleteShare: vi.fn(),
  },
}));

const ownerTask = {
  id: 'owner-task',
  category: 'category-1',
  category_name: 'Work',
  title: 'Owner task',
  description: '',
  status: 'pending',
  priority: 'high',
  due_at: null,
  version: 1,
  created_at: '2026-07-17T12:00:00Z',
  updated_at: '2026-07-17T12:00:00Z',
  access_role: 'owner' as const,
};

const editorTask = {
  ...ownerTask,
  id: 'editor-task',
  title: 'Editor task',
  category: 'foreign-category',
  category_name: 'Owner category',
  access_role: 'editor' as const,
};

const viewerTask = {
  ...ownerTask,
  id: 'viewer-task',
  title: 'Viewer task',
  category: null,
  category_name: null,
  access_role: 'viewer' as const,
};

const taskResponse = {
  count: 3,
  next: null,
  previous: null,
  items: [ownerTask, editorTask, viewerTask],
};

const shareResponse = {
  count: 2,
  next: null,
  previous: null,
  items: [
    {
      id: 'received-share',
      task: 'owner-task',
      task_title: 'Received task',
      recipient: 'current-user',
      recipient_display_email: 'current@example.com',
      shared_by: 'another-user',
      permission: 'viewer' as const,
      status: 'pending' as const,
      created_at: '2026-07-17T12:00:00Z',
      responded_at: null,
      can_respond: true,
      can_cancel: false,
    },
    {
      id: 'sent-share',
      task: 'owner-task',
      task_title: 'Owner task',
      recipient: 'recipient-user',
      recipient_display_email: 'recipient@example.com',
      shared_by: 'current-user',
      permission: 'editor' as const,
      status: 'accepted' as const,
      created_at: '2026-07-17T12:00:00Z',
      responded_at: '2026-07-17T12:05:00Z',
      can_respond: false,
      can_cancel: true,
    },
  ],
};

describe('TaskList permission-aware workspace', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiClient.categories).mockResolvedValue({
      count: 1,
      next: null,
      previous: null,
      items: [{ id: 'category-1', name: 'Work', color: '#2563EB' }],
    });
    vi.mocked(apiClient.tasks).mockResolvedValue(taskResponse);
    vi.mocked(apiClient.shares).mockResolvedValue(shareResponse);
    vi.mocked(apiClient.decideShare).mockResolvedValue(shareResponse.items[0]);
    vi.mocked(apiClient.deleteShare).mockResolvedValue(undefined);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('shows actions according to role and only shares owned tasks', async () => {
    render(<TaskList />);

    await screen.findAllByText('Owner task');
    const shareSelect = screen.getByRole('combobox', { name: 'Tarefa' });
    expect(within(shareSelect).getByRole('option', { name: 'Owner task' })).toBeInTheDocument();
    expect(within(shareSelect).queryByRole('option', { name: 'Editor task' })).not.toBeInTheDocument();
    expect(within(shareSelect).queryByRole('option', { name: 'Viewer task' })).not.toBeInTheDocument();

    expect(screen.getByLabelText('Excluir tarefa Owner task')).toBeInTheDocument();
    expect(screen.queryByLabelText('Excluir tarefa Editor task')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Editar tarefa Viewer task')).not.toBeInTheDocument();
    expect(screen.getByText('Somente leitura')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Editar tarefa Editor task'));
    expect(screen.getByRole('combobox', { name: /Categoria/ })).toBeDisabled();
    expect(screen.getByText('Somente o proprietario altera a categoria.')).toBeInTheDocument();
  });

  it('shows invitation decisions only to recipients and cancellation to owners', async () => {
    render(<TaskList />);
    await screen.findByText('Received task');

    fireEvent.click(screen.getByRole('button', { name: 'Aceitar' }));
    await waitFor(() => expect(apiClient.decideShare).toHaveBeenCalledWith('received-share', 'accepted'));

    expect(screen.queryByRole('button', { name: 'Recusar' })).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Remover compartilhamento Owner task'));
    await waitFor(() => expect(apiClient.deleteShare).toHaveBeenCalledWith('sent-share'));
  });
});
