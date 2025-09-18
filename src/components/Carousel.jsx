import { useState, useEffect } from 'react';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array de imágenes de biblioteca (imágenes específicas de Unsplash)
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
      alt: 'Biblioteca moderna con estanterías',
      title: 'Biblioteca Moderna'
    },
    {
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
      alt: 'Sala de lectura',
      title: 'Sala de Lectura'
    },
    {
      src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
      alt: 'Colección de libros antiguos',
      title: 'Colección de Libros Antiguos'
    },
    {
      src: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&h=400&fit=crop',
      alt: 'Biblioteca universitaria',
      title: 'Biblioteca Universitaria'
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

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="carousel-enhanced relative w-full overflow-hidden rounded-lg shadow-lg bg-gray-200">
      {/* Mostrar imagen actual */}
      <div className="w-full h-full relative">
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="w-full h-full object-cover"
        />
        <div className="carousel-overlay absolute bottom-0 left-0 right-0 p-4">
          <h3 className="carousel-title">{images[currentIndex].title}</h3>
          <p className="carousel-subtitle">Imagen {currentIndex + 1} de {images.length}</p>
        </div>
      </div>

      {/* Botones de navegación */}
      <button
        onClick={prevSlide}
        className="carousel-btn absolute left-2 top-1/2 transform -translate-y-1/2 text-white p-3 rounded-full hover:bg-black/70 transition-colors text-xl"
        aria-label="Imagen anterior"
        style={{ transform: 'translateY(-50%)' }}
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="carousel-btn absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-3 rounded-full hover:bg-black/70 transition-colors text-xl"
        aria-label="Imagen siguiente"
        style={{ transform: 'translateY(-50%)' }}
      >
        ›
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`carousel-indicator w-4 h-4 rounded-full transition-colors ${
              index === currentIndex ? 'active' : ''
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;