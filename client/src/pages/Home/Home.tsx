// client/src/pages/Home/Home.tsx
import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../../components/ui/Hero/Hero';
import Philosophy from '../../components/ui/Philosophy/Philosophy';
import Coach from '../../components/ui/Coach/Coach';
import Method from '../../components/ui/Method/Method';
import MotivationalPhrase from '../../components/ui/MotivationalPhrase/MotivationalPhrase';
import WhyItWorks from '../../components/ui/WhyItWorks/WhyItWorks';
import Package from '../../components/ui/Package/Package';
//import Partners from '../../components/ui/Partners/Partners';
import JoinForm from '../../components/ui/JoinForm/JoinForm';
import './Home.scss';

gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  useEffect(() => {
    ScrollTrigger.refresh();
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="home-page">
      <Hero />
      <Philosophy />
      <Coach />
      <Method />
      <MotivationalPhrase />
      <WhyItWorks />
      <Package />
      <JoinForm />
    </div>
  );
};

export default Home;