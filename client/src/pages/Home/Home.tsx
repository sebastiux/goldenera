import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../../components/ui/Hero/Hero';
import Philosophy from '../../components/ui/Philosophy/Philosophy';
import Method from '../../components/ui/Method/Method';
import WhyItWorks from '../../components/ui/WhyItWorks/WhyItWorks';
import GuaranteedResults from '../../components/ui/GuaranteedResults/GuaranteedResults';
import Testimonials from '../../components/ui/Testimonials/Testimonials';
import Partners from '../../components/ui/Partners/Partners';
import JoinForm from '../../components/ui/JoinForm/JoinForm';
import './Home.scss';

gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  useEffect(() => {
    // Limpiar ScrollTriggers al desmontar
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="home-page">
      <Hero />
      <Philosophy />
      <Method />
      <WhyItWorks />
      <GuaranteedResults />
      <Testimonials />
      <Partners />
      <JoinForm />
    </div>
  );
};

export default Home;