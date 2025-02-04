'use client';

import { useState, useEffect, useMemo } from 'react';
import { listItems } from './items'; // Importar los datos desde items.js
import Select from 'react-select';
import { FixedSizeList as List } from 'react-window';
import PricesTable from './components/PricesTable';




export default function Home() {
  const [selected1, setSelected1] = useState([]);
  const [selectedSearch, setSelectedSearch] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [select3, setSelect3] = useState('EN-US');
  const [isClient, setIsClient] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [resultsTable, setResultsTable] = useState([]);
  const [results, setResults] = useState([]); // Estado para guardar los resultados

  useEffect(() => {
    setIsClient(true);
  }, []);

  const customComponents = {
    MenuList: (props) => {
      const { options, children, maxHeight } = props;
      const height = 35;
      return (
        <List
          height={Math.min(maxHeight, options.length * height)}
          itemCount={options.length}
          itemSize={height}
          width="100%"
        >
          {({ index, style }) => (
            <div style={style}>{children[index]}</div>
          )}
        </List>
      );
    },
  };
  
  const handleFetchData = async () => {
    // Si no hay elementos seleccionados, salimos
    if (selectedSearch.length === 0 || selectedCities.length === 0) {
      alert('Por favor, selecciona al menos un item y una ciudad.');
      return;
    }
  
    // Recoger los UniqueName de los items seleccionados
    const itemNames = selectedSearch.map(item => item.value); // Aquí usamos el `value` de los items seleccionados
  
    // Recoger los valores de las ciudades seleccionadas
    const cities = selectedCities.map(city => city.value);
  
    // Crear un array para almacenar todas las promesas de los fetches
    const fetchPromises = [];
  
    // Para cada combinación de item y ciudad, creamos una promesa de fetch
    itemNames.forEach(itemName => {
      cities.forEach(city => {
        const fetchUrl = `https://www.albion-online-data.com/api/v2/stats/Prices/${itemName}.json?locations=${city}`;
        const fetchPromise = fetch(fetchUrl)
          .then(res => res.json())
          .then(data => {
            // Mapeamos los resultados para añadirles el nombre de la ciudad y el UniqueName
            return data.map(itemData => ({
              ...itemData,
              city: city,
              name: itemName
            }));
          })
          .catch(error => console.error('Error fetching data:', error));
        
        fetchPromises.push(fetchPromise); // Añadimos la promesa al array
      });
    });
  
    // Esperar a que todas las promesas se resuelvan
    try {
      const results = await Promise.all(fetchPromises);
  
      // Aplanamos el array de resultados y los guardamos en el estado
      const allResults = results.flat();
      setResultsTable(allResults); // Guardamos los resultados en el estado
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };


  const languageOptions = useMemo(() => [
    { value: 'EN-US', label: 'English' },
    { value: 'ES-ES', label: 'Español' }
  ], []);

  const options = useMemo(() => {
    return listItems.map((item) => ({
      value: item.UniqueName,
      label: item.LocalizedNames[select3] || item.LocalizedNames['EN-US'],
      index: item.Index
    }));
  }, [select3]);

  const filteredOptions = useMemo(() => {
    if (!inputValue) return [];
    return options.filter(option =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    ).slice(0, 5);
  }, [inputValue, options]);

  const handleLanguageChange = (selectedOption) => {
    setSelect3(selectedOption.value);
  };

  const cities = useMemo(() => [
    { label: 'Fort Sterling', value: 'Fort%20Sterling' },
    { label: 'Bridgewatch', value: 'Bridgewatch' },
    { label: 'Caerleon', value: 'Caerleon' },
    { label: 'Lymhurst', value: 'Lymhurst' },
    { label: 'Martlock', value: 'Martlock' },
    { label: 'Thetford', value: 'Thetford' },
  ], []);

  const customStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: 'white',
      borderColor: '#ccc',
      color: '#333',
      minWidth: '150px',
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
      maxHeight: 300,
    }),
    option: (styles, { isSelected, isFocused }) => ({
      ...styles,
      backgroundColor: isSelected ? '#007bff' : isFocused ? '#f0f0f0' : null,
      color: isSelected ? 'white' : '#333',
    }),
  };

  if (!isClient) return null;

  // Realizar la solicitud de fetch cuando se haga clic en "Action 1"
  const handleActionClick = async () => {
    const selectedUniqueName = selectedSearch.map((item) => item.value).join(',');
    const selectedCitiesStr = selectedCities.map((item) => item.value).join(',');

    const res = await fetch(
      `https://www.albion-online-data.com/api/v2/stats/Prices/${selectedUniqueName}.json?locations=${selectedCitiesStr}`
    );
    const data = await res.json();

    setResults(data); // Guarda los resultados
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 p-6 bg-gray-100">
      <h1 className="text-2xl text-black font-bold">Data Albion Search</h1>

      {/* Selector de idioma */}
      <div className="w-64">
        <label className="block text-gray-700">Selecciona el Idioma</label>
        <Select
          className="w-full"
          options={languageOptions}
          value={languageOptions.find(option => option.value === select3)}
          onChange={handleLanguageChange}
          styles={customStyles}
        />
      </div>

      {/* Buscador por nombre */}
      <div className="w-64">
        <label className="block text-gray-700">Busqueda por Nombre</label>
        <Select
          isMulti
          className="w-full"
          placeholder='Seleccionar...'
          options={filteredOptions}
          value={selectedSearch}
          onChange={setSelectedSearch}
          onInputChange={(newValue) => setInputValue(newValue)}
          components={customComponents}
          getOptionLabel={(e) => e.label}
          noOptionsMessage={() => 'No results found'}
          inputValue={inputValue}
          styles={customStyles}
        />
      </div>

      {/* Selector de ciudades */}
      <div className="w-64">
        <label className="block text-gray-700">Ciudades (max 5)</label>
        <Select
          isMulti
          className="w-full"
          placeholder='Seleccionar...'
          options={cities}
          value={selectedCities}
          onChange={setSelectedCities}
          maxMenuHeight={200}
          components={customComponents}
          noOptionsMessage={() => 'No cities available'}
          styles={customStyles}
        />
      </div>

      {/* Botones de acción */}
      <div className="space-x-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleFetchData}>
          Acción 1
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded-md">Action 2</button>
        <button className="px-4 py-2 bg-red-500 text-white rounded-md" onClick={() => { setSelected1([]); setSelectedSearch([]); setSelectedCities([]); }}>Reset</button>
      </div>

      {/* Tabla con los datos obtenidos */}
      {
        <PricesTable
          elements={resultsTable} // Pasamos los datos de la API a la tabla
          sortByCallback={(column) => { console.log('Ordenar por', column); }} // Callback de ejemplo para ordenar
          removeResultCallback={(index) => {
            const updatedData = resultsTable.filter((_, i) => i !== index);
            setTableData(updatedData); // Eliminar resultado de la tabla
          }}
        />
      }
    </div>
  );
}