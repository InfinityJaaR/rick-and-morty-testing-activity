import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CharacterCard from './CharacterCard';
import { buildCharacter } from '@/test/fixtures';
import type { Character } from '@/types/rickandmorty';

describe('CharacterCard', () => {
  it('renders the character name, status, species and last known location', () => {
    render(<CharacterCard character={buildCharacter()} />);

    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByText('Alive - Human')).toBeInTheDocument();
    expect(screen.getByText('Last known location:')).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
  });

  it('renders the character image with its name as alt text', () => {
    const character = buildCharacter();
    render(<CharacterCard character={character} />);

    const image = screen.getByRole('img', { name: 'Rick Sanchez' });
    expect(image).toHaveAttribute('src', character.image);
  });

  it('links to the character detail page', () => {
    render(<CharacterCard character={buildCharacter({ id: 7 })} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/character/7');
  });

  it.each([
    ['Alive', 'bg-green-500'],
    ['Dead', 'bg-red-500'],
    ['unknown', 'bg-gray-500'],
  ] as const)('shows a %s status indicator with class %s', (status, expectedClass) => {
    render(<CharacterCard character={buildCharacter({ status })} />);

    const indicator = screen.getByText(`${status} - Human`).previousElementSibling;
    expect(indicator).toHaveClass(expectedClass);
  });

  it('falls back to a gray indicator for an unexpected status', () => {
    const character = buildCharacter({ status: 'Missing' as Character['status'] });
    render(<CharacterCard character={character} />);

    const indicator = screen.getByText('Missing - Human').previousElementSibling;
    expect(indicator).toHaveClass('bg-gray-500');
  });
});
