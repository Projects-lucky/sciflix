import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getHeroTrending,
  getTrending,
  getTrendingMovies,
  getTrendingPeople,
} from "@/lib/services/tmdb/routes/trending.ts";

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

describe("Trending Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTrending", () => {
    it("should fetch trending data with default parameters", async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: "Test Movie",
            media_type: "movie",
            adult: false,
            poster_path: "/test.jpg",
            backdrop_path: "/test-backdrop.jpg",
            overview: "Test overview",
            popularity: 100,
            vote_average: 8.5,
            vote_count: 1000,
            release_date: "2024-01-01",
            original_title: "Test Movie",
            original_language: "en",
            genre_ids: [28, 12],
            video: false,
          },
          {
            id: 2,
            name: "Test TV Show",
            media_type: "tv",
            adult: false,
            poster_path: "/test-tv.jpg",
            backdrop_path: "/test-backdrop-tv.jpg",
            overview: "Test TV overview",
            popularity: 90,
            vote_average: 7.5,
            vote_count: 500,
            first_air_date: "2024-01-01",
            original_name: "Test TV Show",
            original_language: "en",
            genre_ids: [18, 35],
            origin_country: ["US"],
          },
        ],
        total_pages: 1,
        total_results: 2,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getTrending();

      expect(mockFetch).toHaveBeenCalledWith(
        "/trending/all/week",
        expect.objectContaining({
          language: "en-US",
          page: 1,
          region: "US",
        }),
        expect.any(Object),
      );
      expect(result).toHaveLength(2);
      expect(result?.[0]).toHaveProperty("title", "Test Movie");
      expect(result?.[1]).toHaveProperty("name", "Test TV Show");
    });

    it("should filter adult content when adult=false", async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: "Family Movie",
            media_type: "movie",
            adult: false,
            poster_path: "/family.jpg",
          },
          {
            id: 2,
            title: "Adult Movie",
            media_type: "movie",
            adult: true,
            poster_path: "/adult.jpg",
          },
        ],
        total_pages: 1,
        total_results: 2,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getTrending({ adult: false });

      expect(result).toHaveLength(1);
      expect(result?.[0]).toHaveProperty("title", "Family Movie");
    });

    it("should include adult content when adult=true", async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: "Family Movie",
            media_type: "movie",
            adult: false,
            poster_path: "/family.jpg",
          },
          {
            id: 2,
            title: "Adult Movie",
            media_type: "movie",
            adult: true,
            poster_path: "/adult.jpg",
          },
        ],
        total_pages: 1,
        total_results: 2,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getTrending({ adult: true });

      expect(result).toHaveLength(2);
    });

    it("should respect the limit parameter", async () => {
      const mockResponse = {
        page: 1,
        results: [
          { id: 1, title: "Movie 1", media_type: "movie", adult: false },
          { id: 2, title: "Movie 2", media_type: "movie", adult: false },
          { id: 3, title: "Movie 3", media_type: "movie", adult: false },
          { id: 4, title: "Movie 4", media_type: "movie", adult: false },
        ],
        total_pages: 1,
        total_results: 4,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getTrending({}, { limit: 2 });

      expect(result).toHaveLength(2);
      expect(result?.[0]).toHaveProperty("id", 1);
      expect(result?.[1]).toHaveProperty("id", 2);
    });

    it("should handle media_type parameter", async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: "Movie Only",
            media_type: "movie",
            adult: false,
            poster_path: "/movie.jpg",
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getTrending({ media_type: "movie" });

      expect(mockFetch).toHaveBeenCalledWith(
        "/trending/movie/week",
        expect.any(Object),
        expect.any(Object),
      );
      expect(result).toHaveLength(1);
    });

    it("should return null when API fails", async () => {
      mockFetch.mockRejectedValue(new Error("API Error"));

      const result = await getTrending();

      expect(result).toBeNull();
    });
  });

  describe("getTrendingMovies", () => {
    it("should fetch trending movies only", async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: "Movie 1",
            media_type: "movie",
            adult: false,
            poster_path: "/movie1.jpg",
          },
          {
            id: 2,
            title: "Movie 2",
            media_type: "movie",
            adult: false,
            poster_path: "/movie2.jpg",
          },
        ],
        total_pages: 1,
        total_results: 2,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getTrendingMovies("week", 10);

      expect(mockFetch).toHaveBeenCalledWith(
        "/trending/movie/week",
        expect.any(Object),
        expect.any(Object),
      );
      expect(result).toHaveLength(2);
    });

    it("should return null on failure", async () => {
      mockFetch.mockRejectedValue(new Error("API Error"));

      const result = await getTrendingMovies("week", 10);

      expect(result).toBeNull();
    });
  });

  describe("getTrendingPeople", () => {
    it("should fetch trending people only", async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            name: "Actor 1",
            media_type: "person",
            adult: false,
            profile_path: "/actor1.jpg",
            known_for_department: "Acting",
            known_for: [],
          },
          {
            id: 2,
            name: "Actor 2",
            media_type: "person",
            adult: false,
            profile_path: "/actor2.jpg",
            known_for_department: "Acting",
            known_for: [],
          },
        ],
        total_pages: 1,
        total_results: 2,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getTrendingPeople("week", 20);

      expect(mockFetch).toHaveBeenCalledWith(
        "/trending/person/week",
        expect.any(Object),
        expect.any(Object),
      );
      expect(result).toHaveLength(2);
    });
  });

  describe("getHeroTrending", () => {
    it("should fetch trending with hero config defaults", async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: "Hero Movie",
            media_type: "movie",
            adult: false,
            poster_path: "/hero.jpg",
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getHeroTrending(10);

      expect(mockFetch).toHaveBeenCalledWith(
        "/trending/all/week",
        expect.objectContaining({
          language: "en-US",
          page: 1,
          region: "US",
        }),
        expect.any(Object),
      );
      expect(result).toHaveLength(1);
      expect(result?.[0]).toHaveProperty("title", "Hero Movie");
    });
  });
});
