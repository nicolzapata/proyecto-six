import { useState, useEffect } from 'react';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array de imágenes de biblioteca (imágenes específicas de Unsplash)
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=500&fit=crop',
      alt: 'Biblioteca moderna con estanterías',
      title: 'Biblioteca Moderna'
    },
    {
      src: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=500&fit=crop',
      alt: 'Sala de lectura amplia',
      title: 'Sala de Lectura'
    },
    {
      src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=500&fit=crop',
      alt: 'Biblioteca histórica',
      title: 'Biblioteca Histórica'
    },
    {
      src: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&h=500&fit=crop',
      alt: 'Biblioteca universitaria',
      title: 'Biblioteca Universitaria'
    },
    {
      src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=500&fit=crop',
      alt: 'Biblioteca infantil',
      title: 'Biblioteca Infantil'
    }
  ];

  // Cambiar automáticamente cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);


  return (
    <div className="carousel-enhanced relative w-full overflow-hidden rounded-lg shadow-lg bg-gray-200">
      {/* Mostrar imagen actual */}
      <div className="w-full h-full relative">
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="w-full h-full object-cover"
        />
        <div className="carousel-overlay absolute bottom-0 left-0 right-0 p-4"></div>
      </div>

      
      {/* Indicadores */}

    </div>
  );
};

export default Carousel;