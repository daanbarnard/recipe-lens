import { NextApiRequest, NextApiResponse } from 'next';
import { searchYoutubeVideo } from '../../utils/youtube';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required and must be a string' });
    }

    try {
      const videoUrl = await searchYoutubeVideo(query);
      res.status(200).json({ videoUrl });
    } catch (error) {
      console.error('Error searching YouTube video:', error);
      res.status(500).json({ error: 'Error searching YouTube video' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}