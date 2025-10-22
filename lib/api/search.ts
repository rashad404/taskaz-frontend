import apiClient from './client';

export interface SearchResult {
  tasks: any[];
  professionals: any[];
  categories: any[];
}

export interface SearchResponse {
  status: string;
  data: SearchResult;
  total: number;
}

export const searchApi = {
  search: async (query: string, limit = 5): Promise<SearchResponse> => {
    const response = await apiClient.get<SearchResponse>('/search', {
      params: { q: query, limit },
    });
    return response.data;
  },
};
