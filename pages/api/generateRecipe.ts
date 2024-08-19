import { NextApiRequest, NextApiResponse } from 'next';
import { generateRecipeFromImage, generateRecipeFromIngredients } from '../../utils/api';
import axios from 'axios';

const cleanText = (text: string) => text.replace(/^\d+\.\s*/, '').replace(/^\*\s*/, '').trim();

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;

  try {
    const response = await axios.post(verifyUrl);
    return response.data.success;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { type, data, recaptchaToken } = req.body;

    console.log(`Received ${type} request`);

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      console.error('reCAPTCHA verification failed');
      return res.status(400).json({ error: 'reCAPTCHA verification failed' });
    }

    try {
      let recipe;
      if (type === 'image') {
        console.log('Generating recipe from image');
        recipe = await generateRecipeFromImage(data);
      } else if (type === 'ingredients') {
        console.log('Generating recipe from ingredients:', data);
        recipe = await generateRecipeFromIngredients(data.split(',').map((i: string) => i.trim()));
      } else {
        throw new Error('Invalid request type');
      }

      // Clean up and structure the recipe data
      const cleanedRecipe = {
        name: '',
        ingredients: [],
        equipmentNeeded: [],
        instructions: [],
        nutritionalInformation: [],
        notes: []
      };

      // Extract name
      cleanedRecipe.name = cleanText(recipe.name);

      // Process ingredients
      cleanedRecipe.ingredients = recipe.ingredients.map(cleanText).filter(item => item !== '');

      // Process equipment needed
      cleanedRecipe.equipmentNeeded = recipe.equipmentNeeded.map(cleanText).filter(item => item !== '');

      // Process instructions
      cleanedRecipe.instructions = recipe.instructions.map(cleanText).filter(item => item !== '');

      // Process nutritional information
      cleanedRecipe.nutritionalInformation = recipe.nutritionalInformation.map(cleanText).filter(item => item !== '');

      // Process notes
      cleanedRecipe.notes = recipe.notes.map(cleanText).filter(item => item !== '');

      console.log('Recipe generated and cleaned successfully:', cleanedRecipe);
      res.status(200).json(cleanedRecipe);
    } catch (error) {
      console.error('Error generating recipe:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      res.status(500).json({ error: 'Failed to generate recipe' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}