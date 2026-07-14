<?php get_header(); ?>
<main>
    <?php
    $hero_slides = [
        [
            'theme' => 'hero-theme-cyan',
            'kicker' => 'Поставка и поверка',
            'title' => 'Газоанализаторы с подбором, поставкой и поверкой',
            'text' => 'Помогаем купить промышленный газоанализатор под конкретный газ, диапазон измерений, условия эксплуатации и требования охраны труда. Подберем прибор, подготовим комплектацию и подскажем по поверке, паспорту и документации.',
            'label' => 'Комплексная поставка',
            'note' => 'подбор, счет, поверка и документы',
            'image' => get_template_directory_uri() . '/assets/images/hero-supply.webp',
            'image_alt' => 'Промышленные газоанализаторы для поставки и поверки',
            'specs' => [
                ['Газы', 'CO / CO2 / O2 / H2S / CH4'],
                ['Срок', 'под заказ и из наличия'],
                ['Подбор', 'по ТЗ, газу и объекту'],
                ['Документы', 'паспорт / поверка / сертификаты'],
            ],
        ],
        [
            'theme' => 'hero-theme-blue',
            'kicker' => 'Стационарные приборы',
            'title' => 'Стационарные газоанализаторы для цехов и котельных',
            'text' => 'Подбираем стационарные газоанализаторы и системы контроля загазованности для производственных помещений, складов, котельных и технологических зон. Учитываем количество точек, тип датчика, выходные сигналы и интеграцию в автоматику.',
            'label' => 'Контроль загазованности',
            'note' => 'датчики, шкафы, реле и сигнализация',
            'image' => get_template_directory_uri() . '/assets/images/hero-stationary.webp',
            'image_alt' => 'Стационарный газоанализатор для промышленного объекта',
            'specs' => [
                ['Объекты', 'цех / котельная / склад'],
                ['Выходы', '4-20 мА / RS-485 / реле'],
                ['Исполнение', 'IP / Ex / улица / мороз'],
                ['Проект', 'схема, спецификация, ЗИП'],
            ],
        ],
        [
            'theme' => 'hero-theme-amber',
            'kicker' => 'Портативные приборы',
            'title' => 'Портативные газоанализаторы для выездов и допуска к работам',
            'text' => 'Подберем переносной газоанализатор для обходов, ремонта, работ в колодцах, резервуарах и замкнутых пространствах. Сравним модели по газам, времени отклика, сигнализации, ресурсу аккумулятора и удобству ежедневной эксплуатации.',
            'label' => 'Мобильный газовый контроль',
            'note' => 'для обходов, сервиса и аварийных проверок',
            'image' => get_template_directory_uri() . '/assets/images/hero-portable.webp',
            'image_alt' => 'Портативный газоанализатор для выездных работ',
            'specs' => [
                ['Задачи', 'обход / допуск / ремонт'],
                ['Газы', '1-4 канала в одном приборе'],
                ['Сигнал', 'звук, свет, вибрация'],
                ['Комплект', 'кейс, зонд, фильтры'],
            ],
        ],
        [
            'theme' => 'hero-theme-violet',
            'kicker' => 'Сенсоры',
            'title' => 'Сенсоры и датчики газа для замены и комплектации',
            'text' => 'Подберем сенсор газа для ремонта, плановой замены или сборки нового решения. Поможем сопоставить тип чувствительного элемента, измеряемый газ, диапазон, совместимость с прибором и требования к калибровке.',
            'label' => 'Сенсоры и датчики',
            'note' => 'электрохимические, ИК, PID и каталитические',
            'image' => get_template_directory_uri() . '/assets/images/hero-sensors.webp',
            'image_alt' => 'Промышленный датчик и сенсор газа',
            'specs' => [
                ['Тип', 'э/х / ИК / PID / каталитический'],
                ['Газы', 'O2 / CO / H2S / CH4 / VOC'],
                ['Задача', 'замена / ремонт / ЗИП'],
                ['Настройка', 'калибровка и совместимость'],
            ],
        ],
    ];
    ?>
    <section class="hero hero-carousel" data-hero-slider>
        <div class="hero-slides">
            <?php foreach ($hero_slides as $index => $slide) : ?>
                <article class="hero-slide <?php echo esc_attr($slide['theme']); ?><?php echo $index === 0 ? ' is-active' : ''; ?>" data-hero-slide aria-hidden="<?php echo $index === 0 ? 'false' : 'true'; ?>">
                    <div class="wrap hero-grid">
                        <div class="hero-copy">
                            <span class="hero-kicker"><?php echo esc_html($slide['kicker']); ?></span>
                            <h1><?php echo esc_html($slide['title']); ?></h1>
                            <p><?php echo esc_html($slide['text']); ?></p>
                            <div class="hero-actions">
                                <a class="btn" href="<?php echo esc_url(home_url('/contacts/')); ?>">Получить подбор</a>
                                <a class="btn btn-secondary" href="<?php echo esc_url(home_url('/category/')); ?>">Смотреть направления</a>
                            </div>
                        </div>
                        <div class="hero-panel hero-panel-motion" aria-label="<?php echo esc_attr($slide['label']); ?>">
                            <div class="hero-orbit" aria-hidden="true">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div class="hero-product-wrap">
                                <img class="hero-product" src="<?php echo esc_url($slide['image']); ?>" alt="<?php echo esc_attr($slide['image_alt']); ?>" width="1200" height="675">
                                <div class="hero-product-badge">
                                    <span><?php echo esc_html(sprintf('%02d', $index + 1)); ?></span>
                                    <strong><?php echo esc_html($slide['label']); ?></strong>
                                </div>
                            </div>
                            <div class="hero-summary">
                                <span><?php echo esc_html($slide['label']); ?></span>
                                <strong><?php echo esc_html($slide['note']); ?></strong>
                            </div>
                            <div class="signal-grid">
                                <?php foreach ($slide['specs'] as $spec_index => $spec) : ?>
                                    <div class="<?php echo esc_attr(['signal-blue', 'signal-steel', 'signal-warm', 'signal-violet'][$spec_index]); ?>">
                                        <span><?php echo esc_html($spec[0]); ?></span>
                                        <strong><?php echo esc_html($spec[1]); ?></strong>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
        <div class="wrap hero-slider-nav" aria-label="Слайды первого экрана">
            <div class="hero-progress" aria-hidden="true"><span data-hero-progress></span></div>
            <div class="hero-dots" role="tablist">
                <?php foreach ($hero_slides as $index => $slide) : ?>
                    <button class="<?php echo $index === 0 ? 'is-active' : ''; ?>" type="button" data-hero-dot="<?php echo esc_attr((string) $index); ?>" aria-label="<?php echo esc_attr('Показать слайд: ' . $slide['kicker']); ?>">
                        <span><?php echo esc_html(sprintf('%02d', $index + 1)); ?></span>
                        <?php echo esc_html($slide['kicker']); ?>
                    </button>
                <?php endforeach; ?>
            </div>
            <div class="hero-arrows">
                <button type="button" data-hero-prev aria-label="Предыдущий слайд">‹</button>
                <button type="button" data-hero-next aria-label="Следующий слайд">›</button>
            </div>
        </div>
    </section>

    <section class="section section-tight">
        <div class="wrap metric-row">
            <div><strong>Поставка по России</strong><span>под заказ и под техническое задание</span></div>
            <div><strong>Подбор по газу</strong><span>сенсор, диапазон, условия эксплуатации</span></div>
            <div><strong>Документы</strong><span>паспорта, поверка, консультация по требованиям</span></div>
        </div>
    </section>

    <section class="section">
        <div class="wrap">
            <div class="section-head">
                <span class="eyebrow">Каталог решений</span>
                <h2 class="section-title">Что подбираем и поставляем</h2>
                <p>Структура каталога построена вокруг технических признаков, по которым инженер или закупщик реально выбирает газоанализатор.</p>
            </div>
            <div class="grid">
                <?php gazrus_term_cards('gaz_product_type', 6); ?>
            </div>
        </div>
    </section>

    <section class="section section-muted">
        <div class="wrap split">
            <div>
                <span class="eyebrow">Подбор без лишней переписки</span>
                <h2 class="section-title">Найдём подходящий прибор по признакам</h2>
                <p class="lead">Для первичного подбора достаточно знать контролируемый газ, тип прибора, канальность, место установки и требования к исполнению. Если данных пока нет, поможем сформировать запрос.</p>
                <a class="btn" href="<?php echo esc_url(home_url('/contacts/')); ?>">Описать задачу</a>
            </div>
            <div class="feature-list">
                <div><strong>1. Газ и диапазон</strong><span>CO, CO2, O2, H2S, CH4, NH3, Cl2, SO2 и другие газы.</span></div>
                <div><strong>2. Тип прибора</strong><span>Стационарный, портативный, переносной, сигнализатор или система.</span></div>
                <div><strong>3. Канальность</strong><span>Одноканальное, двухканальное или многоканальное решение.</span></div>
                <div><strong>4. Сенсор и исполнение</strong><span>Электрохимический, ИК, каталитический, PID; IP, Ex, выходы и реле.</span></div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="wrap">
            <div class="section-head">
                <span class="eyebrow">Контролируемые газы</span>
                <h2 class="section-title">Подбор по газам и сенсорам</h2>
                <p>Для SEO и будущего фильтра каждая группа газов оформляется как отдельная посадочная страница.</p>
            </div>
            <div class="pill-grid">
                <?php gazrus_term_cards('gaz_gas', 12); ?>
            </div>
        </div>
    </section>

    <section class="section section-dark">
        <div class="wrap cta-band">
            <div>
                <span class="eyebrow">Заявка на подбор</span>
                <h2>Нужно быстро понять, какой газоанализатор подходит?</h2>
                <p>Напишите контролируемый газ, условия эксплуатации и желаемый тип прибора. Подготовим варианты оборудования и комплектации.</p>
            </div>
            <a class="btn btn-warm" href="<?php echo esc_url(home_url('/contacts/')); ?>">Получить консультацию</a>
        </div>
    </section>

    <section class="section">
        <div class="wrap content seo-copy">
            <h2>Поставка газоанализаторов для промышленного контроля</h2>
            <p>Газоанализатор.рус работает как поставщик и эксперт по подбору газоаналитического оборудования. Задача проекта — быстро подобрать подходящий тип прибора, сенсор, канальность, диапазон измерений и комплектацию под требования заказчика.</p>
            <p>В структуре сайта предусмотрены отдельные разделы для стационарных и портативных газоанализаторов, сигнализаторов загазованности, газоаналитических систем, сенсоров и контролируемых газов. Такой подход удобен для закупки и инженерного подбора: можно искать оборудование по типу прибора, количеству каналов, контролируемому газу, типу сенсора и исполнению.</p>
        </div>
    </section>
</main>
<?php get_footer(); ?>
