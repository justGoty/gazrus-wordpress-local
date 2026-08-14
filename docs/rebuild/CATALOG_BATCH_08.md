# CATALOG BATCH 08

Статус: локальная подготовка, без commit, push и deploy.

## Состав пакета

- Honeywell City Technology 4OXV — сенсор O2, `published` после проверки маркировки и официального datasheet.
- Alphasense H2S-A1 — сенсор H2S, `published` после проверки официального изображения и datasheet.
- Membrapor CO/C-1000 — сенсор CO, `draft`.

## Официальные источники характеристик

### Honeywell City Technology 4OXV

- [Официальная страница Honeywell City Technology 4 Series](https://automation.honeywell.com/us/en/products/sensing-solutions/sensors/gas-sensors/4-series-gas-sensor)
- [Официальный datasheet 4OXV](https://prod-edam.honeywell.com/content/dam/honeywell-edam/sps/siot/en-us/products/sensors/gas-sensors/4-series/documents/sps-siot-citytech-4oxv-sensor-datasheet.pdf?download=false)
- [PSDS 4](https://automation.honeywell.com/content/dam/honeywell-edam/sps/siot/en-us/citytech-materials-safety/psds/sps-ast-citytech-psds-4.pdf)

Фото с читаемой маркировкой 4OXV получено со страницы промышленного поставщика Spantech и использовано только как источник изображения, не характеристик. Фон удален, конструкция и маркировка не изменялись.

### Alphasense H2S-A1

- [Официальная страница H2S-A1](https://store.alphasense.com/h2s-a1/)
- [Официальный datasheet H2S-A1](https://ametekcdn.azureedge.net/mediafiles/project/oneweb/oneweb/alphasense/products/datasheets/alphasense_h2s-a1_datasheet_en_1.pdf?revision%3A8ed44a8a-fe0c-4c8e-9d3b-f2b3f27d00db=)
- [Официальный обзор сенсоров H2S Alphasense](https://www.alphasense.com/products/view-by-target-gas/hydrogen-sulphide-sensors-h2s)

Фото H2S-A1 получено с официальной товарной страницы Alphasense; фон удален без изменения конструкции и маркировки.

### Membrapor CO/C-1000

- [Официальная страница Membrapor Compact Gas Sensors](https://www.membrapor.ch/en/compact-gas-sensor/)
- [Официальный datasheet CO/C-1000](https://www.membrapor.ch/sheet/Carbon-Monoxide-Gas-Sensor-CO-C-1000.pdf)

Точное товарное фото с читаемой маркировкой CO/C-1000 изготовителем не опубликовано. В карточке временно использован реальный снимок корпуса Membrapor Compact без видимого обозначения соседней модификации; это фото не подтверждает конкретную маркировку CO/C-1000. Карточка остается `draft` до получения точного снимка.

## Измененные файлы

- `web/content/catalog/dictionaries/brands.json`
- `web/content/catalog/products/city-technology-4oxv.json`
- `web/content/catalog/products/alphasense-h2s-a1.json`
- `web/content/catalog/products/membrapor-co-c-1000.json`
- `web/public/images/products/city-technology-4oxv/city-technology-4oxv-cutout.webp`
- `web/public/images/products/alphasense-h2s-a1/alphasense-h2s-a1-cutout.webp`
- `web/public/images/products/membrapor-co-c-1000/membrapor-compact-housing-cutout.webp`
- `docs/rebuild/CATALOG_BATCH_08.md`

## Неподтвержденные или вариативные поля

- Цена, наличие, срок поставки и комплект поставки для всех трех позиций.
- Российская поверка, сертификаты РФ и совместимость с конкретными приборами.
- Совместимость определяется только по точному артикулу, распиновке, электрической схеме и документации изготовителя прибора.
- Для CO/C-1000 требуется точное фото с читаемой маркировкой модели перед переводом в `published`.
- Указанный в datasheet срок службы CO/C-1000 зависит от применения; он не является гарантией для конкретных условий эксплуатации.

## Проверки

- ProductSchema / целостность справочников: успешно через production-сборку Next.js.
- Изображения: `1200x1200`, WebP, alpha-канал присутствует; на светлом и темном фоне заметных рамок и ореолов нет.
- `pnpm lint`: успешно.
- `pnpm build`: успешно.
- Desktop 1440: страницы трех товаров открываются, изображения загружены, горизонтального переполнения нет.
- Mobile 390x844: страницы трех товаров открываются, заголовки и изображения помещаются в контейнеры, горизонтального переполнения нет.

После итоговой проверки 4OXV и H2S-A1 переведены в `published`. CO/C-1000 оставлен в `draft` до получения точного снимка с читаемой маркировкой модели.
