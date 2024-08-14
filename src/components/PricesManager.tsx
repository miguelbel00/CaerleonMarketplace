import React, { useEffect, useState } from "react";
import { IItem, runesFixed } from "../api/items";
import PricesForm from "./PricesForm";
import PricesTable from "./PricesTable";

function PricesManager() {
  const [manualItem, setManualItem] = useState("");
  const [useful, setUseful] = useState<IItem | null>(null);
  const [equip, setEquip] = useState<IItem | null>(null);
  const [city, setCity] = useState({
    label: "Fort Sterling",
    value: "Fort Sterling",
  });
  const [resultsTable, setResultsTable] = useState<IItem[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lastSort, setLastSort] = useState({ property: "", desc: false });
  type Language = "EN-US" | "ES-ES"; // Agrega otros idiomas si es necesario
  const languaje: Language = "EN-US"; // Asigna el valor que corresponda

  useEffect(() => {
    restoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (
    actualUniqueName: string = "",
    actualCity: string = ""
  ) => {
    const a = "T1_CARROT";
    const res = await fetch(
      `https://www.albion-online-data.com/api/v2/stats/Prices/${
        actualUniqueName ||
        useful?.UniqueName ||
        equip?.UniqueName ||
        manualItem ||
        a
      }.json?locations=${actualCity || city.value}`
    );
    const json: IItem[] = await res.json();
    return json;
  };

  const fetchAll = async (array: IItem[]) => {
    const allAsyncResults: IItem[] = [];
    for (const element of array) {
      const asyncResult = await fetchData(element.item_id, element.city);
      allAsyncResults.push(
        ...asyncResult.map((e) => ({ ...e, name: element.name }))
      );
    }
    return allAsyncResults;
  };

  const fetchFixedRunes = async () => {
    const allAsyncResults = [];
    for (const element of runesFixed) {
      const asyncResult = await fetchData(element.UniqueName);
      allAsyncResults.push(
        ...asyncResult.map((e) => ({
          ...e,
          name: element.LocalizedNames[languaje],
        }))
      );
    }
    return allAsyncResults;
  };

  const retrieveData = async (
    actualUniqueName?: string,
    actualCity?: string
  ) => {
    const res = await fetchData(actualUniqueName, actualCity);

    let itemName: string = "";

    if (useful) {
      itemName = useful?.LocalizedNames
        ? useful.LocalizedNames[languaje]
        : actualUniqueName || manualItem;
    } else if (equip) {
      itemName = equip?.LocalizedNames
        ? equip.LocalizedNames[languaje]
        : actualUniqueName || manualItem;
    } else {
      itemName = actualUniqueName || manualItem;
    }

    if (itemName) {
      setResultsTable(
        resultsTable.concat(res.map((e) => ({ ...e, name: itemName })))
      );
    }
  };

  const removeResult = (index: number) => {
    const filtered = resultsTable.filter((e, i) => i !== index);
    setResultsTable(filtered);
  };

  const sortBy = (property: string, desc?: boolean) => {
    function compare(a: IItem, b: IItem) {
      const valueA = a[property as keyof IItem]; // Aquí asumimos que la propiedad es una clave de IItem
      const valueB = b[property as keyof IItem];

      if (valueA === undefined || valueB === undefined) {
        return 0;
      }

      if (valueA < valueB) {
        return desc ? 1 : -1;
      }
      if (valueA > valueB) {
        return desc ? -1 : 1;
      }
      return 0;
    }

    setResultsTable([...resultsTable].sort(compare));
    setLastSort({ property, desc: !desc });
  };

  const saveData = () => {
    localStorage.setItem("albionItemList", JSON.stringify(resultsTable));
  };

  const restoreData = async () => {
    const restoredString = localStorage.getItem("albionItemList");

    if (restoredString) {
      // Verifica si no es null
      const restored: IItem[] = JSON.parse(restoredString); // JSON.parse solo se llama si el string no es null
      const newResults = await fetchAll(restored);
      setResultsTable(newResults);
    }
  };

  const clearData = () => {
    setResultsTable([]);
  };

  const refreshData = async () => {
    const newResults = await fetchAll(resultsTable);
    setResultsTable(newResults);
  };

  const getFixedRunes = async () => {
    const newResults = await fetchFixedRunes();
    setResultsTable(newResults);
  };

  const onSetUseful = (item: IItem | null) => {
    // Cambia aquí para aceptar IItem | null
    setEquip(null);
    setUseful(item);
  };

  const onSetEquip = (item: IItem | null) => {
    // Cambia aquí para aceptar IItem | null
    setUseful(null);
    setEquip(item);
  };

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <PricesForm
        manualItem={manualItem}
        onManualItemChange={setManualItem}
        useful={useful}
        onUsefulChange={onSetUseful}
        equip={equip}
        onEquipChange={onSetEquip}
        city={city}
        onCityChange={setCity}
        clearData={clearData}
        refreshData={refreshData}
        restoreData={restoreData}
        saveData={saveData}
        retrieveData={retrieveData}
        getFixedRunes={getFixedRunes}
      />
      <PricesTable
        elements={resultsTable}
        sortByCallback={sortBy}
        removeResultCallback={removeResult}
      />
    </div>
  );
}

export default PricesManager;
