export type CategoryId = "stationary" | "portable" | "sensors";

export type Category = {
  id: CategoryId;
  label: string;
  cardTitle: string;
  title: string;
  description: string;
  cardImage: string;
  heroImage: string;
  heroMobileImage: string;
  imageAlt: string;
  focus: string;
  accent: "blue" | "amber" | "teal";
  cardDescription: string;
};

export const categories: Category[] = [
  {
    id: "stationary",
    label: "Стационарные",
    cardTitle: "Стационарные газоанализаторы",
    title: "Стационарные газоанализаторы: подбор и поставка",
    description:
      "Подберем прибор для вашего объекта: от отдельных точек контроля до системы загазованности. Уточним газ, диапазон и подключение к автоматике.",
    cardImage: "/images/hero-stationary-hd.webp",
    heroImage: "/images/hero-stationary-scene-v2.webp",
    heroMobileImage: "/images/hero-stationary-scene-mobile-v2.webp",
    imageAlt: "Стационарная система промышленного газового контроля на объекте",
    focus: "Точки контроля · Ex/IP · интерфейсы",
    accent: "blue",
    cardDescription:
      "Для котельных, производственных зон, складов и технологических установок.",
  },
  {
    id: "portable",
    label: "Портативные",
    cardTitle: "Портативные газоанализаторы",
    title: "Портативные газоанализаторы для рабочих задач",
    description:
      "Для обходов, ремонта и проверки воздуха перед работами. Поможем выбрать модель по газам, отбору пробы и времени автономной работы.",
    cardImage: "/images/hero-portable-hd.webp",
    heroImage: "/images/hero-portable-scene-v2.webp",
    heroMobileImage: "/images/hero-portable-scene-mobile-v2.webp",
    imageAlt: "Портативный газоанализатор с пробоотборными принадлежностями",
    focus: "Каналы · отбор пробы · автономность",
    accent: "amber",
    cardDescription:
      "Для обходов, ремонта, колодцев, резервуаров и замкнутых пространств.",
  },
  {
    id: "sensors",
    label: "Сенсоры",
    cardTitle: "Сенсоры для газоанализаторов",
    title: "Сенсоры для газоанализаторов: подберем совместимый",
    description:
      "Нужна замена сенсора? Укажите модель прибора или маркировку чувствительного элемента. Проверим газ, диапазон и совместимость перед заказом.",
    cardImage: "/images/hero-sensors-hd.webp",
    heroImage: "/images/hero-sensors-scene-v2.webp",
    heroMobileImage: "/images/hero-sensors-scene-mobile-v2.webp",
    imageAlt: "Сменные электрохимические, инфракрасные и каталитические сенсоры для газоанализаторов",
    focus: "Совместимость · диапазон · технология",
    accent: "teal",
    cardDescription:
      "Для плановой замены, ремонта и комплектации газоаналитического оборудования.",
  },
];

export const categoryById = Object.fromEntries(
  categories.map((category) => [category.id, category]),
) as Record<CategoryId, Category>;
