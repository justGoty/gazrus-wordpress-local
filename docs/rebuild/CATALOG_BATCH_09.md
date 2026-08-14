# CATALOG BATCH 09

Статус: локальная подготовка от 14 августа 2026 года. Commit, push и deploy не выполнялись.

## Состав пакета

- Аналитприбор ДАХ-М — стационарный электрохимический датчик-газоанализатор.
- Аналитприбор СТГ-3 — стационарный шлейфовый сигнализатор загазованности.
- MSA ULTIMA X5000 — стационарный газовый трансмиттер.

Все позиции используют `commercialMode: request_quote`. Цена, наличие и срок поставки не заявлены.

## Официальные источники

### Аналитприбор ДАХ-М

- [Официальная страница ДАХ-М](https://www.analitpribor-smolensk.ru/products/gazoanalizators/stacionarnye/vzryvozawiwennoe-oborudovanie/dah_m/)
- [Техническое описание ДАХ-М](https://www.analitpribor-smolensk.ru/files/Reklamnielistki/dah-m.pdf)
- [Руководство ДАХ-М-01/-03](https://www.analitpribor-smolensk.ru/files/rukovodstva/2015/dah_m/dah_m_ibyal_413412_005_re.pdf)
- [Руководство ДАХ-М-05/-06](https://www.analitpribor-smolensk.ru/files/rukovodstva/2015/dah_m/dah_m_ibyal_413412_005_04_re.pdf)

Изображение получено с официальной страницы производителя: ДАХ-М-05 в красном металлическом корпусе. Из кадра удалены фон, соседний ракурс и служебная подпись; конструкция, дисплей и маркировка не изменялись.

### Аналитприбор СТГ-3

- [Официальная страница СТГ-3](https://www.analitpribor-smolensk.ru/products/gazoanalizators/stacionarnye/nevzryvozawiwennoe-oborudovanie/stg3/)
- [Техническое описание СТГ-3 / СТГ-3-И](https://www.analitpribor-smolensk.ru/files/Reklamnielistki/stg3_stg3i.pdf)
- [Руководство СТГ-3](https://www.analitpribor-smolensk.ru/files/rukovodstva/2015/stg_3/stg-3_ibyal_413411_051_re.pdf)

Изображение получено с официальной страницы производителя и показывает точное исполнение СТГ-3-CO. Фон удален без изменения корпуса и маркировки.

### MSA ULTIMA X5000

- [Официальная продуктовая страница ULTIMA X5000](https://us.msasafety.com/c/ULTIMA%C2%AE-X5000-Gas-Monitor/p/000070001800001133?locale=en)
- [Официальная страница возможностей X5000](https://us.msasafety.com/x5000?default=1&locale=en)
- [Operating Manual 10177361](https://docs.msasafety.com/x5000/en-us/ULTIMA%2520X5000%2520Gas%2520monitor/PDF/PDF%2520ULTIMA%2520X5000%2520Gas%2520monitor%252010177361.pdf)

Изображение получено из официальной MSA Asset Library и показывает ULTIMA X5000 с сенсором XCell H2S. Удален только белый фон; экран, корпус и маркировка сохранены.

## Ограничения и вариативные параметры

- ДАХ-М: газ, диапазон, корпус, температура, количество проводов и выходы определяются полным индексом исполнения.
- Изображение ДАХ-М показывает модификацию -05 и не является универсальным видом всех корпусов серии.
- СТГ-3: газ, диапазон и сенсорная технология зависят от точного обозначения.
- Соединительная коробка СТГ-3 заказывается отдельно; в карточке она не заявлена частью комплекта.
- ULTIMA X5000: сенсор, диапазон, количество входов, реле, HART, Bluetooth и разрешения зависят от заказного кода и региона.
- Изображение X5000 показывает конфигурацию с XCell H2S; этот сенсор не заявляется частью каждой поставки.
- Российская поверка, российские сертификаты, цена, складское наличие, комплект поставки и срок поставки не заявлены.

## Измененные файлы

- `web/content/catalog/products/analitpribor-dah-m.json`
- `web/content/catalog/products/analitpribor-stg-3.json`
- `web/content/catalog/products/msa-ultima-x5000.json`
- `web/public/images/products/analitpribor-dah-m/analitpribor-dah-m-front-v1.webp`
- `web/public/images/products/analitpribor-stg-3/analitpribor-stg-3-front-v1.webp`
- `web/public/images/products/msa-ultima-x5000/msa-ultima-x5000-front-v1.webp`
- `docs/rebuild/CATALOG_BATCH_09.md`

## Проверки

- ProductSchema / справочники: пройдено в составе production build.
- Изображения: 1200x1200 WebP, RGBA/alpha-канал подтвержден для трех файлов.
- Битые изображения: не обнаружены на трех товарных страницах.
- `pnpm lint`: пройдено.
- `pnpm build`: пройдено.
- Desktop 1440x1000: три страницы проверены, горизонтального переполнения и визуальных дефектов изображений не обнаружено.
- Mobile 390x844: три страницы проверены, заголовки и управляющие элементы помещаются в viewport, горизонтального переполнения нет.

Проверенные маршруты:

- `/catalog/stationary/analitpribor-dah-m`
- `/catalog/stationary/analitpribor-stg-3`
- `/catalog/stationary/msa-ultima-x5000`
