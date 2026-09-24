import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  discoverMovies,
  discoverTV,
  getMoviesByGenre,
  getMoviesByGenres,
  getTVByGenre,
  getLatestMovies,
  getTopRatedMovies,
  getGenreSections,
} from '@/lib/services/tmdb/routes/discover.ts';

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

describe('Discover Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('discoverMovies', () => {
    it('should fetch movies with default parameters', async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'Test Movie 1',
            adult: false,
            poster_path: '/test1.jpg',
            backdrop_path: '/backdrop1.jpg',
            overview: 'Test overview 1',
            popularity: 100,
            vote_average: 8.5,
            vote_count: 1000,
            release_date: '2024-01-01',
            original_title: 'Test Movie 1',
            original_language: 'en',
            genre_ids: [28, 12],
            video: false,
          },
          {
            id: 2,
            title: 'Test Movie 2',
            adult: false,
            poster_path: '/test2.jpg',
            backdrop_path: '/backdrop2.jpg',
            overview: 'Test overview 2',
            popularity: 90,
            vote_average: 7.5,
            vote_count: 500,
            release_date: '2024-01-02',
            original_title: 'Test Movie 2',
            original_language: 'en',
            genre_ids: [35, 18],
            video: false,
          },
        ],
        total_pages: 1,
        total_results: 2,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await discoverMovies();

      expect(mockFetch).toHaveBeenCalledWith(
        '/discover/movie',
        expect.objectContaining({
          sort_by: 'popularity.desc',
          page: 1,
          language: 'en-US',
          adult: false,
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(2);
      expect(result?.[0]).toHaveProperty('title', 'Test Movie 1');
      expect(result?.[1]).toHaveProperty('title', 'Test Movie 2');
    });

    it('should filter by genre', async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'Action Movie',
            adult: false,
            poster_path: '/action.jpg',
            genre_ids: [28],
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await discoverMovies({
        with_genres: '28',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/discover/movie',
        expect.objectContaining({
          with_genres: '28',
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(1);
      expect(result?.[0]).toHaveProperty('title', 'Action Movie');
    });

    it('should filter by multiple genres', async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'Action Comedy',
            adult: false,
            poster_path: '/action-comedy.jpg',
            genre_ids: [28, 35],
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await discoverMovies({
        with_genres: '28,35',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/discover/movie',
        expect.objectContaining({
          with_genres: '28,35',
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(1);
    });

    it('should filter by year', async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'Movie 2023',
            adult: false,
            poster_path: '/movie2023.jpg',
            release_date: '2023-06-01',
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await discoverMovies({
        year: 2023,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/discover/movie',
        expect.objectContaining({
          year: 2023,
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(1);
    });

    it('should filter by vote average', async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'High Rated Movie',
            adult: false,
            poster_path: '/high-rated.jpg',
            vote_average: 8.5,
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await discoverMovies({
        'vote_average.gte': 8.0,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/discover/movie',
        expect.objectContaining({
          'vote_average.gte': 8.0,
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(1);
    });

    it('should respect limit parameter', async () => {
      const mockResponse = {
        page: 1,
        results: [
          { id: 1, title: 'Movie 1', adult: false },
          { id: 2, title: 'Movie 2', adult: false },
          { id: 3, title: 'Movie 3', adult: false },
          { id: 4, title: 'Movie 4', adult: false },
        ],
        total_pages: 1,
        total_results: 4,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await discoverMovies({}, { limit: 2 });

      expect(result).toHaveLength(2);
      expect(result?.[0]).toHaveProperty('id', 1);
      expect(result?.[1]).toHaveProperty('id', 2);
    });

    it('should handle custom sort order', async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'Top Rated',
            adult: false,
            poster_path: '/top-rated.jpg',
            vote_average: 9.0,
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await discoverMovies({
        sort_by: 'vote_average.desc',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/discover/movie',
        expect.objectContaining({
          sort_by: 'vote_average.desc',
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(1);
    });

    it('should return null when API fails', async () => {
      mockFetch.mockRejectedValue(new Error('API Error'));

      const result = await discoverMovies();

      expect(result).toBeNull();
    });
  });

  describe('discoverTV', () => {
    it('should fetch TV shows with default parameters', async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            name: 'Test TV Show 1',
            adult: false,
            poster_path: '/tv1.jpg',
            backdrop_path: '/backdrop-tv1.jpg',
            overview: 'Test TV overview 1',
            popularity: 100,
            vote_average: 8.5,
            vote_count: 1000,
            first_air_date: '2024-01-01',
            original_name: 'Test TV Show 1',
            original_language: 'en',
            genre_ids: [18, 35],
            origin_country: ['US'],
          },
          {
            id: 2,
            name: 'Test TV Show 2',
            adult: false,
            poster_path: '/tv2.jpg',
            backdrop_path: '/backdrop-tv2.jpg',
            overview: 'Test TV overview 2',
            popularity: 90,
            vote_average: 7.5,
            vote_count: 500,
            first_air_date: '2024-01-02',
            original_name: 'Test TV Show 2',
            original_language: 'en',
            genre_ids: [10759, 16],
            origin_country: ['US'],
          },
        ],
        total_pages: 1,
        total_results: 2,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await discoverTV();

      expect(mockFetch).toHaveBeenCalledWith(
        '/discover/tv',
        expect.objectContaining({
          sort_by: 'popularity.desc',
          page: 1,
          language: 'en-US',
          adult: false,
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(2);
      expect(result?.[0]).toHaveProperty('name', 'Test TV Show 1');
    });

    it('should filter TV by genre', async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            name: 'Comedy TV Show',
            adult: false,
            poster_path: '/comedy-tv.jpg',
            genre_ids: [35],
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await discoverTV({
        with_genres: '35',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/discover/tv',
        expect.objectContaining({
          with_genres: '35',
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(1);
    });

    it('should filter TV by first air date year', async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            name: 'TV Show 2022',
            adult: false,
            poster_path: '/tv2022.jpg',
            first_air_date: '2022-06-01',
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await discoverTV({
        first_air_date_year: 2022,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/discover/tv',
        expect.objectContaining({
          first_air_date_year: 2022,
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(1);
    });

    it('should return null when API fails', async () => {
      mockFetch.mockRejectedValue(new Error('API Error'));

      const result = await discoverTV();

      expect(result).toBeNull();
    });
  });

  describe('getMoviesByGenre', () => {
    it('should fetch movies by single genre', async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'Action Movie',
            adult: false,
            poster_path: '/action.jpg',
            genre_ids: [28],
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getMoviesByGenre(28, 10);

      expect(mockFetch).toHaveBeenCalledWith(
        '/discover/movie',
        expect.objectContaining({
          with_genres: '28',
          adult: false,
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(1);
    });

    it('should handle adult flag', async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'Action Movie',
            adult: true,
            poster_path: '/action.jpg',
            genre_ids: [28],
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getMoviesByGenre(28, 10, true);

      expect(mockFetch).toHaveBeenCalledWith(
        '/discover/movie',
        expect.objectContaining({
          with_genres: '28',
          adult: true,
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('getMoviesByGenres', () => {
    it('should fetch movies by multiple genres', async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'Action Comedy',
            adult: false,
            poster_path: '/action-comedy.jpg',
            genre_ids: [28, 35],
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getMoviesByGenres([28, 35], 10);

      expect(mockFetch).toHaveBeenCalledWith(
        '/discover/movie',
        expect.objectContaining({
          with_genres: '28,35',
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('getTVByGenre', () => {
    it('should fetch TV shows by genre', async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            name: 'Comedy TV',
            adult: false,
            poster_path: '/comedy-tv.jpg',
            genre_ids: [35],
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getTVByGenre(35, 10);

      expect(mockFetch).toHaveBeenCalledWith(
        '/discover/tv',
        expect.objectContaining({
          with_genres: '35',
          adult: false,
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('getLatestMovies', () => {
    it('should fetch latest movies by release date', async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'New Movie',
            adult: false,
            poster_path: '/new-movie.jpg',
            release_date: '2024-12-01',
          },
          {
            id: 2,
            title: 'Older Movie',
            adult: false,
            poster_path: '/older-movie.jpg',
            release_date: '2024-11-01',
          },
        ],
        total_pages: 1,
        total_results: 2,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getLatestMovies(5);

      expect(mockFetch).toHaveBeenCalledWith(
        '/discover/movie',
        expect.objectContaining({
          sort_by: 'release_date.desc',
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(2);
    });
  });

  describe('getTopRatedMovies', () => {
    it('should fetch top rated movies with vote count filter', async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'Top Rated Movie',
            adult: false,
            poster_path: '/top-rated.jpg',
            vote_average: 9.0,
            vote_count: 1000,
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getTopRatedMovies(10);

      expect(mockFetch).toHaveBeenCalledWith(
        '/discover/movie',
        expect.objectContaining({
          sort_by: 'vote_average.desc',
          'vote_count.gte': 100,
        }),
        expect.any(Object)
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('getGenreSections', () => {
    it('should fetch movies for multiple genres in parallel', async () => {
      const mockResponse1 = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'Action Movie 1',
            adult: false,
            poster_path: '/action1.jpg',
            genre_ids: [28],
          },
          {
            id: 2,
            title: 'Action Movie 2',
            adult: false,
            poster_path: '/action2.jpg',
            genre_ids: [28],
          },
        ],
        total_pages: 1,
        total_results: 2,
      };

      const mockResponse2 = {
        page: 1,
        results: [
          {
            id: 3,
            title: 'Comedy Movie 1',
            adult: false,
            poster_path: '/comedy1.jpg',
            genre_ids: [35],
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);

      const genreIds = [28, 35];
      const result = await getGenreSections(genreIds, 10);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        genreId: 28,
        movies: expect.arrayContaining([
          expect.objectContaining({ title: 'Action Movie 1' }),
          expect.objectContaining({ title: 'Action Movie 2' }),
        ]),
      });
      expect(result[1]).toEqual({
        genreId: 35,
        movies: expect.arrayContaining([
          expect.objectContaining({ title: 'Comedy Movie 1' }),
        ]),
      });
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle partial failures gracefully', async () => {
      const mockResponse1 = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'Action Movie',
            adult: false,
            poster_path: '/action.jpg',
            genre_ids: [28],
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch
        .mockResolvedValueOnce(mockResponse1)
        .mockRejectedValueOnce(new Error('API Error'));

      const genreIds = [28, 35];
      const result = await getGenreSections(genreIds, 10);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        genreId: 28,
        movies: expect.arrayContaining([
          expect.objectContaining({ title: 'Action Movie' }),
        ]),
      });
      expect(result[1]).toEqual({
        genreId: 35,
        movies: [],
      });
    });

    it('should return empty array for all genres on API failure', async () => {
      mockFetch.mockRejectedValue(new Error('API Error'));

      const genreIds = [28, 35];
      const result = await getGenreSections(genreIds, 10);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ genreId: 28, movies: [] });
      expect(result[1]).toEqual({ genreId: 35, movies: [] });
    });
  });
});