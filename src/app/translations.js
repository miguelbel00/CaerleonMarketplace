// Archivo de traducciones para la aplicación
export const translations = {
  'ES-ES': {
    // Títulos y headers
    title: 'Data Albion Search',
    languageSelector: 'Selecciona el Idioma de Busqueda',
    searchByName: 'Busqueda por Nombre',
    cities: 'Ciudades',
    lastUpdate: 'Última Actualizacion',
    noAvailable: 'No disponible',
    
    // Botones
    search: 'Buscar',
    clear: 'Borrar',
    selectAll: 'Seleccionar todas',
    remove: 'Eliminar',
    
    // Mensajes
    selectItemOrCity: 'Por favor, selecciona al menos un item o una ciudad.',
    noResultsFound: 'No se encontraron resultados',
    noResultsFoundMessage: 'No results found',
    
    // Tablas
    image: 'Imagen',
    quality: 'Calidad',
    city: 'Ciudad',
    sellPriceMin: 'Venta - Min',
    buyPriceMax: 'Compra - Max',
    actions: 'Acciones',
    sellPriceMinBlackMarket: 'Venta - Min Black Market',
    profit: 'Profit',
    
    // Calidades
    unknown: 'Desconocido',
    plain: 'Plano',
    good: 'Bueno',
    outstanding: 'Notable',
    excellent: 'Sobresaliente',
    masterpiece: 'Obra maestra',
    
    // Ciudades
    blackMarket: 'Black Market',
    bridgewatch: 'Bridgewatch',
    caerleon: 'Caerleon',
    fortSterling: 'Fort Sterling',
    lymhurst: 'Lymhurst',
    martlock: 'Martlock',
    thetford: 'Thetford',
    
    // Pestañas
    priceItems: 'Precio items',
    comparativeBlackMarket: 'Comparativa Black Market',
    
    // Filtros
    filters: 'Filtros',
    allCities: 'Todas las ciudades',
    
    // Placeholders
    selectPlaceholder: 'Seleccionar...',
    
    // Errores
    errorFetchingData: 'Error al obtener los datos:',
    errorFetchingDataEn: 'Error fetching data:',
  },
  
  'EN-US': {
    // Titles and headers
    title: 'Albion Data Search',
    languageSelector: 'Select Search Language',
    searchByName: 'Search by Name',
    cities: 'Cities',
    lastUpdate: 'Last Update',
    noAvailable: 'Not available',
    
    // Buttons
    search: 'Search',
    clear: 'Clear',
    selectAll: 'Select all',
    remove: 'Remove',
    
    // Messages
    selectItemOrCity: 'Please select at least one item or city.',
    noResultsFound: 'No results found',
    noResultsFoundMessage: 'No results found',
    
    // Tables
    image: 'Image',
    quality: 'Quality',
    city: 'City',
    sellPriceMin: 'Sell - Min',
    buyPriceMax: 'Buy - Max',
    actions: 'Actions',
    sellPriceMinBlackMarket: 'Sell - Min Black Market',
    profit: 'Profit',
    
    // Qualities
    unknown: 'Unknown',
    plain: 'Plain',
    good: 'Good',
    outstanding: 'Outstanding',
    excellent: 'Excellent',
    masterpiece: 'Masterpiece',
    
    // Cities
    blackMarket: 'Black Market',
    bridgewatch: 'Bridgewatch',
    caerleon: 'Caerleon',
    fortSterling: 'Fort Sterling',
    lymhurst: 'Lymhurst',
    martlock: 'Martlock',
    thetford: 'Thetford',
    
    // Tabs
    priceItems: 'Price Items',
    comparativeBlackMarket: 'Black Market Comparison',
    
    // Filters
    filters: 'Filters',
    allCities: 'All cities',
    
    // Placeholders
    selectPlaceholder: 'Select...',
    
    // Errors
    errorFetchingData: 'Error al obtener los datos:',
    errorFetchingDataEn: 'Error fetching data:',
  }
};

// Función helper para obtener traducción
export const getTranslation = (language, key) => {
  return translations[language]?.[key] || key;
};

// Función helper para obtener traducción con fallback
export const getTranslationWithFallback = (language, key, fallbackKey = 'ES-ES') => {
  return translations[language]?.[key] || translations[fallbackKey]?.[key] || key;
}; 