# Пакет каталога 07

Дата проверки: 14 августа 2026 года.

## Состав пакета

1. Honeywell BW Solo — обслуживаемый одноканальный газоанализатор, без параметров BW Solo Lite.
2. Dräger X-am 5800 — многогазовый прибор до шести газов, без переноса параметров соседних моделей X-am.
3. Honeywell City Technology 4HS+ — OEM-сенсор H2S, артикул 2112B2025, без характеристик 4HS/LM, 4H и других H2S-сенсоров.

## Официальные источники

### Honeywell BW Solo

- [Официальная карточка Honeywell BW Solo](https://automation.honeywell.com/us/en/products/sensing-solutions/gas-and-flame-detection/portables/single-gas/honeywell-bw-solo-single-gas-detector)
- [Официальный datasheet Honeywell BW Solo, revision C](https://prod-edam.honeywell.com/content/dam/honeywell-edam/sps/his/en-us/products/gas-and-flame-detection/documents/portables/bw-solo/sps-his-bw-solo-datasheet-rev-c.pdf?download=false)
- [Официальная декларация соответствия EU/UK](https://prod-edam.honeywell.com/content/dam/honeywell-edam/sps/hgas/en-us/products/portables/honeywell-bw-solo/documents/hon-ia-pmc-bw-solo-2004y0142-07-eu-uk-declaration-of-conformity.pdf)
- [Официальное товарное изображение Honeywell](https://s7d1.scene7.com/is/image/Honeywell65/BWSoloMainSquare)

### Dräger X-am 5800

- [Официальная карточка Dräger X-am 5800](https://www.draeger.com/en-us_us/Products/x-am-5800)
- [Официальная информация о продукте Dräger X-am 5800](https://www.draeger.com/Content/Documents/Products/X-am-5800-pi-100941-en-MASTER.pdf)
- [Официальное техническое руководство X-am 2600/2800/5800](https://www.draeger.com/Content/Documents/Products/xam-ifu-9300310-en.pdf)
- [Официальное товарное изображение Dräger](https://www.draeger.com/Media/Content/Products/Slideshow/draeger-x-am-5800-multi-gas-detectors-3-2-D-9538-2022.jpg?imwidth=768)

### Honeywell City Technology 4HS+

- [Официальная страница сенсоров Honeywell City Technology серии 4](https://automation.honeywell.com/us/en/products/sensing-solutions/sensors/gas-sensors/4-series-gas-sensor)
- [Официальный datasheet Honeywell City Technology 4HS+](https://prod-edam.honeywell.com/content/dam/honeywell-edam/sps/siot/en-us/products/sensors/gas-sensors/4-series/documents/sps-siot-citytech-4hs-plus-sensor-datasheet.pdf?download=false)
- [Официальные принципы работы OP08](https://prod-edam.honeywell.com/content/dam/honeywell-edam/sps/siot/en-us/products/sensors/gas-sensors/common/documents/hon-ia-hss-op08-electrochemical-3-electrode-un-biased-toxic.pdf)

Товарный кадр 4HS+ вырезан из архивной пресс-фотографии City Technology USA с читаемой маркировкой модели. Технические данные по фотографии не определялись: все характеристики взяты только из действующих документов Honeywell. Изображение не генерировалось и конструкция сенсора не дорисовывалась.

## Измененные файлы

- `web/content/catalog/dictionaries/brands.json`
- `web/content/catalog/dictionaries/gases.json`
- `web/content/catalog/products/honeywell-bw-solo.json`
- `web/content/catalog/products/draeger-x-am-5800.json`
- `web/content/catalog/products/city-technology-4hs-plus.json`
- `web/public/images/products/honeywell-bw-solo/honeywell-bw-solo-front-v1.webp`
- `web/public/images/products/draeger-x-am-5800/draeger-x-am-5800-front-v1.webp`
- `web/public/images/products/city-technology-4hs-plus/city-technology-4hs-plus-cutout-v1.webp`
- `docs/rebuild/CATALOG_BATCH_07.md`

## Обработка изображений

- Итоговые файлы: WebP RGBA, 1200 × 1200 px, прозрачный фон.
- Удалены только исходные фоны; рамки и декоративные подложки не добавлялись.
- Геометрия, экран, корпус и маркировка приборов не изменялись.
- Для Dräger использован доступный официальный кадр 768 px, увеличенный до стандартного холста без синтетической реконструкции деталей.
- Попытка генеративной вырезки 4HS+ отклонена, так как она меняла маркировку; в пакет вошла только детерминированная вырезка реального кадра.

## Проверки

- [x] Все новые UUID, slug, SEO title и SEO description уникальны.
- [x] BW Solo отделен от BW Solo Lite; диапазоны, помеченные изготовителем как Lite-only, исключены.
- [x] X-am 5800 отделен от X-am 2800 и других моделей серии.
- [x] 4HS+ отделен от 4HS/LM, 4H и других сенсоров H2S.
- [x] Цена, наличие, срок поставки, российская поверка и российские сертификаты не заявлены.
- [x] Honeywell-ссылки отвечали HTTP 200 при проверке 14 августа 2026 года.
- [x] Страницы и документы Dräger просмотрены в официальном веб-интерфейсе; отдельные HEAD-запросы из PowerShell завершились тайм-аутом сайта.
- [x] ProductSchema, справочники, UUID, slug и уникальность SEO-полей: 15 товаров, 9 брендов, 19 газов.
- [x] `pnpm lint`.
- [x] `pnpm build`.
- [x] `scripts/check.ps1 -SkipWeb` с разовым `ExecutionPolicy Bypass`.
- [x] Desktop 1440 px: каталог и три карточки, без горизонтального переполнения и битых изображений.
- [x] Mobile 390 px: каталог и три карточки, без горизонтального переполнения и битых изображений.
- [x] Консоль браузера: ошибок и предупреждений нет.

## Непроверенные и вариативные параметры

- Цена, наличие и срок поставки — только после запроса коммерческого предложения.
- Российская поверка, утверждение типа и сертификаты РФ — не подтверждены и не заявлены.
- BW Solo: заказной код, конкретный сенсор, диапазон, рабочая температура, wireless-исполнение и ресурс батареи зависят от выбранной версии.
- Dräger X-am 5800: точный набор сенсоров, диапазоны, число измеряемых газов, время работы, температурный допуск и доступность Bluetooth зависят от конфигурации и страны.
- 4HS+: совместимость с конкретным газоанализатором не подтверждается только форм-фактором; нужны артикул, распиновка, нагрузка, схема и калибровка конечного прибора.
- Публичный официальный user manual BW Solo без авторизации не найден; в карточку не добавлялся.

## Ограничения публикации

Пакет подготовлен в изолированном worktree. Коммит, push и deploy не выполнялись. Hero, `globals.css`, `layout.tsx`, `categories.ts`, общие SEO metadata и production-конфигурация не изменялись.
