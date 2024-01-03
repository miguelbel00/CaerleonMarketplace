import React from 'react';
import Navbar from '../components/Navbar';
import HomeIcon from '../assets/navbar/homeIcon.png';

const Home: React.FC = () => {
  const links = [
    { url: '/', icon: HomeIcon }, // Cambié "img" a "icon" para mayor claridad
    { name: 'Meta', url: '/meta' },
    { name: 'Database', url: '/database' },
    { name: 'Tools', url: '/tools' },
    { name: 'Guides', url: '/guides' },
    { name: 'Scoreboard', url: '/scoreboard' },
    { name: 'Map', url: '/map' },
  ];

  return (
    <div>
      <Navbar links={links} />
    </div>
  );
};

export default Home;
