import React, { useState, useEffect } from 'react';
import { FaPrint, FaTimes, FaWhatsapp, FaFacebookF, FaLinkedinIn, FaEnvelope, FaAmazon, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';

interface AmazonProduct {
  ASIN: string;
  DetailPageURL: string;
  Images: { Primary: { Medium: { URL: string } } };
  ItemInfo: { Title: { DisplayValue: string } };
  Offers: { Listings: [{ Price: { DisplayAmount: string } }] };
}

interface EquipmentProducts {
  [key: string]: AmazonProduct[];
}

interface RecipeCardProps {
  name: string;
  ingredients: string[];
  equipmentNeeded: string[];
  instructions: string[];
  nutritionalInformation: string[];
  notes: string[];
  youtubeVideoId?: string;
  onClose: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  name,
  ingredients,
  equipmentNeeded,
  instructions,
  nutritionalInformation,
  notes,
  youtubeVideoId,
  onClose
}) => {
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState<string | null>(null);
  const [amazonProducts, setAmazonProducts] = useState<EquipmentProducts>({});
  const [amazonError, setAmazonError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (youtubeVideoId) {
      setYoutubeVideoUrl(`https://www.youtube.com/embed/${youtubeVideoId}`);
    } else {
      const fetchYoutubeVideo = async () => {
        try {
          const response = await fetch(`/api/youtube?query=${encodeURIComponent(name)}`);
          if (response.ok) {
            const data = await response.json();
            setYoutubeVideoUrl(data.videoUrl);
          }
        } catch (error) {
          console.error('Error fetching YouTube video:', error);
        }
      };

      fetchYoutubeVideo();
    }

    const fetchAmazonProducts = async (item: string): Promise<AmazonProduct[]> => {
      try {
        const searchQuery = item.split(' ').slice(0, 2).join(' '); // Use only the first two words
        console.log(`Fetching Amazon products for: ${searchQuery}`);
        const response = await fetch(`/api/amazon-products?query=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          console.log(`Amazon products for ${searchQuery}:`, data);
          return data;
        } else {
          const errorData = await response.json();
          console.error(`Error response for ${searchQuery}:`, errorData);
          throw new Error(errorData.error || 'Failed to fetch Amazon products');
        }
      } catch (error) {
        console.error(`Error fetching Amazon products for ${item}:`, error);
        setAmazonError(`Error fetching Amazon products: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return [];
      }
    };

    const fetchAllAmazonProducts = async () => {
      setAmazonError(null);
      const productsMap: EquipmentProducts = {};
      for (const item of equipmentNeeded) {
        const products = await fetchAmazonProducts(item);
        if (products.length > 0) {
          productsMap[item] = products;
          setCurrentSlide(prev => ({ ...prev, [item]: 0 }));
        }
      }
      setAmazonProducts(productsMap);
      if (Object.keys(productsMap).length === 0 && !amazonError) {
        setAmazonError('Unable to fetch product recommendations. Please try again later.');
      }
    };

    fetchAllAmazonProducts();
  }, [name, youtubeVideoId, equipmentNeeded]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${cleanText(name)}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              h1 { font-size: 24px; text-align: center; }
              h2 { font-size: 20px; margin-top: 20px; }
              ul { padding-left: 20px; }
              li { margin-bottom: 5px; }
            </style>
          </head>
          <body>
            ${document.querySelector('.recipe-card-content')?.innerHTML || ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const cleanText = (text: string | undefined | null): string => {
    if (text == null) return '';
    return text.replace(/^[#\d*]+\.?\s*/, '').trim();
  };

  const formatIngredient = (ingredient: string): string => {
    const numberRegex = /^(\d+(\s*\/\s*\d+)?(\s*-\s*\d+(\s*\/\s*\d+)?)?)/;
    const match = ingredient.match(numberRegex);
    
    if (match) {
      const number = match[0];
      const restOfIngredient = ingredient.slice(number.length).trim();
      return `${number} ${restOfIngredient}`;
    }
    
    return ingredient;
  };

  const renderList = (items: string[], type: 'bullet' | 'number' | 'none', isIngredient: boolean = false) => (
    items && items.length > 0 ? (
      <ul className={`pl-5 ${type === 'bullet' ? 'list-disc' : type === 'number' ? 'list-decimal' : ''}`}>
        {items.map((item, index) => (
          <li key={index} className="mb-2">
            {isIngredient ? formatIngredient(item) : cleanText(item)}
          </li>
        ))}
      </ul>
    ) : null
  );

  const renderDetailedInstructions = (instructions: string[]) => (
    instructions && instructions.length > 0 ? (
      <div className="space-y-4">
        {instructions.map((instruction, index) => (
          <div key={index} className="mb-4">
            <p className="font-semibold mb-1">Step {index + 1}:</p>
            <p>{cleanText(instruction)}</p>
            {index < instructions.length - 1 && (
              <p className="mt-2 text-sm text-gray-600">
                Tip: Prepare for the next step while this one is in progress, if possible.
              </p>
            )}
          </div>
        ))}
      </div>
    ) : null
  );

  const handlePrevSlide = (equipment: string) => {
    setCurrentSlide(prev => ({
      ...prev,
      [equipment]: (prev[equipment] - 1 + amazonProducts[equipment].length) % amazonProducts[equipment].length
    }));
  };

  const handleNextSlide = (equipment: string) => {
    setCurrentSlide(prev => ({
      ...prev,
      [equipment]: (prev[equipment] + 1) % amazonProducts[equipment].length
    }));
  };

  const renderAmazonProducts = () => (
    <div className="space-y-6">
      {Object.entries(amazonProducts).map(([equipment, products]) => (
        <div key={equipment} className="border rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-2">{equipment}</h4>
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentSlide[equipment] * 100}%)` }}>
                {products.map((product, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <div className="border rounded-lg p-4 flex flex-col items-center">
                      <Image
                        src={product.Images.Primary.Medium.URL}
                        alt={product.ItemInfo.Title.DisplayValue}
                        width={100}
                        height={100}
                        objectFit="contain"
                      />
                      <h3 className="text-sm font-semibold mt-2 text-center">{product.ItemInfo.Title.DisplayValue}</h3>
                      <p className="text-lg font-bold mt-1">{product.Offers.Listings[0].Price.DisplayAmount}</p>
                      <a
                        href={product.DetailPageURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                      >
                        <FaAmazon className="mr-2" />
                        View on Amazon
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {products.length > 1 && (
              <>
                <button
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2"
                  onClick={() => handlePrevSlide(equipment)}
                >
                  <FaChevronLeft />
                </button>
                <button
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2"
                  onClick={() => handleNextSlide(equipment)}
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderBuyIngredientsButton = () => (
    <div className="flex justify-center mt-4">
      <a
        href="https://amzn.to/4dHwfxy"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        <FaAmazon className="mr-2" />
        Buy Ingredients on Amazon Fresh
      </a>
    </div>
  );

  const shareText = "Turn your photos into recipes with Recipe Lens! Snap a picture of your dish or ingredients, and our AI will create a delicious, personalized recipe for you. Explore culinary creativity at RecipeLens.com!";
  const shareUrl = "https://RecipeLens.com";

  const shareLinks = [
    { icon: FaWhatsapp, url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, color: 'bg-green-500' },
    { icon: FaXTwitter, url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, color: 'bg-black' },
    { icon: FaFacebookF, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, color: 'bg-blue-600' },
    { icon: FaLinkedinIn, url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent('Recipe Lens')}&summary=${encodeURIComponent(shareText)}`, color: 'bg-blue-700' },
    { icon: FaEnvelope, url: `mailto:?subject=${encodeURIComponent('Check out Recipe Lens!')}&body=${encodeURIComponent(shareText + ' ' + shareUrl)}`, color: 'bg-red-500' },
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 max-w-2xl mx-auto">
      <div className="recipe-card-content">
        <h1 className="text-3xl font-bold mb-4 text-center">{cleanText(name)}</h1>
        
        <div className="flex justify-center mb-6">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            onClick={handlePrint}
          >
            <FaPrint className="mr-2" />
            Print Recipe
          </button>
        </div>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
          {renderList(ingredients, 'bullet', true)}
          {renderBuyIngredientsButton()}
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Equipment Needed</h2>
          {renderList(equipmentNeeded, 'none')}
          {amazonError && <p className="text-yellow-500 mt-2">{amazonError}</p>}
          {Object.keys(amazonProducts).length > 0 && (
            <>
              <h3 className="text-xl font-semibold mt-4 mb-2">Recommended Products</h3>
              {renderAmazonProducts()}
            </>
          )}
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
          {renderDetailedInstructions(instructions)}
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Nutritional Information</h2>
          {renderList(nutritionalInformation, 'none')}
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Notes</h2>
          {renderList(notes, 'bullet')}
        </section>

        {youtubeVideoUrl && (
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Video Tutorial</h2>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={youtubeVideoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
          </section>
        )}
      </div>

      <div className="flex flex-col items-center space-y-4">
        <h3 className="font-semibold">Share Recipe Lens with Friends!</h3>
        <div className="flex justify-center space-x-2">
          {shareLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${link.color} hover:opacity-80 text-white rounded-full p-2`}
            >
              <link.icon />
            </a>
          ))}
        </div>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          onClick={onClose}
        >
          <FaTimes className="mr-2" />
          Close
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;