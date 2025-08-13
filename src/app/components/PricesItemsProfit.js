import React, { useMemo, useState,useEffect } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import { Button, TextField, MenuItem, Select } from '@mui/material';
import { getCities } from '../constants';
import { getTranslation } from '../translations';
import { listItems } from '../items';

// Función para obtener la calidad del objeto
const getQuality = (quality, language = 'ES-ES') => {
  if (quality == null) return getTranslation(language, 'unknown'); // Si es undefined o null, evitar el error
  const qualities = [
    getTranslation(language, 'plain'),
    getTranslation(language, 'good'),
    getTranslation(language, 'outstanding'),
    getTranslation(language, 'excellent'),
    getTranslation(language, 'masterpiece')
  ];
  return qualities[quality - 1] || getTranslation(language, 'unknown');
};

// Función para obtener el nombre traducido del item
const getItemName = (itemId, language = 'ES-ES') => {
  const item = listItems.find(item => item.UniqueName === itemId);
  return item ? item.LocalizedNames[language] || item.LocalizedNames['EN-US'] || itemId : itemId;
};


const PricesItemsProfit = ({ elements, removeResultCallback, language = 'ES-ES' }) => {
  const cities = getCities(language);
  const [filterCity, setFilterCity] = useState('');
  const [filterQuality, setFilterQuality] = useState('');

  useEffect(() => {
    if (elements.length === 0) {
      setFilterCity('');
      setFilterQuality('');
    }
  }, [elements])

  // Definir columnas
  const columns = useMemo(
    () => [
      {
        header: getTranslation(language, 'image'),
        accessorKey: 'image',
        cell: ({ row }) => (
          <div className="relative group w-12 h-12">
            <img
              src={`https://render.albiononline.com/v1/item/${row.original.item_id}.png`}
              alt={row.original.item_id} 
              className="w-full h-full object-cover rounded"
            />
            {/* Tooltip al hacer hover */}
            <span className="absolute left-1/2 -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-2 py-1 rounded">
              {`${getItemName(row.original.item_id, language)} (${getQuality(row.original.quality, language)})`}
            </span>
          </div>
        ),
      },
      {
        header: getTranslation(language, 'quality'),
        accessorKey: 'quality',
        cell: ({ getValue }) => <span className="font-semibold">{getQuality(getValue(), language)}</span>,
      },
      {
        header: getTranslation(language, 'city'),
        accessorKey: 'city',
        cell: ({ getValue }) => <span>{decodeURIComponent(getValue())}</span>,
      },
      {
        header: getTranslation(language, 'sellPriceMin'),
        accessorKey: 'sell_price_min',
      },
      {
        header: getTranslation(language, 'sellPriceMinBlackMarket'),
        accessorKey: 'sell_price_min_black_market',
      },
      {
        header: getTranslation(language, 'profit'),
        accessorKey: 'profit',
        cell: ({ getValue }) => {
          const profit = getValue();
          const bgColor = profit > 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800';
          return <div className={`px-2 py-1 rounded ${bgColor} font-bold`}>{profit}</div>;
        },
      },
      
      {
        header: getTranslation(language, 'actions'),
        accessorKey: 'actions',
        cell: ({ row }) => (
          <Button
            variant="contained"
            color="secondary"
            size="small"
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
            onClick={() => removeResultCallback(row.original.id)}
          >
            {getTranslation(language, 'remove')}
          </Button>
        ),
      },
    ],
    [removeResultCallback, language]
  );

  // Aplicar filtros
  const filteredData = useMemo(() => {
    return elements.filter((e) =>
      (filterCity === '' || e.city === filterCity) &&
      (filterQuality === '' || getQuality(e.quality, language) === filterQuality)
    );
  }, [elements, filterCity, filterQuality, language]);

  const data = useMemo(() => filteredData.map((e, index) => ({ ...e, id: index })), [filteredData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto p-4 bg-white rounded-xl shadow-lg">
      {/* Filtros */}
      <label className="block text-center  text-gray-700 font-semibold mb-2">{getTranslation(language, 'filters')}</label>
      <div className="mb-4 flex  space-x-4 justify-evenly">
        <Select
          displayEmpty
           className='w-48 min-w-[12rem] bg-white  rounded-xl shadow-lg'
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          variant="outlined"
          size="small"
        >
          <MenuItem value="">{getTranslation(language, 'allCities')}</MenuItem>
          {cities.map((city) => (
            <MenuItem key={city.value} value={city.value}>{city.label}</MenuItem>
          ))}
        </Select>
        <Select
        className='w-48 min-w-[12rem]  bg-white rounded-xl shadow-lg'
          displayEmpty
          value={filterQuality}
          onChange={(e) => setFilterQuality(e.target.value)}
          variant="outlined"
          size="small"
        >
          <MenuItem value="">{getTranslation(language, 'selectAll')}</MenuItem>
          {[
            getTranslation(language, 'plain'),
            getTranslation(language, 'good'),
            getTranslation(language, 'outstanding'),
            getTranslation(language, 'excellent'),
            getTranslation(language, 'masterpiece')
          ].map((quality) => (
            <MenuItem key={quality} value={quality}>{quality}</MenuItem>
          ))}
        </Select>
      </div>
      
      <table className="w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left text-gray-700 border-b border-gray-300"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="odd:bg-white  text-black beven:bg-gray-100 hover:bg-gray-200">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-2 border-b border-gray-300">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PricesItemsProfit;
