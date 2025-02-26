import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import PricesTable from "./PricesTable";
import PricesItemsProfit from "./PricesItemsProfit";

export default function MuiTailwindTabs({ elements, removeResultCallback, sortByCallback, changeTab, tabValue,profitElements }) {

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Contenedor de pestañas */}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={tabValue}
                    onChange={changeTab}
                    aria-label="Pestañas personalizadas"
                    variant="fullWidth"
                    TabIndicatorProps={{ className: "bg-blue-500" }} // Personaliza el indicador con Tailwind
                >
                    <Tab
                        label="Precio items"
                        className={`text-gray-600 hover:text-blue-500 ${tabValue === 0 ? "text-blue-500 font-semibold" : ""
                            }`}
                    />
                    <Tab
                        label="Comparativa Black Market"
                        className={`text-gray-600 hover:text-blue-500 ${tabValue === 1 ? "text-blue-500 font-semibold" : ""
                            }`}
                    />
                </Tabs>
            </Box>

            {/* Contenido de las pestañas */}
            <div >
                {tabValue === 0 && <div>      <PricesTable
                    elements={elements}
                    sortByCallback={sortByCallback}
                    removeResultCallback={removeResultCallback}
                /></div>}
                {tabValue === 1 && <div><PricesItemsProfit elements={profitElements}
                    sortByCallback={sortByCallback}
                    removeResultCallback={removeResultCallback} /></div>}
            </div>
        </div>
    );
}
