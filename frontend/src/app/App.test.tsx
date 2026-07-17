import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from './App';

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'ok', results: [] }),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the application shell', async () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /Task Management System/i })).toBeInTheDocument();
    expect(await screen.findByText('online')).toBeInTheDocument();
  });
});
