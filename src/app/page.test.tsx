import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Home from './page';
import { getCharacters } from '@/lib/api';
import { mockCharacterResponse } from '@/test/fixtures';

vi.mock('@/lib/api', () => ({
  getCharacters: vi.fn(),
}));

const getCharactersMock = vi.mocked(getCharacters);

async function renderHome(searchParams: Record<string, string | string[] | undefined> = {}) {
  // Home is an async Server Component: resolve it first, then render the returned JSX.
  render(await Home({ searchParams: Promise.resolve(searchParams) }));
}

beforeEach(() => {
  getCharactersMock.mockReset();
  getCharactersMock.mockResolvedValue(mockCharacterResponse);
});

describe('Home page', () => {
  it('loads the first page when no page param is given', async () => {
    await renderHome();

    expect(getCharactersMock).toHaveBeenCalledWith(1);
    expect(screen.getByText('Page 1 of 42')).toBeInTheDocument();
  });

  it('loads the page given in the search params', async () => {
    await renderHome({ page: '3' });

    expect(getCharactersMock).toHaveBeenCalledWith(3);
    expect(screen.getByText('Page 3 of 42')).toBeInTheDocument();
  });

  it('falls back to the first page when the page param is repeated', async () => {
    await renderHome({ page: ['2', '3'] });

    expect(getCharactersMock).toHaveBeenCalledWith(1);
  });

  it('renders the title and one card per character', async () => {
    await renderHome();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Rick and Morty Characters' }),
    ).toBeInTheDocument();
    for (const character of mockCharacterResponse.results) {
      expect(screen.getByRole('heading', { level: 2, name: character.name })).toBeInTheDocument();
    }
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(
      mockCharacterResponse.results.length,
    );
  });

  it('propagates API errors so the error boundary can handle them', async () => {
    getCharactersMock.mockRejectedValueOnce(new Error('Failed to fetch characters'));

    await expect(renderHome()).rejects.toThrow('Failed to fetch characters');
  });
});
