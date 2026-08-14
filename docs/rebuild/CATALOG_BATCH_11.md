# Пакет каталога 11

Статус: подготовлен 14 августа 2026 года, без commit, push и deploy.

## Состав пакета

| Товар | Категория | Статус | Причина статуса |
|---|---|---|---|
| MSA ALTAIR 2X | Портативные | `published` | Официальные данные, руководство и изображение точной серии проверены |
| Industrial Scientific Ventis Pro5 | Портативные | `draft` | Для публикации требуется добавить производителя в `brands.json` |
| Membrapor H2S/C-50 | Сенсоры | `draft` | Datasheet точный, но модельная маркировка на официальном фото не читается |

Во всех карточках используется `commercialMode: request_quote`. Цена, наличие, срок поставки, российская поверка и сертификаты РФ не заявлены.

## Официальные источники

### MSA ALTAIR 2X

- [Официальная карточка MSA ALTAIR 2X](https://us.msasafety.com/Portable-Gas-Detection/Single-or-Two-Gas/ALTAIR%C2%AE-2X-Gas-Detector/p/000080000200001600?locale=en)
- [Руководство по эксплуатации MSA ALTAIR 2X](https://docs.msasafety.com/altair2x/en-us/ALTAIR%202X%20INT%20OPM%2010148950/PDF/OPM_ALTAIR_2X_10148950_07_US.pdf)
- [Технические данные MSA ALTAIR 2X](https://docs.msasafety.com/altair2x/en-us/ALTAIR%202X%20INT%20OPM%2010148950/Technical_Data.htm)
- [Данные сенсоров MSA ALTAIR 2X](https://docs.msasafety.com/altair2x/en-us/ALTAIR%202X%20INT%20OPM%2010148950/Sensor_Data.htm)

Изображение извлечено из официального руководства MSA. Использован реальный прибор в исполнении H2S; удалён только фон, конструкция, дисплей и маркировка не заменялись.

### Industrial Scientific Ventis Pro5

- [Официальная карточка Ventis Pro5](https://www.indsci.com/en/gas-detectors/multi/ventis-pro5)
- [Официальная спецификация Ventis Pro5](https://www.indsci.com/hubfs/IS_VentisPro5_SpecSheet_EN%20(2).pdf)
- [Официальное руководство Ventis Pro5](https://fs.hubspotusercontent00.net/hubfs/4113657/_ISC2021/Supporting%20Documents/VentisPro5/17156830-1-ventis-pro-product-manual_en.pdf)

Изображение взято с официальной карточки Industrial Scientific. Исходный прозрачный WebP нормализован до товарного холста без изменения приборов и экранов.

### Membrapor H2S/C-50

- [Официальный datasheet Membrapor H2S/C-50](https://www.membrapor.ch/sheet/Hydrogen-Sulfide-Gas-Sensor-H2S-C-50.pdf)

Изображение вырезано из шапки точного официального datasheet. Это реальный корпус Membrapor Compact, фон удалён без генеративной замены, однако обозначение `H2S/C-50` на снимке неразборчиво. До получения точного фото с читаемой маркировкой карточка остаётся `draft`.

## Требуемая запись справочника

Справочники в рамках пакета не изменялись. Для последующей публикации Ventis Pro5 требуется добавить в `web/content/catalog/dictionaries/brands.json` точную запись:

```json
{ "id": "industrial-scientific", "name": "Industrial Scientific" }
```

Новые записи газов не требуются.

## Изменённые файлы

- `web/content/catalog/products/msa-altair-2x.json`
- `web/content/catalog/products/industrial-scientific-ventis-pro5.json`
- `web/content/catalog/products/membrapor-h2s-c-50.json`
- `web/public/images/products/msa-altair-2x/msa-altair-2x-front-v1.webp`
- `web/public/images/products/industrial-scientific-ventis-pro5/industrial-scientific-ventis-pro5-front-v1.webp`
- `web/public/images/products/membrapor-h2s-c-50/membrapor-h2s-c-50-cutout-v1.webp`
- `docs/rebuild/CATALOG_BATCH_11.md`

## Неподтверждённые или вариативные поля

- Цена, наличие, срок поставки и точная комплектация всех трёх позиций.
- Российская поверка, сертификаты РФ и применимость конкретных разрешительных документов.
- Газовый набор, диапазоны, насос, связь и сертификация Ventis Pro5 зависят от артикула.
- Одно- или двухгазовая конфигурация, диапазон и исполнение XCell Pulse для ALTAIR 2X зависят от артикула.
- Совместимость H2S/C-50 с конкретным прибором подтверждается только по документации производителя прибора и точному артикулу сенсора.
- Для H2S/C-50 требуется фото с читаемой маркировкой модели перед переводом в `published`.

## Проверки

- ProductSchema, уникальность UUID, slug и SEO-полей: успешно через production build.
- Связи со справочниками: MSA и Membrapor корректны; отсутствующая запись Industrial Scientific оставлена явным условием публикации.
- Изображения: три файла `1200×1200`, WebP с alpha-каналом и прозрачными углами.
- Битые локальные изображения: нет; все три URL медиа возвращают `200`.
- Официальные страницы и документы: шесть проверенных URL возвращают `200`.
- `pnpm lint`: успешно.
- `pnpm build`: успешно.
- Desktop 1440: опубликованная страница ALTAIR 2X проверена, один H1, изображение загружено, горизонтального переполнения нет.
- Mobile 390×844: ALTAIR 2X проверен, изображение не обрезано, битых изображений и горизонтального переполнения нет.
- Ventis Pro5 и H2S/C-50 возвращают `404` и отсутствуют в sitemap, поскольку осознанно оставлены в `draft`; их WebP отдельно проверены на прозрачном холсте.
- Sitemap: содержит ALTAIR 2X и не содержит два черновика.
