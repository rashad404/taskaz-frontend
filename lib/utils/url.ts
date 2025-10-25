/**
 * Construct the full storage URL for uploaded files
 * @param path - The relative path from storage (e.g., "avatars/xyz.jpg")
 * @returns Full URL to the storage file
 */
export function getStorageUrl(path: string | null | undefined): string {
  if (!path) return '';

  // Get the API URL and remove the /api suffix if present
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const baseUrl = apiUrl.replace(/\/api\/?$/, '');

  // Construct the storage URL
  return `${baseUrl}/storage/${path}`;
}

/**
 * Get the base URL without /api suffix
 */
export function getBaseUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  return apiUrl.replace(/\/api\/?$/, '');
}
