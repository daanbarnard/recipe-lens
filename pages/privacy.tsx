import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        At Recipe Lens, we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines the types of data we collect, how we use it, and the measures we take to protect your information.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
      <p className="mb-4">
        When you visit Recipe Lens, we may collect certain information about your visit and how you interact with our website. This includes:
      </p>
      <ul className="mb-4 list-disc list-inside">
        <li><strong>Usage Data:</strong> Information about how you use our website, such as pages viewed, time spent on pages, clicks, and other actions taken on the site.</li>
        <li><strong>Device Information:</strong> Details about the device you use to access our website, including your IP address, browser type, operating system, and device type.</li>
        <li><strong>Location Data:</strong> General information about your location, such as your city and country, determined through your IP address. This information is not precise and does not identify your exact location.</li>
        <li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device that help us remember your preferences and understand how you interact with our site.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">How We Use Your Information</h2>
      <p className="mb-4">
        The information we collect is used to improve our services, enhance your experience, and ensure the security of our platform. Specifically, we use your data to:
      </p>
      <ul className="mb-4 list-disc list-inside">
        <li>Analyze and understand how our users interact with Recipe Lens.</li>
        <li>Improve the functionality and content of our website.</li>
        <li>Personalize your experience by remembering your preferences.</li>
        <li>Monitor the security and performance of our platform.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">Google Analytics</h2>
      <p className="mb-4">
        We use Google Analytics to help us understand how users engage with Recipe Lens. Google Analytics collects data such as pages visited, time spent on the site, and interactions with various elements. This data is aggregated and anonymized, meaning it does not personally identify you.
      </p>
      <p className="mb-4">
        The insights we gain from Google Analytics enable us to improve our website and better serve our users. If you wish to opt out of Google Analytics tracking, you can do so by installing the Google Analytics Opt-out Browser Add-on.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Third-Party Services and Affiliates</h2>
      <p className="mb-4">
        Recipe Lens may contain links to third-party websites and services. Please note that we are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party services you use through links on our platform.
      </p>
      <p className="mb-4">
        Additionally, we may include affiliate links in our content. If you click on an affiliate link and make a purchase, we may receive a small commission at no additional cost to you. These affiliate partnerships help us maintain and improve our platform.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Your Privacy Rights</h2>
      <p className="mb-4">
        You have the right to access, correct, or delete your personal information that we hold. If you wish to exercise any of these rights or have any questions about our privacy practices, please contact us.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Changes to This Policy</h2>
      <p className="mb-4">
        We may update our Privacy Policy from time to time to reflect changes in our practices or for legal and regulatory reasons. Any changes will be posted on this page, and we encourage you to review this policy periodically to stay informed about how we are protecting your information.
      </p>

      <p className="mb-4">
        Thank you for trusting Recipe Lens. We are committed to safeguarding your privacy and ensuring a secure and positive experience on our platform.
      </p>
    </div>
  );
};

export default PrivacyPage;