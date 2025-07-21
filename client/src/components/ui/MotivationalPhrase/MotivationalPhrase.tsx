// client/src/components/ui/MotivationalPhrase/MotivationalPhrase.tsx
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import './MotivationalPhrase.scss';

gsap.registerPlugin(ScrollTrigger);

interface Quote {
  id: number;
  textParts: {
    text: string;
    color: 'white' | 'black' | 'golden';
  }[];
  background: 'black' | 'golden';
}

const MotivationalPhrase: React.FC = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  // 6 frases únicas con fondos alternados
  const quotes: Quote[] = [
    {
      id: 1,
      background: 'black',
      textParts: [
        { text: t('home.phrases.phrase1.part1'), color: 'white' },
        { text: t('home.phrases.phrase1.part2'), color: 'golden' }
      ]
    },
    {
      id: 2,
      background: 'golden',
      textParts: [
        { text: i18n.language === 'ar' ? 
          'ابنِ جسدًا يتحدث عنك. كن منيعًا.' : 
          t('home.phrases.phrase2'), 
          color: 'black' 
        }
      ]
    },
    {
      id: 3,
      background: 'black',
      textParts: [
        { text: t('home.phrases.phrase3.part1'), color: 'white' },
        { text: t('home.phrases.phrase3.part2'), color: 'golden' }
      ]
    },
    {
      id: 4,
      background: 'golden',
      textParts: [
        { text: i18n.language === 'ar' ? 
          'بدون عضلات، لا احترام. ابنِ جسدًا يتحدث عنك.' : 
          t('home.phrases.phrase4'), 
          color: 'black' 
        }
      ]
    },
    {
      id: 5,
      background: 'black',
      textParts: i18n.language === 'ar' ? [
        { text: 'الذهب يُصاغ في النار،', color: 'golden' },
        { text: 'كما يُصاغ العضلات في الحديد.', color: 'white' }
      ] : [
        { text: t('home.phrases.phrase5.part1'), color: 'golden' },
        { text: t('home.phrases.phrase5.part2'), color: 'white' }
      ]
    },
    {
      id: 6,
      background: 'golden',
      textParts: [
        { text: t('home.phrases.phrase6'), color: 'black' }
      ]
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true
          }
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, []);

  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [currentIndex, quotes.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  return (
    <section ref={sectionRef} className="motivational-phrase-section">
      <div className="carousel-container">
        <div 
          className="quotes-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className={`motivational-phrase ${quote.background}`}
            >
              <div className="phrase-container">
                <div className="phrase-text">
                  {quote.textParts.map((part, index) => (
                    <React.Fragment key={index}>
                      <span className={`text-${part.color}`}>
                        {part.text}
                      </span>
                      {index < quote.textParts.length - 1 && ' '}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="carousel-control prev" 
          onClick={handlePrev}
          aria-label="Previous"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button 
          className="carousel-control next" 
          onClick={handleNext}
          aria-label="Next"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="carousel-dots">
          {quotes.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MotivationalPhrase;