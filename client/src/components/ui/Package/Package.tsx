import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import './Package.scss';

gsap.registerPlugin(ScrollTrigger);

interface PackageItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const PackageItem: React.FC<PackageItemProps> = ({ icon, title, description }) => (
  <div className="package-item">
    <div className="package-icon">{icon}</div>
    <div className="package-content">
      <h3 className="package-title">{title}</h3>
      <p className="package-description">{description}</p>
    </div>
  </div>
);

const Package: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.package-item', {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%'
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="package-section">
      <div className="container">
        <div className="package-header">
          <h2 className="arabic-title" dir="rtl">تتضمن هذه الحزمة</h2>
          <h2 className="section-title">{t('home.package.title')}</h2>
        </div>

        <div className="package-list">
          <PackageItem
            icon={
              <div className="icon-placeholder">
                <img src="https://placehold.co/253x277" alt="Coach" />
              </div>
            }
            title={t('home.package.coaching.title')}
            description={t('home.package.coaching.description')}
          />
          
          <PackageItem
            icon={
              <div className="icon-placeholder">
                <img src="https://placehold.co/254x318" alt="Apps" />
              </div>
            }
            title={t('home.package.apps.title')}
            description={t('home.package.apps.description')}
          />
          
          <PackageItem
            icon={
              <div className="icon-placeholder">
                <img src="https://placehold.co/258x256" alt="Recipes" />
              </div>
            }
            title={t('home.package.recipes.title')}
            description={t('home.package.recipes.description')}
          />
          
          <PackageItem
            icon={
              <div className="icon-placeholder">
                <img src="https://placehold.co/270x232" alt="Merch" />
              </div>
            }
            title={t('home.package.merch.title')}
            description={t('home.package.merch.description')}
          />
        </div>
      </div>
    </section>
  );
};

export default Package;