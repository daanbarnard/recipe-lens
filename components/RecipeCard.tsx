import React from 'react';
import { FaPrint, FaTimes, FaWhatsapp, FaFacebookF, FaLinkedinIn, FaEnvelope, FaAmazon } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

interface RecipeCardProps {
  name: string;
  ingredients: string[];
  equipmentNeeded: string[];
  instructions: string[];
  nutritionalInformation: string[];
  notes: string[];
  onClose: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  name,
  ingredients,
  equipmentNeeded,
  instructions,
  nutritionalInformation,
  notes,
  onClose
}) => {
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
    // This regex matches numbers (including fractions) at the start of the string
    const numberRegex = /^(\d+(\s*\/\s*\d+)?(\s*-\s*\d+(\s*\/\s*\d+)?)?)/;
    const match = ingredient.match(numberRegex);
    
    if (match) {
      const number = match[0];
      const restOfIngredient = ingredient.slice(number.length).trim();
      return `${number} ${restOfIngredient}`;
    }
    
    return ingredient;
  };

  const getAmazonSearchUrl = (item: string): string => {
    const searchQuery = encodeURIComponent(item);
    return `https://www.amazon.com/s?k=${searchQuery}&tag=recipelens-20`;
  };

  const renderList = (items: string[], type: 'bullet' | 'number' | 'none', isEquipment: boolean = false, isIngredient: boolean = false) => (
    items && items.length > 0 ? (
      <ul className={`pl-5 ${type === 'bullet' ? 'list-disc' : type === 'number' ? 'list-decimal' : ''}`}>
        {items.map((item, index) => (
          <li key={index} className="mb-2">
            {isEquipment ? (
              <a href={getAmazonSearchUrl(cleanText(item))} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {cleanText(item)}
              </a>
            ) : isIngredient ? (
              formatIngredient(item)
            ) : (
              cleanText(item)
            )}
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
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
          {renderList(ingredients, 'bullet', false, true)}
          <a
            href="https://amzn.to/3YLQiGD"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            <FaAmazon className="mr-2" />
            Shop on Amazon Fresh
          </a>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Equipment Needed</h2>
          {renderList(equipmentNeeded, 'none', true)}
          <a
            href="https://amzn.to/3WRQTUH"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            <FaAmazon className="mr-2" />
            Shop Kitchen Supplies
          </a>
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
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          onClick={handlePrint}
        >
          <FaPrint className="mr-2" />
          Print Recipe
        </button>
        <div className="flex flex-col items-center space-y-2">
          <h3 className="font-semibold">Share Recipe Lens with Friends!</h3>
          <div className="flex space-x-2">
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