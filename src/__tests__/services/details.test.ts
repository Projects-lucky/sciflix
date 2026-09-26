import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getMovieCredits,
  getMovieDetails,
  getMovieWithCredits,
  getMultipleMovieDetails,
  getPersonDetails,
  getPersonWithCredits,
  getTVCredits,
  getTVDetails,
  getTVWithCredits,
} from "@/lib/services/tmdb/routes/details.ts";

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

describe("Details Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getMovieDetails", () => {
    it("should fetch movie details by ID", async () => {
      const mockResponse = {
        id: 12345,
        title: "Test Movie",
        adult: false,
        backdrop_path: "/test-backdrop.jpg",
        poster_path: "/test-poster.jpg",
        overview: "Test movie overview",
        popularity: 100,
        vote_average: 8.5,
        vote_count: 1000,
        release_date: "2024-01-01",
        original_title: "Test Movie Original",
        original_language: "en",
        genre_ids: [28, 12],
        video: false,
        budget: 100000000,
        revenue: 500000000,
        runtime: 120,
        status: "Released",
        tagline: "Test tagline",
        homepage: "https://testmovie.com",
        imdb_id: "tt1234567",
        belongs_to_collection: null,
        genres: [
          { id: 28, name: "Action" },
          { id: 12, name: "Adventure" },
        ],
        production_companies: [
          { id: 1, name: "Test Studio", logo_path: null, origin_country: "US" },
        ],
        production_countries: [{ iso_3166_1: "US", name: "United States" }],
        spoken_languages: [
          { english_name: "English", iso_639_1: "en", name: "English" },
        ],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getMovieDetails(12345);

      expect(mockFetch).toHaveBeenCalledWith(
        "/movie/12345",
        expect.objectContaining({
          language: "en-US",
        }),
        expect.any(Object),
      );
      expect(result).toEqual(mockResponse);
      expect(result?.id).toBe(12345);
      expect(result?.title).toBe("Test Movie");
    });

    it("should include append_to_response when provided", async () => {
      const mockResponse = {
        id: 12345,
        title: "Test Movie",
        adult: false,
        poster_path: "/test-poster.jpg",
        credits: {
          id: 12345,
          cast: [
            {
              id: 1,
              name: "Actor 1",
              character: "Character 1",
              profile_path: "/actor1.jpg",
              adult: false,
              gender: 1,
              known_for_department: "Acting",
              original_name: "Actor 1",
              popularity: 100,
              cast_id: 1,
              credit_id: "credit1",
              order: 0,
            },
          ],
          crew: [],
        },
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getMovieDetails(12345, {
        append_to_response: "credits",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "/movie/12345",
        expect.objectContaining({
          language: "en-US",
          append_to_response: "credits",
        }),
        expect.any(Object),
      );
      expect(result?.credits).toBeDefined();
      expect(result?.credits?.cast).toHaveLength(1);
    });

    it("should handle language parameter", async () => {
      const mockResponse = {
        id: 12345,
        title: "Test Movie",
        adult: false,
        poster_path: "/test-poster.jpg",
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getMovieDetails(12345, { language: "fr-FR" });

      expect(mockFetch).toHaveBeenCalledWith(
        "/movie/12345",
        expect.objectContaining({
          language: "fr-FR",
        }),
        expect.any(Object),
      );
      expect(result).toBeDefined();
    });

    it("should return null when API fails", async () => {
      mockFetch.mockRejectedValue(new Error("API Error"));

      const result = await getMovieDetails(12345);

      expect(result).toBeNull();
    });
  });

  describe("getMovieCredits", () => {
    it("should fetch movie credits by ID", async () => {
      const mockResponse = {
        id: 12345,
        cast: [
          {
            id: 1,
            name: "Actor 1",
            character: "Character 1",
            profile_path: "/actor1.jpg",
            adult: false,
            gender: 1,
            known_for_department: "Acting",
            original_name: "Actor 1",
            popularity: 100,
            cast_id: 1,
            credit_id: "credit1",
            order: 0,
          },
          {
            id: 2,
            name: "Actor 2",
            character: "Character 2",
            profile_path: "/actor2.jpg",
            adult: false,
            gender: 2,
            known_for_department: "Acting",
            original_name: "Actor 2",
            popularity: 90,
            cast_id: 2,
            credit_id: "credit2",
            order: 1,
          },
        ],
        crew: [
          {
            id: 3,
            name: "Director 1",
            job: "Director",
            department: "Directing",
            profile_path: "/director1.jpg",
            adult: false,
            gender: 1,
            known_for_department: "Directing",
            original_name: "Director 1",
            popularity: 80,
            credit_id: "credit3",
          },
        ],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getMovieCredits(12345);

      expect(mockFetch).toHaveBeenCalledWith(
        "/movie/12345/credits",
        expect.objectContaining({
          language: "en-US",
        }),
        expect.any(Object),
      );
      expect(result?.cast).toHaveLength(2);
      expect(result?.crew).toHaveLength(1);
      expect(result?.cast[0]).toHaveProperty("name", "Actor 1");
      expect(result?.cast[1]).toHaveProperty("name", "Actor 2");
      expect(result?.crew[0]).toHaveProperty("name", "Director 1");
    });

    it("should return null when API fails", async () => {
      mockFetch.mockRejectedValue(new Error("API Error"));

      const result = await getMovieCredits(12345);

      expect(result).toBeNull();
    });
  });

  describe("getMovieWithCredits", () => {
    it("should fetch movie with credits in one call", async () => {
      const mockResponse = {
        id: 12345,
        title: "Test Movie",
        adult: false,
        poster_path: "/test-poster.jpg",
        credits: {
          id: 12345,
          cast: [
            {
              id: 1,
              name: "Actor 1",
              character: "Character 1",
              profile_path: "/actor1.jpg",
              adult: false,
              gender: 1,
              known_for_department: "Acting",
              original_name: "Actor 1",
              popularity: 100,
              cast_id: 1,
              credit_id: "credit1",
              order: 0,
            },
          ],
          crew: [
            {
              id: 2,
              name: "Director 1",
              job: "Director",
              department: "Directing",
              profile_path: "/director1.jpg",
              adult: false,
              gender: 1,
              known_for_department: "Directing",
              original_name: "Director 1",
              popularity: 80,
              credit_id: "credit2",
            },
          ],
        },
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getMovieWithCredits(12345);

      expect(mockFetch).toHaveBeenCalledWith(
        "/movie/12345",
        expect.objectContaining({
          language: "en-US",
          append_to_response: "credits",
        }),
        expect.any(Object),
      );
      expect(result?.id).toBe(12345);
      expect(result?.title).toBe("Test Movie");
      expect(result?.credits).toBeDefined();
      expect(result?.credits?.cast).toHaveLength(1);
      expect(result?.credits?.crew).toHaveLength(1);
    });

    it("should return null when credits are missing", async () => {
      const mockResponse = {
        id: 12345,
        title: "Test Movie",
        adult: false,
        poster_path: "/test-poster.jpg",
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getMovieWithCredits(12345);

      expect(result).toBeNull();
    });
  });

  describe("getTVDetails", () => {
    it("should fetch TV details by ID", async () => {
      const mockResponse = {
        id: 67890,
        name: "Test TV Show",
        adult: false,
        backdrop_path: "/test-tv-backdrop.jpg",
        poster_path: "/test-tv-poster.jpg",
        overview: "Test TV overview",
        popularity: 100,
        vote_average: 8.5,
        vote_count: 1000,
        first_air_date: "2024-01-01",
        original_name: "Test TV Show Original",
        original_language: "en",
        genre_ids: [18, 35],
        origin_country: ["US"],
        number_of_episodes: 10,
        number_of_seasons: 1,
        status: "Ended",
        tagline: "Test TV tagline",
        homepage: "https://testtvshow.com",
        in_production: false,
        episode_run_time: [60],
        languages: ["en"],
        last_air_date: "2024-01-10",
        created_by: [
          {
            id: 1,
            credit_id: "credit1",
            name: "Creator 1",
            gender: 1,
            profile_path: "/creator1.jpg",
          },
        ],
        genres: [
          { id: 18, name: "Drama" },
          { id: 35, name: "Comedy" },
        ],
        networks: [
          {
            id: 1,
            name: "Test Network",
            logo_path: "/network.jpg",
            origin_country: "US",
          },
        ],
        production_companies: [
          { id: 1, name: "Test Studio", logo_path: null, origin_country: "US" },
        ],
        production_countries: [{ iso_3166_1: "US", name: "United States" }],
        seasons: [
          {
            air_date: "2024-01-01",
            episode_count: 10,
            id: 1,
            name: "Season 1",
            overview: "Season 1 overview",
            poster_path: "/season1.jpg",
            season_number: 1,
            vote_average: 8.5,
          },
        ],
        spoken_languages: [
          { english_name: "English", iso_639_1: "en", name: "English" },
        ],
        type: "Scripted",
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getTVDetails(67890);

      expect(mockFetch).toHaveBeenCalledWith(
        "/tv/67890",
        expect.objectContaining({
          language: "en-US",
        }),
        expect.any(Object),
      );
      expect(result?.id).toBe(67890);
      expect(result?.name).toBe("Test TV Show");
      expect(result?.number_of_seasons).toBe(1);
      expect(result?.number_of_episodes).toBe(10);
    });

    it("should return null when API fails", async () => {
      mockFetch.mockRejectedValue(new Error("API Error"));

      const result = await getTVDetails(67890);

      expect(result).toBeNull();
    });
  });

  describe("getTVCredits", () => {
    it("should fetch TV credits by ID", async () => {
      const mockResponse = {
        id: 67890,
        cast: [
          {
            id: 1,
            name: "TV Actor 1",
            character: "Character 1",
            profile_path: "/tv-actor1.jpg",
            adult: false,
            gender: 1,
            known_for_department: "Acting",
            original_name: "TV Actor 1",
            popularity: 100,
            cast_id: 1,
            credit_id: "credit1",
            order: 0,
          },
        ],
        crew: [
          {
            id: 2,
            name: "TV Director 1",
            job: "Director",
            department: "Directing",
            profile_path: "/tv-director1.jpg",
            adult: false,
            gender: 1,
            known_for_department: "Directing",
            original_name: "TV Director 1",
            popularity: 80,
            credit_id: "credit2",
          },
        ],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getTVCredits(67890);

      expect(mockFetch).toHaveBeenCalledWith(
        "/tv/67890/credits",
        expect.objectContaining({
          language: "en-US",
        }),
        expect.any(Object),
      );
      expect(result?.cast).toHaveLength(1);
      expect(result?.crew).toHaveLength(1);
    });
  });

  describe("getTVWithCredits", () => {
    it("should fetch TV with credits in one call", async () => {
      const mockResponse = {
        id: 67890,
        name: "Test TV Show",
        adult: false,
        poster_path: "/test-tv-poster.jpg",
        credits: {
          id: 67890,
          cast: [
            {
              id: 1,
              name: "TV Actor 1",
              character: "Character 1",
              profile_path: "/tv-actor1.jpg",
              adult: false,
              gender: 1,
              known_for_department: "Acting",
              original_name: "TV Actor 1",
              popularity: 100,
              cast_id: 1,
              credit_id: "credit1",
              order: 0,
            },
          ],
          crew: [],
        },
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getTVWithCredits(67890);

      expect(mockFetch).toHaveBeenCalledWith(
        "/tv/67890",
        expect.objectContaining({
          language: "en-US",
          append_to_response: "credits",
        }),
        expect.any(Object),
      );
      expect(result?.id).toBe(67890);
      expect(result?.name).toBe("Test TV Show");
      expect(result?.credits).toBeDefined();
    });

    it("should return null when credits are missing", async () => {
      const mockResponse = {
        id: 67890,
        name: "Test TV Show",
        adult: false,
        poster_path: "/test-tv-poster.jpg",
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getTVWithCredits(67890);

      expect(result).toBeNull();
    });
  });

  describe("getPersonDetails", () => {
    it("should fetch person details by ID", async () => {
      const mockResponse = {
        id: 123,
        name: "Test Person",
        adult: false,
        gender: 1,
        profile_path: "/test-person.jpg",
        biography: "Test biography",
        birthday: "1990-01-01",
        deathday: null,
        homepage: null,
        imdb_id: "nm1234567",
        place_of_birth: "Test City",
        known_for_department: "Acting",
        popularity: 100,
        also_known_as: ["Test Person AKA"],
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getPersonDetails(123);

      expect(mockFetch).toHaveBeenCalledWith(
        "/person/123",
        expect.objectContaining({
          language: "en-US",
        }),
        expect.any(Object),
      );
      expect(result?.id).toBe(123);
      expect(result?.name).toBe("Test Person");
      expect(result?.biography).toBe("Test biography");
    });

    it("should fetch person with movie credits", async () => {
      const mockResponse = {
        id: 123,
        name: "Test Person",
        adult: false,
        gender: 1,
        profile_path: "/test-person.jpg",
        biography: "Test biography",
        movie_credits: {
          cast: [
            {
              id: 1,
              title: "Movie 1",
              character: "Character 1",
              poster_path: "/movie1.jpg",
              adult: false,
              genre_ids: [28],
              original_title: "Movie 1",
              original_language: "en",
              overview: "Overview 1",
              popularity: 100,
              vote_average: 8.5,
              vote_count: 1000,
              release_date: "2024-01-01",
              video: false,
            },
          ],
          crew: [],
        },
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getPersonWithCredits(123);

      expect(mockFetch).toHaveBeenCalledWith(
        "/person/123",
        expect.objectContaining({
          language: "en-US",
          append_to_response: "movie_credits",
        }),
        expect.any(Object),
      );
      expect(result?.id).toBe(123);
      expect(result?.name).toBe("Test Person");
      expect(result?.movie_credits).toBeDefined();
    });
  });

  describe("getMultipleMovieDetails", () => {
    it("should fetch multiple movie details in parallel", async () => {
      const mockResponse1 = {
        id: 1,
        title: "Movie 1",
        adult: false,
        poster_path: "/movie1.jpg",
      };
      const mockResponse2 = {
        id: 2,
        title: "Movie 2",
        adult: false,
        poster_path: "/movie2.jpg",
      };

      mockFetch
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);

      const result = await getMultipleMovieDetails([1, 2]);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 1, data: mockResponse1 });
      expect(result[1]).toEqual({ id: 2, data: mockResponse2 });
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it("should handle partial failures gracefully", async () => {
      const mockResponse1 = {
        id: 1,
        title: "Movie 1",
        adult: false,
        poster_path: "/movie1.jpg",
      };

      mockFetch
        .mockResolvedValueOnce(mockResponse1)
        .mockRejectedValueOnce(new Error("API Error"));

      const result = await getMultipleMovieDetails([1, 2]);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 1, data: mockResponse1 });
      expect(result[1]).toEqual({ id: 2, data: null });
    });

    it("should handle all failures gracefully", async () => {
      mockFetch.mockRejectedValue(new Error("API Error"));

      const result = await getMultipleMovieDetails([1, 2, 3]);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ id: 1, data: null });
      expect(result[1]).toEqual({ id: 2, data: null });
      expect(result[2]).toEqual({ id: 3, data: null });
    });
  });
});
