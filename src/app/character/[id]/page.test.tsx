import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CharacterPage from './page';
import { getCharacter, getEpisodes } from '@/lib/api';
import { buildCharacter, mockEpisodes } from '@/test/fixtures';
import type { Character } from '@/types/rickandmorty';

vi.mock('@/lib/api', () => ({
  getCharacter: vi.fn(),
  getEpisodes: vi.fn(),
}));

const getCharacterMock = vi.mocked(getCharacter);
const getEpisodesMock = vi.mocked(getEpisodes);

async function renderCharacterPage(character: Character = buildCharacter(), id = '1') {
  getCharacterMock.mockResolvedValue(character);
  // CharacterPage is an async Server Component: resolve it first, then render the returned JSX.
  render(await CharacterPage({ params: Promise.resolve({ id }) }));
}

beforeEach(() => {
  getCharacterMock.mockReset();
  getEpisodesMock.mockReset();
  getEpisodesMock.mockResolvedValue(mockEpisodes);
});

describe('Character detail page', () => {
  it('fetches the character using the id from the route params', async () => {
    await renderCharacterPage(buildCharacter({ id: 42 }), '42');

    expect(getCharacterMock).toHaveBeenCalledWith('42');
  });

  it('extracts the episode ids from the episode URLs', async () => {
    const character = buildCharacter({
      episode: [
        'https://rickandmortyapi.com/api/episode/1',
        'https://rickandmortyapi.com/api/episode/10',
        'https://rickandmortyapi.com/api/episode/51',
      ],
    });

    await renderCharacterPage(character);

    expect(getEpisodesMock).toHaveBeenCalledWith(['1', '10', '51']);
  });

  it('renders the character details', async () => {
    await renderCharacterPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByText('Alive - Human')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
  });

  it('formats the creation date in long US format', async () => {
    await renderCharacterPage(buildCharacter({ created: '2017-11-04T18:48:46.250Z' }));

    expect(screen.getByText('November 4, 2017')).toBeInTheDocument();
  });

  it('shows "Unknown" when the character has no type', async () => {
    await renderCharacterPage(buildCharacter({ type: '' }));

    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('shows the character type when it is present', async () => {
    await renderCharacterPage(buildCharacter({ type: 'Parasite' }));

    expect(screen.getByText('Parasite')).toBeInTheDocument();
    expect(screen.queryByText('Unknown')).not.toBeInTheDocument();
  });

  it.each([
    ['Alive', 'bg-green-500'],
    ['Dead', 'bg-red-500'],
    ['unknown', 'bg-gray-500'],
  ] as const)('shows a %s status indicator with class %s', async (status, expectedClass) => {
    await renderCharacterPage(buildCharacter({ status }));

    const indicator = screen.getByText(`${status} - Human`).previousElementSibling;
    expect(indicator).toHaveClass(expectedClass);
  });

  it('lists the episodes with their code and a descriptive tooltip', async () => {
    await renderCharacterPage();

    expect(screen.getByRole('heading', { name: 'Episodes (2)' })).toBeInTheDocument();
    expect(screen.getByText('S01E01')).toHaveAttribute('title', 'Pilot - December 2, 2013');
    expect(screen.getByText('S01E02')).toHaveAttribute('title', 'Lawnmower Dog - December 9, 2013');
  });

  it('renders a link back to the characters list', async () => {
    await renderCharacterPage();

    expect(screen.getByRole('link', { name: /back to characters/i })).toHaveAttribute('href', '/');
  });
});
