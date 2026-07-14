<?php get_header(); ?>
<main>
    <section class="page-hero">
        <div class="wrap">
            <span class="eyebrow">Контролируемые газы</span>
            <h1>Газоанализаторы по газам и типам сенсоров</h1>
            <p>Выберите газ, который нужно контролировать. Для каждого направления можно уточнить тип прибора, канальность, диапазон измерений, сенсор и исполнение.</p>
            <div class="hero-actions">
                <a class="btn" href="<?php echo esc_url(home_url('/contacts/')); ?>">Получить подбор</a>
                <a class="btn btn-secondary" href="<?php echo esc_url(home_url('/category/')); ?>">Каталог признаков</a>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="wrap">
            <div class="section-head">
                <span class="eyebrow">Газы</span>
                <h2 class="section-title">Популярные направления контроля</h2>
                <p>Эти страницы будут использоваться и как SEO-посадки, и как будущие фильтры каталога оборудования.</p>
            </div>
            <div class="pill-grid"><?php gazrus_term_cards('gaz_gas', 24); ?></div>
        </div>
    </section>

    <section class="section section-muted">
        <div class="wrap split">
            <article class="content">
                <h2>Как выбрать сенсор под газ</h2>
                <p>Тип сенсора зависит от контролируемого газа, диапазона измерений, условий среды, возможных помех и режима эксплуатации. Для токсичных газов часто применяются электрохимические сенсоры, для горючих газов — каталитические или инфракрасные, для VOC — PID-детекторы.</p>
                <p>Если нужно контролировать несколько газов, дополнительно учитывается канальность прибора: одноканальный, двухканальный, многоканальный или модульный вариант.</p>
            </article>
            <aside class="request-card">
                <span class="eyebrow">Заявка</span>
                <h2>Не знаете, какой сенсор нужен?</h2>
                <p>Опишите газ, диапазон и условия эксплуатации. Подскажем, какой тип сенсора и прибора рассматривать.</p>
                <a class="btn btn-warm" href="<?php echo esc_url(home_url('/contacts/')); ?>">Запросить консультацию</a>
            </aside>
        </div>
    </section>
</main>
<?php get_footer(); ?>
