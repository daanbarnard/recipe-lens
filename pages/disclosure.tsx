import React from 'react';

const DisclosurePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Disclosure</h1>
      <p className="mb-4">
        At Recipe Lens, we believe in full transparency with our users. This disclosure page outlines our use of affiliate links, sponsored content, and other partnerships that help support our platform while ensuring you have access to valuable information.
      </p>

      <h2 className="text-2xl font-semibold mb-2">1. Affiliate Programs</h2>
      <p className="mb-4">
        Recipe Lens participates in affiliate marketing programs, which means that we may earn a commission if you click on certain links on our site and make a purchase. This is at no additional cost to you.
      </p>

      <h2 className="text-2xl font-semibold mb-2">2. Amazon Affiliate Program</h2>
      <p className="mb-4">
        Recipe Lens is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. We may receive a small commission from Amazon when you purchase through our links, which helps us maintain the site and continue to provide valuable content.
      </p>

      <h2 className="text-2xl font-semibold mb-2">3. Sponsored Content</h2>
      <p className="mb-4">
        From time to time, Recipe Lens may publish sponsored content. Sponsored content is paid for by a company or organization to promote their products or services. We only work with sponsors whose products and values align with our own, and we always strive to provide honest and informative content. All sponsored content will be clearly marked as such.
      </p>

      <h2 className="text-2xl font-semibold mb-2">4. Product Reviews and Recommendations</h2>
      <p className="mb-4">
        Our product reviews and recommendations are based on thorough research and our genuine belief in the quality and usefulness of the products. While we may receive commissions from sales generated through our affiliate links, this does not influence the integrity of our content. We prioritize the trust of our users and aim to provide objective, unbiased advice.
      </p>

      <h2 className="text-2xl font-semibold mb-2">5. Why We Use Affiliate Links</h2>
      <p className="mb-4">
        Affiliate links and sponsored content are ways we generate revenue to support the ongoing operation and development of Recipe Lens. This enables us to keep the service free for users while continuously improving and expanding our offerings. We appreciate your support through these links and services, as it allows us to keep providing valuable resources and information.
      </p>

      <h2 className="text-2xl font-semibold mb-2">6. Your Trust Matters</h2>
      <p className="mb-4">
        Your trust is incredibly important to us. We are committed to transparency and honesty in all our practices. If you have any questions or concerns about our use of affiliate links, sponsored content, or anything else related to how we operate, please feel free to <a href="https://recipelens.com/contact" className="text-blue-600 underline">contact us</a>.
      </p>

      <p className="mb-4">
        Thank you for supporting Recipe Lens. Your trust and engagement make it possible for us to continue to provide this service.
      </p>
    </div>
  );
};

export default DisclosurePage;