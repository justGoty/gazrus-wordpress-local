export type CategoryId = "stationary" | "portable" | "sensors";

export type Category = {
  id: CategoryId;
  number: string;
  label: string;
  cardTitle: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  focus: string;
  accent: "blue" | "amber" | "teal";
  filters: string[];
  cardDescription: string;
};

export const categories: Category[] = [
  {
    id: "stationary",
    number: "01",
    label: "Стационарные",
    cardTitle: "Стационарные газоанализаторы",
    title: "Непрерывный контроль газовой среды на объекте",
    description:
      "Подбор стационарных газоанализаторов и систем контроля загазованности по газу, диапазону, исполнению и способу интеграции.",
    image: "/images/hero-stationary-v2.webp",
    imageAlt: "Стационарная система промышленного газового контроля на объекте",
    focus: "Точки контроля · Ex/IP · интерфейсы",
    accent: "blue",
    filters: ["Газ", "Диапазон", "Ex/IP", "Интерфейс"],
    cardDescription:
      "Для котельных, производственных зон, складов и технологических установок.",
  },
  {
    id: "portable",
    number: "02",
    label: "Портативные",
    cardTitle: "Портативные газоанализаторы",
    title: "Газовый контроль для обходов и допуска к работам",
    description:
      "Выбор переносных приборов по контролируемым газам, числу каналов, способу отбора пробы и условиям эксплуатации.",
    image: "/images/hero-portable-v2.webp",
    imageAlt: "Портативный газоанализатор с пробоотборными принадлежностями",
    focus: "Каналы · отбор пробы · автономность",
    accent: "amber",
    filters: ["Газ", "Каналы", "Отбор пробы", "Задача"],
    cardDescription:
      "Для обходов, ремонта, колодцев, резервуаров и замкнутых пространств.",
  },
  {
    id: "sensors",
    number: "03",
    label: "Сенсоры",
    cardTitle: "Сенсоры для газоанализаторов",
    title: "Сенсоры для замены, обслуживания и интеграции",
    description:
      "Поиск сенсора по целевому газу, диапазону, принципу измерения, форм-фактору и совместимости с прибором.",
    image: "/images/hero-sensors-v3.webp",
    imageAlt: "Сменные электрохимические, инфракрасные и каталитические сенсоры для газоанализаторов",
    focus: "Совместимость · диапазон · технология",
    accent: "teal",
    filters: ["Газ", "Совместимость", "Технология", "Диапазон"],
    cardDescription:
      "Для плановой замены, ремонта и комплектации газоаналитического оборудования.",
  },
];

export const categoryById = Object.fromEntries(
  categories.map((category) => [category.id, category]),
) as Record<CategoryId, Category>;
