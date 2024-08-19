import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export async function searchYoutubeVideo(query: string): Promise<string | null> {
  try {
    console.log('Searching YouTube for:', query);
    const response = await youtube.search.list({
      part: ['id'],
      q: query + ' recipe',
      type: ['video'],
      maxResults: 1,
    });

    console.log('YouTube API Response:', response.data);

    if (response.data.items && response.data.items.length > 0) {
      const videoId = response.data.items[0].id?.videoId;
      if (videoId) {
        console.log('Found YouTube video ID:', videoId);
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    console.log('No YouTube videos found');
    return null;
  } catch (error) {
    console.error('Error searching YouTube video:', error);
    return null;
  }
}