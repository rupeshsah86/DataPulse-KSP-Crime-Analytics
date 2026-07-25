import api from "./api";
import { Crime } from "./crimeService";

export interface SimilarityResult {
  crime: Crime;
  similarity_score: number; // 0-100
  match_reason: string;
}

export const similarityService = {
  /**
   * Find similar crimes to a given crime
   */
  findSimilar: async (crimeId: number): Promise<SimilarityResult[]> => {
    const response = await api.get<SimilarityResult[]>(
      `/crimes/${crimeId}/similar`,
    );
    return response.data;
  },

  /**
   * Find similar crimes by keyword
   */
  findSimilarByKeyword: async (keyword: string): Promise<Crime[]> => {
    const response = await api.get<Crime[]>(
      `/crimes/similar?keyword=${keyword}`,
    );
    return response.data;
  },
};
