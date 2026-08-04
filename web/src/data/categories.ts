export type CategoryId = "stationary" | "portable" | "sensors";

export type Category = {
  id: CategoryId;
  label: string;
  cardTitle: string;
  title: string;
  description: string;
  image: string;
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
    title: "Непрерывный контроль газовой среды на объекте",
    description:
      "Подбор стационарных газоанализаторов и систем контроля загазованности по газу, диапазону, исполнению и способу интеграции.",
    image: "/images/hero-stationary-v3.webp",
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
    title: "Газовый контроль для обходов и допуска к работам",
    description:
      "Выбор переносных приборов по контролируемым газам, числу каналов, способу отбора пробы и условиям эксплуатации.",
    image: "/images/hero-portable-v2.webp",
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
    title: "Сенсоры для замены, обслуживания и интеграции",
    description:
      "Поиск сенсора по целевому газу, диапазону, принципу измерения, форм-фактору и совместимости с прибором.",
    image: "/images/hero-sensors-v3.webp",
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
