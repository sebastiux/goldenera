// src/components/ui/JoinForm/JoinForm.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { TextPlugin } from 'gsap/TextPlugin';
import './JoinForm.scss';

gsap.registerPlugin(ScrollTrigger, CustomEase, TextPlugin);

// Crear ease personalizado para animaciones premium
CustomEase.create("goldenEase", "M0,0 C0.25,0.1 0.25,1 1,1");

interface FormData {
  name: string;
  phone: string;
  email: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
}

// Detectar si es dispositivo móvil para optimizaciones
const isMobile = () => window.innerWidth <= 768;

// Configuración de rendimiento
const PERFORMANCE_CONFIG = {
  particleCount: isMobile() ? 15 : 30,
  backgroundParticles: isMobile() ? 20 : 50,
  animationQuality: isMobile() ? 'reduced' : 'full',
  enableComplexEffects: !isMobile()
};

const JoinForm: React.FC = () => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const formElementRef = useRef<HTMLFormElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const isInitialized = useRef(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formProgress, setFormProgress] = useState(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Preload crítico de recursos
  useEffect(() => {
    const preloadAssets = async () => {
      // Simular preload de fuentes y recursos críticos
      const criticalFonts = [
        new FontFace('Mohave', 'url(/fonts/mohave.woff2)', { weight: '600' }),
        new FontFace('Helvetica', 'url(/fonts/helvetica.woff2)', { weight: '400' })
      ];

      try {
        await Promise.all(criticalFonts.map(font => font.load()));
        criticalFonts.forEach(font => document.fonts.add(font));
      } catch (error) {
        console.log('Fonts loaded from cache or system');
      }

      // Pequeño delay para asegurar que todo está listo
      await new Promise(resolve => setTimeout(resolve, 100));
      setIsReady(true);
    };

    preloadAssets();
  }, []);

  // Inicializar animaciones solo cuando esté listo
  useEffect(() => {
    if (!isReady || isInitialized.current) return;
    
    isInitialized.current = true;

    const ctx = gsap.context(() => {
      // Configuración de rendimiento para GSAP
      gsap.config({
        force3D: true,
        nullTargetWarn: false,
      });

      // Timeline principal con optimizaciones
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          fastScrollEnd: true,
          preventOverlaps: true
        }
      });

      // Usar requestAnimationFrame para animaciones pesadas
      animationFrameRef.current = requestAnimationFrame(() => {
        initializeAnimations(masterTl);
      });

    }, formRef);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      ctx.revert();
    };
  }, [isReady]);

  // Separar las animaciones en una función para mejor control
 const initializeAnimations = (masterTl: gsap.core.Timeline) => {
  // Animación del título con optimizaciones
  if (titleRef.current) {
    const titlePre = titleRef.current.querySelector('.join-form__title-pre');
    const titleMain = titleRef.current.querySelector('.join-form__title-main');
    const titlePost = titleRef.current.querySelector('.join-form__title-post');

    // Pre-título con will-change
    if (titlePre) {
      gsap.set(titlePre, { willChange: 'transform, opacity' });
      masterTl.fromTo(titlePre,
        {
          opacity: 0,
          y: -30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(titlePre, { willChange: 'auto' });
          }
        }
      );
    }

    // Título principal optimizado
    if (titleMain) {
      gsap.set(titleMain, { willChange: 'transform, opacity' });
      
      if (PERFORMANCE_CONFIG.enableComplexEffects) {
        masterTl.fromTo(titleMain,
          {
            scale: 0,
            opacity: 0,
            rotationY: 90,
          },
          {
            scale: 1,
            opacity: 1,
            rotationY: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
            onComplete: () => {
              gsap.set(titleMain, { willChange: 'auto' });
              // Animación de brillo más ligera
              gsap.to(titleMain, {
                filter: 'brightness(1.2)',
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
              });
            }
          },
          "-=0.4"
        );
      } else {
        // Versión móvil simplificada
        masterTl.fromTo(titleMain,
          {
            scale: 0.8,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(1.4)",
            onComplete: () => {
              gsap.set(titleMain, { willChange: 'auto' });
            }
          },
          "-=0.4"
        );
      }
    }

    // Post-título
    if (titlePost) {
      gsap.set(titlePost, { willChange: 'transform, opacity' });
      masterTl.fromTo(titlePost,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(titlePost, { willChange: 'auto' });
          }
        },
        "-=0.6"
      );
    }

    // Partículas optimizadas con lazy loading
    if (PERFORMANCE_CONFIG.enableComplexEffects) {
      requestAnimationFrame(() => {
        animateTitleParticles();
      });
    }
  }

  // Efecto de partículas doradas con throttling
  if (PERFORMANCE_CONFIG.backgroundParticles > 0) {
    requestAnimationFrame(() => {
      createOptimizedParticles();
    });
  }

  // Animaciones del formulario simplificadas
  if (subtitleRef.current) {
    gsap.set(subtitleRef.current, { willChange: 'transform, opacity' });
    masterTl.fromTo(subtitleRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(subtitleRef.current, { willChange: 'auto' });
        }
      },
      "-=0.6"
    );
  }

  // Formulario optimizado
  if (formElementRef.current) {
    gsap.set(formElementRef.current, { willChange: 'transform, opacity' });
    masterTl.fromTo(formElementRef.current,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(formElementRef.current, { willChange: 'auto' });
        }
      },
      "-=0.6"
    );
  }

  // Inputs con stagger optimizado - CORREGIDO
  const inputs = formElementRef.current?.querySelectorAll('.join-form__input-wrapper');
  if (inputs && inputs.length > 0) {
    gsap.set(inputs, { willChange: 'transform, opacity' });
    masterTl.fromTo(inputs,
      {
        opacity: 0,
        x: -20,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(inputs, { willChange: 'auto' });
        }
      },
      "-=0.8"
    );
  }

  // Botón con animación ligera
  if (ctaButtonRef.current) {
    gsap.set(ctaButtonRef.current, { willChange: 'transform, opacity' });
    masterTl.fromTo(ctaButtonRef.current,
      {
        opacity: 0,
        scale: 0.9,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.4)",
        onComplete: () => {
          gsap.set(ctaButtonRef.current, { willChange: 'auto' });
          // Levitación sutil
          gsap.to(ctaButtonRef.current, {
            y: -3,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
      },
      "-=0.5"
    );
  }

  // Barra de progreso
  if (progressBarRef.current) {
    gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: "left center" });
  }
};

  // Animar partículas del título de forma optimizada
  const animateTitleParticles = () => {
    const particles = titleRef.current?.parentElement?.querySelectorAll('.particle');
    if (!particles || particles.length === 0) return;

    particles.forEach((particle, i) => {
      // Usar transform3d para GPU acceleration
      gsap.set(particle, {
        x: gsap.utils.random(-150, 150),
        y: gsap.utils.random(-150, 150),
        scale: 0,
        force3D: true
      });

      gsap.to(particle, {
        scale: gsap.utils.random(0.5, 1),
        opacity: gsap.utils.random(0.3, 0.7),
        duration: gsap.utils.random(2, 4),
        delay: i * 0.02,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Movimiento simplificado
      gsap.to(particle, {
        x: `+=${gsap.utils.random(-50, 50)}`,
        y: `+=${gsap.utils.random(-50, 50)}`,
        duration: gsap.utils.random(8, 12),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  };

  // Crear partículas optimizadas con pooling
  const createOptimizedParticles = useCallback(() => {
    if (!particlesRef.current) return;

    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < PERFORMANCE_CONFIG.backgroundParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'join-form__particle';
      particle.style.willChange = 'transform';
      fragment.appendChild(particle);
    }
    
    particlesRef.current.appendChild(fragment);

    // Animar partículas en lotes
    requestAnimationFrame(() => {
      const particles = particlesRef.current?.querySelectorAll('.join-form__particle');
      if (!particles) return;

      particles.forEach((particle, i) => {
        const delay = i * 0.1;
        
        gsap.set(particle, {
          x: gsap.utils.random(0, 100) + '%',
          y: gsap.utils.random(0, 100) + '%',
          scale: gsap.utils.random(0.5, 1.5),
          opacity: 0,
          force3D: true
        });

        gsap.to(particle, {
          y: `-=${gsap.utils.random(100, 200)}`,
          opacity: gsap.utils.random(0.3, 0.7),
          duration: gsap.utils.random(3, 6),
          delay: delay,
          repeat: -1,
          ease: "none"
        });
      });
    });
  }, []);

  // Debounce para el cálculo del progreso
  const updateProgress = useCallback(
    debounce((data: FormData) => {
      const filledFields = Object.values(data).filter(value => value.trim() !== '').length;
      const totalFields = Object.keys(data).length;
      const progress = (filledFields / totalFields) * 100;
      
      setFormProgress(progress);
      
      if (progressBarRef.current) {
        gsap.to(progressBarRef.current, {
          scaleX: progress / 100,
          duration: 0.3,
          ease: "power2.out",
          force3D: true
        });
      }

      if (progress === 100 && !Object.keys(errors).length && PERFORMANCE_CONFIG.enableComplexEffects) {
        requestAnimationFrame(() => celebrateCompletion());
      }
    }, 100),
    [errors]
  );

  useEffect(() => {
    updateProgress(formData);
  }, [formData, updateProgress]);

  // Efecto de celebración optimizado
  const celebrateCompletion = () => {
    if (!formElementRef.current) return;
    
    gsap.to(formElementRef.current, {
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out",
      yoyo: true,
      repeat: 1
    });

    if (PERFORMANCE_CONFIG.enableComplexEffects) {
      requestAnimationFrame(() => createOptimizedParticleBurst());
    }
  };

  // Explosión de partículas optimizada
  const createOptimizedParticleBurst = () => {
    const colors = ['#EAC31B', '#FFD700'];
    const container = formRef.current;
    
    if (!container) return;

    const fragment = document.createDocumentFragment();
    const particleCount = isMobile() ? 15 : 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'burst-particle';
      particle.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        background: ${colors[i % colors.length]};
        border-radius: 50%;
        pointer-events: none;
        left: 50%;
        top: 50%;
        will-change: transform;
      `;
      fragment.appendChild(particle);
    }
    
    container.appendChild(fragment);

    const particles = container.querySelectorAll('.burst-particle');
    particles.forEach((particle, i) => {
      const angle = (i / particleCount) * Math.PI * 2;
      const velocity = 100 + Math.random() * 100;

      gsap.to(particle, {
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity,
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: "power2.out",
        force3D: true,
        onComplete: () => particle.remove()
      });
    });
  };

  // Validación optimizada
  const validateField = useCallback((name: string, value: string): string | undefined => {
    let error: string | undefined;

    switch (name) {
      case 'name':
        if (!value.trim()) error = t('joinElite.form.errors.nameRequired');
        else if (value.length < 2) error = t('joinElite.form.errors.nameTooShort');
        else if (!/^[a-zA-ZáéíóúñÑ\s]+$/.test(value)) error = t('joinElite.form.errors.nameInvalid');
        break;
        
      case 'phone':
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/;
        if (!value.trim()) error = t('joinElite.form.errors.phoneRequired');
        else if (!phoneRegex.test(value.replace(/\s/g, ''))) error = t('joinElite.form.errors.phoneInvalid');
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) error = t('joinElite.form.errors.emailRequired');
        else if (!emailRegex.test(value)) error = t('joinElite.form.errors.emailInvalid');
        break;
    }

    const fieldIndex = ['name', 'phone', 'email'].indexOf(name);
    const inputElement = inputRefs.current[fieldIndex];
    
    if (inputElement && PERFORMANCE_CONFIG.enableComplexEffects) {
      gsap.to(inputElement, {
        borderColor: error ? '#ff4444' : '#4caf50',
        duration: 0.3,
        ease: "power2.out"
      });
    }

    return error;
  }, [t]);

  // Handlers optimizados
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setFocusedField(name);
    
    if (!PERFORMANCE_CONFIG.enableComplexEffects) return;

    const wrapper = e.target.parentElement;
    if (wrapper) {
      gsap.to(wrapper, {
        scale: 1.02,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFocusedField(null);
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    
    if (!PERFORMANCE_CONFIG.enableComplexEffects) return;

    const wrapper = e.target.parentElement;
    if (wrapper) {
      gsap.to(wrapper, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  }, [validateField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) newErrors[key as keyof FormErrors] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      if (formElementRef.current && PERFORMANCE_CONFIG.enableComplexEffects) {
        gsap.to(formElementRef.current, {
          x: 5,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: "power2.inOut"
        });
      }
      return;
    }

    setIsLoading(true);
    setIsError(false);

    if (ctaButtonRef.current) {
      gsap.to(ctaButtonRef.current, {
        scale: 0.95,
        duration: 0.2,
        ease: "power2.in"
      });
    }

    try {
      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
      
      // Tu código de Stripe aquí
      
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  // Loading screen mientras se prepara todo
  if (!isReady) {
    return (
      <section className="join-form join-form--loading">
        <div className="join-form__loader">
          <div className="join-form__loader-text">GOLDEN ERA</div>
          <div className="join-form__loader-bar"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="join-form" ref={formRef}>
      <div className="join-form__particles" ref={particlesRef}></div>
      
      <div className="join-form__container">
        <div className="join-form__content">
          {/* CONTENEDOR DEL TÍTULO CON EFECTOS */}
          <div className="join-form__title-container">
            {/* Partículas flotantes - reducidas en móvil */}
            {PERFORMANCE_CONFIG.enableComplexEffects && (
              <div className="join-form__title-particles">
                {[...Array(PERFORMANCE_CONFIG.particleCount)].map((_, i) => (
                  <span key={i} className="particle"></span>
                ))}
              </div>
            )}
            
            {/* Rayos de luz solo en desktop */}
            {PERFORMANCE_CONFIG.enableComplexEffects && (
              <div className="join-form__title-rays"></div>
            )}
            
            {/* TÍTULO PRINCIPAL */}
            <h2 className="join-form__title" ref={titleRef}>
              <span className="join-form__title-pre">ÚNETE A LA</span>
              <span className="join-form__title-main">GOLDEN ERA</span>
              <span className="join-form__title-post">RECLAMA TU RESPETO HOY</span>
            </h2>
          </div>

          <p className="join-form__subtitle" ref={subtitleRef}>
            {t('joinElite.description')}
          </p>

          {/* Barra de progreso */}
          <div className="join-form__progress">
            <div className="join-form__progress-bar" ref={progressBarRef}></div>
            <span className="join-form__progress-text">{Math.round(formProgress)}% Completado</span>
          </div>

          <form className="join-form__form" ref={formElementRef} onSubmit={handleSubmit}>
            <div className="join-form__input-wrapper">
              <label className="join-form__label" htmlFor="name">
                {t('joinElite.form.name')}
              </label>
              <input
                ref={el => inputRefs.current[0] = el}
                type="text"
                id="name"
                name="name"
                className={`join-form__input ${errors.name ? 'join-form__input--error' : ''} ${focusedField === 'name' ? 'join-form__input--focused' : ''}`}
                value={formData.name}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={isLoading}
                autoComplete="name"
              />
              {errors.name && (
                <span className="join-form__error">
                  <svg className="join-form__error-icon" width="16" height="16" viewBox="0 0 16 16">
                    <path fill="currentColor" d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 13a6 6 0 110-12 6 6 0 010 12zm1-5V4H7v5h2zm0 3V10H7v2h2z"/>
                  </svg>
                  {errors.name}
                </span>
              )}
            </div>

            <div className="join-form__input-wrapper">
              <label className="join-form__label" htmlFor="phone">
                {t('joinElite.form.phone')}
              </label>
              <input
                ref={el => inputRefs.current[1] = el}
                type="tel"
                id="phone"
                name="phone"
                className={`join-form__input ${errors.phone ? 'join-form__input--error' : ''} ${focusedField === 'phone' ? 'join-form__input--focused' : ''}`}
                value={formData.phone}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={isLoading}
                autoComplete="tel"
              />
              {errors.phone && (
                <span className="join-form__error">
                  <svg className="join-form__error-icon" width="16" height="16" viewBox="0 0 16 16">
                    <path fill="currentColor" d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 13a6 6 0 110-12 6 6 0 010 12zm1-5V4H7v5h2zm0 3V10H7v2h2z"/>
                  </svg>
                  {errors.phone}
                </span>
              )}
            </div>

            <div className="join-form__input-wrapper">
              <label className="join-form__label" htmlFor="email">
                {t('joinElite.form.email')}
              </label>
              <input
                ref={el => inputRefs.current[2] = el}
                type="email"
                id="email"
                name="email"
                className={`join-form__input ${errors.email ? 'join-form__input--error' : ''} ${focusedField === 'email' ? 'join-form__input--focused' : ''}`}
                value={formData.email}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={isLoading}
                autoComplete="email"
              />
              {errors.email && (
                <span className="join-form__error">
                  <svg className="join-form__error-icon" width="16" height="16" viewBox="0 0 16 16">
                    <path fill="currentColor" d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 13a6 6 0 110-12 6 6 0 010 12zm1-5V4H7v5h2zm0 3V10H7v2h2z"/>
                  </svg>
                  {errors.email}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="join-form__button"
              ref={ctaButtonRef}
              disabled={isLoading || Object.keys(errors).length > 0}
            >
              {isLoading ? (
                <span className="join-form__button-loading">
                  <span className="join-form__button-spinner"></span>
                  <span>{t('joinElite.form.processing')}</span>
                </span>
              ) : (
                <>
                  <span className="join-form__button-text">
                    {t('joinElite.form.submit')}
                  </span>
                  <span className="join-form__button-glow"></span>
                  <span className="join-form__button-shine"></span>
                </>
              )}
            </button>

            {isSuccess && (
              <div className="join-form__message join-form__message--success">
                <svg className="join-form__message-icon" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                {t('joinElite.form.successMessage')}
              </div>
            )}

            {isError && (
              <div className="join-form__message join-form__message--error">
                <svg className="join-form__message-icon" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {t('joinElite.form.errorMessage')}
              </div>
            )}
          </form>

          {/* Elementos decorativos premium */}
          <div className="join-form__decoration join-form__decoration--1"></div>
          <div className="join-form__decoration join-form__decoration--2"></div>
          <div className="join-form__decoration join-form__decoration--3"></div>
        </div>
      </div>
    </section>
  );
};

// Función de utilidad para debounce
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default JoinForm;