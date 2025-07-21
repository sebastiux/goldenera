import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './JoinForm.scss';

gsap.registerPlugin(ScrollTrigger);

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

const JoinForm: React.FC = () => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const formElementRef = useRef<HTMLFormElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline de animación de entrada
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      // Animación del título con efecto de revelación
      tl.fromTo(titleRef.current, 
        {
          opacity: 0,
          y: 50,
          clipPath: "inset(100% 0% 0% 0%)"
        },
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          ease: "power4.out"
        }
      );

      // Animación del subtítulo
      tl.fromTo(subtitleRef.current,
        {
          opacity: 0,
          y: 30,
          filter: "blur(10px)"
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out"
        },
        "-=0.8"
      );

      // Animación del formulario
      tl.fromTo(formElementRef.current,
        {
          opacity: 0,
          scale: 0.95,
          y: 40
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "power3.out"
        },
        "-=0.6"
      );

      // Animación de los campos del formulario
      const inputs = formElementRef.current?.querySelectorAll('.join-form__input-wrapper');
      if (inputs) {
        tl.fromTo(inputs,
          {
            opacity: 0,
            x: -30
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
          },
          "-=0.5"
        );
      }

      // Animación del botón CTA con efecto premium
      tl.fromTo(ctaButtonRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: 20
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "elastic.out(1, 0.5)"
        },
        "-=0.3"
      );

      // Animación hover para el botón
      if (ctaButtonRef.current) {
        gsap.to(ctaButtonRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
          paused: true,
          repeat: -1,
          yoyo: true,
          yoyoEase: "power2.inOut"
        });
      }
    }, formRef);

    return () => ctx.revert();
  }, []);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return t('joinElite.form.errors.nameRequired');
        if (value.length < 2) return t('joinElite.form.errors.nameTooShort');
        break;
      case 'phone':
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{4,6}$/;
        if (!value.trim()) return t('joinElite.form.errors.phoneRequired');
        if (!phoneRegex.test(value.replace(/\s/g, ''))) return t('joinElite.form.errors.phoneInvalid');
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return t('joinElite.form.errors.emailRequired');
        if (!emailRegex.test(value)) return t('joinElite.form.errors.emailInvalid');
        break;
    }
    return undefined;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validación en tiempo real solo si el campo ha sido tocado
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) newErrors[key as keyof FormErrors] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Animar el formulario para indicar error
      gsap.fromTo(formElementRef.current, 
        { x: 0 },
        {
          x: 10,
          duration: 0.5,
          ease: "power2.inOut",
          repeat: 3,
          yoyo: true
        }
      );
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      // Llamada al backend para procesar el pago con Stripe
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          language: localStorage.getItem('i18nextLng') || 'en'
        })
      });

      if (!response.ok) throw new Error('Payment initialization failed');

      const { checkoutUrl } = await response.json();
      
      // Redirigir a Stripe Checkout
      window.location.href = checkoutUrl;
      
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
      setIsLoading(false);
      
      // Animación de error
      gsap.to(formElementRef.current, {
        scale: 0.98,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
  };

  return (
    <section className="join-form" ref={formRef}>
      <div className="join-form__container">
        <div className="join-form__content">
          <h2 className="join-form__title" ref={titleRef}>
            {t('joinElite.title')}
          </h2>
          <p className="join-form__subtitle" ref={subtitleRef}>
            {t('joinElite.description')}
          </p>

          <form className="join-form__form" ref={formElementRef} onSubmit={handleSubmit}>
            <div className="join-form__input-wrapper">
              <input
                type="text"
                name="name"
                className={`join-form__input ${errors.name ? 'join-form__input--error' : ''}`}
                placeholder={t('joinElite.form.name')}
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
              {errors.name && (
                <span className="join-form__error">{errors.name}</span>
              )}
            </div>

            <div className="join-form__input-wrapper">
              <input
                type="tel"
                name="phone"
                className={`join-form__input ${errors.phone ? 'join-form__input--error' : ''}`}
                placeholder={t('joinElite.form.phone')}
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
              {errors.phone && (
                <span className="join-form__error">{errors.phone}</span>
              )}
            </div>

            <div className="join-form__input-wrapper">
              <input
                type="email"
                name="email"
                className={`join-form__input ${errors.email ? 'join-form__input--error' : ''}`}
                placeholder={t('joinElite.form.email')}
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
              {errors.email && (
                <span className="join-form__error">{errors.email}</span>
              )}
            </div>

            <button
              type="submit"
              className="join-form__button"
              ref={ctaButtonRef}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="join-form__button-loading">
                  <span className="join-form__button-spinner"></span>
                  {t('joinElite.form.processing')}
                </span>
              ) : (
                <>
                  <span className="join-form__button-text">
                    {t('joinElite.form.submit')}
                  </span>
                  <span className="join-form__button-glow"></span>
                </>
              )}
            </button>

            {isSuccess && (
              <div className="join-form__message join-form__message--success">
                {t('joinElite.form.successMessage')}
              </div>
            )}

            {isError && (
              <div className="join-form__message join-form__message--error">
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

export default JoinForm;