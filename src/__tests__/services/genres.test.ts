import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getMovieGenres,
  getTVGenres,
  getHomeGenres,
  getGenreNameById,
  getGenreNamesByIds,
  mapGenreIdsToObjects,
  FALLBACK_MOVIE_GENRES,
  FALLBACK_TV_GENRES,
} from '@/lib/services/tmdb/routes/genres.ts';

// Use vi.hoisted to define mock functions before vi.mock
const { mockFetch } = vi.hoisted(() => {
  return {
    mockFetch: vi.fn(),
  };
});

// Mock the TMDB client
vi.mock('@/lib/services/tmdb/client', () => ({
  tmdbClient: {
    fetch: mockFetch,
  },
}));

describe('Genres Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMovieGenres', () => {
    it('should fetch movie genres from TMDB', async () => {
      const mockResponse = {
        genres: [
          { id: 28, name: 'Action' },
          { id: 12, name: 'Adventure' },
          { id: 16, name: 'Animation' },
          { id: 35, name: 'Comedy' },
        ],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getMovieGenres();

      expect(mockFetch).toHaveBeenCalledWith(
        '/genre/movie/list',
        expect.objectContaining({
          language: 'en-US',
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(4);
      expect(result[0]).toEqual({ id: 28, name: 'Action' });
      expect(result[1]).toEqual({ id: 12, name: 'Adventure' });
    });

    it('should respect language parameter', async () => {
      const mockResponse = {
        genres: [
          { id: 28, name: 'Action' },
          { id: 35, name: 'Comedy' },
        ],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getMovieGenres({ language: 'fr-FR' });

      expect(mockFetch).toHaveBeenCalledWith(
        '/genre/movie/list',
        expect.objectContaining({
          language: 'fr-FR',
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(2);
    });

    it('should return fallback movie genres when API fails', async () => {
      mockFetch.mockRejectedValue(new Error('API Error'));

      const result = await getMovieGenres();

      expect(result).toEqual(FALLBACK_MOVIE_GENRES);
      expect(result).toHaveLength(19); // Full movie fallback list
    });

    it('should return empty array when API returns empty', async () => {
      mockFetch.mockResolvedValue({ genres: [] });

      const result = await getMovieGenres();

      expect(result).toEqual([]);
    });
  });

  describe('getTVGenres', () => {
    it('should fetch TV genres from TMDB', async () => {
      const mockResponse = {
        genres: [
          { id: 10759, name: 'Action & Adventure' },
          { id: 16, name: 'Animation' },
          { id: 35, name: 'Comedy' },
          { id: 80, name: 'Crime' },
        ],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getTVGenres();

      expect(mockFetch).toHaveBeenCalledWith(
        '/genre/tv/list',
        expect.objectContaining({
          language: 'en-US',
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(4);
      expect(result[0]).toEqual({ id: 10759, name: 'Action & Adventure' });
    });

    it('should return fallback TV genres when API fails', async () => {
      mockFetch.mockRejectedValue(new Error('API Error'));

      const result = await getTVGenres();

      expect(result).toEqual(FALLBACK_TV_GENRES);
      expect(result).toHaveLength(16); // Full TV fallback list
    });
  });

  describe('getHomeGenres', () => {
    it('should fetch top N movie genres for home page', async () => {
      const mockResponse = {
        genres: [
          { id: 28, name: 'Action' },
          { id: 12, name: 'Adventure' },
          { id: 16, name: 'Animation' },
          { id: 35, name: 'Comedy' },
          { id: 80, name: 'Crime' },
          { id: 99, name: 'Documentary' },
        ],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getHomeGenres(4, 'movie');

      expect(mockFetch).toHaveBeenCalledWith(
        '/genre/movie/list',
        expect.objectContaining({
          language: 'en-US',
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(4);
      expect(result[0]).toEqual({ id: 28, name: 'Action' });
      expect(result[1]).toEqual({ id: 12, name: 'Adventure' });
      expect(result[2]).toEqual({ id: 16, name: 'Animation' });
      expect(result[3]).toEqual({ id: 35, name: 'Comedy' });
    });

    it('should fetch top N TV genres when type is tv', async () => {
      const mockResponse = {
        genres: [
          { id: 10759, name: 'Action & Adventure' },
          { id: 16, name: 'Animation' },
          { id: 35, name: 'Comedy' },
          { id: 80, name: 'Crime' },
        ],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getHomeGenres(3, 'tv');

      expect(mockFetch).toHaveBeenCalledWith(
        '/genre/tv/list',
        expect.objectContaining({
          language: 'en-US',
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ id: 10759, name: 'Action & Adventure' });
      expect(result[1]).toEqual({ id: 16, name: 'Animation' });
      expect(result[2]).toEqual({ id: 35, name: 'Comedy' });
    });

    it('should return fallback movie genres when API fails', async () => {
      mockFetch.mockRejectedValue(new Error('API Error'));

      const result = await getHomeGenres(4, 'movie');

      // Should return first 4 from FALLBACK_MOVIE_GENRES
      expect(result).toHaveLength(4);
      expect(result[0]).toEqual({ id: 28, name: 'Action' });
      expect(result[1]).toEqual({ id: 12, name: 'Adventure' });
      expect(result[2]).toEqual({ id: 16, name: 'Animation' });
      expect(result[3]).toEqual({ id: 35, name: 'Comedy' });
    });

    it('should default to 4 movie genres', async () => {
      const mockResponse = {
        genres: [
          { id: 28, name: 'Action' },
          { id: 12, name: 'Adventure' },
          { id: 16, name: 'Animation' },
          { id: 35, name: 'Comedy' },
        ],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getHomeGenres();

      expect(result).toHaveLength(4);
    });
  });

  describe('getGenreNameById', () => {
    it('should return genre name for valid movie ID', () => {
      const result = getGenreNameById(28);
      expect(result).toBe('Action');
    });

    it('should return genre name for valid TV-only ID', () => {
      const result = getGenreNameById(10765);
      expect(result).toBe('Sci-Fi & Fantasy');
    });

    it('should return "Genre {id}" for invalid ID', () => {
      const result = getGenreNameById(99999);
      expect(result).toBe('Genre 99999');
    });
  });

  describe('getGenreNamesByIds', () => {
    it('should return genre names for multiple IDs', () => {
      const result = getGenreNamesByIds([28, 35, 18]);
      expect(result).toEqual(['Action', 'Comedy', 'Drama']);
    });

    it('should handle invalid IDs gracefully', () => {
      const result = getGenreNamesByIds([28, 99999, 35]);
      expect(result).toEqual(['Action', 'Genre 99999', 'Comedy']);
    });
  });

  describe('mapGenreIdsToObjects', () => {
    it('should map genre IDs to genre objects', () => {
      const result = mapGenreIdsToObjects([28, 35, 18]);
      expect(result).toEqual([
        { id: 28, name: 'Action' },
        { id: 35, name: 'Comedy' },
        { id: 18, name: 'Drama' },
      ]);
    });

    it('should filter out invalid IDs', () => {
      const result = mapGenreIdsToObjects([28, 99999, 35]);
      expect(result).toEqual([
        { id: 28, name: 'Action' },
        { id: 35, name: 'Comedy' },
      ]);
    });

    it('should use custom genre list when provided', () => {
      const customGenres = [
        { id: 1, name: 'Custom 1' },
        { id: 2, name: 'Custom 2' },
      ];

      const result = mapGenreIdsToObjects([1, 2], customGenres);
      expect(result).toEqual([
        { id: 1, name: 'Custom 1' },
        { id: 2, name: 'Custom 2' },
      ]);
    });
  });

  describe('Fallback genre lists', () => {
    it('FALLBACK_MOVIE_GENRES should contain all expected movie genres', () => {
      expect(FALLBACK_MOVIE_GENRES).toContainEqual({ id: 28, name: 'Action' });
      expect(FALLBACK_MOVIE_GENRES).toContainEqual({ id: 35, name: 'Comedy' });
      expect(FALLBACK_MOVIE_GENRES).toContainEqual({ id: 18, name: 'Drama' });
      expect(FALLBACK_MOVIE_GENRES).toContainEqual({
        id: 878,
        name: 'Science Fiction',
      });
      expect(FALLBACK_MOVIE_GENRES).toHaveLength(19);
    });

    it('FALLBACK_TV_GENRES should contain all expected TV genres', () => {
      expect(FALLBACK_TV_GENRES).toContainEqual({
        id: 10759,
        name: 'Action & Adventure',
      });
      expect(FALLBACK_TV_GENRES).toContainEqual({ id: 35, name: 'Comedy' });
      expect(FALLBACK_TV_GENRES).toContainEqual({ id: 18, name: 'Drama' });
      expect(FALLBACK_TV_GENRES).toContainEqual({
        id: 10765,
        name: 'Sci-Fi & Fantasy',
      });
      expect(FALLBACK_TV_GENRES).toContainEqual({ id: 10764, name: 'Reality' });
      expect(FALLBACK_TV_GENRES).toHaveLength(16);
    });

    it('movie and TV fallbacks should not be identical', () => {
      expect(FALLBACK_MOVIE_GENRES).not.toEqual(FALLBACK_TV_GENRES);
    });
  });
});