import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { FaCamera, FaUpload, FaUtensils, FaList, FaPrint, FaInfoCircle, FaTimes, FaSearch, FaLightbulb, FaMobileAlt, FaRobot } from 'react-icons/fa'
import RecipeCard from '../components/RecipeCard'
import LoadingIcon from '../components/LoadingIcon'
import { generateRecipeFromImage, generateRecipeFromIngredients, resizeImage, RecipeResponse } from '../utils/api'

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function Home() {
  const [showOptions, setShowOptions] = useState(false)
  const [recipeType, setRecipeType] = useState<'identify' | 'create'>('identify')
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState('')
  const [characteristics, setCharacteristics] = useState('')
  const [optionalIngredients, setOptionalIngredients] = useState('')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadRecaptcha = () => {
      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`
      script.async = true
      script.defer = true
      script.onload = () => {
        console.log('reCAPTCHA script loaded successfully')
      }
      script.onerror = () => {
        console.error('Failed to load reCAPTCHA script')
        setError('Failed to load reCAPTCHA. Please try refreshing the page.')
      }
      document.body.appendChild(script)
    }

    if (!document.querySelector('script[src^="https://www.google.com/recaptcha/api.js"]')) {
      loadRecaptcha()
    }

    if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
      console.error('NEXT_PUBLIC_GOOGLE_API_KEY is not set')
      setError('The application is not configured correctly. Please contact support.')
    }

    if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      console.error('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set')
      setError('The application is not configured correctly. Please contact support.')
    }

    return () => {
      const script = document.querySelector('script[src^="https://www.google.com/recaptcha/api.js"]')
      if (script) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handleButtonClick = (type: 'identify' | 'create') => {
    setRecipeType(type)
    setShowOptions(true)
    setRecipe(null)
    setError(null)
  }

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const scaleFactor = Math.min(1, 800 / Math.max(img.width, img.height));
          canvas.width = img.width * scaleFactor;
          canvas.height = img.height * scaleFactor;
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        setUploadedImage(compressedImage);
        setError(null);
      } catch (error) {
        console.error('Error compressing image:', error);
        setError('Failed to process image. Please try again.');
      }
    }
  }

  const handleTakePhoto = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    }
  }

  const resetApp = () => {
    setShowOptions(false)
    setRecipeType('identify')
    setRecipe(null)
    setLoading(false)
    setUploadedImage('')
    setCharacteristics('')
    setOptionalIngredients('')
    setError(null)
  }

  const executeRecaptcha = async () => {
    return new Promise((resolve, reject) => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit' }).then(resolve, reject)
        })
      } else {
        console.error('reCAPTCHA is not loaded')
        reject(new Error('reCAPTCHA is not loaded'))
      }
    })
  }

  const handleIdentifyRecipe = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await executeRecaptcha()
      const result = await generateRecipeFromImage(uploadedImage, characteristics)
      setRecipe(result)
    } catch (err) {
      console.error('Failed to identify recipe:', err)
      if (err instanceof Error) {
        setError(`Failed to identify recipe: ${err.message}`)
      } else {
        setError('Failed to identify recipe. Please try again.')
      }
    }
    setLoading(false)
  }

  const handleCreateRecipe = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await executeRecaptcha()
      const result = await generateRecipeFromIngredients(uploadedImage, optionalIngredients)
      setRecipe(result)
    } catch (err) {
      console.error('Failed to create recipe:', err)
      if (err instanceof Error) {
        setError(`Failed to create recipe: ${err.message}`)
      } else {
        setError('Failed to create recipe. Please try again.')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Recipe Lens | AI-Powered Recipe Identification and Creation</title>
        <meta name="description" content="Recipe Lens: AI-powered app that identifies dishes from photos and creates personalized recipes from ingredients. Revolutionize your cooking experience." />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="recipe identification, AI recipes, food recognition, cooking app, ingredient-based recipes" />
        <meta property="og:title" content="Recipe Lens | AI-Powered Recipe Identification and Creation" />
        <meta property="og:description" content="Recipe Lens: AI-powered app that identifies dishes from photos and creates personalized recipes from ingredients. Revolutionize your cooking experience." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://recipe-lens.com" />
        <meta property="og:image" content="https://recipe-lens.com/og-image.jpg" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="Recipe Lens Logo" width={300} height={300} />
          <h1 className="text-4xl font-bold text-center mt-4">Recipe Lens</h1>
          <p className="text-xl text-center mt-2">Transforming Photos and Ingredients into Culinary Masterpieces.</p>
        </div>

        <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">How to Use Recipe Lens</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Identify a recipe from an image or snap a photo of your ingredients to create a custom recipe.</li>
            <li>Upload an image or take a photo of your dish or ingredients.</li>
            <li>Optionally, add dish characteristics or additional ingredients.</li>
            <li>Let our AI analyze the image to identify the recipe or create a custom recipe based on the ingredients.</li>
            <li>View the detailed recipe, including ingredients, instructions, and nutritional information.</li>
          </ol>
        </section>

        {!recipe && (
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleButtonClick('identify')}
            >
              Identify Recipe from Image
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleButtonClick('create')}
            >
              Create Recipe from Ingredients
            </button>
          </div>
        )}

        {showOptions && !recipe && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col items-center">
              {!uploadedImage && (
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                  <label className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                      accept="image/*"
                      ref={fileInputRef}
                    />
                    <FaUpload className="inline-block mr-2" />
                    Upload Image
                  </label>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    onClick={handleTakePhoto}
                  >
                    <FaCamera className="inline-block mr-2" />
                    Take Photo
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    ref={cameraInputRef}
                    onChange={handleImageUpload}
                  />
                </div>
              )}
              {uploadedImage && (
                <div className="relative mb-4">
                  <Image src={uploadedImage} alt="Uploaded food" width={300} height={300} objectFit="cover" />
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    onClick={resetApp}
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
              {!recipe && (
                <>
                  <div className="w-full max-w-md mb-4">
                    {recipeType === 'identify' ? (
                      <input
                        type="text"
                        value={characteristics}
                        onChange={(e) => setCharacteristics(e.target.value)}
                        placeholder="Optional: Enter dish characteristics or flavors"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    ) : (
                      <input
                        type="text"
                        value={optionalIngredients}
                        onChange={(e) => setOptionalIngredients(e.target.value)}
                        placeholder="Optional: Enter additional ingredients"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    )}
                  </div>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    onClick={recipeType === 'identify' ? handleIdentifyRecipe : handleCreateRecipe}
                    disabled={!uploadedImage}
                  >
                    <FaSearch className="inline-block mr-2" />
                    {recipeType === 'identify' ? 'Identify Recipe' : 'Create Recipe'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center mb-8">
            <LoadingIcon />
            <p className="mt-4 text-lg font-semibold">Our AI is busy {recipeType === 'identify' ? 'identifying' : 'creating'} the recipe...</p>
          </div>
        )}

        {recipe && (
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <Image src={uploadedImage} alt="Uploaded food" width={300} height={300} objectFit="cover" />
            </div>
            <RecipeCard
              name={recipe.name}
              ingredients={recipe.ingredients}
              equipmentNeeded={recipe.equipmentNeeded || []}
              instructions={recipe.instructions}
              nutritionalInformation={recipe.nutritionalInformation}
              notes={recipe.notes}
              onClose={resetApp}
            />
          </div>
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { 
                icon: FaCamera, 
                title: "Advanced Image Recognition", 
                text: "Our cutting-edge AI technology can analyze photos of dishes or ingredients with remarkable accuracy. Simply upload an image, and Recipe Lens will identify the dish or suggest recipes based on the ingredients it detects. This feature is perfect for when you're curious about a dish you've seen or want to recreate a meal from a picture."
              },
              { 
                icon: FaRobot, 
                title: "AI-Powered Recipe Generation", 
                text: "Leveraging state-of-the-art artificial intelligence, Recipe Lens can generate unique, customized recipes tailored to your preferences and available ingredients. Our AI considers factors like flavor combinations, cooking techniques, and nutritional balance to create delicious, practical recipes just for you."
              },
              { 
                icon: FaLightbulb, 
                title: "Creative Recipe Creation", 
                text: "Stuck with a random assortment of ingredients? Let Recipe Lens spark your culinary creativity! Our AI can craft innovative recipes using the ingredients you have on hand, helping you reduce food waste and discover exciting new dishes. You can even specify dietary restrictions or preferences for truly personalized results."
              },
              { 
                icon: FaList, 
                title: "Detailed, Step-by-Step Instructions", 
                text: "Each recipe comes with clear, comprehensive instructions that guide you through the cooking process from start to finish. Whether you're a novice cook or an experienced chef, our step-by-step guide ensures you can recreate each dish with confidence. We also include tips for preparation, cooking techniques, and potential substitutions."
              },
              { 
                icon: FaInfoCircle, 
                title: "Comprehensive Nutritional Information", 
                text: "Stay informed about what you're eating with our detailed nutritional breakdown for each recipe. Recipe Lens provides information on calories, macronutrients, vitamins, and minerals, helping you make informed decisions about your meals. This feature is especially useful for those with specific dietary goals or restrictions."
              },
              { 
                icon: FaMobileAlt, 
                title: "Fully Responsive Design", 
                text: "Access Recipe Lens anytime, anywhere, on any device. Our mobile-friendly design ensures a seamless experience whether you're using a smartphone, tablet, or desktop computer. Take Recipe Lens with you to the grocery store, use it in the kitchen, or plan your meals on the go with ease."
              },
            ].map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <item.icon className="text-3xl mb-2 text-blue-500" />
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">More About the App</h2>
          
          <h3 className="text-xl font-semibold mb-2">What is Recipe Lens?</h3>
          <p className="mb-4">
            Recipe Lens is an innovative AI-powered platform that transforms how you approach cooking. Whether you're trying to identify a dish from a photo or create a recipe using ingredients you have on hand, Recipe Lens is your ultimate culinary assistant.
          </p>

          <h3 className="text-xl font-semibold mb-2">Revolutionizing Your Cooking Experience</h3>
          <p className="mb-4">
            Cooking should be an adventure, not a chore. Recipe Lens brings excitement back into your kitchen by offering tools that inspire creativity and simplify meal preparation. By combining advanced image recognition with AI-driven recipe generation, Recipe Lens empowers you to discover new dishes and make the most out of the ingredients you already have.
          </p>

          <h3 className="text-xl font-semibold mb-2">Advanced Image Recognition Technology</h3>
          <p className="mb-4">
            Our app utilizes cutting-edge image recognition technology to accurately identify dishes from photos. Simply snap a picture of a meal you've enjoyed or ingredients you want to use, and Recipe Lens will do the rest. It can detect and analyze various food elements, providing you with detailed recipes and cooking instructions based on what it sees.
          </p>

          <h3 className="text-xl font-semibold mb-2">AI-Crafted, Personalized Recipes</h3>
          <p className="mb-4">
            Not sure what to cook? Recipe Lens has you covered. By analyzing the ingredients you have on hand, our AI generates personalized recipes that cater to your preferences and dietary needs. Whether you're in the mood for something traditional or looking to try a new culinary creation, Recipe Lens delivers recipes that suit your taste.
          </p>

          <h3 className="text-xl font-semibold mb-2">Detailed Cooking Instructions and Nutritional Insights</h3>
          <p className="mb-4">
            Recipe Lens doesn't just give you a list of ingredients. It provides you with step-by-step instructions to ensure you can easily recreate any dish. Plus, every recipe comes with a comprehensive nutritional breakdown, so you can make informed choices about what you're eating.
          </p>

          <h3 className="text-xl font-semibold mb-2">The Perfect Kitchen Companion</h3>
          <p className="mb-4">
            With its user-friendly design and mobile accessibility, Recipe Lens is the perfect companion for any cook. Whether you're a seasoned chef or just starting in the kitchen, Recipe Lens offers tools and resources that make cooking more enjoyable and less stressful.
          </p>

          <h3 className="text-xl font-semibold mb-2">Discover the Endless Possibilities</h3>
          <p className="mb-4">
            With Recipe Lens, cooking becomes an exciting journey of discovery and creativity. No more wondering what to do with leftover ingredients or trying to remember that amazing dish you had at a restaurant. Recipe Lens opens up a world of culinary possibilities. Start exploring the endless potential of your kitchen today!
          </p>
        </section>
      </main>
    </div>
  )
}