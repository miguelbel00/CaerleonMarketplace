import React from 'react';

interface NavbarProps {
  links: {
    name?: string; // Hacer el nombre opcional
    url: string;
    icon?: string; // Añadir la propiedad para el icono
  }[];
}

const Navbar: React.FC<NavbarProps> = ({ links }) => {
  return (
    <nav className="bg-gray-800 py-4">
      <ul className="flex space-x-4 justify-center">
        {links.map((link, index) => (
          <li key={index}>
            {link.icon ? (
              <img src={link.icon} alt={link.name || 'Icon'} className="h-6 w-6 bg-white rounded-full p-1" />
            ) : (
              <a
                href={link.url}
                className="text-white hover:text-gray-300 transition duration-300"
              >
                {link.name}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
