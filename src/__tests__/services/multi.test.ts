import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  findByExternalId,
  findByFacebook,
  findByInstagram,
  findByTVDB,
  findByTwitter,
  findMovieByImdb,
  findPersonByImdb,
  findTVByImdb,
} from "@/lib/services/tmdb/routes/multi.ts";

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

describe("Multi/Find Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findByExternalId", () => {
    it("should find movie by IMDb ID", async () => {
      const mockResponse = {
        movie_results: [
          {
            id: 12345,
            title: "Inception",
            adult: false,
            poster_path: "/inception.jpg",
            backdrop_path: "/inception-backdrop.jpg",
            overview: "A thief who steals corporate secrets...",
            popularity: 100,
            vote_average: 8.5,
            vote_count: 1000,
            release_date: "2010-07-16",
            original_title: "Inception",
            original_language: "en",
            genre_ids: [28, 12],
            video: false,
          },
        ],
        tv_results: [],
        person_results: [],
        tv_episode_results: [],
        tv_season_results: [],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await findByExternalId("tt1375666", "imdb_id");

      expect(mockFetch).toHaveBeenCalledWith(
        "/find/tt1375666",
        expect.objectContaining({
          external_source: "imdb_id",
          language: "en-US",
        }),
        expect.any(Object),
      );
      expect(result?.movie_results).toHaveLength(1);
      expect(result?.movie_results[0]).toHaveProperty("title", "Inception");
      expect(result?.movie_results[0]).toHaveProperty("id", 12345);
    });

    it("should find TV show by IMDb ID", async () => {
      const mockResponse = {
        movie_results: [],
        tv_results: [
          {
            id: 67890,
            name: "Breaking Bad",
            adult: false,
            poster_path: "/breaking-bad.jpg",
            backdrop_path: "/breaking-bad-backdrop.jpg",
            overview: "A high school chemistry teacher...",
            popularity: 100,
            vote_average: 9.0,
            vote_count: 1000,
            first_air_date: "2008-01-20",
            original_name: "Breaking Bad",
            original_language: "en",
            genre_ids: [18, 35],
            origin_country: ["US"],
          },
        ],
        person_results: [],
        tv_episode_results: [],
        tv_season_results: [],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await findByExternalId("tt0903747", "imdb_id");

      expect(result?.tv_results).toHaveLength(1);
      expect(result?.tv_results[0]).toHaveProperty("name", "Breaking Bad");
      expect(result?.tv_results[0]).toHaveProperty("id", 67890);
    });

    it("should find person by IMDb ID", async () => {
      const mockResponse = {
        movie_results: [],
        tv_results: [],
        person_results: [
          {
            id: 123,
            name: "Leonardo DiCaprio",
            adult: false,
            profile_path: "/leonardo.jpg",
            known_for_department: "Acting",
            popularity: 100,
            known_for: [],
          },
        ],
        tv_episode_results: [],
        tv_season_results: [],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await findByExternalId("nm0000138", "imdb_id");

      expect(result?.person_results).toHaveLength(1);
      expect(result?.person_results[0]).toHaveProperty(
        "name",
        "Leonardo DiCaprio",
      );
      expect(result?.person_results[0]).toHaveProperty("id", 123);
    });

    it("should handle language parameter", async () => {
      const mockResponse = {
        movie_results: [],
        tv_results: [],
        person_results: [],
        tv_episode_results: [],
        tv_season_results: [],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await findByExternalId("tt1375666", "imdb_id", {
        language: "fr-FR",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "/find/tt1375666",
        expect.objectContaining({
          external_source: "imdb_id",
          language: "fr-FR",
        }),
        expect.any(Object),
      );
      expect(result).toBeDefined();
    });

    it("should return null when API fails", async () => {
      mockFetch.mockRejectedValue(new Error("API Error"));

      const result = await findByExternalId("tt1375666", "imdb_id");

      expect(result).toBeNull();
    });
  });

  describe("findMovieByImdb", () => {
    it("should return first movie result from IMDb search", async () => {
      const mockResponse = {
        movie_results: [
          {
            id: 12345,
            title: "Inception",
            adult: false,
            poster_path: "/inception.jpg",
            backdrop_path: "/inception-backdrop.jpg",
            overview: "A thief who steals corporate secrets...",
            popularity: 100,
            vote_average: 8.5,
            vote_count: 1000,
            release_date: "2010-07-16",
            original_title: "Inception",
            original_language: "en",
            genre_ids: [28, 12],
            video: false,
          },
        ],
        tv_results: [],
        person_results: [],
        tv_episode_results: [],
        tv_season_results: [],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await findMovieByImdb("tt1375666");

      expect(result).toHaveProperty("title", "Inception");
      expect(result).toHaveProperty("id", 12345);
    });

    it("should return null when no movie found", async () => {
      const mockResponse = {
        movie_results: [],
        tv_results: [
          {
            id: 67890,
            name: "Breaking Bad",
            adult: false,
            poster_path: "/breaking-bad.jpg",
          },
        ],
        person_results: [],
        tv_episode_results: [],
        tv_season_results: [],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await findMovieByImdb("tt0903747");

      expect(result).toBeNull();
    });

    it("should return null when API fails", async () => {
      mockFetch.mockRejectedValue(new Error("API Error"));

      const result = await findMovieByImdb("tt1375666");

      expect(result).toBeNull();
    });
  });

  describe("findTVByImdb", () => {
    it("should return first TV result from IMDb search", async () => {
      const mockResponse = {
        movie_results: [],
        tv_results: [
          {
            id: 67890,
            name: "Breaking Bad",
            adult: false,
            poster_path: "/breaking-bad.jpg",
            backdrop_path: "/breaking-bad-backdrop.jpg",
            overview: "A high school chemistry teacher...",
            popularity: 100,
            vote_average: 9.0,
            vote_count: 1000,
            first_air_date: "2008-01-20",
            original_name: "Breaking Bad",
            original_language: "en",
            genre_ids: [18, 35],
            origin_country: ["US"],
          },
        ],
        person_results: [],
        tv_episode_results: [],
        tv_season_results: [],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await findTVByImdb("tt0903747");

      expect(result).toHaveProperty("name", "Breaking Bad");
      expect(result).toHaveProperty("id", 67890);
    });

    it("should return null when no TV show found", async () => {
      const mockResponse = {
        movie_results: [
          {
            id: 12345,
            title: "Inception",
            adult: false,
            poster_path: "/inception.jpg",
          },
        ],
        tv_results: [],
        person_results: [],
        tv_episode_results: [],
        tv_season_results: [],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await findTVByImdb("tt1375666");

      expect(result).toBeNull();
    });
  });

  describe("findPersonByImdb", () => {
    it("should return first person result from IMDb search", async () => {
      const mockResponse = {
        movie_results: [],
        tv_results: [],
        person_results: [
          {
            id: 123,
            name: "Leonardo DiCaprio",
            adult: false,
            profile_path: "/leonardo.jpg",
            known_for_department: "Acting",
            popularity: 100,
            known_for: [],
          },
        ],
        tv_episode_results: [],
        tv_season_results: [],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await findPersonByImdb("nm0000138");

      expect(result).toHaveProperty("name", "Leonardo DiCaprio");
      expect(result).toHaveProperty("id", 123);
    });

    it("should return null when no person found", async () => {
      const mockResponse = {
        movie_results: [
          {
            id: 12345,
            title: "Inception",
            adult: false,
            poster_path: "/inception.jpg",
          },
        ],
        tv_results: [],
        person_results: [],
        tv_episode_results: [],
        tv_season_results: [],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await findPersonByImdb("tt1375666");

      expect(result).toBeNull();
    });
  });

  describe("findByTVDB", () => {
    it("should find content by TVDB ID", async () => {
      const mockResponse = {
        movie_results: [],
        tv_results: [
          {
            id: 67890,
            name: "Breaking Bad",
            adult: false,
            poster_path: "/breaking-bad.jpg",
          },
        ],
        person_results: [],
        tv_episode_results: [],
        tv_season_results: [],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await findByTVDB("12345");

      expect(mockFetch).toHaveBeenCalledWith(
        "/find/12345",
        expect.objectContaining({
          external_source: "tvdb_id",
          language: "en-US",
        }),
        expect.any(Object),
      );
      expect(result?.tv_results).toHaveLength(1);
      expect(result?.tv_results[0]).toHaveProperty("name", "Breaking Bad");
    });
  });

  describe("findByFacebook", () => {
    it("should find content by Facebook ID", async () => {
      const mockResponse = {
        movie_results: [
          {
            id: 12345,
            title: "Test Movie",
            adult: false,
            poster_path: "/test.jpg",
          },
        ],
        tv_results: [],
        person_results: [],
        tv_episode_results: [],
        tv_season_results: [],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await findByFacebook("test_facebook_id");

      expect(mockFetch).toHaveBeenCalledWith(
        "/find/test_facebook_id",
        expect.objectContaining({
          external_source: "facebook_id",
          language: "en-US",
        }),
        expect.any(Object),
      );
      expect(result?.movie_results).toHaveLength(1);
    });
  });

  describe("findByInstagram", () => {
    it("should find content by Instagram ID", async () => {
      const mockResponse = {
        movie_results: [],
        tv_results: [
          {
            id: 67890,
            name: "Test TV Show",
            adult: false,
            poster_path: "/test-tv.jpg",
          },
        ],
        person_results: [],
        tv_episode_results: [],
        tv_season_results: [],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await findByInstagram("test_instagram_id");

      expect(mockFetch).toHaveBeenCalledWith(
        "/find/test_instagram_id",
        expect.objectContaining({
          external_source: "instagram_id",
          language: "en-US",
        }),
        expect.any(Object),
      );
      expect(result?.tv_results).toHaveLength(1);
    });
  });

  describe("findByTwitter", () => {
    it("should find content by Twitter ID", async () => {
      const mockResponse = {
        movie_results: [],
        tv_results: [],
        person_results: [
          {
            id: 123,
            name: "Test Person",
            adult: false,
            profile_path: "/test-person.jpg",
            known_for_department: "Acting",
            popularity: 100,
            known_for: [],
          },
        ],
        tv_episode_results: [],
        tv_season_results: [],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await findByTwitter("test_twitter_id");

      expect(mockFetch).toHaveBeenCalledWith(
        "/find/test_twitter_id",
        expect.objectContaining({
          external_source: "twitter_id",
          language: "en-US",
        }),
        expect.any(Object),
      );
      expect(result?.person_results).toHaveLength(1);
    });
  });
});
