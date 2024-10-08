import React, { FC } from 'react';
import { IItem } from '../api/items';

const getQuality = (quality: number): string => {
  if (quality === 1) {
    return 'plano';
  } else if (quality === 2) {
    return 'bueno';
  } else if (quality === 3) {
    return 'notable';
  } else if (quality === 4) {
    return 'sobresaliente';
  } else if (quality === 5) {
    return 'obra maestra';
  }
  return '';
};

const getFullName = (item: IItem): string => {
  // Proporciona valores por defecto si `item.name` o `item.quality` son `undefined`
  const name = item.name ?? 'Desconocido'; // Proporciona un nombre por defecto si `item.name` es `undefined`
  const quality = item.quality ?? 0; // Proporciona un valor por defecto si `item.quality` es `undefined`

  return quality > 1 ? `${name} (${getQuality(quality)})` : name;
};

interface IPriceTableProps {
  elements: IItem[];
  sortByCallback: (property: string, desc?: boolean) => void;
  removeResultCallback: (index: number) => void;
}

const PricesTable: FC<IPriceTableProps> = (props) => {
  const { elements, sortByCallback, removeResultCallback } = props;

  return (
    <div className="mt-3 flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 tracking-wider">
                  </th>
                  <th scope="col" className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => sortByCallback('item_id')}>
                    Objeto
                  </th>
                  <th scope="col" className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => sortByCallback('city')}>
                    Ciudad
                  </th>
                  <th scope="col" className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => sortByCallback('sell_price_min')}>
                    Venta - Min
                  </th>
                  <th scope="col" className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => sortByCallback('buy_price_max')}>
                    Compra - Max
                  </th>
                  <th scope="col" className="">
                  </th>
                </tr>
              </thead>
              <tbody>
                {elements?.map((e, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="thumb-img">
                      <img src={`https://render.albiononline.com/v1/item/${e.item_id}.png`} alt={`${e.item_id}_thumb`} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getFullName(e)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{e.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{e.sell_price_min}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{e.buy_price_max}</td>
                    <td className="cursor-pointer px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={() => removeResultCallback(index)}>
                      Eliminar
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricesTable;