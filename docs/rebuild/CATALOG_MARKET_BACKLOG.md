# Рыночная очередь каталога

Статус: рабочий план от 11 августа 2026 года.

Документ задает очередность наполнения каталога Газоанализатор.рус. Это не рейтинг продаж: сопоставимой открытой статистики по моделям на рынке нет. Приоритет основан на присутствии продукции в каталогах крупных поставщиков, актуальности официальной линейки, узнаваемости бренда, полноте документации и способности модели закрыть востребованный сценарий.

## Обозначения

- **P0** — ядро каталога, карточку следует готовить в ближайших партиях.
- **P1** — востребованное расширение после ядра.
- **P2** — специализированная или резервная позиция.
- **published** — карточка уже опубликована.
- **queued** — модель включена в план, но факты, поставка и изображения еще проверяются.
- **availability check** — перед публикацией нужно подтвердить актуальную поставку, сертификаты и поверку для РФ.

Приоритет не означает наличие на складе. На сайте для всех позиций действует коммерческий режим «Запросить КП».

## Ближайшие партии

Каждая партия содержит разные типы продукции, чтобы каталог рос сбалансированно.

| Партия | Стационарный прибор | Портативный прибор | Сенсор |
|---|---|---|---|
| 03 | ДГС ЭРИС-210 | КИП-МГ4 | Honeywell City Technology 4CF+ (CO) |
| 04 | Аналитприбор ДАК | АНКАТ-64М3 | Honeywell City Technology 4HS+ (H2S) |
| 05 | Dräger Polytron 8100 EC | Honeywell BW Solo | Honeywell City Technology 4OXV (O2) |
| 06 | MSA ULTIMA X5000 | Dräger X-am 5800 | Alphasense H2S-A1 |

Перед стартом партии владелец подтверждает, что указанную модель действительно можно поставлять. Если поставка не подтверждена, модель остается в плане, но не публикуется как доступная к заказу.

## Стационарные газоанализаторы

