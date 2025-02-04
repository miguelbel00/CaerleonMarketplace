'use client'

import React, { useEffect, useState } from "react";
import { runesFixed } from "../items";
import PricesForm from "./PricesForm";
import PricesTable from "./PricesTable";

function PricesManager() {
  const [manualItem, setManualItem] = useState("");
  const [useful, setUseful] = useState(null);
  const [equip, setEquip] = useState(null);
  const [city, setCity] = useState({
    label: "Fort Sterling",
    value: "Fort Sterling",
  });
  const [resultsTable, setResultsTable] = useState([]);
  const [lastSort, setLastSort] = useState({ property: "", desc: false });
  const languaje = "EN-US"; // Asigna el valor que corresponda

  useEffect(() => {
    restoreData();
  }, []);

  const fetchData = async (actualUniqueName = "", actualCity = "") => {
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
    const json = await res.json();
    return json;
  };

  const fetchAll = async (array) => {
    const allAsyncResults = [];
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

  const retrieveData = async (actualUniqueName, actualCity) => {
    const res = await fetchData(actualUniqueName, actualCity);

    let itemName = "";

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

  const removeResult = (index) => {
    const filtered = resultsTable.filter((e, i) => i !== index);
    setResultsTable(filtered);
  };

  const sortBy = (property, desc) => {
    function compare(a, b) {
      const valueA = a[property]; 
      const valueB = b[property];

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
      const restored = JSON.parse(restoredString);
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

  const onSetUseful = (item) => {
    setEquip(null);
    setUseful(item);
  };

  const onSetEquip = (item) => {
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
