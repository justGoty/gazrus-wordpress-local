"use client";

import { FlaskConical } from "lucide-react";
import { useState } from "react";

type GasOption = {
  id: string;
  formula: string;
  name: string;
};

type ProductChemistryProps = {
  gases: GasOption[];
  model: string;
};

export function ProductChemistry({ gases, model }: ProductChemistryProps) {
  const [activeId, setActiveId] = useState(gases[0]?.id ?? "");
  const activeGas = gases.find((gas) => gas.id === activeId) ?? gases[0];

  if (!activeGas) {
    return null;
  }

  const gasName = activeGas.name.charAt(0).toUpperCase() + activeGas.name.slice(1);

  return (
    <section className="product-chemistry" aria-labelledby="product-chemistry-title">
      <div className="product-chemistry-header">
        <FlaskConical aria-hidden="true" size={22} />
        <div>
          <p>Контролируемые компоненты</p>
          <h3 id="product-chemistry-title">Выберите газ</h3>
        </div>
      </div>

      <div className="product-gas-tabs" role="tablist" aria-label="Контролируемые газы">
        {gases.map((gas) => (
          <button
            type="button"
            role="tab"
            aria-selected={gas.id === activeGas.id}
            aria-controls="product-gas-description"
            key={gas.id}
            onClick={() => setActiveId(gas.id)}
          >
            {gas.formula}
          </button>
        ))}
      </div>

      <div className="product-gas-description" id="product-gas-description" role="tabpanel">
        <strong>{gasName}</strong>
        <p>
          Для контроля компонента {activeGas.formula} прибор {model} комплектуется подходящим сенсором.
          Диапазон измерения и технологию сенсора фиксируем в коммерческом предложении.
        </p>
      </div>
    </section>
  );
}