| Приоритет | Производитель и модель | Основной сценарий | Основание для каталога | Статус |
|---|---|---|---|---|
| P0 | [СТА-КД1](https://stacom.ru/product/statsionarnyj-gazoanalizator-ga-kd1/) | Один газ, непрерывный контроль, интеграция в АСУ ТП | Опорная российская модель | published |
| P0 | [СТА-КД3](https://stacom.ru/) | Многоканальный контроль объекта | Закрывает системы с несколькими точками и газами | published |
| P0 | [ДГС ЭРИС-210](https://eriskip.com/ru/product/dgs-210) | Горючие, токсичные газы и O2, взрывоопасные зоны | Актуальная российская промышленная серия, подробная документация | queued |
| P0 | [Аналитприбор ДАК](https://www.analitpribor-smolensk.ru/products/gazoanalizators/stacionarnye/vzryvozawiwennoe-oborudovanie/dak_datchik/) | CH4, CO2, углеводороды и пары нефтепродуктов, ИК | Важная отечественная позиция для нефтегаза | queued |
| P0 | [ЭКСИС МАГ-6 С-П](https://www.eksis.ru/catalog/statsionarnye-odnokomponentnye-gazoanalizatory/) | H2S, CH4, O2, CO2, CO, NH3, SO2, NO2 | Широкая линейка для помещений и технологических задач | queued |
| P0 | [Dräger Polytron 8100 EC](https://www.draeger.com/en-us_us/Products/Draeger-Polytron-8100) | Токсичные газы и O2, электрохимические сенсоры | Международный отраслевой ориентир, более 100 газовых исполнений | availability check |
| P1 | [ДГС ЭРИС-230](https://eriskip.com/ru/product/dgs-230) | Стационарный промышленный контроль | Расширяет российскую линейку ЭРИС и варианты исполнения | queued |
| P1 | [Аналитприбор ДАХ-М](https://www.analitpribor-smolensk.ru/products/gazoanalizators/stacionarnye/vzryvozawiwennoe-oborudovanie/dah_m/) | Токсичные газы и O2 | Закрывает редкие токсичные компоненты; статус каждого исполнения проверять отдельно | queued |
| P1 | [Аналитприбор СТГ-3](https://www.analitpribor-smolensk.ru/products/gazoanalizators/stacionarnye/nevzryvozawiwennoe-oborudovanie/stg3/) | ЖКХ, паркинги, холодильные установки, водоканалы | Полезная многоточечная система для гражданских и промышленных объектов | queued |
| P1 | [Dräger Polytron 8700 IR](https://www.draeger.com/en-us_us/Products/Polytron-8700) | Углеводороды в ppm и % НКПР, ИК | Сильная позиция для нефтегаза и нефтехимии | availability check |
| P1 | [MSA ULTIMA X5000](https://us.msasafety.com/x5000?default=1&locale=en) | Горючие, токсичные газы и O2 | Актуальная универсальная платформа MSA | availability check |
| P1 | [Honeywell Sensepoint XCD](https://www.honeywellanalytics.com/en/products/Sensepoint-XCD) | Горючие, токсичные газы и O2 | Узнаваемая платформа с дисплеем и Modbus | availability check |
| P1 | [Crowcon Xgard Bright](https://www.crowcon.com/us-en/products/xgard-bright/) | Горючие, токсичные газы и O2 | Современная альтернатива с MPS, Modbus и HART | availability check |
| P1 | [Teledyne OLCT 100](https://www.teledynegasandflamedetection.com/en-us/olct-100-olc-100-toxic-and-combustible-gas-detector) | Горючие, токсичные газы и O2 | Широкая модульная серия для обычных и Ex-зон | availability check |
| P2 | [Riken Keiki SD-3](https://global.rikenkeiki.co.jp/products/sd-3) | Нефтегаз, суда и промышленные площадки | Международная конфигурируемая сенсорная платформа | availability check |
| P2 | [Sensitron SMART3G-D3](https://www.sensitron.it/en/smart-3g-d3/) | Горючие и токсичные газы, CO2, ЛОС, хладагенты | Расширяет каталог по холодильной отрасли и VOC | availability check |
| P2 | [Emerson Rosemount 928](https://www.emerson.com/en/measurement-instrumentation/products/rosemount-928-wireless-gas-monitor) | Удаленные беспроводные точки контроля | Нишевая WirelessHART-модель для дорогой кабельной инфраструктуры | availability check |
| P2 | [GfG EC28](https://www.gfgsafety.com/us-en/products/fixed-gas-detection-systems-transmitter/ec28) | Специальные токсичные газы | Полезен для NH3, Cl2, HCN, HF, PH3 и других редких задач | availability check |

## Портативные газоанализаторы

### Уже опубликованы

| Модель | Класс | Статус |
|---|---|---|
| RKI GX-3R Pro | До 5 газов, компактный персональный прибор | published |
| КИП-МГ5 | До 5 газов, встроенный насос | published |
| MSA ALTAIR 4XR | Типовой четырехгазовый персональный прибор | published |
| Dräger X-am 2800 | До 4 газов, персональный контроль | published |

### Очередь

| Приоритет | Производитель и модель | Канальность и сценарий | Основание для каталога | Статус |
|---|---|---|---|---|
| P0 | [КИП-МГ4](https://kipkonsalt.com/product/portativnye-gazoanalizatory/portativnye-gazoanalizatory-kip-mg/portativnyy-mnogokanalnyy-gazoanalizator-kip-mg4-/) | До 5 компонентов, диффузионный контроль | Логичное дополнение насосного КИП-МГ5 | queued |
| P0 | [АНКАТ-64М3](https://www.analitpribor-smolensk.ru/products/gazoanalizators/perenosnii/bezopasnost-i-ohrana-truda/ankat_64_m3/) | До 5 газов, включая PID/VOC по исполнению | Современная российская многоканальная линейка | queued |
| P0 | [КИП-МГ1](https://kipkonsalt.com/product/portativnye-gazoanalizatory/portativnye-gazoanalizatory-kip-mg/portativnyy-odnokanalnyy-gazoanalizator-kip-mg1-/) | Один выбранный газ | Базовый отечественный персональный прибор | queued |
| P0 | [АНКАТ-7631Микро](https://www.analitpribor-smolensk.ru/products/gazoanalizators/perenosnii/bezopasnost-i-ohrana-truda/ankat7631micro/) | Один газ: CO, HCl, H2S, NH3, Cl2, SO2, NO2 или O2 | Закрывает российские одноканальные исполнения | queued |
| P0 | [Honeywell BW Flex](https://automation.honeywell.com/us/en/products/sensing-solutions/gas-and-flame-detection/portables/multi-gas/honeywell-bw-flex) | До 5 газов, персональный контроль и ОЗП | Современная международная многогазовая платформа | availability check |
| P0 | [Honeywell BW Solo](https://automation.honeywell.com/us/en/products/sensing-solutions/gas-and-flame-detection/portables/single-gas/honeywell-bw-solo-single-gas-detector) | Один из широкого перечня токсичных газов или O2 | Узнаваемая обслуживаемая одноканальная серия | availability check |
| P0 | [Dräger X-am 5800](https://www.draeger.com/en-us_us/Products/X-am-5800) | До 5 газов | Следующая ступень линейки после X-am 2800 | availability check |
| P0 | [MSA ALTAIR 5X](https://us.msasafety.com/Portable-Gas-Detection/Multi-Gas/ALTAIR%C2%AE-5X-Multigas-Detector/p/000080001600001023?locale=en) | До 6 газов, насос, PID по исполнению | Закрывает обследовательские работы и ОЗП | availability check |
| P1 | [АНКАТ-7664Микро](https://www.analitpribor-smolensk.ru/products/gazoanalizators/perenosnii/bezopasnost-i-ohrana-truda/ankat_micro_pid/) | 1-4 канала, много отраслевых исполнений | Хорошо известная российская серия | queued |
| P1 | [Dräger Pac 6000](https://www.draeger.com/en-us_us/Products/Pac-6000) | Один газ: CO, H2S, SO2 или O2 | Базовый одноканальный прибор Dräger | availability check |
| P1 | [MSA ALTAIR 2X](https://us.msasafety.com/Portable-Gas-Detection/Single-or-Two-Gas/ALTAIR%C2%AE-2X-Gas-Detector/p/000080000200001600?locale=en) | Одно- и двухгазовые исполнения | Дополняет семейство MSA между Solo и многоканальными моделями | availability check |
| P1 | [Industrial Scientific Ventis Pro5](https://www.indsci.com/en/gas-detectors/multi/ventis-pro5) | До 5 газов, PID и подключенные функции | Сильная модель для промышленной безопасности и ОЗП | availability check |
| P1 | [Crowcon T4x](https://www.crowcon.com/products/t4x) | Четыре стандартных газа | Прямой аналог ALTAIR 4XR и X-am 2800 для сравнения | availability check |
| P1 | [Honeywell BW Ultra](https://automation.honeywell.com/us/en/products/sensing-solutions/gas-and-flame-detection/portables/multi-gas/honeywell-bw-ultra-multi-gas-detector) | Пять газов, встроенный насос | Востребованный сценарий проверки замкнутых пространств | availability check |
| P1 | [Honeywell BW MicroClip X3](https://automation.honeywell.com/us/en/products/sensing-solutions/gas-and-flame-detection/portables/multi-gas/honeywell-bw-microclip-series-multi-gas-detector) | До четырех газов | Производитель позиционирует серию как массовую четырехгазовую платформу | availability check |
| P1 | [ПГ ЭРИС-411](https://eriskip.com/ru/product/pg-eris-411) | Один токсичный газ или O2 | Российский персональный одноканальный прибор | queued |
| P1 | [ПГ ЭРИС-414](https://eriskip.com/ru/product/pg%2Beris-414) | Четыре канала | Российская альтернатива международным четырехгазовым моделям | queued |
| P2 | [ГАНК-4](https://www.gank4.ru/product/gazoanalizatory/gank-4-ex-gazoanalizator-perenosnoy/) | Многокомпонентный принудительный отбор | Нужен для сложных и редких загрязняющих веществ | queued |
| P2 | [ОКА-92МТ](https://gazoanalit.ru/catalog/perenosnye/gazoanalizator-oka-92mt/) | До 5 газов, выносные блоки по исполнению | Распространенная российская серия для колодцев и тоннелей | queued |
| P2 | [Industrial Scientific Tango TX1](https://www.indsci.com/en/gas-detectors/single/tango-tx1) | Один токсичный газ, два однотипных сенсора | Отличается от обычных одноканальных моделей схемой DualSense | availability check |
| P2 | [Crowcon Gasman](https://www.crowcon.com/products/gasman) | Один газ, включая редкие исполнения | Расширение одноканального ассортимента | availability check |
| P2 | [Teledyne PS200](https://www.teledynegasandflamedetection.com/en-us/ps200-portable-4-gas-monitor) | До четырех газов, насос опционально | Дополнительная международная четырехгазовая платформа | availability check |

## Сенсоры для газоанализаторов

| Приоритет | Производитель и модель | Газ и технология | Позиция в каталоге | Статус |
|---|---|---|---|---|
| P0 | [Alphasense CO-B4](https://www.alphasense.com/products/view-by-target-gas/co-b4) | CO, электрохимический | Опорная карточка сенсора | published |
| P0 | [Honeywell City Technology 4CF+](https://automation.honeywell.com/us/en/products/sensing-solutions/sensors/gas-sensors/4-series-gas-sensor) | CO, электрохимический 4-Series | Базовый промышленный CO-сенсор | queued |
| P0 | [Honeywell City Technology 4HS+](https://automation.honeywell.com/us/en/products/sensing-solutions/sensors/gas-sensors/4-series-gas-sensor) | H2S, электрохимический 4-Series | Базовый H2S-сенсор | queued |
| P0 | [Honeywell City Technology 4OXV](https://automation.honeywell.com/us/en/products/sensing-solutions/sensors/gas-sensors/4-series-gas-sensor) | O2, электрохимический 4-Series | Базовый кислородный сенсор | queued |
| P0 | [Alphasense CO-AF](https://www.alphasense.com/products/view-by-target-gas/co-af) | CO, электрохимический A-Series | Расширяет Alphasense по другому форм-фактору и диапазону | queued |
| P0 | [Alphasense H2S-A1](https://www.alphasense.com/products/view-by-target-gas/h2s-a1) | H2S, электрохимический A-Series | Востребованный токсичный газ | queued |
| P0 | [Membrapor CO/C-1000](https://www.membrapor.ch/en/compact-gas-sensor/) | CO, электрохимический Compact/7-Series | Альтернатива Alphasense и City Technology | queued |
| P0 | [Membrapor H2S/C-50](https://www.membrapor.ch/sheet/Hydrogen-Sulfide-Gas-Sensor-H2S-C-50.pdf) | H2S, электрохимический Compact/7-Series | Промышленный H2S-сенсор | queued |
| P0 | [Membrapor O2/M-100](https://www.membrapor.ch/en/oxygen-sensors/) | O2, бессвинцовый электрохимический | Кислородный сенсор; диапазон уточнять по ревизии | queued |
| P0 | [SGX PS1-CO-1000](https://sgxsensortech.com/sensor/ps1-co-1000) | CO, твердополимерный электрохимический | Компактная современная технология | queued |
| P0 | [SGX PS1-H2S-100](https://www.sgxsensortech.com/sensorSelector/) | H2S, твердополимерный электрохимический | Компактная H2S-позиция | queued |
| P0 | [SGX-4OX-ROHS-FS](https://sgxsensortech.com/sensor/sgx-4ox-rohs-fs) | O2, бессвинцовый электрохимический | Альтернативный кислородный 4-Series | queued |
| P0 | [Winsen ME2-CO](https://www.winsen-sensor.com/d/files/me2-co/electrochemical-gas-sensor-me2-co.pdf) | CO, электрохимический | Бюджетный OEM-сегмент | queued |
| P0 | [Winsen ME3-H2S](https://www.winsen-sensor.com/product/me3-h2s.html) | H2S, электрохимический | Бюджетный H2S OEM-сегмент | queued |
| P0 | [Winsen MH-440D](https://www.winsen-sensor.com/product/mh-440d.html) | CH4, NDIR | Добавляет цифровой ИК-сенсор метана | queued |
| P0 | [NevadaNano MPS 5.0](https://nevadanano.com/products/mps-flammable-gas-sensor/mps-flammable-gas-sensor-5/) | Горючие газы, MEMS MPS | Премиальный OEM-сенсор для нескольких горючих газов | queued |
| P1 | [Alphasense NH3-B1](https://www.alphasense.com/products/view-by-target-gas/nh3-b1) | NH3, электрохимический с bias | Холодильные установки и химические производства | queued |
| P1 | [Alphasense SO2-AF](https://www.alphasense.com/products/view-by-target-gas/so2-af) | SO2, электрохимический | Энергетика и выбросы | queued |
| P1 | [Membrapor NH3/CR-200](https://www.membrapor.ch/en/compact-gas-sensor/) | NH3, электрохимический | Альтернативный аммиачный сенсор | queued |
| P1 | [Honeywell City Technology 4ND](https://automation.honeywell.com/us/en/products/sensing-solutions/sensors/gas-sensors/4-series-gas-sensor) | NO2, электрохимический | Контроль диоксида азота | queued |
| P1 | [SGX-NH3-500-EL](https://sgxsensortech.com/sensor/sgx-nh3-500-el) | NH3, электрохимический Extended Life | Аммиак с повышенным ресурсом | queued |
| P1 | [Winsen ME3-NH3](https://www.winsen-sensor.com/d/files/4-series-electrochemical-toxic-gas-sensor/me3-nh3-0~100ppm/me3-nh3-0-100ppm.pdf) | NH3, электрохимический | Бюджетный аммиачный OEM-сегмент | queued |
| P1 | [Figaro TGS5042-A00](https://www.figarosensor.com/product/entry/tgs5042-a00.html) | CO, электрохимический | Специализированный длинный цилиндрический элемент | queued |
| P1 | [Figaro TGS2611-C00](https://www.figarosensor.com/product/entry/tgs2611-c00.html) | CH4, MOS | Сигнализаторы утечки метана | queued |
| P1 | [Dynament Platinum Hydrocarbon](https://dynament.com/product/hydrocarbon-infrared-platinum-sensors/) | CH4/углеводороды, NDIR | Интегрированный ИК-сенсор для стационарных систем | queued |

## Правило совместимости сенсоров

Совпадение названия серии, диаметра или расположения контактов не доказывает взаимозаменяемость. В карточке разрешены только три статуса:

1. **Совместимость подтверждена** — есть официальный документ производителя прибора или сенсора с точным артикулом.
2. **Совпадает форм-фактор, требуется проверка** — механические параметры похожи, но электрическая и метрологическая совместимость не доказана.
3. **OEM-компонент для проектирования** — сенсор предназначен для разработчиков оборудования, совместимые готовые приборы не заявляются.

До присвоения первого статуса проверяются точный артикул и ревизия прибора, распиновка, геометрия, bias, нагрузка, чувствительность, фильтры, перекрестные газы, режим отбора, коэффициенты прошивки и влияние замены на сертификацию и взрывозащиту.

## Правило подготовки каждой карточки

1. Подтвердить текущий статус производства и возможность поставки.
2. Найти официальный datasheet, руководство и сертификаты для конкретной модификации.
3. Не переносить диапазон, газы, Ex, IP, Госреестр и поверку с соседнего исполнения.
4. Обработать реальное изображение без изменения конструкции и маркировки.
5. Заполнить карточку по [PRODUCT_CREATION_STANDARD.md](PRODUCT_CREATION_STANDARD.md).
6. Проверить страницу на desktop и mobile, выполнить lint и production build.
7. После приемки сделать commit, push и развертывание.

## Источники рыночного среза

- [Каталог Новаприбора](https://novapribor.ru/catalog/)
- [Каталог ГазоАналит](https://gazoanalit.ru/catalog/gazoanalizatory/)
- [Каталог ЭКСИС](https://www.eksis.ru/catalog/gas-analyzers/)
- [Каталог Аналитприбора](https://www.analitpribor-smolensk.ru/)
- [Каталог ЭРИС](https://eriskip.com/ru/products?categories=2)
- [Honeywell BW MicroClip Series](https://automation.honeywell.com/us/en/products/sensing-solutions/gas-and-flame-detection/portables/multi-gas/honeywell-bw-microclip-series-multi-gas-detector)
- [Honeywell City Technology 4-Series](https://automation.honeywell.com/us/en/products/sensing-solutions/sensors/gas-sensors/4-series-gas-sensor)
- [Dräger: стационарные системы](https://www.draeger.com/en-us_us/Productfinder/Fixed-Gas-Detection)
- [MSA: стационарная линейка](https://assetlibrary.msasafety.com/m/75ad0a9659bf056f/original/Bulletin-Fixed-Gas-amp-Flame-Detection-International-Product-Range-Overview.pdf)
- [Membrapor](https://www.membrapor.ch/en/)
- [SGX Sensortech](https://www.sgxsensortech.com/products)
