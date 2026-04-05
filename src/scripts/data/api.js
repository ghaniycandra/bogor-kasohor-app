import CONFIG from '../config';

const ENDPOINTS = {
  ENDPOINT: `${CONFIG.BASE_URL}/your/endpoint/here`,
};

export async function getData() {
  const fetchResponse = await fetch(ENDPOINTS.ENDPOINT);
  return await fetchResponse.json();
}

export class StoryApi {
  static async getAllStories(token) {
    const response = await fetch('https://story-api.dicoding.dev/v1/stories?location=1', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  }
}
