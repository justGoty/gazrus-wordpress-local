<?php get_header(); ?>
<?php $term = get_queried_object(); ?>
<main>
    <section class="page-hero">
        <div class="wrap">
            <div class="breadcrumbs"><a href="<?php echo esc_url(home_url('/category/')); ?>">Каталог</a> / <?php echo esc_html($term->name ?? 'Направление'); ?></div>
            <span class="eyebrow">Направление поставки</span>
            <h1><?php echo esc_html($term->name ?? 'Газоанализаторы'); ?></h1>
            <p><?php echo esc_html($term->description ?: 'Подберём оборудование под контролируемые газы, условия эксплуатации, канальность, сенсоры и требования к документам.'); ?></p>
            <div class="hero-actions">
                <a class="btn" href="<?php echo esc_url(home_url('/contacts/')); ?>">Запросить подбор</a>
                <a class="btn btn-secondary" href="<?php echo esc_url(home_url('/category/')); ?>">Все направления</a>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="wrap grid">
            <article class="card">
                <span class="eyebrow">Газ и диапазон</span>
                <h2>Что контролируем</h2>
                <p>Уточняем газ или смесь, диапазон измерений, единицы, пороги сигнализации и требования к точности.</p>
            </article>
            <article class="card">
                <span class="eyebrow">Формат прибора</span>
                <h2>Как будет использоваться</h2>
                <p>Подбираем стационарный, портативный, переносной прибор, сигнализатор или систему под условия объекта.</p>
            </article>
            <article class="card">
                <span class="eyebrow">Документы</span>
                <h2>Что нужно для эксплуатации</h2>
                <p>Согласуем паспорт, руководство, поверку, сертификаты, требования к IP/Ex и интерфейсам.</p>
            </article>
        </div>
    </section>

    <section class="section section-muted">
        <div class="wrap split">
            <article class="content">
                <h2>Подбор и поставка по техническому заданию</h2>
                <p>Газоанализаторы выбирают не только по названию газа. Для корректного подбора важны тип сенсора, количество каналов, режим эксплуатации, выходные сигналы, питание, условия среды и требования к документам. Поэтому на сайте сделана структура по техническим признакам: тип прибора, канальность, контролируемые газы, сенсоры и исполнение.</p>
                <p>Если точная модель пока не определена, можно отправить задачу специалисту. Мы поможем сформировать требования и предложим подходящие варианты оборудования и комплектации.</p>
            </article>
            <aside class="request-card">
                <span class="eyebrow">Подбор</span>
                <h2>Опишите задачу</h2>
                <p>Напишите газ, объект, формат прибора и требования к документам.</p>
                <a class="btn btn-warm" href="<?php echo esc_url(home_url('/contacts/')); ?>">Оставить заявку</a>
            </aside>
        </div>
    </section>
</main>
<?php get_footer(); ?>
