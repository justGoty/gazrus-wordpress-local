<?php get_header(); ?>
<?php $term = get_queried_object(); ?>
<main>
    <section class="page-hero">
        <div class="wrap">
            <div class="breadcrumbs"><a href="<?php echo esc_url(home_url('/category/')); ?>">Каталог</a> / <?php echo esc_html(gazrus_tax_label($term->taxonomy)); ?></div>
            <span class="eyebrow"><?php echo esc_html(gazrus_tax_label($term->taxonomy)); ?></span>
            <h1><?php echo esc_html($term->name); ?></h1>
            <p><?php echo esc_html($term->description ?: gazrus_default_term_text($term)); ?></p>
            <div class="hero-actions">
                <a class="btn" href="<?php echo esc_url(home_url('/contacts/')); ?>">Получить подбор</a>
                <a class="btn btn-secondary" href="<?php echo esc_url(home_url('/category/')); ?>">Вернуться в каталог</a>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="wrap split">
            <article class="content">
                <?php if ($term->taxonomy === 'gaz_gas') : ?>
                    <h2>Как подбирается газоанализатор <?php echo esc_html($term->name); ?></h2>
                    <p>Для подбора оборудования важно уточнить концентрации, диапазон измерений, условия среды, наличие фоновых газов, требования к сигнализации и документам. По этим данным выбирается тип прибора, сенсор, канальность, исполнение и комплектация.</p>
                    <p>Если нужен контроль нескольких газов одновременно, рассматриваются многоканальные газоанализаторы или газоаналитические системы. Для переносного контроля подойдут портативные приборы, для постоянного мониторинга объекта — стационарные решения.</p>
                <?php elseif ($term->taxonomy === 'gaz_channel') : ?>
                    <h2>Подбор по канальности</h2>
                    <p>Канальность определяет, сколько измерительных каналов или сенсоров требуется для задачи. Одноканальные решения подходят для контроля одного газа или точки, многоканальные — для нескольких газов, зон или датчиков в составе системы.</p>
                <?php elseif ($term->taxonomy === 'gaz_product_type') : ?>
                    <h2>Когда подходит этот тип оборудования</h2>
                    <p>Тип прибора выбирают по сценарию эксплуатации: постоянный мониторинг, переносной контроль, сигнализация загазованности или комплексная газоаналитическая система. Дополнительно учитываются питание, выходы, интерфейсы, исполнение и документы.</p>
                <?php else : ?>
                    <h2>Подбор оборудования</h2>
                    <p>Подберём газоанализатор по контролируемому газу, типу сенсора, канальности, исполнению, диапазону измерений и требованиям к эксплуатации.</p>
                <?php endif; ?>
            </article>
            <aside class="request-card">
                <span class="eyebrow">Заявка</span>
                <h2>Подобрать оборудование</h2>
                <p>Сообщите газ, условия объекта и желаемый формат прибора. Подготовим варианты поставки и комплектации.</p>
                <a class="btn btn-warm" href="<?php echo esc_url(home_url('/contacts/')); ?>">Оставить заявку</a>
            </aside>
        </div>
    </section>

    <?php if (have_posts()) : ?>
        <section class="section section-muted">
            <div class="wrap">
                <div class="section-head">
                    <span class="eyebrow">Оборудование</span>
                    <h2 class="section-title">Подходящие позиции</h2>
                </div>
                <div class="grid">
                    <?php while (have_posts()) : the_post(); ?>
                        <?php get_template_part('template-parts/product-card'); ?>
                    <?php endwhile; ?>
                </div>
            </div>
        </section>
    <?php endif; ?>
</main>
<?php get_footer(); ?>
