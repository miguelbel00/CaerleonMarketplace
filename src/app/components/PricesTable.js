import React, { useMemo, useState,useEffect } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import { Button, TextField, MenuItem, Select } from '@mui/material';

// Función para obtener la calidad del objeto
const getQuality = (quality) => {
  if (quality == null) return 'Desconocido'; // Si es undefined o null, evitar el error
  const qualities = ['Plano', 'Bueno', 'Notable', 'Sobresaliente', 'Obra maestra'];
  return qualities[quality - 1] || 'Desconocido';
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

const PricesTable = ({ elements, removeResultCallback }) => {
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
        header: 'Imagen',
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
              {`${row.original.name} (${getQuality(row.original.quality)})`}
            </span>
          </div>
        ),
      },
      {
        header: 'Calidad',
        accessorKey: 'quality',
        cell: ({ getValue }) => <span className="font-semibold">{getQuality(getValue())}</span>,
      },
      {
        header: 'Ciudad',
        accessorKey: 'city',
        cell: ({ getValue }) => <span>{decodeURIComponent(getValue())}</span>,
      },
      {
        header: 'Venta - Min',
        accessorKey: 'sell_price_min',
      },
      {
        header: 'Compra - Max',
        accessorKey: 'buy_price_max',
      },
      {
        header: 'Acciones',
        accessorKey: 'actions',
        cell: ({ row }) => (
          <Button
            variant="contained"
            color="secondary"
            size="small"
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
            onClick={() => removeResultCallback(row.original.id)}
          >
            Eliminar
          </Button>
        ),
      },
    ],
    [removeResultCallback]
  );

  // Aplicar filtros
  const filteredData = useMemo(() => {
    return elements.filter((e) =>
      (filterCity === '' || e.city === filterCity) &&
      (filterQuality === '' || getQuality(e.quality) === filterQuality)
    );
  }, [elements, filterCity, filterQuality]);

  const data = useMemo(() => filteredData.map((e, index) => ({ ...e, id: index })), [filteredData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto p-4">
      {/* Filtros */}
      <div className="mb-4 flex  space-x-4">
        <Select
          displayEmpty
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          variant="outlined"
          size="small"
        >
          <MenuItem value="">Todas las ciudades</MenuItem>
          {cities.map((city) => (
            <MenuItem key={city.value} value={city.value}>{city.label}</MenuItem>
          ))}
        </Select>
        <Select
          displayEmpty
          value={filterQuality}
          onChange={(e) => setFilterQuality(e.target.value)}
          variant="outlined"
          size="small"
        >
          <MenuItem value="">Todas las calidades</MenuItem>
          {['Plano', 'Bueno', 'Notable', 'Sobresaliente', 'Obra maestra'].map((quality) => (
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

export default PricesTable;
