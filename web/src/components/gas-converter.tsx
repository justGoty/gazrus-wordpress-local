"use client";

import { Check, Copy, ExternalLink, FlaskConical, Gauge, RotateCcw, Thermometer, Wind } from "lucide-react";
import { useMemo, useState } from "react";
import {
  DEFAULT_TEMPERATURE_C,
  GAS_OPTIONS,
  STANDARD_PRESSURE_KPA,
  UNIT_OPTIONS,
  calculateGasConversions,
  getGasById,
} from "@/lib/calculators/gas-converter.mjs";

type ConcentrationUnit = "ppm" | "mg-m3" | "vol-percent" | "lel-percent";
type ResultUnit = "ppm" | "mgM3" | "volPercent" | "lelPercent";

const resultLabels: Record<ResultUnit, string> = {
  ppm: "ppm",
  mgM3: "мг/м³",
  volPercent: "% об.",
  lelPercent: "% НКПР",
};

function parseNumber(value: string) {
  return Number(value.replace(",", "."));
}

function formatNumber(value: number) {
  const absolute = Math.abs(value);
  const maximumFractionDigits = absolute >= 1000 ? 2 : absolute >= 1 ? 4 : 6;
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits,
    useGrouping: true,
  }).format(value);
}

export function GasConverter() {
  const [gasId, setGasId] = useState("ch4");
  const [inputValue, setInputValue] = useState("100");
  const [inputUnit, setInputUnit] = useState<ConcentrationUnit>("ppm");
  const [temperature, setTemperature] = useState(String(DEFAULT_TEMPERATURE_C));
  const [pressure, setPressure] = useState(String(STANDARD_PRESSURE_KPA));
  const [copied, setCopied] = useState<ResultUnit | null>(null);
  const gas = getGasById(gasId);

  const selectGas = (nextGasId: string) => {
    const nextGas = getGasById(nextGasId);
    setGasId(nextGasId);
    if (inputUnit === "lel-percent" && nextGas.lelVolPercent == null) {
      setInputUnit("ppm");
    }
  };

  const calculation = useMemo(() => {
    try {
      const value = parseNumber(inputValue);
      const temperatureC = parseNumber(temperature);
      const pressureKpa = parseNumber(pressure);
      return {
        result: calculateGasConversions({ gasId, value, unit: inputUnit, temperatureC, pressureKpa }),
        error: "",
      };
    } catch (error) {
      return {
        result: null,
        error: error instanceof Error ? error.message : "Не удалось выполнить расчет",
      };
    }
  }, [gasId, inputUnit, inputValue, pressure, temperature]);

  const resetConditions = () => {
    setTemperature(String(DEFAULT_TEMPERATURE_C));
    setPressure(String(STANDARD_PRESSURE_KPA));
  };

  const copyResult = async (unit: ResultUnit, value: number | null) => {
    if (value == null) return;
    await navigator.clipboard.writeText(`${formatNumber(value)} ${resultLabels[unit]}`);
    setCopied(unit);
    window.setTimeout(() => setCopied(null), 1500);
  };

  const resultRows: Array<{ unit: ResultUnit; value: number | null; note: string }> = calculation.result
    ? [
        { unit: "ppm", value: calculation.result.ppm, note: "объемных частей на миллион" },
        { unit: "mgM3", value: calculation.result.mgM3, note: "массовая концентрация" },
        { unit: "volPercent", value: calculation.result.volPercent, note: "объемная доля газа" },
        {
          unit: "lelPercent",
          value: calculation.result.lelPercent,
          note: gas.lelVolPercent == null ? "справочное значение НКПР не задано" : `НКПР: ${gas.lelVolPercent}% об.`,
        },
      ]
    : [];

  return (
    <div className="converter-shell">
      <section className="converter-input-panel" aria-labelledby="converter-input-title">
        <div className="converter-panel-heading">
          <span className="converter-heading-icon converter-heading-icon-blue">
            <FlaskConical aria-hidden="true" size={22} />
          </span>
          <div>
            <p>Исходные данные</p>
            <h2 id="converter-input-title">Что переводим</h2>
          </div>
        </div>

        <label className="converter-field">
          <span>Газ</span>
          <select value={gasId} onChange={(event) => selectGas(event.target.value)}>
            {GAS_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.formula} — {option.name}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="converter-unit-fieldset">
          <legend>Исходная единица</legend>
          <div className="converter-unit-segment">
            {UNIT_OPTIONS.map((unit) => {
              const disabled = unit.id === "lel-percent" && gas.lelVolPercent == null;
              return (
                <button
                  key={unit.id}
                  type="button"
                  aria-pressed={inputUnit === unit.id}
                  disabled={disabled}
                  title={disabled ? "Для этого газа значение НКПР пока не внесено" : undefined}
                  onClick={() => setInputUnit(unit.id as ConcentrationUnit)}
                >
                  {unit.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="converter-field converter-value-field">
          <span>Концентрация</span>
          <div>
            <input
              type="text"
              inputMode="decimal"
              value={inputValue}
              aria-describedby="converter-value-unit"
              onChange={(event) => setInputValue(event.target.value)}
            />
            <strong id="converter-value-unit">
              {UNIT_OPTIONS.find((unit) => unit.id === inputUnit)?.label}
            </strong>
          </div>
        </label>

        <div className="converter-conditions-heading">
          <div>
            <strong>Условия измерения</strong>
            <span>влияют на перевод в мг/м³</span>
          </div>
          <button type="button" title="Вернуть стандартные условия" onClick={resetConditions}>
            <RotateCcw aria-hidden="true" size={15} />
            20 °C / 101,325 кПа
          </button>
        </div>

        <div className="converter-condition-grid">
          <label className="converter-field">
            <span>
              <Thermometer aria-hidden="true" size={16} /> Температура, °C
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={temperature}
              onChange={(event) => setTemperature(event.target.value)}
            />
          </label>
          <label className="converter-field">
            <span>
              <Wind aria-hidden="true" size={16} /> Давление, кПа
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={pressure}
              onChange={(event) => setPressure(event.target.value)}
            />
          </label>
        </div>

        <div className="converter-gas-note">
          <span>
            <strong>{gas.formula}</strong> · молярная масса {formatNumber(gas.molarMass)} г/моль
            {gas.lelVolPercent == null ? "" : ` · НКПР ${formatNumber(gas.lelVolPercent)}% об.`}
          </span>
          {gas.sourceUrl ? (
            <a href={gas.sourceUrl} target="_blank" rel="noreferrer">
              Источник НКПР <ExternalLink aria-hidden="true" size={14} />
            </a>
          ) : null}
        </div>
      </section>

      <section className="converter-result-panel" aria-labelledby="converter-result-title" aria-live="polite">
        <div className="converter-panel-heading">
          <span className="converter-heading-icon converter-heading-icon-teal">
            <Gauge aria-hidden="true" size={22} />
          </span>
          <div>
            <p>Результат</p>
            <h2 id="converter-result-title">Эквивалентные значения</h2>
          </div>
        </div>

        {calculation.error ? (
          <div className="converter-error" role="alert">
            {calculation.error}
          </div>
        ) : (
          <div className="converter-results">
            {resultRows.map((row) => (
              <article key={row.unit} className="converter-result-row" data-unavailable={row.value == null}>
                <div>
                  <span>{row.note}</span>
                  <strong>{row.value == null ? "Недоступно" : formatNumber(row.value)}</strong>
                </div>
                <div className="converter-result-unit">
                  <b>{resultLabels[row.unit]}</b>
                  <button
                    type="button"
                    disabled={row.value == null}
                    title={`Копировать значение в ${resultLabels[row.unit]}`}
                    aria-label={`Копировать значение в ${resultLabels[row.unit]}`}
                    onClick={() => copyResult(row.unit, row.value)}
                  >
                    {copied === row.unit ? <Check aria-hidden="true" size={17} /> : <Copy aria-hidden="true" size={17} />}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="converter-result-note">
          <strong>Учитывайте условия задачи</strong>
          <p>
            Перевод выполнен по уравнению идеального газа. Для поверки, проектирования и охраны труда используйте
            условия и коэффициенты из применимого нормативного или технического документа.
          </p>
        </div>
      </section>
    </div>
  );
}
