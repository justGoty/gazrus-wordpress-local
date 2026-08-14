# CATALOG BATCH 10

Статус: локальная подготовка, без commit, push и deploy.

## Состав пакета

- Honeywell Sensepoint XCD — стационарный одноканальный газовый трансмиттер, `published`.
- АНКАТ-7664Микро — переносной многокомпонентный газоанализатор, `published`.
- Dräger Pac 6000 — индивидуальный однокомпонентный газоанализатор, `published`.

Все три записи используют `commercialMode: request_quote`. Цена, наличие и срок поставки не заявлены.

## Официальные источники

### Honeywell Sensepoint XCD

- [Официальная страница Honeywell Sensepoint XCD](https://automation.honeywell.com/us/en/products/sensing-solutions/gas-and-flame-detection/fixed-gas-and-flame-detection/fixed-gas-detectors/sensepoint-xcd-gas-detector)
- [Sensepoint XCD Technical Manual, Issue 16](https://prod-edam.honeywell.com/content/dam/honeywell-edam/sps/his/en-us/products/gas-and-flame-detection/documents/hon-ia-pmc-sensepoint-xcd-technical-manual.pdf)
- [Официальный рендер Sensepoint XCD](https://s7d1.scene7.com/is/image/Honeywell65/Sensepoint_XCD)

Карточка описывает платформу XCD без смешивания характеристик сенсоров. На изображении показано исполнение O2; газ, диапазон, материал корпуса, вводы и взрывозащита уточняются по конфигурации.

### АНКАТ-7664Микро

- [Официальная страница АНКАТ-7664Микро](https://www.analitpribor-smolensk.ru/products/gazoanalizators/perenosnii/bezopasnost-i-ohrana-truda/ankat_micro_pid/)
- [Паспорт ИБЯЛ.413411.053 ПС](https://www.analitpribor-smolensk.ru/files/rukovodstva/2015/ankat-7664micro/ankat_7664mikro_ibyal_413411_053_ps.pdf)
- [Руководство для модификаций 01–18](https://www.analitpribor-smolensk.ru/files/rukovodstva/2015/ankat-7664micro/ankat_7664mikro_ibyal_413411_053_re_chast_1.pdf)
- [Руководство для модификаций 20–45](https://www.analitpribor-smolensk.ru/files/rukovodstva/2015/ankat-7664micro/ankat_7664mikro_ibyal_413411_053_re_chast_2.pdf)
- [Методика поверки МП-242-1981-2015](https://www.analitpribor-smolensk.ru/files/rukovodstva/2015/ankat-7664micro/ankat_7664_mikro_mp-242-1981-2015_izm_1.pdf)
- [Официальное фото АНКАТ-7664Микро](https://www.analitpribor-smolensk.ru/images/cms/data/photo/Ankat7664mikro/ankat_7664_mikro_1.jpg)

Российская поверка и утверждение типа упомянуты только для АНКАТ-7664Микро, поскольку они подтверждены паспортом, методикой поверки и официальным свидетельством. Конкретный состав каналов, маркировка Ex и автономность зависят от модификации.

### Dräger Pac 6000

- [Официальная страница Dräger Pac 6000](https://www.draeger.com/en-us_us/Products/Pac-6000)
- [Dräger Pac 6000 Product Information DMC-113255](https://www.draeger.com/Content/Documents/Products/pac-6000-pi-113255-en-us.pdf)
- [Pac 6x00 / 8x00 Technical Manual 9033742](https://www.draeger.com/Content/Documents/Products/pac-6x00-8x00-technical-manual-9033742-ifu-en.pdf)
- [Официальное фото Dräger Pac 6000 H2S](https://www.draeger.com/Media/Content/Products/Slideshow/Draeger-Pac-6000-D-4977-2017-01.jpg)

Изображение показывает исполнение H2S. Диапазоны остальных исполнений взяты из актуального официального product information; российская поверка и сертификаты не заявлены.

## Обработка изображений

- Использованы только официальные изображения точных моделей.
- Фон удалён без генеративной дорисовки и без изменения конструкции, дисплеев, органов управления или маркировки.
- У АНКАТ удалён отдельный рекламный знак, не являющийся частью прибора.
- Каждый итоговый файл: WebP, `1200 × 1200`, прозрачный фон и сохранённые пропорции.

## Изменённые файлы

- `web/content/catalog/products/honeywell-sensepoint-xcd.json`
- `web/content/catalog/products/ankat-7664-micro.json`
- `web/content/catalog/products/draeger-pac-6000.json`
- `web/public/images/products/honeywell-sensepoint-xcd/honeywell-sensepoint-xcd-front-v1.webp`
- `web/public/images/products/ankat-7664-micro/ankat-7664-micro-front-v1.webp`
- `web/public/images/products/draeger-pac-6000/draeger-pac-6000-h2s-front-v1.webp`
- `docs/rebuild/CATALOG_BATCH_10.md`

Справочники брендов и газов не изменялись: необходимые записи уже существуют.

## Неподтверждённые или вариативные поля

- Цена, наличие, срок поставки и фактическая комплектация всех трёх товаров.
- Российская поверка и российские сертификаты Honeywell Sensepoint XCD и Dräger Pac 6000.
- Точный сенсор, диапазон, корпус, вводы и взрывозащита Honeywell Sensepoint XCD.
- Состав каналов, принадлежности, Ex-маркировка и автономность конкретной модификации АНКАТ-7664Микро.
- Газовое исполнение и артикул Dräger Pac 6000; фотография карточки относится к H2S.

## Проверки

- ProductSchema, уникальность `id`/`slug`, SEO-поля и целостность справочников: успешно проверены production-сборкой.
- Изображения `1200 × 1200`, WebP, alpha-канал: проверено.
- Битые локальные изображения: не обнаружены; все три изображения загружаются с ненулевым натуральным размером.
- `pnpm lint`: успешно.
- `pnpm build`: успешно.
- Desktop 1440 и mobile 390: все три страницы проверены в Chromium; горизонтального переполнения, обрезки текста и сломанных изображений не обнаружено.
