'use client';

import { useState, useEffect, useMemo } from 'react';
import { listItems } from './items'; // Importar los datos desde items.js
import Select from 'react-select';
import BasicTabs from './components/tabs';
import { CITIES, getDefaultCity, getAllCities, getCities } from './constants';
import { getTranslation } from './translations';

export default function Home() {

  useEffect(() => {
    const savedSearch = localStorage.getItem('selectedSearch');
    const savedCities = localStorage.getItem('selectedCities');
    if (savedSearch) setSelectedSearch(JSON.parse(savedSearch));
    if (savedCities) setSelectedCities(JSON.parse(savedCities));
  }, []);

  const [tabValue, setTabValue] = useState(0);
  const [selectedSearch, setSelectedSearch] = useState([]);
  const [select1, setSelect1] = useState('ES-ES'); // Español por defecto
  const [selectedCities, setSelectedCities] = useState([getDefaultCity(select1)]); // Establecer Black Market como seleccionado por defecto
  const [isClient, setIsClient] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [itemsSearchResults, setItemsSearchTable] = useState([]);
  const [blackMarketResults, setBlackMarketResults] = useState([]);
  const [debouncedInput, setDebouncedInput] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');

  const changeTab = (event, newValue) => {
    setTabValue(newValue);
  };


  useEffect(() => {
    localStorage.setItem('selectedSearch', JSON.stringify(selectedSearch));
    localStorage.setItem('selectedCities', JSON.stringify(selectedCities));
  }, [selectedSearch, selectedCities]);

  // Actualizar ciudades cuando cambie el idioma
  useEffect(() => {
    const currentCities = getCities(select1);
    setSelectedCities(prev => {
      // Mantener las ciudades seleccionadas pero con las nuevas traducciones
      return prev.map(selectedCity => {
        const translatedCity = currentCities.find(city => city.value === selectedCity.value);
        return translatedCity || selectedCity;
      });
    });
  }, [select1]);

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setDebouncedInput(inputValue);
    }, 700);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const removeItem = (itemToRemove) => {
    // Crear un identificador único para cada item basado en sus propiedades
    const createItemId = (item) => `${item.item_id}_${item.city}_${item.quality}`;
    const itemIdToRemove = createItemId(itemToRemove);
    
    const updatedResults = itemsSearchResults.filter(item => {
      const itemId = createItemId(item);
      return itemId !== itemIdToRemove;
    });
    
    setItemsSearchTable(updatedResults);
  };

  const removeBlackMarketItem = (itemToRemove) => {
    // Crear un identificador único para cada item basado en sus propiedades
    const createItemId = (item) => `${item.item_id}_${item.city}_${item.quality}`;
    const itemIdToRemove = createItemId(itemToRemove);
    
    const updatedResults = blackMarketResults.filter(item => {
      const itemId = createItemId(item);
      return itemId !== itemIdToRemove;
    });
    
    setBlackMarketResults(updatedResults);
  };

