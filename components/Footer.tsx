import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Contact', href: '/contact' },
    { name: 'About', href: '/about' },
    { name: 'Disclosure', href: '/disclosure' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex flex-wrap justify-center mb-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md text-sm font-medium w-full sm:w-auto text-center mb-2 sm:mb-0"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="text-center text-gray-500 text-sm">
          &copy; {currentYear} Recipe Lens. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;