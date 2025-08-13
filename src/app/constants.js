import { getTranslation } from './translations';

// Función para obtener las ciudades con traducciones
export const getCities = (language = 'ES-ES') => [
  { label: getTranslation(language, 'blackMarket'), value: 'Black Market' },
  { label: getTranslation(language, 'bridgewatch'), value: 'Bridgewatch' },
  { label: getTranslation(language, 'caerleon'), value: 'Caerleon' },
  { label: getTranslation(language, 'fortSterling'), value: 'Fort Sterling' },
  { label: getTranslation(language, 'lymhurst'), value: 'Lymhurst' },
  { label: getTranslation(language, 'martlock'), value: 'Martlock' },
  { label: getTranslation(language, 'thetford'), value: 'Thetford' },
];

// Constantes para las ciudades de Albion Online (mantener para compatibilidad)
export const CITIES = getCities('ES-ES');

// Función helper para obtener la ciudad por defecto (Black Market)
export const getDefaultCity = (language = 'ES-ES') => getCities(language)[0];

// Función helper para obtener todas las ciudades como array de objetos con value y label
export const getAllCities = (language = 'ES-ES') => getCities(language).map(city => ({ value: city.value, label: city.label })); 