//Normaliza la cadena de texto eliminando acentos y convirtiéndola a minúsculas
  const normalizeString = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const fetchBuscar = async () => {
    if (selectedSearch.length === 0 || selectedCities.length === 0) {
      alert(getTranslation(select1, 'selectItemOrCity'));
      return;
    }

    try {
      // Crear una sola URL con todos los items y ciudades concatenados
      const itemsString = selectedSearch.map(item => item.value).join(',');
      const citiesString = selectedCities.map(city => encodeURIComponent(city.value)).join(',');
      const fetchUrl = `https://www.albion-online-data.com/api/v2/stats/Prices/${itemsString}.json?locations=${citiesString}`;
      
      const response = await fetch(fetchUrl);
      const data = await response.json();
      
      // Filtrar los datos para eliminar aquellos sin `sell_price_min` o `buy_price_max`
      const filteredData = data.filter(itemData => 
        itemData.sell_price_min != 0 || itemData.buy_price_max != 0
      );

      // Agregar el nombre del item a cada resultado
      const resultsWithNames = filteredData.map(itemData => {
        const selectedItem = selectedSearch.find(item => item.value === itemData.item_id);
        return {
          ...itemData,
          name: selectedItem ? selectedItem.label : itemData.item_id,
        };
      });

      if (resultsWithNames.length === 0) {
        alert(getTranslation(select1, 'noResultsFound'));
      } else {
        setItemsSearchTable(resultsWithNames);
      }
      
      const now = new Date().toLocaleString();
      setLastUpdate(now);
      localStorage.setItem('lastUpdate', now);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };



  const fetchComparar = async () => {
    if (selectedSearch.length === 0 || selectedCities.length === 0) {
      alert(getTranslation(select1, 'selectItemOrCity'));
      return;
    }

    try {
      // Crear una sola URL con todos los items y todas las ciudades (incluyendo Black Market)
      const itemsString = selectedSearch.map(item => item.value).join(',');
      const allCities = [...selectedCities.map(city => city.value), 'Black Market'];
      const citiesString = allCities.map(city => encodeURIComponent(city)).join(',');
      const fetchUrl = `https://www.albion-online-data.com/api/v2/stats/Prices/${itemsString}.json?locations=${citiesString}`;
      
      const response = await fetch(fetchUrl);
      const data = await response.json();
      
      // Filtrar los datos para eliminar aquellos sin `sell_price_min` o `buy_price_max`
      const filteredData = data.filter(itemData => 
        itemData.sell_price_min != 0 || itemData.buy_price_max != 0
      );

      // Separar datos de Black Market y ciudades normales
      const blackMarketData = filteredData.filter(item => item.city === 'Black Market');
      const normalCitiesData = filteredData.filter(item => item.city !== 'Black Market');

      // Agregar el nombre del item a cada resultado
      const resultsWithNames = normalCitiesData.map(itemData => {
        const selectedItem = selectedSearch.find(item => item.value === itemData.item_id);
        return {
          ...itemData,
          name: selectedItem ? selectedItem.label : itemData.item_id,
        };
      });

      // Calcular profit para cada item
      const updatedResults = resultsWithNames.map(result => {
        const blackMarketItem = blackMarketData.find(
          bmItem => bmItem.item_id === result.item_id && bmItem.quality === result.quality
        );
        return {
          ...result,
          profit: (blackMarketItem?.sell_price_min || 0) - (result?.sell_price_min || 0),
          sell_price_min_black_market: (blackMarketItem?.sell_price_min || 0)
        };
      });

      if (updatedResults.length === 0) {
        alert(getTranslation(select1, 'noResultsFound'));
      } else {
        setBlackMarketResults(updatedResults);
      }
      
      const now = new Date().toLocaleString();
      setLastUpdate(now);
      localStorage.setItem('lastUpdate', now);
    } catch (error) {
      console.error(getTranslation(select1, 'errorFetchingData'), error);
    }
  };

  const languageOptions = useMemo(() => [
    { value: 'EN-US', label: 'English' },
    { value: 'ES-ES', label: 'Español' }
  ], []);

  const options = useMemo(() => {
    return listItems
      .map(item => ({
        value: item.UniqueName,
        label: item.LocalizedNames[select1],
        index: item.Index,
      }));
  }, [select1]);


  const filteredOptions = useMemo(() => {
    if (!inputValue) return [];
    const normalizedInput = normalizeString(inputValue);
    return options.filter(option =>
      normalizeString(option.label).includes(normalizedInput)
    ).slice(0, 10);
  }, [inputValue, options]);

  const handleLanguageChange = (selectedOption) => {
    setSelect1(selectedOption.value);
  };

  const toggleCity = (value) => {
    setSelectedCities((prev) => {
      const cityExists = prev.some((city) => city.value === value);

      if (cityExists) {
        const updatedCities = prev.filter((city) => city.value !== value);
        return updatedCities.length === 0 ? prev : updatedCities;
      } else {
        const selectedCity = cities.find((city) => city.value === value);
        return [...prev, selectedCity];
      }
    });
  };

  const cities = getCities(select1);

  const customStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: 'white',
      borderColor: '#ccc',
      color: '#333',
      minWidth: '300px',
      width: 'auto',
      '&:hover': {
        borderColor: '#888',
      },
    }),
    input: (styles) => ({
      ...styles,
      color: '#333',
      minWidth: '100px',
    }),
    menu: (styles) => ({
      ...styles,
      maxHeight: 1000,
    }),
    option: (styles, { isSelected, isFocused }) => ({
      ...styles,
      maxHeight: 1000,
      backgroundColor: isSelected ? '#007bff' : isFocused ? '#f0f0f0' : null,
      color: isSelected ? 'white' : '#333',
    }),
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 p-6 bg-gray-100 ">
      <h1 className="text-3xl font-bold text-gray-900 bg-white px-6 py-2 rounded-xl shadow-md">{getTranslation(select1, 'title')}</h1>
      {/* Selector de idioma */}
      <div className="w-96 p-4 bg-white rounded-xl shadow-lg text-center">
        <label className="block text-gray-700 font-semibold ">{getTranslation(select1, 'languageSelector')}</label>
        <Select
          className="w-full mt-2"
          options={languageOptions}
          value={languageOptions.find(option => option.value === select1)}
          onChange={handleLanguageChange}
          styles={customStyles}
        />
      </div>

      {/* Buscador por nombre */}
      <div className="w-96 p-4 bg-white rounded-xl shadow-lg text-center">
        <label className="block text-gray-700 font-semibold">{getTranslation(select1, 'searchByName')}</label>
        <Select
          isMulti
          className="w-full mt-2"
          placeholder={getTranslation(select1, 'selectPlaceholder')}
          options={filteredOptions}
          value={selectedSearch}
          onChange={setSelectedSearch}
          onInputChange={(newValue) => setInputValue(newValue)}
          getOptionLabel={(e) => e.label}
          noOptionsMessage={() => getTranslation(select1, 'noResultsFoundMessage')}
          inputValue={inputValue}
          styles={customStyles}
        />
      </div>

      {/* Ciudades */}
      <div className="w-96 p-4 bg-white rounded-xl shadow-lg text-center ">
        <label className="block text-gray-700 font-semibold mb-2">{getTranslation(select1, 'cities')}</label>
        <div className="flex flex-wrap gap-2 p-2 justify-center ">
          <button
            onClick={() => setSelectedCities(cities.map(c => ({ value: c.value, label: c.label })))}
            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
          >
            {getTranslation(select1, 'selectAll')}
          </button>

          {cities.map((city) => (
            <button
              key={city.value}
              onClick={() => toggleCity(city.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedCities.some(s => s.value === city.value)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
                } hover:bg-blue-400 hover:text-white transition-colors`}
            >
              {city.label}
            </button>
          ))}
        </div>
      </div>
      <div className="w-96 p-3 bg-white shadow-md rounded-lg border border-gray-200 text-center mt-4">
        <p className="text-gray-500 text-sm">{getTranslation(select1, 'lastUpdate')}</p>
        <p className="text-gray-800 font-semibold">{lastUpdate || getTranslation(select1, 'noAvailable')}</p>
      </div>
      {/* Botones de acción */}
      <div className="space-x-4 ">
        <button className="w-44 px-4 py-2 bg-blue-500 text-white rounded-md" onClick={() => {tabValue==0 ? fetchBuscar() : fetchComparar()}}>
          {getTranslation(select1, 'search')}
        </button>
        <button
          className=" w-44 px-4 py-2 bg-red-500 text-white rounded-md"
          onClick={() => {
            setItemsSearchTable([]);
            setSelectedSearch([]);
            setBlackMarketResults([]);
            setSelectedCities([getDefaultCity(select1)]);
            setLastUpdate('');
            localStorage.removeItem('selectedSearch'); // Limpiar cache
            localStorage.removeItem('selectedCities');
            localStorage.removeItem('lastUpdate');
          }}
        >
          {getTranslation(select1, 'clear')}
        </button>
      </div>
      <BasicTabs 
        profitElements={blackMarketResults} 
        changeTab={changeTab} 
        tabValue={tabValue} 
        removeResultCallback={removeItem}
        removeBlackMarketCallback={removeBlackMarketItem}
        elements={itemsSearchResults} 
        sortByCallback={(column) => { console.log('Ordenar por', column); }} 
        language={select1}
      />
    </div>
  );
}
