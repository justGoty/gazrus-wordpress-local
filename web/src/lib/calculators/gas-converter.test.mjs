import assert from "node:assert/strict";
import test from "node:test";
import { calculateGasConversions } from "./gas-converter.mjs";

const standardConditions = { temperatureC: 20, pressureKpa: 101.325 };

test("1% volume equals 10,000 ppm", () => {
  const result = calculateGasConversions({
    gasId: "ch4",
    value: 1,
    unit: "vol-percent",
    ...standardConditions,
  });
  assert.equal(result.ppm, 10000);
});

test("50% LEL methane equals 2.5% volume", () => {
  const result = calculateGasConversions({
    gasId: "ch4",
    value: 50,
    unit: "lel-percent",
    ...standardConditions,
  });
  assert.equal(result.ppm, 25000);
  assert.equal(result.volPercent, 2.5);
});

test("10% LEL propane equals 2,100 ppm", () => {
  const result = calculateGasConversions({
    gasId: "c3h8",
    value: 10,
    unit: "lel-percent",
    ...standardConditions,
  });
  assert.ok(Math.abs(result.ppm - 2100) < 1e-9);
  assert.ok(Math.abs(result.volPercent - 0.21) < 1e-9);
});

test("carbon monoxide at 25 C converts close to 1.145 mg/m3 per ppm", () => {
  const result = calculateGasConversions({
    gasId: "co",
    value: 1,
    unit: "ppm",
    temperatureC: 25,
    pressureKpa: 101.325,
  });
  assert.ok(Math.abs(result.mgM3 - 1.145) < 0.002);
});

test("mg/m3 conversion round-trips through ppm", () => {
  const forward = calculateGasConversions({
    gasId: "h2s",
    value: 35,
    unit: "ppm",
    ...standardConditions,
  });
  const backward = calculateGasConversions({
    gasId: "h2s",
    value: forward.mgM3,
    unit: "mg-m3",
    ...standardConditions,
  });
  assert.ok(Math.abs(backward.ppm - 35) < 1e-9);
});

test("LEL input is rejected when the gas has no verified LEL value", () => {
  assert.throws(
    () =>
      calculateGasConversions({
        gasId: "o2",
        value: 10,
        unit: "lel-percent",
        ...standardConditions,
      }),
    /НКПР пока недоступен/,
  );
});

test("invalid physical conditions are rejected", () => {
  assert.throws(
    () =>
      calculateGasConversions({
        gasId: "ch4",
        value: 1,
        unit: "ppm",
        temperatureC: -273.15,
        pressureKpa: 101.325,
      }),
    /абсолютного нуля/,
  );
});
