<?php get_header(); ?>
<main>
    <section class="page-hero">
        <div class="wrap">
            <span class="eyebrow">Каталог по техническим признакам</span>
            <h1>Подбор газоанализаторов по типу, канальности и газам</h1>
            <p>Раздел подготовлен как основа для будущего каталога с фильтрами. Сейчас он помогает быстро выбрать направление и отправить заявку на подбор оборудования.</p>
        </div>
    </section>

    <section class="section">
        <div class="wrap catalog-map">
            <div class="filter-panel">
                <h2>Быстрый подбор</h2>
                <p>Выберите ключевые признаки. После добавления ассортимента они станут полноценными фильтрами каталога.</p>
                <form class="selector-form" action="<?php echo esc_url(home_url('/contacts/')); ?>">
                    <label>Тип прибора<input name="type" placeholder="стационарный / портативный"></label>
                    <label>Контролируемый газ<input name="gas" placeholder="CO, H2S, O2..."></label>
                    <label>Канальность<input name="channel" placeholder="1 канал / многоканальный"></label>
                    <button class="btn" type="submit">Запросить подбор</button>
                </form>
            </div>
            <div class="catalog-groups">
                <section>
                    <div class="section-head compact">
                        <span class="eyebrow">Тип прибора</span>
                        <h2>Стационарные, портативные и системные решения</h2>
                    </div>
                    <div class="grid grid-2"><?php gazrus_term_cards('gaz_product_type', 8); ?></div>
                </section>
                <section>
                    <div class="section-head compact">
                        <span class="eyebrow">Канальность</span>
                        <h2>Подбор по количеству каналов</h2>
                    </div>
                    <div class="grid grid-3"><?php gazrus_term_cards('gaz_channel', 8); ?></div>
                </section>
                <section>
                    <div class="section-head compact">
                        <span class="eyebrow">Контролируемые газы</span>
                        <h2>Газоанализаторы по газам и сенсорам</h2>
                    </div>
                    <div class="pill-grid"><?php gazrus_term_cards('gaz_gas', 16); ?></div>
                </section>
            </div>
        </div>
    </section>

    <?php if (have_posts()) : ?>
        <section class="section section-muted">
            <div class="wrap">
                <div class="section-head">
                    <span class="eyebrow">Демо-карточки</span>
                    <h2 class="section-title">Пример будущих карточек оборудования</h2>
                    <p>Эти позиции добавлены только для демонстрации структуры каталога, тегов и карточки товара.</p>
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
