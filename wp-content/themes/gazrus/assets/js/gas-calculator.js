(function () {
  const root = document.querySelector('[data-gas-calculator]');
  if (!root) return;

  const gases = {
    methane: { name: 'Метан - CH4', molarMass: 16.04, lel: 4.4, pdk: '7000 мг/м³ в соответствии с СанПиН 3.45.2486-2020' },
    propane: { name: 'Пропан - C3H8', molarMass: 44.1, lel: 1.7, pdk: 'нет данных' },
    butane: { name: 'Бутан - C4H10', molarMass: 58.12, lel: 1.4, pdk: '900 мг/м³ (ПДКмр), 300 мг/м³ (ПДКсс)' },
    hydrogenSulfide: { name: 'Сероводород - H2S', molarMass: 34.08, lel: 4, pdk: '3 мг/м³' },
    carbonMonoxide: { name: 'Монооксид углерода - CO', molarMass: 28.01, lel: 10.9, pdk: '20 мг/м³' },
    carbonDioxide: { name: 'Диоксид углерода - CO2', molarMass: 44.01, lel: null, pdk: 'ПДКмр = 27000 мг/м³, ПДКсс = 9000 мг/м³' },
    ammonia: { name: 'Аммиак - NH3', molarMass: 17.03, lel: 15, pdk: '20 мг/м³ (ПДКмр)' },
    acetylene: { name: 'Ацетилен - C2H2', molarMass: 26.04, lel: 2.3, pdk: 'нет данных' },
    hydrogen: { name: 'Водород - H2', molarMass: 2.016, lel: 4, pdk: 'нет данных' },
    benzene: { name: 'Бензол - C6H6', molarMass: 78.11, lel: 1.2, pdk: '15 мг/м³ (ПДКмр), 5 мг/м³ (ПДКсс)' },
  };

  const units = {
    ppm: 'ppm (млн⁻¹)',
    mg_m3: 'мг/м³',
    vol_percent: '% об. д.',
    lel_percent: '% НКПР',
  };

  const gasSelect = root.querySelector('[data-gas-select]');
  const unitSelect = root.querySelector('[data-unit-select]');
  const valueInput = root.querySelector('[data-value-input]');
  const pressureInput = root.querySelector('[data-pressure-input]');
  const temperatureInput = root.querySelector('[data-temperature-input]');
  const valueLabel = root.querySelector('[data-value-label]');
  const reset = root.querySelector('[data-reset-conditions]');

  Object.entries(gases).forEach(([id, gas]) => {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = gas.name;
    gasSelect.append(option);
  });

  function number(value, fallback) {
    const parsed = Number(String(value).replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function format(value) {
    if (!Number.isFinite(value)) return 'нет данных';
    if (Math.abs(value) >= 100000) return value.toLocaleString('ru-RU', { maximumFractionDigits: 0 });
    if (Math.abs(value) >= 100) return value.toLocaleString('ru-RU', { maximumFractionDigits: 2 });
    return value.toLocaleString('ru-RU', { maximumFractionDigits: 5 });
  }

  function convert() {
    const gas = gases[gasSelect.value] || gases.methane;
    const unit = unitSelect.value;
    const value = Math.max(0, number(valueInput.value, 0));
    const pressure = Math.max(1, number(pressureInput.value, 101.325)) * 1000;
    const temperature = number(temperatureInput.value, 20) + 273.15;
    const r = 8.314462618;

    let ppm = 0;
    let mgM3 = 0;
    let volPercent = 0;
    let lelPercent = null;

    if (temperature <= 0) {
      ppm = 0;
    } else if (unit === 'ppm') {
      ppm = value;
    } else if (unit === 'mg_m3') {
      ppm = value * r * temperature * 1000 / (gas.molarMass * pressure);
    } else if (unit === 'vol_percent') {
      ppm = value * 10000;
    } else if (unit === 'lel_percent' && gas.lel) {
      ppm = (value / 100) * gas.lel * 10000;
    }

    mgM3 = ppm * gas.molarMass * pressure / (r * temperature) / 1000;
    volPercent = ppm / 10000;
    lelPercent = gas.lel ? (volPercent / gas.lel) * 100 : null;

    root.querySelector('[data-result="ppm"]').textContent = format(ppm);
    root.querySelector('[data-result="mg_m3"]').textContent = format(mgM3);
    root.querySelector('[data-result="vol_percent"]').textContent = format(volPercent);
    root.querySelector('[data-result="lel_percent"]').textContent = lelPercent === null ? 'нет данных' : format(lelPercent);
    root.querySelector('[data-info="name"]').textContent = gas.name;
    root.querySelector('[data-info="molar"]').textContent = `${gas.molarMass} г/моль`;
    root.querySelector('[data-info="lel"]').textContent = gas.lel ? `${gas.lel.toFixed(2)} % об. д. = 100 % НКПР` : 'нет данных';
    root.querySelector('[data-info="pdk"]').textContent = gas.pdk;
    valueLabel.textContent = units[unit] || units.ppm;
  }

  [gasSelect, unitSelect, valueInput, pressureInput, temperatureInput].forEach((element) => {
    element.addEventListener('input', convert);
    element.addEventListener('change', convert);
  });

  reset.addEventListener('click', () => {
    pressureInput.value = '101.325';
    temperatureInput.value = '20';
    convert();
  });

  convert();
}());
