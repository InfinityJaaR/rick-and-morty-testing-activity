import type { Character, CharacterResponse, Episode } from '@/types/rickandmorty';

export function buildCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
    location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: [
      'https://rickandmortyapi.com/api/episode/1',
      'https://rickandmortyapi.com/api/episode/2',
    ],
    url: 'https://rickandmortyapi.com/api/character/1',
    created: '2017-11-04T18:48:46.250Z',
    ...overrides,
  };
}

export function buildEpisode(overrides: Partial<Episode> = {}): Episode {
  return {
    id: 1,
    name: 'Pilot',
    air_date: 'December 2, 2013',
    episode: 'S01E01',
    characters: ['https://rickandmortyapi.com/api/character/1'],
    url: 'https://rickandmortyapi.com/api/episode/1',
    created: '2017-11-10T12:56:33.798Z',
    ...overrides,
  };
}

export const mockEpisodes: Episode[] = [
  buildEpisode(),
  buildEpisode({
    id: 2,
    name: 'Lawnmower Dog',
    air_date: 'December 9, 2013',
    episode: 'S01E02',
    url: 'https://rickandmortyapi.com/api/episode/2',
  }),
];

export const mockCharacterResponse: CharacterResponse = {
  info: {
    count: 826,
    pages: 42,
    next: 'https://rickandmortyapi.com/api/character?page=2',
    prev: null,
  },
  results: [
    buildCharacter(),
    buildCharacter({
      id: 2,
      name: 'Morty Smith',
      location: { name: 'Earth (Replacement Dimension)', url: '' },
    }),
    buildCharacter({ id: 3, name: 'Birdperson', status: 'Dead', species: 'Bird-Person' }),
  ],
};
