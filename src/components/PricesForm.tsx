import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Select, { SingleValue, ActionMeta } from 'react-select';
import { IItem, usefulItems, equipItems } from '../api/items';

export interface IPriceFormProps {
  manualItem: string;
  onManualItemChange: (item: string) => void;
  useful: IItem | null; 
  onUsefulChange: (item: IItem | null) => void; 
  equip: IItem | null; 
  onEquipChange: (item: IItem | null) => void; 
  city: { label: string; value: string };
  onCityChange: (city: { label: string; value: string }) => void;
  clearData: () => void;
  refreshData: () => void;
  restoreData: () => void;
  saveData: () => void;
  retrieveData: () => void;
  getFixedRunes: () => void;
}

function PricesForm(props: IPriceFormProps) {
  const { manualItem, onManualItemChange, useful, onUsefulChange, equip, onEquipChange, city, onCityChange, clearData, refreshData, restoreData, saveData, retrieveData, getFixedRunes } = props;

  const allItemsOptions = usefulItems;
  const allEquipOptions = equipItems;
  const allCities = [
    { label: 'Fort Sterling', value: 'Fort%20Sterling' },
    { label: 'Bridgewatch', value: 'Bridgewatch' },
    { label: 'Caerleon', value: 'Caerleon' },
    { label: 'Lymhurst', value: 'Lymhurst' },
    { label: 'Martlock', value: 'Martlock' },
    { label: 'Thetford', value: 'Thetford' },
  ];

  return (
    <form className="">
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Buscador de Precios</h3>
            <p className="max-w-2xl mt-1 text-sm text-gray-500">Escribe o selecciona un objeto y añadelo a la tabla para consultar el precio</p>
          </div>
          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="manual-item" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Objeto por ID (Avanzado)
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="manual-item"
                  id="manual-item"
                  value={manualItem}
                  onChange={e => onManualItemChange(e.target.value)}
                  className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="object" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Selección Objetos
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <Select<IItem>
                  options={allItemsOptions}
                  value={useful ?? null} // Asegúrate de manejar el caso en que `useful` sea `null`
                  onChange={(e: SingleValue<IItem>) => onUsefulChange(e ?? null)} // Maneja el caso `null`
                  getOptionLabel={e => e.LocalizedNames ? `${e.LocalizedNames['ES-ES']}` : e.UniqueName}
                  getOptionValue={e => e.UniqueName}
                  isClearable={true}
                  className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="object" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Selección Equipo
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <Select<IItem>
                  options={allEquipOptions}
                  value={equip ?? null} // Asegúrate de manejar el caso en que `equip` sea `null`
                  onChange={(e: SingleValue<IItem>) => onEquipChange(e ?? null)} // Maneja el caso `null`
                  getOptionLabel={e => e.LocalizedNames ? `${e.LocalizedNames['ES-ES']}` : e.UniqueName}
                  getOptionValue={e => e.UniqueName}
                  isClearable={true}
                  className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Ciudad
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <Select<{ label: string; value: string }>
                  options={allCities}
                  value={city}
                  onChange={(e: SingleValue<{ label: string; value: string }>) => onCityChange(e ?? { label: '', value: '' })} // Maneja el caso `null`
                  className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="pt-5">
          <div className="flex flex-wrap justify-center md:justify-end">
            <button
              type="button"
              onClick={() => retrieveData()}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 mb-2" >
              Buscar Precios
            </button>
          </div>
        </div>
      </div>
      <div className="border-b border-gray-300"></div>
      <div className="pt-5">
        <div className="flex flex-wrap justify-center md:justify-end">
          <button
            type="button"
            onClick={() => getFixedRunes()}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 mr-2 mb-2" >
            Listado de Runas
          </button>
          <button
            type="button"
            onClick={() => clearData()}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2 mb-2" >
            Limpiar
          </button>
          <button
            type="button"
            onClick={() => refreshData()}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2 mb-2" >
            Refrescar
          </button>
          <button
            type="button"
            onClick={() => restoreData()}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2 mb-2" >
            Restaurar
          </button>
          <button
            type="button"
            onClick={() => saveData()}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2 mb-2" >
            Guardar listado
          </button>
        </div>
      </div>
    </form>
  );
}

export default PricesForm;
