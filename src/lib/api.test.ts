import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCharacter, getCharacters, getEpisodes } from './api';
import { buildCharacter, mockCharacterResponse, mockEpisodes } from '@/test/fixtures';

const API_BASE_URL = 'https://rickandmortyapi.com/api';
const fetchMock = vi.fn();

function mockFetchResponse(body: unknown, ok = true) {
  fetchMock.mockResolvedValueOnce({ ok, json: () => Promise.resolve(body) });
}

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

describe('getCharacters', () => {
  it('requests the first page by default', async () => {
    mockFetchResponse(mockCharacterResponse);

    await getCharacters();

    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/character?page=1`);
  });

  it('requests the given page and returns the parsed response', async () => {
    mockFetchResponse(mockCharacterResponse);

    const data = await getCharacters(5);

    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/character?page=5`);
    expect(data).toEqual(mockCharacterResponse);
  });

  it('throws when the response is not ok', async () => {
    mockFetchResponse({}, false);

    await expect(getCharacters(999)).rejects.toThrow('Failed to fetch characters');
  });
});

describe('getCharacter', () => {
  it('requests a single character by id and returns it', async () => {
    const character = buildCharacter({ id: 42 });
    mockFetchResponse(character);

    const data = await getCharacter('42');

    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/character/42`);
    expect(data).toEqual(character);
  });

  it('throws when the response is not ok', async () => {
    mockFetchResponse({}, false);

    await expect(getCharacter('0')).rejects.toThrow('Failed to fetch character details');
  });
});

describe('getEpisodes', () => {
  it('returns an empty array without calling the API when no ids are given', async () => {
    const data = await getEpisodes([]);

    expect(data).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('joins the ids with commas in a single request', async () => {
    mockFetchResponse(mockEpisodes);

    const data = await getEpisodes(['1', '2']);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/episode/1,2`);
    expect(data).toEqual(mockEpisodes);
  });

  it('wraps a single episode object in an array', async () => {
    // With a single id the API returns an object instead of an array.
    mockFetchResponse(mockEpisodes[0]);

    const data = await getEpisodes(['1']);

    expect(Array.isArray(data)).toBe(true);
    expect(data).toEqual([mockEpisodes[0]]);
  });

  it('throws when the response is not ok', async () => {
    mockFetchResponse({}, false);

    await expect(getEpisodes(['1'])).rejects.toThrow('Failed to fetch episodes');
  });
});
