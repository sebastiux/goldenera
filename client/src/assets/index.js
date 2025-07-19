// Importar todos los módulos de assets
import logos from './logos';
import images from './images';
import videos from './videos';
import icons from './icons';
import fonts from './fonts';

// Re-exportar todo desde los sub-módulos para acceso directo
export * from './logos';
export * from './images';
export * from './videos';
export * from './icons';
export * from './fonts';

// Exportar objetos agrupados
export {
  logos,
  images,
  videos,
  icons,
  fonts,
};

// Crear y exportar un objeto maestro con todos los assets
const assets = {
  logos,
  images,
  videos,
  icons,
  fonts,
};

export default assets;