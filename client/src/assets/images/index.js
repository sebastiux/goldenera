// Aquí irán las imágenes generales (hero, backgrounds, etc.)
 import { use } from 'i18next';
import Coach from './Coach.jpg';
 import jointheclub from './jointheclub.gif';
 import usethematerial from './usethematerial.gif';
// import HeroBackground from './hero-bg.jpg';
// import AboutBackground from './about-bg.jpg';
// import GymPhoto1 from './gym-photo-1.jpg';
// import GymPhoto2 from './gym-photo-2.jpg';
// import CoachPhoto from './coach.jpg';

export const images = {
  coach: Coach,
  jointheclub: jointheclub,
  usethematerial: usethematerial
  // aboutBg: AboutBackground,
  // gym1: GymPhoto1,
  // gym2: GymPhoto2,
  // coach: CoachPhoto,
};

// Exportar individualmente cuando agregues imágenes
export {
    Coach,
    jointheclub,
    usethematerial
//   HeroBackground,
//   AboutBackground,
//   GymPhoto1,
//   GymPhoto2,
//   CoachPhoto,
};

export default images;