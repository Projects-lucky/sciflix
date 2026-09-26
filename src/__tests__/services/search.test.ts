import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  isSearchMovie,
  isSearchPerson,
  isSearchTV,
  searchAll,
  searchMedia,
  searchMovies,
  searchMulti,
  searchPeople,
  searchTV,
} from "@/lib/services/tmdb/routes/search.ts";

// Use vi.hoisted to define mock functions before vi.mock
const { mockFetch } = vi.hoisted(() => {
  return {
    mockFetch: vi.fn(),
  };
});

// Mock the TMDB client
vi.mock("@/lib/services/tmdb/client", () => ({
  tmdbClient: {
    fetch: mockFetch,
  },
}));

describe("Search Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("searchMulti", () => {
    it("should search across all media types", async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: "Star Wars: A New Hope",
            media_type: "movie",
            adult: false,
            poster_path: "/star-wars.jpg",
            overview: "Test overview",
            popularity: 100,
            vote_average: 8.5,
            vote_count: 1000,
            release_date: "1977-05-25",
            original_title: "Star Wars",
            original_language: "en",
            genre_ids: [28, 12],
            video: false,
          },
          {
            id: 2,
            name: "Star Wars: The Clone Wars",
            media_type: "tv",
            adult: false,
            poster_path: "/clone-wars.jpg",
            overview: "Test TV overview",
            popularity: 90,
            vote_average: 7.5,
            vote_count: 500,
            first_air_date: "2008-10-03",
            original_name: "Star Wars: The Clone Wars",
            original_language: "en",
            genre_ids: [18, 35],
            origin_country: ["US"],
          },
          {
            id: 3,
            name: "George Lucas",
            media_type: "person",
            adult: false,
            profile_path: "/george-lucas.jpg",
            known_for_department: "Directing",
            popularity: 80,
            known_for: [],
          },
        ],
        total_pages: 1,
        total_results: 3,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await searchMulti({ query: "star wars" });

      expect(mockFetch).toHaveBeenCalledWith(
        "/search/multi",
        expect.objectContaining({
          query: "star wars",
          page: 1,
          language: "en-US",
          region: "US",
          adult: false,
        }),
        expect.any(Object),
      );
      expect(result).toHaveLength(3);
      expect(result?.[0]).toHaveProperty("media_type", "movie");
      expect(result?.[0]).toHaveProperty("title", "Star Wars: A New Hope");
      expect(result?.[1]).toHaveProperty("media_type", "tv");
      expect(result?.[1]).toHaveProperty("name", "Star Wars: The Clone Wars");
      expect(result?.[2]).toHaveProperty("media_type", "person");
      expect(result?.[2]).toHaveProperty("name", "George Lucas");
    });

    it("should respect limit parameter", async () => {
      const mockResponse = {
        page: 1,
        results: [
          { id: 1, title: "Result 1", media_type: "movie", adult: false },
          { id: 2, title: "Result 2", media_type: "movie", adult: false },
          { id: 3, title: "Result 3", media_type: "movie", adult: false },
          { id: 4, title: "Result 4", media_type: "movie", adult: false },
        ],
        total_pages: 1,
        total_results: 4,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await searchMulti({ query: "test" }, { limit: 2 });

      expect(result).toHaveLength(2);
      expect(result?.[0]).toHaveProperty("id", 1);
      expect(result?.[1]).toHaveProperty("id", 2);
    });

    it("should filter adult content", async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: "Test Movie",
            media_type: "movie",
            adult: true,
            poster_path: "/test.jpg",
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await searchMulti({ query: "test", adult: true });

      expect(mockFetch).toHaveBeenCalledWith(
        "/search/multi",
        expect.objectContaining({
          adult: true,
        }),
        expect.any(Object),
      );
      expect(result).toHaveLength(1);
    });

    it("should return null for empty query", async () => {
      const result = await searchMulti({ query: "" });

      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should return null for query shorter than min length", async () => {
      const result = await searchMulti({ query: "a" });

      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should return null when API fails", async () => {
      mockFetch.mockRejectedValue(new Error("API Error"));

      const result = await searchMulti({ query: "test" });

      expect(result).toBeNull();
    });
  });

  describe("searchMovies", () => {
    it("should search movies only", async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: "The Matrix",
            adult: false,
            poster_path: "/matrix.jpg",
            overview: "Test overview",
            popularity: 100,
            vote_average: 8.5,
            vote_count: 1000,
            release_date: "1999-03-31",
            original_title: "The Matrix",
            original_language: "en",
            genre_ids: [28, 12],
            video: false,
          },
          {
            id: 2,
            title: "The Matrix Reloaded",
            adult: false,
            poster_path: "/matrix-reloaded.jpg",
            overview: "Test overview 2",
            popularity: 90,
            vote_average: 7.5,
            vote_count: 800,
            release_date: "2003-05-15",
            original_title: "The Matrix Reloaded",
            original_language: "en",
            genre_ids: [28, 12],
            video: false,
          },
        ],
        total_pages: 1,
        total_results: 2,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await searchMovies({ query: "matrix" });

      expect(mockFetch).toHaveBeenCalledWith(
        "/search/movie",
        expect.objectContaining({
          query: "matrix",
          page: 1,
          language: "en-US",
          region: "US",
          adult: false,
        }),
        expect.any(Object),
      );
      expect(result).toHaveLength(2);
      expect(result?.[0]).toHaveProperty("title", "The Matrix");
      expect(result?.[1]).toHaveProperty("title", "The Matrix Reloaded");
    });

    it("should filter by year", async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: "Movie 1999",
            adult: false,
            poster_path: "/movie1999.jpg",
            release_date: "1999-01-01",
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await searchMovies({ query: "matrix", year: 1999 });

      expect(mockFetch).toHaveBeenCalledWith(
        "/search/movie",
        expect.objectContaining({
          year: 1999,
        }),
        expect.any(Object),
      );
      expect(result).toHaveLength(1);
    });

    it("should return null for empty query", async () => {
      const result = await searchMovies({ query: "" });

      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("searchTV", () => {
    it("should search TV shows only", async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            name: "Breaking Bad",
            adult: false,
            poster_path: "/breaking-bad.jpg",
            overview: "Test overview",
            popularity: 100,
            vote_average: 8.5,
            vote_count: 1000,
            first_air_date: "2008-01-20",
            original_name: "Breaking Bad",
            original_language: "en",
            genre_ids: [18, 35],
            origin_country: ["US"],
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await searchTV({ query: "breaking bad" });

      expect(mockFetch).toHaveBeenCalledWith(
        "/search/tv",
        expect.objectContaining({
          query: "breaking bad",
          page: 1,
          language: "en-US",
          region: "US",
          adult: false,
        }),
        expect.any(Object),
      );
      expect(result).toHaveLength(1);
      expect(result?.[0]).toHaveProperty("name", "Breaking Bad");
    });

    it("should filter by first air date year", async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            name: "TV Show 2008",
            adult: false,
            poster_path: "/tv2008.jpg",
            first_air_date: "2008-01-20",
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await searchTV({
        query: "breaking bad",
        first_air_date_year: 2008,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "/search/tv",
        expect.objectContaining({
          first_air_date_year: 2008,
        }),
        expect.any(Object),
      );
      expect(result).toHaveLength(1);
    });
  });

  describe("searchPeople", () => {
    it("should search people only", async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            name: "Bryan Cranston",
            adult: false,
            profile_path: "/bryan-cranston.jpg",
            known_for_department: "Acting",
            popularity: 100,
            known_for: [],
          },
          {
            id: 2,
            name: "Aaron Paul",
            adult: false,
            profile_path: "/aaron-paul.jpg",
            known_for_department: "Acting",
            popularity: 90,
            known_for: [],
          },
        ],
        total_pages: 1,
        total_results: 2,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await searchPeople({ query: "breaking bad" });

      expect(mockFetch).toHaveBeenCalledWith(
        "/search/person",
        expect.objectContaining({
          query: "breaking bad",
          page: 1,
          language: "en-US",
          region: "US",
          adult: false,
        }),
        expect.any(Object),
      );
      expect(result).toHaveLength(2);
      expect(result?.[0]).toHaveProperty("name", "Bryan Cranston");
      expect(result?.[1]).toHaveProperty("name", "Aaron Paul");
    });
  });

  describe("searchAll", () => {
    it("should search all categories in parallel", async () => {
      const mockMovies = {
        page: 1,
        results: [
          {
            id: 1,
            title: "Test Movie",
            adult: false,
            poster_path: "/test-movie.jpg",
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      const mockTV = {
        page: 1,
        results: [
          {
            id: 1,
            name: "Test TV",
            adult: false,
            poster_path: "/test-tv.jpg",
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      const mockPeople = {
        page: 1,
        results: [
          {
            id: 1,
            name: "Test Person",
            adult: false,
            profile_path: "/test-person.jpg",
            known_for_department: "Acting",
            known_for: [],
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch
        .mockResolvedValueOnce(mockMovies)
        .mockResolvedValueOnce(mockTV)
        .mockResolvedValueOnce(mockPeople);

      const result = await searchAll("test", 10);

      expect(result.movies).toHaveLength(1);
      expect(result.tv).toHaveLength(1);
      expect(result.people).toHaveLength(1);
      expect(result.movies?.[0]).toHaveProperty("title", "Test Movie");
      expect(result.tv?.[0]).toHaveProperty("name", "Test TV");
      expect(result.people?.[0]).toHaveProperty("name", "Test Person");
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it("should handle partial failures in searchAll", async () => {
      const mockMovies = {
        page: 1,
        results: [
          {
            id: 1,
            title: "Test Movie",
            adult: false,
            poster_path: "/test-movie.jpg",
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch
        .mockResolvedValueOnce(mockMovies)
        .mockRejectedValueOnce(new Error("API Error"))
        .mockResolvedValueOnce({
          page: 1,
          results: [
            {
              id: 1,
              name: "Test Person",
              adult: false,
              profile_path: "/test-person.jpg",
              known_for_department: "Acting",
              known_for: [],
            },
          ],
          total_pages: 1,
          total_results: 1,
        });

      const result = await searchAll("test", 10);

      expect(result.movies).toHaveLength(1);
      expect(result.tv).toBeNull();
      expect(result.people).toHaveLength(1);
    });
  });

  describe("searchMedia", () => {
    it("should search multi with default parameters", async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: "Test Media",
            media_type: "movie",
            adult: false,
            poster_path: "/test-media.jpg",
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await searchMedia("test", 20);

      expect(mockFetch).toHaveBeenCalledWith(
        "/search/multi",
        expect.objectContaining({
          query: "test",
          adult: false,
        }),
        expect.any(Object),
      );
      expect(result).toHaveLength(1);
    });

    it("should include adult content when specified", async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: "Adult Content",
            media_type: "movie",
            adult: true,
            poster_path: "/adult.jpg",
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await searchMedia("test", 20, true);

      expect(mockFetch).toHaveBeenCalledWith(
        "/search/multi",
        expect.objectContaining({
          adult: true,
        }),
        expect.any(Object),
      );
      expect(result).toHaveLength(1);
    });
  });

  describe("Type Guards", () => {
    it("isSearchMovie should identify movie items", () => {
      const movieItem = {
        id: 1,
        title: "Test Movie",
        media_type: "movie" as const,
        adult: false,
        poster_path: "/test.jpg",
      };
      expect(isSearchMovie(movieItem)).toBe(true);
    });

    it("isSearchTV should identify TV items", () => {
      const tvItem = {
        id: 1,
        name: "Test TV",
        media_type: "tv" as const,
        adult: false,
        poster_path: "/test.jpg",
      };
      expect(isSearchTV(tvItem)).toBe(true);
    });

    it("isSearchPerson should identify person items", () => {
      const personItem = {
        id: 1,
        name: "Test Person",
        media_type: "person" as const,
        adult: false,
        profile_path: "/test.jpg",
        known_for_department: "Acting",
        known_for: [],
      };
      expect(isSearchPerson(personItem)).toBe(true);
    });
  });
});
