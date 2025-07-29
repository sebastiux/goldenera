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
  aspectRatio?: number;
}

interface MusicTrack {
  id: string;
  name: string;
  artist: string;
  url: string;
  type: 'classical' | 'jazz';
}

const Gallery: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState<{ [key: number]: boolean }>({});
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showHeart, setShowHeart] = useState<number | null>(null);
  const [imageAspectRatios, setImageAspectRatios] = useState<{ [key: string]: number }>({});
  const [showHint, setShowHint] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteractedRef = useRef(false);

  // Music tracks - Using royalty-free classical and jazz music URLs
  const musicTracks: MusicTrack[] = [
    {
      id: 'vivaldi-spring',
      name: 'Spring - Allegro',
      artist: 'Vivaldi',
      url: 'https://www.bensound.com/bensound-music/bensound-thejazzpiano.mp3',
      type: 'classical'
    },
    {
      id: 'jazz-smooth',
      name: 'Smooth Jazz',
      artist: 'Jazz Ensemble',
      url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kevin_MacLeod/Classical_Sampler/Kevin_MacLeod_-_Canon_in_D_Major.mp3',
      type: 'jazz'
    },
    {
      id: 'vivaldi-winter',
      name: 'Winter - Largo',
      artist: 'Vivaldi',
      url: '/audio/vivaldi-winter.mp3',
      type: 'classical'
    },
    {
      id: 'jazz-night',
      name: 'Night Jazz',
      artist: 'Jazz Quartet',
      url: '/audio/jazz-night.mp3',
      type: 'jazz'
    }
  ];

  // Initialize and auto-play music
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = 0.2; // Low volume for background music
    audioRef.current.loop = false;
    
    // Handle track ended
    audioRef.current.addEventListener('ended', () => {
      playNextTrack();
    });

    // Start playing music on first user interaction
    const startMusic = () => {
      if (!hasInteractedRef.current && audioRef.current) {
        hasInteractedRef.current = true;
        audioRef.current.src = musicTracks[currentTrack].url;
        audioRef.current.play().catch(err => {
          console.log('Autoplay prevented, waiting for user interaction');
        });
      }
    };

    // Try to play immediately (might be blocked by browser)
    audioRef.current.src = musicTracks[0].url;
    audioRef.current.play().catch(() => {
      // If autoplay is blocked, wait for user interaction
      document.addEventListener('click', startMusic, { once: true });
      document.addEventListener('touchstart', startMusic, { once: true });
      document.addEventListener('keydown', startMusic, { once: true });
      document.addEventListener('wheel', startMusic, { once: true });
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      document.removeEventListener('click', startMusic);
      document.removeEventListener('touchstart', startMusic);
      document.removeEventListener('keydown', startMusic);
      document.removeEventListener('wheel', startMusic);
    };
  }, []);

  // Play next track with smooth transition
  const playNextTrack = useCallback(() => {
    if (!audioRef.current) return;
    
    const nextTrack = (currentTrack + 1) % musicTracks.length;
    
    // Fade out current track
    gsap.to(audioRef.current, {
      volume: 0,
      duration: 1,
      onComplete: () => {
        if (audioRef.current) {
          audioRef.current.src = musicTracks[nextTrack].url;
          setCurrentTrack(nextTrack);
          
          audioRef.current.play().then(() => {
            // Fade in new track
            gsap.to(audioRef.current, {
              volume: 0.2,
              duration: 1
            });
          }).catch(err => console.log('Audio play failed:', err));
        }
      }
    });
  }, [currentTrack, musicTracks]);

  // Hide hint after first interaction or after timeout
  useEffect(() => {
    if (currentIndex > 0) {
      setShowHint(false);
    }
  }, [currentIndex]);

  // Auto-hide hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Frases divididas en dos partes con colores intercalados
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
      color: 'white',
      colorPart2: '#EAC31B'
    }
  ];

  // Imágenes de la galería
  const galleryImages = Object.values(images.gallery);

  // Crear slides mezclando imágenes y quotes
  const createSlides = useCallback((): Slide[] => {
    const slides: Slide[] = [];
    let imageIndex = 0;
    let quoteIndex = 0;
    let slideId = 1;

    // Patrón: 2 imágenes, 1 quote
    while (imageIndex < galleryImages.length || quoteIndex < quotes.length) {
      // Añadir 2 imágenes
      for (let i = 0; i < 2; i++) {
        if (imageIndex < galleryImages.length) {
          slides.push({
            id: slideId++,
            type: 'image',
            image: galleryImages[imageIndex],
            originalIndex: imageIndex,
            aspectRatio: imageAspectRatios[galleryImages[imageIndex]] || 1
          });
          imageIndex++;
        }
      }

      // Añadir 1 quote
      if (quoteIndex < quotes.length) {
        slides.push({
          id: slideId++,
          type: 'quote',
          ...quotes[quoteIndex],
          originalIndex: quoteIndex
        });
        quoteIndex++;
      }
    }

    return slides;
  }, [galleryImages, quotes, imageAspectRatios]);

  const [slides, setSlides] = useState<Slide[]>([]);

  // Load image aspect ratios
  useEffect(() => {
    const loadImageAspectRatios = async () => {
      const ratios: { [key: string]: number } = {};
      
      for (const imageSrc of galleryImages) {
        const img = new Image();
        img.src = imageSrc;
        await new Promise((resolve) => {
          img.onload = () => {
            ratios[imageSrc] = img.width / img.height;
            resolve(null);
          };
        });
      }
      
      setImageAspectRatios(ratios);
    };

    loadImageAspectRatios();
  }, [galleryImages]);

  useEffect(() => {
    setSlides(createSlides());
  }, [createSlides]);

  // Touch handling para móvil
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd || isTransitioning) return;
    
    const distance = touchStart - touchEnd;
    const threshold = 50;

    if (Math.abs(distance) > threshold) {
      if (distance > 0 && currentIndex < slides.length - 1) {
        // Swipe up
        navigateToSlide(currentIndex + 1);
      } else if (distance < 0 && currentIndex > 0) {
        // Swipe down
        navigateToSlide(currentIndex - 1);
      }
    }
  }, [touchStart, touchEnd, currentIndex, isTransitioning, slides.length]);

  // Navegación mejorada
  const navigateToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex || index < 0 || index >= slides.length) return;
    
    setIsTransitioning(true);

    const container = slidesContainerRef.current;
    if (container) {
      const targetScroll = index * window.innerHeight;
      
      gsap.to(container, {
        scrollTop: targetScroll,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          setCurrentIndex(index);
          setIsTransitioning(false);
        }
      });
    }
  }, [currentIndex, isTransitioning, slides.length]);

  // Handle native scroll
  const handleScroll = useCallback(() => {
    if (isTransitioning) return;

    const container = slidesContainerRef.current;
    if (!container) return;

    // Clear previous timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Debounce scroll handling
    scrollTimeoutRef.current = setTimeout(() => {
      const scrollTop = container.scrollTop;
      const slideHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / slideHeight);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < slides.length) {
        setCurrentIndex(newIndex);
      }
    }, 100);
  }, [currentIndex, isTransitioning, slides.length]);

  // Wheel handling para desktop con throttle
  const handleWheel = useCallback((e: WheelEvent) => {
    // No prevenir el comportamiento por defecto para permitir scroll nativo
    if (isTransitioning) {
      e.preventDefault();
      return;
    }

    // Clear previous timeout
    if (wheelTimeoutRef.current) {
      clearTimeout(wheelTimeoutRef.current);
    }

    // Throttle wheel events
    wheelTimeoutRef.current = setTimeout(() => {
      const delta = e.deltaY;
      if (Math.abs(delta) > 30) { // Threshold para evitar scrolls accidentales
        if (delta > 0 && currentIndex < slides.length - 1) {
          navigateToSlide(currentIndex + 1);
        } else if (delta < 0 && currentIndex > 0) {
          navigateToSlide(currentIndex - 1);
        }
      }
    }, 50);
  }, [currentIndex, isTransitioning, navigateToSlide, slides.length]);

  // Double tap para like
  const handleDoubleTap = useCallback((slideId: number) => {
    setIsLiked(prev => ({
      ...prev,
      [slideId]: !prev[slideId]
    }));

    // Mostrar animación de corazón
    setShowHeart(slideId);
    setTimeout(() => setShowHeart(null), 1000);

    // Haptic feedback si está disponible
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, []);

  const lastTapRef = useRef(0);
  const handleTap = useCallback((slideId: number) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      handleDoubleTap(slideId);
    }
    lastTapRef.current = now;
  }, [handleDoubleTap]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch(e.key) {
      case 'ArrowUp':
        if (currentIndex > 0) navigateToSlide(currentIndex - 1);
        break;
      case 'ArrowDown':
        if (currentIndex < slides.length - 1) navigateToSlide(currentIndex + 1);
        break;
      case ' ':
      case 'Enter':
        const currentSlide = slides[currentIndex];
        if (currentSlide) {
          handleDoubleTap(currentSlide.id);
        }
        break;
    }
  }, [currentIndex, navigateToSlide, handleDoubleTap, slides]);

  // Event listeners
  useEffect(() => {
    const container = slidesContainerRef.current;
    if (!container) return;

    // Add scroll listener
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Add wheel listener to container, not window
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    // Add keyboard listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Prevenir el pull-to-refresh en móviles
    document.body.style.overscrollBehavior = 'none';

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overscrollBehavior = 'auto';
      
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleWheel, handleKeyDown, handleScroll]);

  // Snap to correct position when index changes
  useEffect(() => {
    const container = slidesContainerRef.current;
    if (container && !isTransitioning) {
      const targetScroll = currentIndex * window.innerHeight;
      if (Math.abs(container.scrollTop - targetScroll) > 10) {
        container.scrollTop = targetScroll;
      }
    }
  }, [currentIndex, isTransitioning]);

  // Preload próximas imágenes
  useEffect(() => {
    const preloadNextImages = () => {
      for (let i = currentIndex + 1; i < Math.min(currentIndex + 3, slides.length); i++) {
        const slide = slides[i];
        if (slide?.type === 'image' && slide.image) {
          const img = new Image();
          img.src = slide.image;
        }
      }
    };

    preloadNextImages();
  }, [currentIndex, slides]);

  // Generar número aleatorio de likes
  const getLikeCount = (slideId: number) => {
    const baseCount = 1000 + (slideId * 237);
    return isLiked[slideId] ? baseCount + 1 : baseCount;
  };

  // Calcular el estilo de la imagen basado en su aspect ratio
  const getImageStyle = (slide: Slide) => {
    if (slide.type !== 'image' || !slide.aspectRatio) {
      return {};
    }

    const viewportAspectRatio = window.innerWidth / window.innerHeight;
    const imageAspectRatio = slide.aspectRatio;

    if (imageAspectRatio > viewportAspectRatio) {
      // Imagen más ancha que el viewport
      return {
        width: '100%',
        height: 'auto',
        maxHeight: '100vh'
      };
    } else {
      // Imagen más alta que el viewport
      return {
        width: 'auto',
        height: '100%',
        maxWidth: '100vw'
      };
    }
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
            data-active={index === currentIndex}
          >
            {slide.type === 'image' ? (
              <>
                <div className="image-wrapper">
                  <img 
                    src={slide.image} 
                    alt={`Gallery ${slide.id}`}
                    draggable={false}
                    style={getImageStyle(slide)}
                    loading={index <= currentIndex + 2 ? "eager" : "lazy"}
                  />
                </div>
                
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

                {/* Navigation hint - only on first image slide */}
                {index === 0 && showHint && currentIndex === 0 && (
                  <div className="navigation-hint">
                    <div className="swipe-icon">👆</div>
                    <p>Swipe up</p>
                  </div>
                )}
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
    </div>
  );
};

export default Gallery;