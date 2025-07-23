// client/src/pages/Gallery/Gallery.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';
import { images } from '../../assets/images';
import './Gallery.scss';

interface Slide {
  id: number;
  type: 'image' | 'quote';
  content?: string;
  contentPart2?: string;
  image?: string;
  background?: string;
  color?: string;
  colorPart2?: string;
  originalIndex: number;
}

const Gallery: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState<{ [key: number]: boolean }>({});
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showHeart, setShowHeart] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const lastTapRef = useRef(0);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Frases divididas en dos partes con colores intercalados (sin las rayas)
  const quotes = [
    { 
      content: 'Build a body that speaks for you.',
      contentPart2: 'Become untouchable.',
      background: 'black',
      color: 'white',
      colorPart2: '#EAC31B'
    },
    { 
      content: 'Transform your physique.',
      contentPart2: 'Transform your life.',
      background: 'black',
      color: '#EAC31B',
      colorPart2: 'white'
    },
    { 
      content: 'With no muscles comes no respect.',
      contentPart2: 'Build a body that commands attention.',
      background: 'black',
      color: 'white',
      colorPart2: '#EAC31B'
    },
    { 
      content: 'Discipline builds muscle.',
      contentPart2: 'Muscle builds confidence.',
      background: 'black',
      color: '#EAC31B',
      colorPart2: 'white'
    },
    { 
      content: 'Gold is forged with fire,',
      contentPart2: 'just as muscle with iron.',
      background: 'black',
      color: 'white',
      colorPart2: '#EAC31B'
    },
    { 
      content: 'Your body is your first impression.',
      contentPart2: 'Make it count.',
      background: 'black',
      color: '#EAC31B',
      colorPart2: 'white'
    },
    { 
      content: 'The pain you feel today',
      contentPart2: 'will be the strength you feel tomorrow.',
      background: 'black',
      color: 'white',
      colorPart2: '#EAC31B'
    },
    { 
      content: 'Champions are made in the gym.',
      contentPart2: 'Legends are made in Golden Era.',
      background: 'black',
      color: '#EAC31B',
      colorPart2: 'white'
    },
  ];

  // Generar slides intercalando imágenes y frases
  const generateSlides = (): Slide[] => {
    const slides: Slide[] = [];
    let quoteIndex = 0;
    let slideId = 0;

    images.gallery.forEach((img, index) => {
      // Añadir imagen
      slides.push({
        id: slideId++,
        type: 'image',
        image: img,
        originalIndex: slides.length
      });

      // Añadir frase después de cada imagen
      if (quoteIndex < quotes.length) {
        slides.push({
          id: slideId++,
          type: 'quote',
          ...quotes[quoteIndex % quotes.length],
          originalIndex: slides.length
        });
        quoteIndex++;
      }
    });

    return slides;
  };

  const slides = generateSlides();

  // Scroll suave a un índice específico
  const scrollToIndex = useCallback((index: number) => {
    if (slidesContainerRef.current && !isScrollingRef.current) {
      isScrollingRef.current = true;
      
      slidesContainerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      });

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 600);
    }
  }, []);

  // Navegación mejorada
  const navigateToSlide = useCallback((newIndex: number) => {
    if (isTransitioning || newIndex === currentIndex) return;
    
    // Implementar infinite scroll
    let targetIndex = newIndex;
    
    // Si llegamos al final, volvemos al principio
    if (newIndex >= slides.length) {
      targetIndex = 0;
    } else if (newIndex < 0) {
      targetIndex = slides.length - 1;
    }
    
    setIsTransitioning(true);
    setCurrentIndex(targetIndex);
    scrollToIndex(targetIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [currentIndex, slides.length, isTransitioning, scrollToIndex]);

  // Manejo mejorado del scroll
  useEffect(() => {
    if (!slidesContainerRef.current) return;

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const container = slidesContainerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const itemHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / itemHeight);

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < slides.length) {
        setCurrentIndex(newIndex);
      }
    };

    const container = slidesContainerRef.current;
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [currentIndex, slides.length]);

  // Manejo de rueda del mouse con debounce
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();

    if (wheelTimeoutRef.current) {
      clearTimeout(wheelTimeoutRef.current);
    }

    wheelTimeoutRef.current = setTimeout(() => {
      const direction = e.deltaY > 0 ? 1 : -1;
      navigateToSlide(currentIndex + direction);
    }, 50);
  }, [currentIndex, navigateToSlide]);

  // Touch handlers mejorados
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
    setTouchEnd(0); // Reset touchEnd
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const threshold = 50; // Mínima distancia para considerar un swipe

    if (Math.abs(distance) > threshold) {
      if (distance > 0) {
        // Swipe up - siguiente slide
        navigateToSlide(currentIndex + 1);
      } else {
        // Swipe down - slide anterior
        navigateToSlide(currentIndex - 1);
      }
    }

    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Manejo del doble tap para like
  const handleDoubleTap = useCallback((slideId: number) => {
    const slideElement = slidesContainerRef.current?.children[currentIndex] as HTMLElement;
    if (!slideElement) return;

    // Mostrar animación de corazón
    setShowHeart(slideId);
    setTimeout(() => setShowHeart(null), 1000);

    // Crear animación de corazón grande
    const heart = document.createElement('div');
    heart.className = 'like-heart';
    heart.innerHTML = '❤️';
    slideElement.appendChild(heart);

    gsap.set(heart, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      opacity: 1,
      zIndex: 100
    });

    gsap.to(heart, {
      scale: 3,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      onComplete: () => {
        heart.remove();
      }
    });

    // Actualizar estado de like
    setIsLiked(prev => ({ ...prev, [slideId]: !prev[slideId] }));

    // Vibración
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [currentIndex]);

  // Detectar doble tap
  const handleTap = (slideId: number) => {
    const currentTime = Date.now();
    const tapInterval = currentTime - lastTapRef.current;
    
    if (tapInterval < 300 && tapInterval > 0) {
      handleDoubleTap(slideId);
    }
    
    lastTapRef.current = currentTime;
  };

  // Manejo de teclas
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch(e.key) {
      case 'ArrowUp':
        e.preventDefault();
        navigateToSlide(currentIndex - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        navigateToSlide(currentIndex + 1);
        break;
      case ' ':
        e.preventDefault();
        const currentSlide = slides[currentIndex];
        if (currentSlide) {
          handleDoubleTap(currentSlide.id);
        }
        break;
    }
  }, [currentIndex, navigateToSlide, handleDoubleTap, slides]);

  // Event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    
    // Prevenir el pull-to-refresh en móviles
    document.body.style.overscrollBehavior = 'none';

    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overscrollBehavior = 'auto';
      
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
    };
  }, [handleWheel, handleKeyDown]);

  // Posicionar en el slide correcto al cambiar currentIndex
  useEffect(() => {
    if (slidesContainerRef.current && !isScrollingRef.current) {
      slidesContainerRef.current.scrollTop = currentIndex * window.innerHeight;
    }
  }, [currentIndex]);

  // Generar número aleatorio de likes
  const getLikeCount = (slideId: number) => {
    const baseCount = 1000 + (slideId * 237); // Número consistente basado en el ID
    return isLiked[slideId] ? baseCount + 1 : baseCount;
  };

  return (
    <div 
      className="gallery-container" 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="slides-container"
        ref={slidesContainerRef}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`gallery-slide ${slide.type}`}
            style={slide.type === 'quote' ? { backgroundColor: slide.background } : {}}
            onClick={() => handleTap(slide.id)}
          >
            {slide.type === 'image' ? (
              <>
                <img 
                  src={slide.image} 
                  alt={`Gallery ${slide.id}`}
                  draggable={false}
                />
                
                {/* Animación de corazón centrada */}
                {showHeart === slide.id && (
                  <div className="heart-animation-overlay">
                    <div className="heart-icon">❤️</div>
                  </div>
                )}

                {/* Solo botón de like */}
                <div className="actions-sidebar">
                  <button 
                    className={`action-button like-button ${isLiked[slide.id] ? 'liked' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDoubleTap(slide.id);
                    }}
                  >
                    <span className="icon">❤️</span>
                    <span className="count">
                      {getLikeCount(slide.id).toLocaleString()}
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <div className="quote-content">
                <h2 style={{ color: slide.color }}>
                  {slide.content}
                </h2>
                {slide.contentPart2 && (
                  <h2 style={{ color: slide.colorPart2 }}>
                    {slide.contentPart2}
                  </h2>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Indicador de progreso */}
      <div className="progress-indicator">
        <div 
          className="progress-bar"
          style={{ 
            height: `${((currentIndex + 1) / slides.length) * 100}%` 
          }}
        />
      </div>

      {/* Hint de navegación (solo se muestra al principio) */}
      {currentIndex === 0 && (
        <div className="navigation-hint">
          <div className="swipe-icon">👆</div>
          <p>Swipe up</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;