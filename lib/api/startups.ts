import apiClient from './client';

export interface Startup {
  name: string;
  url: string;
  tagline: string;
}

export interface StartupsResponse {
  success: boolean;
  data: Startup[];
  count: number;
}

/**
 * Fetch all startups for cross-promotion
 */
export const fetchStartups = async (): Promise<Startup[]> => {
  try {
    const response = await apiClient.get<StartupsResponse>('/startups');
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch startups:', error);
    return [];
  }
};

/**
 * Fetch limited number of startups
 */
export const fetchStartupsLimited = async (limit: number = 3): Promise<Startup[]> => {
  try {
    const response = await apiClient.get<StartupsResponse>(`/startups/limited/${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch startups:', error);
    return [];
  }
};

/**
 * Clear startups cache
 */
export const clearStartupsCache = async (): Promise<boolean> => {
  try {
    await apiClient.post('/startups/clear-cache');
    return true;
  } catch (error) {
    console.error('Failed to clear startups cache:', error);
    return false;
  }
};
