// @ts-check

export const GAS_CONSTANT = 8.314462618;
export const STANDARD_PRESSURE_KPA = 101.325;
export const DEFAULT_TEMPERATURE_C = 20;

/** @typedef {"ppm" | "mg-m3" | "vol-percent" | "lel-percent"} ConcentrationUnit */

/**
 * Molar masses are conventional molecular weights in g/mol. LEL values are
 * volume percentages used only for the optional %LEL conversion.
 */
export const GAS_OPTIONS = [
  {
    id: "ch4",
    formula: "CH4",
    name: "Метан",
    molarMass: 16.0425,
    lelVolPercent: 5,
    sourceUrl: "https://www.cdc.gov/niosh/docs/2016-108/pdfs/2016-108.pdf",
  },
  {
    id: "c3h8",
    formula: "C3H8",
    name: "Пропан",
    molarMass: 44.0956,
    lelVolPercent: 2.1,
    sourceUrl: "https://www.cdc.gov/niosh/npg/npgd0524.html",
  },
  {
    id: "co",
    formula: "CO",
    name: "Оксид углерода",
    molarMass: 28.0101,
    lelVolPercent: 12.5,
    sourceUrl: "https://www.cdc.gov/niosh/npg/npgd0105.html",
  },
  {
    id: "h2s",
    formula: "H2S",
    name: "Сероводород",
    molarMass: 34.0809,
    lelVolPercent: 4,
    sourceUrl: "https://www.cdc.gov/niosh/npg/npgd0337.html",
  },
  {
    id: "nh3",
    formula: "NH3",
    name: "Аммиак",
    molarMass: 17.0305,
    lelVolPercent: 15,
    sourceUrl: "https://www.cdc.gov/niosh/npg/npgd0028.html",
  },
  { id: "h2", formula: "H2", name: "Водород", molarMass: 2.01588 },
  { id: "o2", formula: "O2", name: "Кислород", molarMass: 31.9988 },
  { id: "co2", formula: "CO2", name: "Диоксид углерода", molarMass: 44.0095 },
  { id: "no", formula: "NO", name: "Оксид азота", molarMass: 30.0061 },
  { id: "no2", formula: "NO2", name: "Диоксид азота", molarMass: 46.0055 },
  { id: "so2", formula: "SO2", name: "Диоксид серы", molarMass: 64.066 },
  { id: "cl2", formula: "Cl2", name: "Хлор", molarMass: 70.906 },
  { id: "hcl", formula: "HCl", name: "Хлороводород", molarMass: 36.46094 },
  { id: "o3", formula: "O3", name: "Озон", molarMass: 47.9982 },
  { id: "hcn", formula: "HCN", name: "Циановодород", molarMass: 27.0253 },
];

export const UNIT_OPTIONS = [
  { id: "ppm", label: "ppm" },
  { id: "mg-m3", label: "мг/м³" },
  { id: "vol-percent", label: "% об." },
  { id: "lel-percent", label: "% НКПР" },
];

/** @param {string} gasId */
export function getGasById(gasId) {
  const gas = GAS_OPTIONS.find((option) => option.id === gasId);
  if (!gas) {
    throw new Error("Выберите газ из списка");
  }
  return gas;
}

/**
 * @param {{ gasId: string; value: number; unit: ConcentrationUnit; temperatureC: number; pressureKpa: number }} input
 */
export function calculateGasConversions(input) {
  const { gasId, value, unit, temperatureC, pressureKpa } = input;
  const gas = getGasById(gasId);

  if (!Number.isFinite(value) || value < 0) {
    throw new Error("Введите неотрицательную концентрацию");
  }
  if (!Number.isFinite(temperatureC) || temperatureC <= -273.15) {
    throw new Error("Температура должна быть выше абсолютного нуля");
  }
  if (!Number.isFinite(pressureKpa) || pressureKpa <= 0) {
    throw new Error("Давление должно быть больше нуля");
  }
  if (unit === "lel-percent" && gas.lelVolPercent == null) {
    throw new Error("Для выбранного газа перевод через НКПР пока недоступен");
  }

  const temperatureK = temperatureC + 273.15;
  const pressurePa = pressureKpa * 1000;
  let ppm;

  switch (unit) {
    case "ppm":
      ppm = value;
      break;
    case "mg-m3":
      ppm = (value * GAS_CONSTANT * temperatureK * 1000) / (gas.molarMass * pressurePa);
      break;
    case "vol-percent":
      ppm = value * 10000;
      break;
    case "lel-percent": {
      if (gas.lelVolPercent == null) {
        throw new Error("Для выбранного газа перевод через НКПР пока недоступен");
      }
      ppm = (value / 100) * gas.lelVolPercent * 10000;
      break;
    }
    default:
      throw new Error("Выберите единицу измерения");
  }

  const volPercent = ppm / 10000;
  const mgM3 = (ppm * gas.molarMass * pressurePa) / (GAS_CONSTANT * temperatureK * 1000);
  const lelPercent = gas.lelVolPercent == null ? null : (volPercent / gas.lelVolPercent) * 100;

  return {
    gas,
    ppm,
    mgM3,
    volPercent,
    lelPercent,
    temperatureK,
    pressurePa,
  };
}
