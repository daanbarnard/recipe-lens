import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyB3e0sHxN5auQwt17bEtGldd-ArJJkWI3I';
const GOOGLE_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const requestBody = {
        contents: [
          {
            parts: [
              { text: "Generate a simple recipe for pancakes." }
            ]
          }
        ]
      };

      const response = await axios.post(
        GOOGLE_API_ENDPOINT,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GOOGLE_API_KEY}`,
          },
        }
      );

      res.status(200).json({ success: true, data: response.data });
    } catch (error) {
      console.error('Error testing Gemini API:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
        console.error('Error response status:', error.response?.status);
        console.error('Error response headers:', error.response?.headers);
      }
      res.status(500).json({ success: false, error: 'Failed to test Gemini API' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}