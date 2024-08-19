import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4">
        Welcome to Recipe Lens. By accessing or using our platform, you agree to be bound by the following terms and conditions. If you do not agree to these terms, please refrain from using our service.
      </p>

      <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
      <p className="mb-4">
        By accessing and using Recipe Lens, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service, along with our Privacy Policy and any additional terms and conditions that may apply to specific sections of the site or services offered by us.
      </p>

      <h2 className="text-2xl font-semibold mb-2">2. Changes to Terms</h2>
      <p className="mb-4">
        We reserve the right to modify these terms at any time. Any changes will be posted on this page, and your continued use of Recipe Lens after such changes are posted constitutes your agreement to the modified terms. We encourage you to review these terms periodically.
      </p>

      <h2 className="text-2xl font-semibold mb-2">3. Use of Services</h2>
      <p className="mb-4">
        Recipe Lens grants you a non-exclusive, non-transferable, limited right to access and use the platform for personal, non-commercial purposes. You agree to use the service only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the platform.
      </p>

      <h2 className="text-2xl font-semibold mb-2">4. User Responsibilities</h2>
      <p className="mb-4">
        You are responsible for maintaining the confidentiality of your account information, including your password, and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
      </p>
      <ul className="mb-4 list-disc list-inside">
        <li>Use Recipe Lens in any way that may lead to the encouragement, procurement, or carrying out of any criminal or unlawful activity.</li>
        <li>Transmit or distribute any viruses, malware, or other harmful software through the platform.</li>
        <li>Attempt to gain unauthorized access to our systems or networks.</li>
        <li>Use the platform in any manner that could damage, disable, overburden, or impair the service or interfere with any other party's use of the platform.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">5. Intellectual Property</h2>
      <p className="mb-4">
        All content, design, text, graphics, logos, icons, images, and software on Recipe Lens are the property of Recipe Lens or its content suppliers and are protected by international copyright laws. You may not reproduce, distribute, or otherwise use any of the materials on the site without our prior written consent.
      </p>

      <h2 className="text-2xl font-semibold mb-2">6. Disclaimer of Warranties</h2>
      <p className="mb-4">
        Recipe Lens is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the service will be uninterrupted, timely, secure, or error-free.
      </p>

      <h2 className="text-2xl font-semibold mb-2">7. Limitation of Liability</h2>
      <p className="mb-4">
        In no event shall Recipe Lens, its affiliates, directors, employees, or agents be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses resulting from the use of or inability to use the service.
      </p>

      <h2 className="text-2xl font-semibold mb-2">8. Governing Law</h2>
      <p className="mb-4">
        These terms and your use of Recipe Lens are governed by and construed in accordance with the laws of the jurisdiction in which Recipe Lens operates. You agree that any legal action or proceeding between you and Recipe Lens shall be brought exclusively in a court of competent jurisdiction located in that jurisdiction.
      </p>

      <p>
        If you have any questions about these Terms of Service, please <a href="https://recipelens.com/contact" className="text-blue-600 underline">contact us</a>.
      </p>
    </div>
  );
};

export default TermsPage;