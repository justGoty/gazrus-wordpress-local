"use client";

import { ArrowRight, Mail } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, type CategoryId } from "@/data/categories";

const gases = ["Не выбран", "CO", "CH4", "O2", "H2S", "NH3", "Другой газ"];
const applications = [
  "Не выбрана",
  "Непрерывный контроль",
  "Обход и допуск",
  "Поиск утечек",
  "Замена сенсора",
];

export function QuickSelection() {
  const [category, setCategory] = useState<CategoryId>("stationary");
  const [gas, setGas] = useState(gases[0]);
  const [application, setApplication] = useState(applications[0]);

  const mailto = useMemo(() => {
    const categoryLabel = categories.find((item) => item.id === category)?.label ?? category;
    const body = [
      "Здравствуйте! Нужен подбор газоанализатора.",
      "",
      `Категория: ${categoryLabel}`,
      `Газ: ${gas}`,
      `Задача: ${application}`,
      "",
      "Контактные данные:",
    ].join("\n");

    return `mailto:info@prscom.ru?subject=${encodeURIComponent("Запрос на подбор газоанализатора")}&body=${encodeURIComponent(body)}`;
  }, [application, category, gas]);

  return (
    <div className="selection-layout">
      <div className="selection-copy">
        <p className="section-kicker">Быстрый подбор</p>
        <h2>Начните с известных параметров</h2>
        <p>
          Укажите тип оборудования, газ и задачу. Неизвестные параметры можно оставить пустыми — инженер уточнит их при подготовке КП.
        </p>
      </div>

      <form className="selection-form" onSubmit={(event) => event.preventDefault()}>
        <label>
          <span>Категория</span>
          <select value={category} onChange={(event) => setCategory(event.target.value as CategoryId)}>
            {categories.map((item) => (
              <option value={item.id} key={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Контролируемый газ</span>
          <select value={gas} onChange={(event) => setGas(event.target.value)}>
            {gases.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Задача</span>
          <select value={application} onChange={(event) => setApplication(event.target.value)}>
            {applications.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <a className="button button-primary selection-submit" href={mailto}>
          <Mail aria-hidden="true" size={18} />
          Подготовить запрос
          <ArrowRight aria-hidden="true" size={18} />
        </a>
      </form>
    </div>
  );
}
