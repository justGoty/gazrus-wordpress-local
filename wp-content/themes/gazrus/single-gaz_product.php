<?php get_header(); ?>
<?php while (have_posts()) : the_post(); ?>
<main class="section">
    <div class="wrap">
        <div class="breadcrumbs"><a href="<?php echo esc_url(home_url('/category/')); ?>">Каталог</a> / <?php the_title(); ?></div>
        <article class="product-layout">
            <div class="product-image">
                <?php $image = gazrus_asset_image(get_the_ID()); ?>
                <?php if ($image) : ?><img src="<?php echo esc_url($image); ?>" alt="<?php the_title_attribute(); ?>"><?php endif; ?>
            </div>
            <div class="content">
                <h1 class="section-title"><?php the_title(); ?></h1>
                <p class="price"><?php echo esc_html(gazrus_price(get_the_ID())); ?></p>
                <?php the_content(); ?>
                <?php
                $quick_specs = [
                    'Диапазон измерений' => get_post_meta(get_the_ID(), '_gazrus_range', true),
                    'Канальность' => get_post_meta(get_the_ID(), '_gazrus_channel_count', true),
                    'Сенсоры и газы' => get_post_meta(get_the_ID(), '_gazrus_sensor_note', true),
                    'Выходы и интерфейсы' => get_post_meta(get_the_ID(), '_gazrus_outputs', true),
                    'Исполнение' => get_post_meta(get_the_ID(), '_gazrus_protection', true),
                    'Поверка и документы' => get_post_meta(get_the_ID(), '_gazrus_verification', true),
                ];
                ?>
                <div class="specs">
                    <?php foreach ($quick_specs as $label => $value) : ?>
                        <?php if ($value) : ?><strong><?php echo esc_html($label); ?>:</strong> <?php echo esc_html($value); ?><br><?php endif; ?>
                    <?php endforeach; ?>
                </div>
                <?php $specs = get_post_meta(get_the_ID(), '_gazrus_specs', true); ?>
                <?php if ($specs) : ?>
                    <h2>Характеристики</h2>
                    <div class="specs"><?php echo esc_html($specs); ?></div>
                <?php endif; ?>
                <p style="margin-top:24px"><a class="btn" href="<?php echo esc_url(home_url('/contacts/')); ?>">Оставить заявку</a></p>
            </div>
        </article>
    </div>
</main>
<?php endwhile; ?>
<?php get_footer(); ?>
