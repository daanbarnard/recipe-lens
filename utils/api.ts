import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

if (!API_KEY) {
  console.warn('NEXT_PUBLIC_GOOGLE_API_KEY is not set in the environment variables');
}

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

try {
  genAI = new GoogleGenerativeAI(API_KEY || '');
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
} catch (error) {
  console.error('Error initializing Google Generative AI:', error);
}

export interface RecipeResponse {
  name: string;
  ingredients: string[];
  instructions: string[];
  equipmentNeeded: string[];
  nutritionalInformation: string[];
  notes: string[];
}

async function generateRecipe(prompt: string, imagePart?: any): Promise<RecipeResponse> {
  if (!API_KEY) {
    throw new Error('NEXT_PUBLIC_GOOGLE_API_KEY is not set in the environment variables');
  }

  if (!genAI || !model) {
    throw new Error('Google Generative AI is not initialized');
  }

  try {
    const result = await model.generateContent(imagePart ? [prompt, imagePart] : prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Generated text is empty');
    }

    return parseRecipeResponse(text);
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw new Error('Failed to generate recipe. Please try again.');
  }
}

export async function generateRecipeFromImage(imageBase64: string, characteristics: string = ''): Promise<RecipeResponse> {
  try {
    let prompt = `Analyze the following image and provide a detailed recipe based on the food shown.`;
    
    if (characteristics) {
      prompt += ` Consider these additional characteristics or flavors: ${characteristics}.`;
    }
    
    prompt += ` Format the recipe EXACTLY as follows:

Recipe Name

Ingredients:
- [List ingredients]

Instructions:
1. [List instructions]

Equipment Needed:
- [List equipment]

Nutritional Information:
- [List nutritional info]

Notes:
- [List notes]

Use ONLY these exact section titles. Do not add any extra text or sections.`;

    const imagePart = {
      inlineData: {
        data: imageBase64.split(',')[1],
        mimeType: "image/jpeg"
      }
    };

    return await generateRecipe(prompt, imagePart);
  } catch (error) {
    console.error('Error generating recipe from image:', error);
    throw new Error('Failed to generate recipe from image. Please try again.');
  }
}

export async function generateRecipeFromIngredients(imageBase64: string, optionalIngredients: string = ''): Promise<RecipeResponse> {
  try {
    let prompt = `I have the ingredients in the image. Not sure what to cook or make, create a recipe for me from the ingredients in the image.`;
    
    if (optionalIngredients) {
      prompt += ` Also consider these additional ingredients: ${optionalIngredients}.`;
    }
    
    prompt += ` Format the recipe EXACTLY as follows:

Recipe Name

Ingredients:
- [List ingredients]

Instructions:
1. [List instructions]

Equipment Needed:
- [List equipment]

Nutritional Information:
- [List nutritional info]

Notes:
- [List notes]

Use ONLY these exact section titles. Do not add any extra text or sections.`;

    const imagePart = {
      inlineData: {
        data: imageBase64.split(',')[1],
        mimeType: "image/jpeg"
      }
    };

    return await generateRecipe(prompt, imagePart);
  } catch (error) {
    console.error('Error generating recipe from ingredients:', error);
    throw new Error('Failed to generate recipe from ingredients. Please try again.');
  }
}

function parseRecipeResponse(generatedText: string): RecipeResponse {
  const sections = generatedText.split('\n\n');
  const recipe: RecipeResponse = {
    name: '',
    ingredients: [],
    instructions: [],
    equipmentNeeded: [],
    nutritionalInformation: [],
    notes: []
  };

  sections.forEach(section => {
    const [title, ...content] = section.split('\n');
    const cleanContent = content.map(line => line.replace(/^[-\d]+\.?\s*/, '').trim()).filter(Boolean);

    switch (title.toLowerCase().replace(':', '').trim()) {
      case 'ingredients':
        recipe.ingredients = cleanContent;
        break;
      case 'instructions':
        recipe.instructions = cleanContent;
        break;
      case 'equipment needed':
        recipe.equipmentNeeded = cleanContent;
        break;
      case 'nutritional information':
        recipe.nutritionalInformation = cleanContent;
        break;
      case 'notes':
        recipe.notes = cleanContent;
        break;
      default:
        if (!recipe.name) {
          recipe.name = title.trim();
        }
    }
  });

  return recipe;
}

export function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxWidth = 800;
        const maxHeight = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(resizedDataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
