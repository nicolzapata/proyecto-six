import { useState, useEffect } from 'react';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array de imágenes de biblioteca (placeholders simples y confiables)
  const images = [
    {
      src: 'https://via.placeholder.com/600x400/4f46e5/ffffff?text=Biblioteca+Moderna',
      alt: 'Biblioteca moderna con estanterías',
      title: 'Biblioteca Moderna'
    },
    {
      src: 'https://via.placeholder.com/600x400/059669/ffffff?text=Sala+de+Lectura',
      alt: 'Sala de lectura',
      title: 'Sala de Lectura'
    },
    {
      src: 'https://via.placeholder.com/600x400/dc2626/ffffff?text=Coleccion+de+Libros',
      alt: 'Libros antiguos',
      title: 'Colección de Libros Antiguos'
    },
    {
      src: 'https://via.placeholder.com/600x400/7c3aed/ffffff?text=Biblioteca+Universitaria',
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
    <div className="relative w-full h-64 lg:h-96 overflow-hidden rounded-lg shadow-lg">
      {/* Mostrar imagen actual */}
      <div className="w-full h-full relative">
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white text-lg font-semibold">{images[currentIndex].title}</h3>
          <p className="text-white/80 text-sm">Imagen {currentIndex + 1} de {images.length}</p>
        </div>

        {/* Indicador de imagen actual */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          {currentIndex + 1}/{images.length}
        </div>
      </div>

      {/* Botones de navegación */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors text-xl"
        aria-label="Imagen anterior"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors text-xl"
        aria-label="Imagen siguiente"
      >
        ›
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;