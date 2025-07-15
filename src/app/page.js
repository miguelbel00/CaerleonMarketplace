'use client';

import { useState, useEffect, useMemo } from 'react';
import { listItems } from './items'; // Importar los datos desde items.js
import Select from 'react-select';
import BasicTabs from './components/tabs';

export default function Home() {

  useEffect(() => {
    const savedSearch = localStorage.getItem('selectedSearch');
    const savedCities = localStorage.getItem('selectedCities');

    if (savedSearch) setSelectedSearch(JSON.parse(savedSearch));
    if (savedCities) setSelectedCities(JSON.parse(savedCities));
  }, []);

  const [tabValue, setTabValue] = useState(0);
  const [selectedSearch, setSelectedSearch] = useState([]);
  const [selectedCities, setSelectedCities] = useState([{ value: 'Black%20Market', label: 'Black Market' }]); // Establecer Black Market como seleccionado por defecto
  const [select1, setSelect1] = useState('ES-ES');
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

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setDebouncedInput(inputValue);
    }, 700);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const removeItem = (index) => {
    const updatedResults = itemsSearchResults.filter((_, i) => i !== index);
    setItemsSearchTable(updatedResults); // Actualizamos el estado eliminando el ítem
  };


  const normalizeString = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const fetchBuscar = async () => {
    if (selectedSearch.length === 0 || selectedCities.length === 0) {
      alert('Por favor, selecciona al menos un item o una ciudad.');
      return;
    }

    const fetchPromises = [];

    selectedSearch.forEach(selectSearch => {
      selectedCities.forEach(selectedCity => {
        const fetchUrl = `https://www.albion-online-data.com/api/v2/stats/Prices/${selectSearch.value}.json?locations=${selectedCity.value}`;
        const fetchPromise = fetch(fetchUrl)
          .then(res => res.json())
          .then(data => {
            // Filtrar los datos para eliminar aquellos sin `sell_price_min` o `buy_price_max`
            return data
              .filter(itemData => itemData.sell_price_min != 0 || itemData.buy_price_max != 0)  /// Filtrar los items sin precios
              .map(itemData => ({
                ...itemData,
                city: selectedCity.value,
                name: selectSearch.label,
              }));
          })
          .catch(error => console.error('Error fetching data:', error));

        fetchPromises.push(fetchPromise);
      });
    });

    try {
      const results = await Promise.all(fetchPromises);
      const allResults = results.flat();
      if (allResults.length === 0) {
        alert('No se encontraron resultados');
      } else {
        setItemsSearchTable(allResults); // Actualizar los datos en la tabla
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
      alert('Por favor, selecciona al menos un item o una ciudad.');
      return;
    }

    

    const fetchPromisesItems = [];
    const fetchBlackMarket = []
    
    //data de blackmarket
    selectedSearch.forEach(selectSearch => {
      const fetchUrl = `https://www.albion-online-data.com/api/v2/stats/Prices/${selectSearch.value}.json?locations=Black Market`;
      const fetchPromise = fetch(fetchUrl)
        .then(res => res.json())
        .then(data => {
          // Filtrar los datos para eliminar aquellos sin `sell_price_min` o `buy_price_max`
          return data
            .filter(itemData => itemData.sell_price_min != 0 || itemData.buy_price_max != 0)  /// Filtrar los items sin precios
            .map(itemData => ({
              ...itemData,
              city: 'Black%20Market',
              name: selectSearch.label,
            }));
        })
        .catch(error => console.error('Error fetching data:', error));

        fetchBlackMarket.push(fetchPromise);
    });
  
    //data general
    selectedSearch.forEach(selectSearch => {
      selectedCities.forEach(selectedCity => {
        const fetchUrl = `https://www.albion-online-data.com/api/v2/stats/Prices/${selectSearch.value}.json?locations=${selectedCity.value}`;
        const fetchPromise = fetch(fetchUrl)
          .then(res => res.json())
          .then(data => {
            // Filtrar los datos para eliminar aquellos sin `sell_price_min` o `buy_price_max`
            return data
              .filter(itemData => itemData.sell_price_min != 0 || itemData.buy_price_max != 0)  /// Filtrar los items sin precios
              .map(itemData => ({
                ...itemData,
                city: selectedCity.value,
                name: selectSearch.label,
              }));
          })
          .catch(error => console.error('Error fetching data:', error));

          fetchPromisesItems.push(fetchPromise);
      });
    });

    try {
      const resultsItems = await Promise.all(fetchPromisesItems);
      const allResultsItems = resultsItems.flat();
      const resultsBlackMarket = await Promise.all(fetchBlackMarket);
      const allResultsBlackMarket = resultsBlackMarket.flat();

      const updatedResults = allResultsItems.map(result => {
        const blackMarketItem = allResultsBlackMarket.find(
          resultBlackMarket => resultBlackMarket.item_id == result.item_id && resultBlackMarket.quality == result.quality
        );
        return {
          ...result,
          profit: (blackMarketItem?.sell_price_min || 0) - (result?.sell_price_min || 0 ),
          sell_price_min_black_market :(blackMarketItem?.sell_price_min || 0)
        };
      });

      if (updatedResults.length === 0) {
        alert('No se encontraron resultados');
      } else {
        setBlackMarketResults(updatedResults); // Actualizar los datos en la tabla
      }
      const now = new Date().toLocaleString();
      setLastUpdate(now);
      localStorage.setItem('lastUpdate', now);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
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

  const cities = [
    { label: 'Black Market', value: 'Black%20Market' },
    { label: 'Bridgewatch', value: 'Bridgewatch' },
    { label: 'Caerleon', value: 'Caerleon' },
    { label: 'Fort Sterling', value: 'Fort%20Sterling' },
    { label: 'Lymhurst', value: 'Lymhurst' },
    { label: 'Martlock', value: 'Martlock' },
    { label: 'Thetford', value: 'Thetford' },
  ];

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
      <h1 className="text-3xl font-bold text-gray-900 bg-white px-6 py-2 rounded-xl shadow-md">Data Albion Search</h1>
      {/* Selector de idioma */}
      <div className="w-96 p-4 bg-white rounded-xl shadow-lg text-center">
        <label className="block text-gray-700 font-semibold ">Selecciona el Idioma de Busqueda</label>
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
        <label className="block text-gray-700 font-semibold">Busqueda por Nombre</label>
        <Select
          isMulti
          className="w-full mt-2"
          placeholder='Seleccionar...'
          options={filteredOptions}
          value={selectedSearch}
          onChange={setSelectedSearch}
          onInputChange={(newValue) => setInputValue(newValue)}
          getOptionLabel={(e) => e.label}
          noOptionsMessage={() => 'No results found'}
          inputValue={inputValue}
          styles={customStyles}
        />
      </div>

      {/* Ciudades */}
      <div className="w-96 p-4 bg-white rounded-xl shadow-lg text-center ">
        <label className="block text-gray-700 font-semibold mb-2">Ciudades</label>
        <div className="flex flex-wrap gap-2 p-2 justify-center ">
          <button
            onClick={() => setSelectedCities(cities.map(c => ({ value: c.value, label: c.label })))}
            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
          >
            Seleccionar todas
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
        <p className="text-gray-500 text-sm">Última Actualizacion</p>
        <p className="text-gray-800 font-semibold">{lastUpdate || 'No disponible'}</p>
      </div>
      {/* Botones de acción */}
      <div className="space-x-4 ">
        <button className="w-44 px-4 py-2 bg-blue-500 text-white rounded-md" onClick={() => {tabValue==0 ? fetchBuscar() : fetchComparar()}}>
          Buscar
        </button>
        <button
          className=" w-44 px-4 py-2 bg-red-500 text-white rounded-md"
          onClick={() => {
            setItemsSearchTable([]);
            setSelectedSearch([]);
            setBlackMarketResults([]);
            setSelectedCities([{ value: 'Black%20Market', label: 'Black Market' }]);
            setLastUpdate('');
            localStorage.removeItem('selectedSearch'); // Limpiar cache
            localStorage.removeItem('selectedCities');
            localStorage.removeItem('lastUpdate');
          }}
        >
          Borrar
        </button>
      </div>
      <BasicTabs profitElements={blackMarketResults} changeTab={changeTab} tabValue={tabValue} removeResultCallback={removeItem} elements={itemsSearchResults} sortByCallback={(column) => { console.log('Ordenar por', column); }} ></BasicTabs>
    </div>
  );
}
